const TavusAPI = require('../../../lib/tavusApi');

let tavusAPI = null;
let initializationPromise = null;

// Initialize Tavus API if not already done
function getTavusAPI() {
  if (!tavusAPI) {
    tavusAPI = new TavusAPI();
  }
  return tavusAPI;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tavus = getTavusAPI();
    
    // Check if initialization is already in progress
    if (initializationPromise) {
      const result = await initializationPromise;
      return res.status(200).json({
        message: 'Initialization already in progress',
        experts: result,
        timestamp: new Date().toISOString()
      });
    }

    // Start initialization
    initializationPromise = tavus.initializeExperts();
    const experts = await initializationPromise;

    // Reset promise after completion
    initializationPromise = null;

    res.status(200).json({
      message: 'Expert initialization completed',
      experts: experts.map(expert => ({
        category: expert.category,
        name: expert.name,
        replicaId: expert.replicaId,
        status: expert.status,
        error: expert.error
      })),
      totalExperts: experts.length,
      successfullyCreated: experts.filter(e => !e.error).length,
      failed: experts.filter(e => e.error).length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error initializing experts:', error);
    
    // Reset promise on error
    initializationPromise = null;
    
    res.status(500).json({
      error: 'Failed to initialize experts',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
} 