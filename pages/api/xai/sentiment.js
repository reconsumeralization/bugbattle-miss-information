import XaiGrokAPI from '../../../lib/xaiApi';

const grok = new XaiGrokAPI();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { claim, options = {} } = req.body;

    if (!claim) {
      return res.status(400).json({ 
        error: 'Claim parameter is required' 
      });
    }

    // Perform sentiment analysis on X
    const sentimentResults = await grok.analyzeMisinformationSentiment(claim, options);

    const response = {
      ...sentimentResults,
      powered_by: 'X.ai Grok Sentiment Analysis',
      data_source: 'Real-time X (Twitter) sentiment data',
      analysis_type: 'Misinformation spread patterns',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Sentiment Analysis API Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze sentiment',
      powered_by: 'X.ai Grok Sentiment Analysis',
      fallback: true
    });
  }
} 