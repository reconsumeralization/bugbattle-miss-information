import XaiGrokAPI from '../../../lib/xaiApi';

const grok = new XaiGrokAPI();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { categories } = req.query;
    const categoryList = categories ? categories.split(',') : undefined;

    // Get emerging misinformation alerts
    const alerts = await grok.getEmergingMisinformationAlerts(categoryList);

    const response = {
      ...alerts,
      powered_by: 'X.ai Grok Real-time Monitoring',
      data_source: 'Live X (Twitter) misinformation detection',
      monitoring_type: 'Early warning system',
      refresh_rate: '6 hours',
      disclaimer: 'Automated detection - requires human verification'
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Alerts API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch misinformation alerts',
      powered_by: 'X.ai Grok Real-time Monitoring',
      alerts: [],
      fallback: true
    });
  }
} 