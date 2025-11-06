import XaiGrokAPI from '../../../lib/xaiApi';

const grok = new XaiGrokAPI();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, options = {} } = req.body;

    if (!query) {
      return res.status(400).json({ 
        error: 'Query parameter is required' 
      });
    }

    // Perform live search for misinformation
    const searchResults = await grok.liveSearchMisinformation(query, options);

    const response = {
      ...searchResults,
      powered_by: 'X.ai Grok Live Search',
      real_time_data: true,
      uncensored_search: true,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Live Search API Error:', error);
    res.status(500).json({ 
      error: 'Failed to perform live search',
      powered_by: 'X.ai Grok Live Search',
      fallback: true
    });
  }
} 