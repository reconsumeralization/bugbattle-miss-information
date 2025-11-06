import axios from 'axios';

interface Expert {
  category: string;
  name: string;
  expertise: string;
  description: string;
  personality: string;
  background: string;
  replicaId?: string;
  status?: string;
  error?: string;
}

interface ReplicaData {
  replica_name: string;
  callback_url: string;
  train_video_url: string;
  metadata: {
    category: string;
    expertise: string;
    personality: string;
    background: string;
  };
}

interface TavusReplicaResponse {
  replica_id: string;
  status: string;
}

interface VideoGenerationOptions {
  category: string;
  claims: any[];
  verificationResults: any;
  playerScore: number;
  articleTitle: string;
}

interface VideoData {
  replica_id: string;
  script: string;
  callback_url: string;
  metadata: any;
}

interface VideoResponse {
  video_id: string;
  status: string;
  video_url?: string;
}

interface VideoStatus {
  video_id: string;
  status: string;
  video_url?: string;
  error?: string;
}

class TavusAPI {
  private baseURL: string;
  private apiKey: string | undefined;
  private cache: Map<string, any>;

  constructor() {
    this.baseURL = 'https://tavusapi.com';
    this.apiKey = process.env.TAVUS_API_KEY;
    this.cache = new Map();
    
    if (!this.apiKey) {
      console.warn('TAVUS_API_KEY not found in environment variables');
    }
  }

  // Get headers for Tavus API requests
  private getHeaders(): Record<string, string> {
    return {
      'x-api-key': this.apiKey || '',
      'Content-Type': 'application/json'
    };
  }

  // Create expert replicas for fact-checking
  async createFactCheckingExperts(): Promise<Expert[]> {
    const experts: Expert[] = [
      {
        category: 'climate',
        name: 'Dr. Elena Rodriguez',
        expertise: 'Climate Science & Environmental Policy',
        description: 'Climate scientist with 15+ years of experience in climate change research and environmental policy analysis.',
        personality: 'Authoritative yet approachable, uses clear scientific explanations',
        background: 'PhD in Atmospheric Sciences, IPCC contributing author'
      },
      {
        category: 'renewable_energy',
        name: 'Professor Marcus Chen',
        expertise: 'Renewable Energy & Sustainable Technology',
        description: 'Leading expert in solar, wind, and energy storage technologies with extensive industry experience.',
        personality: 'Enthusiastic about clean tech, practical and solution-oriented',
        background: 'Professor of Energy Engineering, Former Tesla energy consultant'
      },
      {
        category: 'technology',
        name: 'Dr. Sarah Kim',
        expertise: 'Technology Ethics & Digital Literacy',
        description: 'Computer scientist specializing in AI ethics, misinformation detection, and digital media literacy.',
        personality: 'Analytical and methodical, excellent at explaining complex tech concepts',
        background: 'PhD Computer Science, Former Google AI researcher'
      },
      {
        category: 'fact_checking',
        name: 'Jonathan Mitchell',
        expertise: 'Investigative Journalism & Fact-Checking',
        description: 'Award-winning journalist with expertise in fact-checking methodologies and media verification.',
        personality: 'Skeptical but fair, emphasizes evidence-based reasoning',
        background: '20+ years investigative journalism, Pulitzer Prize finalist'
      },
      {
        category: 'general_news',
        name: 'Dr. Amara Okafor',
        expertise: 'Media Studies & Information Science',
        description: 'Expert in media literacy, information science, and critical thinking education.',
        personality: 'Educational and patient, great at teaching verification skills',
        background: 'PhD Media Studies, UNESCO media literacy consultant'
      }
    ];

    const createdExperts: Expert[] = [];

    for (const expert of experts) {
      try {
        const replica = await this.createExpertReplica(expert);
        createdExperts.push({
          ...expert,
          replicaId: replica.replica_id,
          status: replica.status
        });
        
        // Cache the expert for quick access
        this.cache.set(`expert:${expert.category}`, {
          ...expert,
          replicaId: replica.replica_id
        });
        
        console.log(`Created expert replica for ${expert.name} (${expert.category})`);
      } catch (error: any) {
        console.error(`Failed to create replica for ${expert.name}:`, error.message);
        createdExperts.push({
          ...expert,
          error: error.message
        });
      }
    }

    return createdExperts;
  }

