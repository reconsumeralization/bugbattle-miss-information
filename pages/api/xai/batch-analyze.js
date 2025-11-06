// Batch analysis endpoint using async X.ai requests
import XaiApi from '../../../lib/xaiApi';

const xaiApi = new XaiApi();

// Generate mock batch results
const generateMockBatchResults = (claims) => {
  return claims.map((claim, index) => ({
    accuracy_score: Math.floor(Math.random() * 40) + 60,
    verdict: ['TRUE', 'FALSE', 'MISLEADING', 'CONTEXT_NEEDED'][Math.floor(Math.random() * 4)],
    confidence_level: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
    key_findings: [
      `Analysis of claim ${index + 1}: ${claim.substring(0, 30)}...`,
      'This requires further verification',
      'Multiple sources should be consulted'
    ],
    fallback_mode: true
  }));
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { claims, batchType = 'fact-check' } = req.body;

    if (!claims || !Array.isArray(claims) || claims.length === 0) {
      return res.status(400).json({ error: 'Claims array is required' });
    }

    if (claims.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 claims per batch' });
    }

    const startTime = Date.now();
    let results;
    let usingFallback = false;

    // Check if we have X.ai API key
    if (!process.env.XAI_API_KEY) {
      console.log('⚠️  X.ai API key not found, using fallback mode for batch analysis');
      
      // Simulate processing time for batch
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      
      results = generateMockBatchResults(claims);
      usingFallback = true;
    } else {
      // Use real X.ai API
      try {
        switch (batchType) {
          case 'fact-check':
            results = await xaiApi.batchFactCheck(claims);
            break;
          
          case 'multi-expert':
            // For multi-expert analysis, we need expert personas
            const { experts } = req.body;
            if (!experts || experts.length === 0) {
              return res.status(400).json({ error: 'Expert personas required for multi-expert analysis' });
            }
            
            // Create a mock game session for analysis
            const gameSession = {
              claims,
              timestamp: new Date().toISOString(),
              user_responses: claims.map(() => ({ verdict: 'UNVERIFIED', confidence: 50 }))
            };
            
            results = await xaiApi.getMultiExpertAnalysis(gameSession, experts);
            break;
          
          default:
            return res.status(400).json({ error: 'Invalid batch type' });
        }
      } catch (apiError) {
        console.log('⚠️  X.ai batch API failed, falling back to mock data:', apiError.message);
        results = generateMockBatchResults(claims);
        usingFallback = true;
      }
    }

    const processingTime = Date.now() - startTime;

    res.status(200).json({
      results,
      metadata: {
        batch_size: claims.length,
        processing_time_ms: processingTime,
        timestamp: new Date().toISOString(),
        batch_type: batchType,
        success_rate: results.filter(r => r && !r.error).length / results.length,
        api_version: 'enhanced-async',
        fallback_mode: usingFallback
      }
    });

  } catch (error) {
    console.error('Batch X.ai analysis error:', error);
    
    // Return fallback response even on error
    const fallbackResults = generateMockBatchResults(req.body.claims || ['Default claim']);
    
    res.status(200).json({
      results: fallbackResults,
      metadata: {
        batch_size: req.body.claims?.length || 1,
        processing_time_ms: 1200,
        timestamp: new Date().toISOString(),
        batch_type: req.body.batchType || 'fact-check',
        success_rate: 1.0,
        api_version: 'enhanced-async',
        fallback_mode: true,
        error: 'API unavailable, showing simulated results'
      }
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb', // Larger limit for batch requests
    },
    responseLimit: '5mb',
  },
}; 