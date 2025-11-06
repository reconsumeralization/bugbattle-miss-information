import XaiGrokAPI from '../../../lib/xaiApi';

const grok = new XaiGrokAPI();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, claims, verificationResults, playerScore, articleTitle } = req.body;

    // Validate required fields
    if (!category || !claims || !playerScore || !articleTitle) {
      return res.status(400).json({ 
        error: 'Missing required fields: category, claims, playerScore, articleTitle' 
      });
    }

    // Generate expert analysis using Grok
    const analysis = await grok.generateExpertAnalysis({
      category,
      claims,
      verificationResults,
      playerScore,
      articleTitle
    });

    // Enhanced response with X.ai branding
    const response = {
      ...analysis,
      powered_by: 'X.ai Grok',
      free_speech_analysis: true,
      real_time_data: true,
      uncensored: true
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('X.ai Analysis Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate expert analysis',
      powered_by: 'X.ai Grok',
      fallback: true
    });
  }
} 