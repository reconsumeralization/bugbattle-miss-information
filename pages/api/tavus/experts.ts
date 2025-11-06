import { NextApiRequest, NextApiResponse } from 'next';
const TavusAPI = require('../../../lib/tavusApi');

interface Expert {
  category: string;
  name: string;
  expertise: string;
  description: string;
  personality: string;
  background: string;
  replica_id?: string;
  currentStatus?: string;
  trainingProgress?: number;
  replicaId?: string;
  status?: string;
  error?: string;
}

interface ExpertRequestBody {
  force_recreate?: boolean;
  categories?: string[];
}

interface ReplicaStatus {
  status: string;
  progress?: number;
}

let tavusAPI: any = null;

// Initialize Tavus API if not already done
function getTavusAPI(): any {
  if (!tavusAPI) {
    tavusAPI = new TavusAPI();
  }
  return tavusAPI;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tavus = getTavusAPI();

  try {
    switch (req.method) {
      case 'GET':
        await handleGetExperts(req, res, tavus);
        break;
      case 'POST':
        await handleCreateExperts(req, res, tavus);
        break;
      case 'DELETE':
        await handleCleanupExperts(req, res, tavus);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error: any) {
    console.error('Tavus Experts API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

async function handleGetExperts(req: NextApiRequest, res: NextApiResponse, tavus: any): Promise<void> {
  const { category, status } = req.query;
  
  try {
    if (category) {
      // Get specific expert by category
      const expert: Expert = await tavus.getExpertByCategory(category);
      
      if (!expert) {
        return res.status(404).json({
          error: 'Expert not found',
          message: `No expert found for category: ${category}`
        });
      }

      // Check replica status if requested
      if (status === 'true' && expert.replica_id) {
        const replicaStatus: ReplicaStatus = await tavus.getReplicaStatus(expert.replica_id);
        expert.currentStatus = replicaStatus.status;
        expert.trainingProgress = replicaStatus.progress;
      }
      
      res.status(200).json({
        expert,
        category,
        timestamp: new Date().toISOString()
      });
    } else {
      // Get all expert replicas
      const experts: Expert[] = await tavus.getExpertReplicas();
      
      // If status check requested, get detailed status for each
      if (status === 'true') {
        const expertsWithStatus = await Promise.all(
          experts.map(async (expert) => {
            try {
              const replicaStatus: ReplicaStatus = await tavus.getReplicaStatus(expert.replica_id!);
              return {
                ...expert,
                currentStatus: replicaStatus.status,
                trainingProgress: replicaStatus.progress
              };
            } catch (error: any) {
              return {
                ...expert,
                currentStatus: 'error',
                error: error.message
              };
            }
          })
        );
        
        res.status(200).json({
          experts: expertsWithStatus,
          totalCount: expertsWithStatus.length,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(200).json({
          experts,
          totalCount: experts.length,
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (error: any) {
    console.error('Error handling GET experts request:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve experts',
      message: error.message 
    });
  }
}

async function handleCreateExperts(req: NextApiRequest, res: NextApiResponse, tavus: any): Promise<void> {
  const { force_recreate = false, categories = [] }: ExpertRequestBody = req.body;
  
  try {
    if (force_recreate || categories.length > 0) {
      // Create specific experts or recreate all
      let createdExperts: Expert[];
      
      if (categories.length > 0) {
        // Create only specified categories
        createdExperts = [];
        for (const category of categories) {
          try {
            const expertConfig = getExpertConfigByCategory(category);
            if (expertConfig) {
              const replica = await tavus.createExpertReplica(expertConfig);
              createdExperts.push({
                ...expertConfig,
                replicaId: replica.replica_id,
                status: replica.status
              });
            }
          } catch (error: any) {
            createdExperts.push({
              category,
              error: error.message
            } as Expert);
          }
        }
      } else {
        // Create all experts
        createdExperts = await tavus.createFactCheckingExperts();
      }
      
      res.status(201).json({
        message: 'Expert replicas creation initiated',
        experts: createdExperts,
        timestamp: new Date().toISOString()
      });
    } else {
      // Initialize experts (create if don't exist)
      const experts = await tavus.initializeExperts();
      
      res.status(200).json({
        message: 'Expert replicas initialized',
        experts,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error: any) {
    console.error('Error handling POST experts request:', error);
    res.status(500).json({ 
      error: 'Failed to create/initialize experts',
      message: error.message 
    });
  }
}

async function handleCleanupExperts(req: NextApiRequest, res: NextApiResponse, tavus: any): Promise<void> {
  try {
    const result = await tavus.cleanupOldReplicas();
    
    res.status(200).json({
      message: 'Cleanup completed',
      deletedCount: result.deleted,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error handling DELETE experts request:', error);
    res.status(500).json({ 
      error: 'Failed to cleanup experts',
      message: error.message 
    });
  }
}

// Helper function to get expert configuration by category
function getExpertConfigByCategory(category: string): Expert | null {
  const expertConfigs: { [key: string]: Expert } = {
    climate: {
      category: 'climate',
      name: 'Dr. Elena Rodriguez',
      expertise: 'Climate Science & Environmental Policy',
      description: 'Climate scientist with 15+ years of experience in climate change research and environmental policy analysis.',
      personality: 'Authoritative yet approachable, uses clear scientific explanations',
      background: 'PhD in Atmospheric Sciences, IPCC contributing author'
    },
    renewable_energy: {
      category: 'renewable_energy',
      name: 'Professor Marcus Chen',
      expertise: 'Renewable Energy Technology & Engineering',
      description: 'Leading researcher in solar and wind energy technologies with extensive industry experience.',
      personality: 'Technical but accessible, passionate about sustainable solutions',
      background: 'Professor of Electrical Engineering, 50+ peer-reviewed publications'
    },
    technology: {
      category: 'technology',
      name: 'Dr. Sarah Kim',
      expertise: 'AI Ethics & Technology Policy',
      description: 'Expert in artificial intelligence ethics, technology policy, and digital transformation.',
      personality: 'Analytical and balanced, focuses on practical implications',
      background: 'PhD in Computer Science, former tech industry executive'
    },
    fact_checking: {
      category: 'fact_checking',
      name: 'Dr. James Thompson',
      expertise: 'Journalism & Information Verification',
      description: 'Investigative journalist and fact-checking expert with expertise in media literacy.',
      personality: 'Methodical and thorough, emphasizes source verification',
      background: 'Pulitzer Prize winner, 20+ years in investigative journalism'
    },
    general_news: {
      category: 'general_news',
      name: 'Dr. Maria Gonzalez',
      expertise: 'Media Studies & Communication',
      description: 'Expert in media studies, communication theory, and news analysis.',
      personality: 'Insightful and comprehensive, provides broader context',
      background: 'PhD in Communications, former news editor'
    }
  };
  
  return expertConfigs[category] || null;
} 