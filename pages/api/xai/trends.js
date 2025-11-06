import XaiGrokAPI from '../../../lib/xaiApi';

const grok = new XaiGrokAPI();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category = 'general' } = req.query;

    // Get real-time trending misinformation using Grok's X integration
    const trends = await grok.analyzeTrendingMisinformation(category);

    const response = {
      ...trends,
      category,
      powered_by: 'X.ai Grok',
      data_source: 'Real-time X (Twitter) data',
      analysis_type: 'Uncensored misinformation trends',
      disclaimer: 'Analysis based on current X platform activity'
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('X.ai Trends Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze trending misinformation',
      powered_by: 'X.ai Grok',
      trends: [],
      fallback: true
    });
  }
} 