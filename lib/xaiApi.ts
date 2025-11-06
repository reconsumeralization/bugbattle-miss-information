/**
 * X.ai Grok API Integration for Miss Information
 * Enhanced with Live Search and Sentiment Analysis capabilities
 */

import OpenAI from 'openai';

interface FactCheckResult {
  accuracy_score: number;
  verdict: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED' | 'CONTEXT_NEEDED';
  confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
  key_findings: string[];
  sources_checked?: {
    source: string;
    reliability: 'HIGH' | 'MEDIUM' | 'LOW';
    supports_claim: boolean;
  }[];
  misinformation_tactics?: string[];
  educational_points?: string[];
  real_time_context?: {
    trending_on_x: boolean;
    related_discussions: string[];
    sentiment_trend: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  };
}

interface MisinformationAlert {
  alert_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  topic: string;
  narrative: string;
  viral_metrics?: {
    estimated_reach: number;
    engagement_rate: number;
    growth_velocity: 'EXPLOSIVE' | 'RAPID' | 'STEADY' | 'SLOW';
  };
  platforms_affected?: string[];
  demographic_targets?: string[];
  counter_narratives?: string[];
  fact_check_priority: number;
}

interface SentimentAnalysis {
  overall_sentiment: 'VERY_POSITIVE' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'VERY_NEGATIVE';
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  emotional_indicators?: {
    emotion: string;
    intensity: number;
    prevalence: number;
  }[];
  key_themes: string[];
  influencer_sentiment?: {
    high_reach_accounts: 'POSITIVE' | 'NEGATIVE' | 'MIXED';
    expert_voices: 'POSITIVE' | 'NEGATIVE' | 'MIXED';
  };
  misinformation_correlation?: {
    correlation_strength: number;
    false_narratives_driving_sentiment: string[];
  };
}

interface LiveSearchResult {
  query: string;
  results: {
    title: string;
    url: string;
    snippet: string;
    relevance_score: number;
    credibility_rating: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  misinformation_detected: boolean;
  trending_status: 'VIRAL' | 'TRENDING' | 'EMERGING' | 'STABLE';
}

interface GameSession {
  claims: any[];
  verificationResults?: any;
  score: number;
  articleTitle?: string;
}

interface BatchRequest {
  id: string;
  messages: any[];
  schema: any;
  model?: string;
}

class Semaphore {
  private permits: number;
  private tasks: (() => void)[] = [];

  constructor(count: number) {
    this.permits = count;
  }

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (this.permits > 0) {
        this.permits--;
        resolve();
      } else {
        this.tasks.push(() => {
          this.permits--;
          resolve();
        });
      }
    });
  }

  release(): void {
    this.permits++;
    if (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task) task();
    }
  }
}