  // Create a single expert replica
  async createExpertReplica(expert: Expert): Promise<TavusReplicaResponse> {
    try {
      const replicaData: ReplicaData = {
        replica_name: `${expert.name} - ${expert.expertise}`,
        callback_url: `${process.env.NEXTAUTH_URL}/api/tavus/replica-callback`,
        train_video_url: this.getStockVideoForExpert(expert),
        metadata: {
          category: expert.category,
          expertise: expert.expertise,
          personality: expert.personality,
          background: expert.background
        }
      };

      const response = await axios.post<TavusReplicaResponse>(`${this.baseURL}/v2/replicas`, replicaData, {
        headers: this.getHeaders(),
        timeout: 30000
      });

      return response.data;
    } catch (error: any) {
      console.error('Error creating Tavus replica:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get appropriate stock video for expert persona
  private getStockVideoForExpert(expert: Expert): string {
    // For demo purposes, we'll use Tavus stock videos
    // In production, you'd want custom training videos for each expert
    const stockVideos: Record<string, string> = {
      climate: 'https://tavus-stock-videos.s3.amazonaws.com/climate-expert.mp4',
      renewable_energy: 'https://tavus-stock-videos.s3.amazonaws.com/energy-expert.mp4',
      technology: 'https://tavus-stock-videos.s3.amazonaws.com/tech-expert.mp4',
      fact_checking: 'https://tavus-stock-videos.s3.amazonaws.com/journalist.mp4',
      general_news: 'https://tavus-stock-videos.s3.amazonaws.com/media-expert.mp4'
    };

    return stockVideos[expert.category] || stockVideos.general_news;
  }

  // Get all available expert replicas
  async getExpertReplicas(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseURL}/v2/replicas`, {
        headers: this.getHeaders()
      });

      // Filter for our fact-checking experts
      const experts = (response.data as any)?.data?.filter((replica: any) => 
        replica.metadata?.category && 
        ['climate', 'renewable_energy', 'technology', 'fact_checking', 'general_news'].includes(replica.metadata.category)
      ) || [];

      return experts;
    } catch (error) {
      console.error('Error fetching expert replicas:', error);
      return [];
    }
  }

  // Get expert replica by category
  async getExpertByCategory(category: string): Promise<any> {
    // Check cache first
    const cached = this.cache.get(`expert:${category}`);
    if (cached) return cached;

    const experts = await this.getExpertReplicas();
    const expert = experts.find((e: any) => e.metadata?.category === category);
    
    if (expert) {
      this.cache.set(`expert:${category}`, expert);
    }
    
    return expert;
  }

  // Generate fact-checking explanation video
  async generateFactCheckExplanation(options: VideoGenerationOptions): Promise<VideoResponse> {
    const {
      category,
      claims,
      verificationResults,
      playerScore,
      articleTitle
    } = options;

    try {
      const expert = await this.getExpertByCategory(category);
      if (!expert) {
        throw new Error(`No expert found for category: ${category}`);
      }

      const script = this.generateExplanationScript({
        claims,
        verificationResults,
        playerScore,
        articleTitle,
        expertName: expert.replica_name
      });

      const videoData: VideoData = {
        replica_id: expert.replica_id,
        script,
        callback_url: `${process.env.NEXTAUTH_URL}/api/tavus/video-callback`,
        metadata: {
          category,
          articleTitle,
          playerScore,
          timestamp: new Date().toISOString()
        }
      };

      const response = await axios.post<VideoResponse>(`${this.baseURL}/v2/videos`, videoData, {
        headers: this.getHeaders(),
        timeout: 30000
      });

      return response.data;
    } catch (error: any) {
      console.error('Error generating video:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generate script for explanation video
  private generateExplanationScript(data: any): string {
    const {
      claims,
      verificationResults,
      playerScore,
      articleTitle,
      expertName
    } = data;

    const performance = playerScore >= 80 ? 'excellent' : playerScore >= 60 ? 'good' : 'needs improvement';
    
    let script = `Hello! I'm ${expertName}, and I'm here to help you understand the fact-checking results for "${articleTitle}".

You scored ${playerScore} points, which shows ${performance} critical thinking skills. `;

    if (claims && claims.length > 0) {
      script += `Let me walk you through the key claims we analyzed:

`;
      
      claims.forEach((claim: any, index: number) => {
        const verification = verificationResults?.results?.[index];
        script += `Claim ${index + 1}: "${claim.text}"
This claim is ${verification?.verified ? 'verified' : 'unverified'} based on our analysis. `;
        
        if (verification?.explanation) {
          script += `${verification.explanation}

`;
        }
      });
    }

    script += `Remember, effective fact-checking involves cross-referencing multiple reliable sources, looking for primary evidence, and being aware of potential biases. Keep practicing these skills to become a more informed citizen!`;

    return script;
  }

  // Start conversation with expert
  async startConversationWithExpert(category: string, context: string): Promise<any> {
    try {
      const expert = await this.getExpertByCategory(category);
      if (!expert) {
        throw new Error(`No expert found for category: ${category}`);
      }

      const conversationData = {
        replica_id: expert.replica_id,
        conversation_name: `Fact-checking discussion - ${new Date().toISOString()}`,
        persona_id: expert.replica_id,
        context_prompt: `You are ${expert.replica_name}, ${expert.metadata.expertise}. ${context}. Please provide helpful, accurate information in your expert domain.`
      };

      const response = await axios.post(`${this.baseURL}/v2/conversations`, conversationData, {
        headers: this.getHeaders()
      });

      return response.data;
    } catch (error: any) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }

  // Get video status
  async getVideoStatus(videoId: string): Promise<VideoStatus> {
    try {
      const response = await axios.get<VideoStatus>(`${this.baseURL}/v2/videos/${videoId}`, {
        headers: this.getHeaders()
      });

      return response.data;
    } catch (error: any) {
      console.error('Error getting video status:', error);
      throw error;
    }
  }

  // Get replica status
  async getReplicaStatus(replicaId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/v2/replicas/${replicaId}`, {
        headers: this.getHeaders()
      });

      return response.data;
    } catch (error: any) {
      console.error('Error getting replica status:', error);
      throw error;
    }
  }

