// Enhanced X.ai analysis endpoint with structured outputs
import XaiApi from '../../../lib/xaiApi';

const xaiApi = new XaiApi();

// Fallback mock data for development/testing
const generateMockResponse = (claim, analysisType) => {
  const mockResponses = {
    'fact-check': {
      accuracy_score: Math.floor(Math.random() * 40) + 60, // 60-100%
      verdict: ['TRUE', 'FALSE', 'MISLEADING', 'CONTEXT_NEEDED'][Math.floor(Math.random() * 4)],
      confidence_level: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
      key_findings: [
        'This claim requires fact-checking against reliable sources',
        'The statement contains elements that need verification',
        'Context is important for understanding this claim'
      ],
      sources_checked: [
        { source: 'Mock Source 1', reliability: 'HIGH', supports_claim: Math.random() > 0.5 },
        { source: 'Mock Source 2', reliability: 'MEDIUM', supports_claim: Math.random() > 0.5 }
      ],
      misinformation_tactics: ['Selective statistics', 'Emotional appeal'],
      educational_points: [
        'Always verify numerical claims',
        'Check multiple sources',
        'Consider the source credibility'
      ],
      real_time_context: {
        trending_on_x: Math.random() > 0.7,
        related_discussions: ['Related topic 1', 'Related topic 2'],
        sentiment_trend: ['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'][Math.floor(Math.random() * 4)]
      }
    },
    'sentiment': {
      overall_sentiment: ['VERY_POSITIVE', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'VERY_NEGATIVE'][Math.floor(Math.random() * 5)],
      sentiment_distribution: {
        positive: Math.floor(Math.random() * 50) + 20,
        neutral: Math.floor(Math.random() * 30) + 20,
        negative: Math.floor(Math.random() * 30) + 10
      },
      key_themes: ['Public opinion', 'Media coverage', 'Expert consensus'],
      misinformation_correlation: {
        correlation_strength: (Math.random() - 0.5) * 2, // -1 to 1
        false_narratives: ['Sample false narrative 1', 'Sample false narrative 2']
      }
    },
    'live-search': {
      search_results: [
        {
          content_type: 'POST',
          misinformation_risk: ['HIGH', 'MEDIUM', 'LOW', 'NONE'][Math.floor(Math.random() * 4)],
          fact_check_needed: Math.random() > 0.5,
          key_claims: ['Sample claim from search'],
          credibility: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)]
        }
      ],
      trending_narratives: ['Trending narrative 1', 'Trending narrative 2'],
      expert_consensus: 'Mock expert consensus on the topic',
      recommendation: 'Further investigation recommended'
    }
  };

  return mockResponses[analysisType] || mockResponses['fact-check'];
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { claim, context, analysisType = 'fact-check' } = req.body;

    if (!claim) {
      return res.status(400).json({ error: 'Claim is required' });
    }

    let result;
    const startTime = Date.now();

    // Check if we have X.ai API key
    if (!process.env.XAI_API_KEY) {
      console.log('⚠️  X.ai API key not found, using fallback mode');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      
      result = generateMockResponse(claim, analysisType);
      result.fallback_mode = true;
      result.message = 'This is a simulated response. Add XAI_API_KEY for real analysis.';
    } else {
      // Use real X.ai API
      try {
        switch (analysisType) {
          case 'fact-check':
            result = await xaiApi.analyzeClaimStructured(claim, context);
            break;
          
          case 'sentiment':
            result = await xaiApi.analyzeSentimentStructured(claim);
            break;
          
          case 'live-search':
            result = await xaiApi.liveSearchStructured(claim);
            break;
          
          default:
            return res.status(400).json({ error: 'Invalid analysis type' });
        }
      } catch (apiError) {
        console.log('⚠️  X.ai API failed, falling back to mock data:', apiError.message);
        result = generateMockResponse(claim, analysisType);
        result.fallback_mode = true;
        result.api_error = apiError.message;
      }
    }

    // Add metadata
    result.metadata = {
      timestamp: new Date().toISOString(),
      analysis_type: analysisType,
      api_version: 'enhanced-structured',
      processing_time: Date.now() - startTime,
      fallback_mode: result.fallback_mode || false
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Enhanced X.ai analysis error:', error);
    
    // Return fallback response even on error
    const fallbackResult = generateMockResponse(req.body.claim, req.body.analysisType);
    fallbackResult.fallback_mode = true;
    fallbackResult.error = 'API unavailable, showing simulated results';
    
    res.status(200).json(fallbackResult);
  }
}

// Middleware to track processing time
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}; 