class XaiApi {
  private client: OpenAI;
  private maxConcurrent: number;
  private semaphore: Semaphore;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: 'https://api.x.ai/v1'
    });
    
    // Rate limiting: max concurrent requests
    this.maxConcurrent = 3;
    this.semaphore = new Semaphore(this.maxConcurrent);
  }

  // Structured output schemas for guaranteed JSON responses
  getFactCheckSchema() {
    return {
      type: "object",
      properties: {
        accuracy_score: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "Accuracy percentage (0-100)"
        },
        verdict: {
          type: "string",
          enum: ["TRUE", "FALSE", "MISLEADING", "UNVERIFIED", "CONTEXT_NEEDED"],
          description: "Final fact-check verdict"
        },
        confidence_level: {
          type: "string",
          enum: ["HIGH", "MEDIUM", "LOW"],
          description: "Confidence in the analysis"
        },
        key_findings: {
          type: "array",
          items: { type: "string" },
          description: "Main findings from the analysis"
        },
        sources_checked: {
          type: "array",
          items: {
            type: "object",
            properties: {
              source: { type: "string" },
              reliability: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
              supports_claim: { type: "boolean" }
            }
          }
        },
        misinformation_tactics: {
          type: "array",
          items: { type: "string" },
          description: "Specific misinformation tactics identified"
        },
        educational_points: {
          type: "array",
          items: { type: "string" },
          description: "Key educational takeaways"
        },
        real_time_context: {
          type: "object",
          properties: {
            trending_on_x: { type: "boolean" },
            related_discussions: { type: "array", items: { type: "string" } },
            sentiment_trend: { type: "string", enum: ["POSITIVE", "NEGATIVE", "NEUTRAL", "MIXED"] }
          }
        }
      },
      required: ["accuracy_score", "verdict", "confidence_level", "key_findings"]
    };
  }

  getMisinformationAlertSchema() {
    return {
      type: "object",
      properties: {
        alert_level: {
          type: "string",
          enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
          description: "Urgency level of the alert"
        },
        topic: { type: "string", description: "Main topic of misinformation" },
        narrative: { type: "string", description: "The false narrative being spread" },
        viral_metrics: {
          type: "object",
          properties: {
            estimated_reach: { type: "number" },
            engagement_rate: { type: "number" },
            growth_velocity: { type: "string", enum: ["EXPLOSIVE", "RAPID", "STEADY", "SLOW"] }
          }
        },
        platforms_affected: {
          type: "array",
          items: { type: "string" },
          description: "Social media platforms where this is spreading"
        },
        demographic_targets: {
          type: "array",
          items: { type: "string" },
          description: "Demographics being targeted"
        },
        counter_narratives: {
          type: "array",
          items: { type: "string" },
          description: "Effective counter-arguments"
        },
        fact_check_priority: {
          type: "number",
          minimum: 1,
          maximum: 10,
          description: "Priority for fact-checking (1-10)"
        }
      },
      required: ["alert_level", "topic", "narrative", "fact_check_priority"]
    };
  }

  getSentimentAnalysisSchema() {
    return {
      type: "object",
      properties: {
        overall_sentiment: {
          type: "string",
          enum: ["VERY_POSITIVE", "POSITIVE", "NEUTRAL", "NEGATIVE", "VERY_NEGATIVE"],
          description: "Overall sentiment towards the topic"
        },
        sentiment_distribution: {
          type: "object",
          properties: {
            positive: { type: "number", minimum: 0, maximum: 100 },
            neutral: { type: "number", minimum: 0, maximum: 100 },
            negative: { type: "number", minimum: 0, maximum: 100 }
          }
        },
        emotional_indicators: {
          type: "array",
          items: {
            type: "object",
            properties: {
              emotion: { type: "string" },
              intensity: { type: "number", minimum: 0, maximum: 10 },
              prevalence: { type: "number", minimum: 0, maximum: 100 }
            }
          }
        },
        key_themes: {
          type: "array",
          items: { type: "string" },
          description: "Main themes driving sentiment"
        },
        influencer_sentiment: {
          type: "object",
          properties: {
            high_reach_accounts: { type: "string", enum: ["POSITIVE", "NEGATIVE", "MIXED"] },
            expert_voices: { type: "string", enum: ["POSITIVE", "NEGATIVE", "MIXED"] }
          }
        },
        misinformation_correlation: {
          type: "object",
          properties: {
            correlation_strength: { type: "number", minimum: -1, maximum: 1 },
            false_narratives_driving_sentiment: { type: "array", items: { type: "string" } }
          }
        }
      },
      required: ["overall_sentiment", "sentiment_distribution", "key_themes"]
    };
  }

  // Semaphore wrapper for rate limiting
  private async withSemaphore<T>(fn: () => Promise<T>): Promise<T> {
    await this.semaphore.acquire();
    try {
      return await fn();
    } finally {
      this.semaphore.release();
    }
  }

  // Enhanced single request with structured output
  async makeStructuredRequest(messages: any[], schema: any, model: string = "grok-3"): Promise<any> {
    return this.withSemaphore(async () => {
      try {
        const completion = await (this.client as any).chat.completions.create({
          model,
          messages,
          response_format: { type: "json_schema", json_schema: { name: "response", schema } },
          temperature: 0.3
        });

        return completion.choices[0].message.parsed;
      } catch (error) {
        console.error('X.ai structured request failed:', error);
        throw error;
      }
    });
  }

  // Batch processing with concurrency control
  async batchRequests(requests: BatchRequest[], maxConcurrent: number = this.maxConcurrent): Promise<any[]> {
    const results: any[] = [];
    const chunks: BatchRequest[][] = [];
    
    // Split requests into chunks
    for (let i = 0; i < requests.length; i += maxConcurrent) {
      chunks.push(requests.slice(i, i + maxConcurrent));
    }

    // Process each chunk
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (request) => {
        try {
          return await this.makeStructuredRequest(request.messages, request.schema, request.model);
        } catch (error) {
          console.error(`Request ${request.id} failed:`, error);
          return null;
        }
      });
      
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    return results;
  }

  // Single claim analysis with structured output
  async analyzeClaimStructured(claim: string, context: string = ''): Promise<FactCheckResult> {
    const messages = [
      {
        role: "system",
        content: `You are Grok, an advanced AI fact-checker with real-time access to X (Twitter) and web data. 
        Analyze claims for accuracy, identify misinformation tactics, and provide educational insights.
        Focus on being helpful, accurate, and educational while maintaining a slightly witty personality.`
      },
      {
        role: "user", 
        content: `Fact-check this claim with real-time analysis: "${claim}"
        
        Context: ${context}
        
        Please provide a comprehensive fact-check including:
        1. Accuracy assessment (0-100%)
        2. Clear verdict
        3. Key supporting/contradicting evidence
        4. Any misinformation tactics detected
        5. Educational takeaways
        6. Real-time context from X and web`
      }
    ];

    return this.makeStructuredRequest(messages, this.getFactCheckSchema());
  }

  // Batch fact-checking multiple claims
  async batchFactCheck(claims: string[]): Promise<FactCheckResult[]> {
    const requests: BatchRequest[] = claims.map((claim, index) => ({
      id: `claim_${index}`,
      messages: [
        {
          role: "system",
          content: "You are Grok, an advanced AI fact-checker. Analyze each claim efficiently and accurately."
        },
        {
          role: "user",
          content: `Fact-check: "${claim}"`
        }
      ],
      schema: this.getFactCheckSchema()
    }));

    return this.batchRequests(requests);
  }

  // Get emerging misinformation alerts with structured output
  async getEmergingMisinformationAlertsStructured(): Promise<MisinformationAlert[]> {
    const messages = [
      {
        role: "system",
        content: `You are Grok with real-time access to X (Twitter) and global information networks. 
        Monitor and identify emerging misinformation campaigns, viral false narratives, and coordinated inauthentic behavior.
        Focus on actionable intelligence for fact-checkers and educators.`
      },
      {
        role: "user",
        content: `Scan current trending topics and conversations for emerging misinformation patterns. 
        Identify the top 5 most concerning misinformation narratives spreading right now.
        
        For each alert, provide:
        1. Urgency level and topic
        2. The false narrative being spread
        3. Viral metrics and platform analysis
        4. Demographic targeting patterns
        5. Effective counter-narratives
        6. Fact-checking priority score
        
        Focus on narratives with significant reach and potential for harm.`
      }
    ];

    const result = await this.makeStructuredRequest(messages, {
      type: "object", 
      properties: {
        alerts: {
          type: "array",
          items: this.getMisinformationAlertSchema()
        }
      },
      required: ["alerts"]
    });

    return result.alerts || [];
  }

  // Analyze misinformation sentiment with structured output  
  async analyzeMisinformationSentimentStructured(topic: string): Promise<SentimentAnalysis> {
    const messages = [
      {
        role: "system",
        content: `You are Grok with real-time sentiment analysis capabilities across X (Twitter) and social media.
        Analyze how misinformation affects public sentiment and emotional responses.
        Identify manipulation tactics that exploit emotional vulnerabilities.`
      },
      {
        role: "user",
        content: `Analyze current sentiment around: "${topic}"
        
        Provide comprehensive sentiment analysis including:
        1. Overall sentiment classification
        2. Detailed sentiment distribution
        3. Emotional indicators and intensity
        4. Key themes driving sentiment
        5. Influencer sentiment patterns
        6. Correlation with misinformation narratives
        
        Focus on how false information might be amplifying negative emotions or exploiting psychological biases.`
      }
    ];

    return this.makeStructuredRequest(messages, this.getSentimentAnalysisSchema());
  }

  // Live search for misinformation with structured output
  async liveSearchMisinformationStructured(query: string): Promise<LiveSearchResult> {
    const messages = [
      {
        role: "system", 
        content: `You are Grok with real-time web and X (Twitter) search capabilities.
        Search for and analyze information related to potential misinformation.
        Assess credibility, detect patterns, and identify trending status.`
      },
      {
        role: "user",
        content: `Search for current information about: "${query}"
        
        Provide:
        1. Relevant search results with credibility ratings
        2. Detection of any misinformation
        3. Trending status analysis
        4. Source reliability assessment
        
        Focus on identifying both accurate information and potential misinformation about this topic.`
      }
    ];

    const schema = {
      type: "object",
      properties: {
        query: { type: "string" },
        results: {
          type: "array",
          items: {
            type: "object", 
            properties: {
              title: { type: "string" },
              url: { type: "string" },
              snippet: { type: "string" },
              relevance_score: { type: "number", minimum: 0, maximum: 100 },
              credibility_rating: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] }
            }
          }
        },
        misinformation_detected: { type: "boolean" },
        trending_status: { type: "string", enum: ["VIRAL", "TRENDING", "EMERGING", "STABLE"] }
      },
      required: ["query", "results", "misinformation_detected", "trending_status"]
    };

    return this.makeStructuredRequest(messages, schema);
  }

  // Generate expert analysis with live data and structured output
  async generateExpertAnalysisWithLiveDataStructured(gameSession: GameSession, expertPersona: string): Promise<any> {
    const messages = [
      {
        role: "system",
        content: `You are Grok embodying the persona of ${expertPersona}.
        Use real-time data to provide expert-level analysis of fact-checking results.
        Combine your expertise with current information trends and misinformation patterns.`
      },
      {
        role: "user",
        content: `As ${expertPersona}, analyze these fact-checking game results with real-time context:
        
        Game Data:
        - Claims analyzed: ${gameSession.claims?.length || 0}
        - Article: "${gameSession.articleTitle || 'Unknown'}"
        - Player score: ${gameSession.score}
        - Verification results: ${JSON.stringify(gameSession.verificationResults, null, 2)}
        
        Provide expert analysis including:
        1. Assessment of player performance
        2. Real-time context about these topics
        3. Educational insights from your expertise
        4. Connections to current misinformation trends
        5. Recommendations for improvement
        
        Maintain your expert voice while being encouraging and educational.`
      }
    ];

    const schema = {
      type: "object",
      properties: {
        expert_assessment: { type: "string" },
        performance_analysis: { type: "string" },
        real_time_context: { type: "string" },
        educational_insights: { type: "array", items: { type: "string" } },
        misinformation_connections: { type: "array", items: { type: "string" } },
        improvement_recommendations: { type: "array", items: { type: "string" } },
        encouragement_message: { type: "string" }
      },
      required: ["expert_assessment", "performance_analysis", "educational_insights"]
    };

    return this.makeStructuredRequest(messages, schema);
  }

  // Multi-expert analysis for enhanced perspectives
  async getMultiExpertAnalysis(gameSession: GameSession, experts: string[]): Promise<any[]> {
    const requests: BatchRequest[] = experts.map((expert, index) => ({
      id: `expert_${index}`,
      messages: [
        {
          role: "system",
          content: `You are Grok embodying ${expert}. Provide analysis from this expert's unique perspective.`
        },
        {
          role: "user", 
          content: `As ${expert}, analyze these fact-checking results: ${JSON.stringify(gameSession, null, 2)}`
        }
      ],
      schema: {
        type: "object",
        properties: {
          expert_name: { type: "string" },
          analysis: { type: "string" },
          key_insights: { type: "array", items: { type: "string" } },
          recommendations: { type: "array", items: { type: "string" } }
        },
        required: ["expert_name", "analysis", "key_insights"]
      }
    }));

    return this.batchRequests(requests);
  }
}

export default XaiApi; 