  // Initialize experts if they don't exist
  async initializeExperts(): Promise<Expert[]> {
    try {
      const existingExperts = await this.getExpertReplicas();
      
      if (existingExperts.length === 0) {
        console.log('No existing experts found. Creating new expert replicas...');
        return await this.createFactCheckingExperts();
      } else {
        console.log(`Found ${existingExperts.length} existing expert replicas`);
        
        // Cache existing experts
        existingExperts.forEach((expert: any) => {
          if (expert.metadata?.category) {
            this.cache.set(`expert:${expert.metadata.category}`, expert);
          }
        });
        
        return existingExperts;
      }
    } catch (error: any) {
      console.error('Error initializing experts:', error);
      return [];
    }
  }

  // Clean up old replicas
  async cleanupOldReplicas(): Promise<void> {
    try {
      const replicas = await this.getExpertReplicas();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      for (const replica of replicas) {
        const createdDate = new Date(replica.created_at);
        if (createdDate < oneWeekAgo && replica.status === 'training_failed') {
          try {
            await axios.delete(`${this.baseURL}/v2/replicas/${replica.replica_id}`, {
              headers: this.getHeaders()
            });
            console.log(`Deleted old failed replica: ${replica.replica_id}`);
          } catch (error) {
            console.error(`Failed to delete replica ${replica.replica_id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export default TavusAPI; 