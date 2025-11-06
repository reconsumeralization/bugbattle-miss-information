const TavusAPI = require('../../../lib/tavusApi');

let tavusAPI = null;

// Initialize Tavus API if not already done
function getTavusAPI() {
  if (!tavusAPI) {
    tavusAPI = new TavusAPI();
  }
  return tavusAPI;
}

export default async function handler(req, res) {
  const tavus = getTavusAPI();

  try {
    switch (req.method) {
      case 'POST':
        await handleGenerateVideo(req, res, tavus);
        break;
      case 'GET':
        await handleGetVideoStatus(req, res, tavus);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Tavus Video Generation API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

async function handleGenerateVideo(req, res, tavus) {
  const {
    category,
    claims,
    verificationResults,
    playerScore,
    articleTitle,
    customScript
  } = req.body;

  // Validate required fields
  if (!category) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'Category is required'
    });
  }

  try {
    let videoData;

    if (customScript) {
      // Use custom script provided by user
      const expert = await tavus.getExpertByCategory(category);
      if (!expert) {
        return res.status(404).json({
          error: 'Expert not found',
          message: `No expert replica found for category: ${category}`
        });
      }

      videoData = await tavus.generateFactCheckExplanation({
        category,
        claims: [],
        verificationResults: null,
        playerScore: 0,
        articleTitle: 'Custom Explanation',
        customScript
      });
    } else {
      // Generate video with game results
      if (!claims || !verificationResults || playerScore === undefined || !articleTitle) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'claims, verificationResults, playerScore, and articleTitle are required'
        });
      }

      videoData = await tavus.generateFactCheckExplanation({
        category,
        claims,
        verificationResults,
        playerScore,
        articleTitle
      });
    }

    res.status(202).json({
      message: 'Video generation initiated',
      videoId: videoData.video_id,
      status: videoData.status,
      expertCategory: category,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({
      error: 'Failed to generate video',
      message: error.message
    });
  }
}

async function handleGetVideoStatus(req, res, tavus) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({
      error: 'Missing videoId parameter'
    });
  }

  try {
    const videoStatus = await tavus.getVideoStatus(videoId);
    
    res.status(200).json({
      videoId,
      status: videoStatus.status,
      downloadUrl: videoStatus.download_url,
      duration: videoStatus.duration,
      createdAt: videoStatus.created_at,
      metadata: videoStatus.metadata,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting video status:', error);
    res.status(500).json({
      error: 'Failed to get video status',
      message: error.message
    });
  }
} 