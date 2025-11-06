// Webhook callback for Tavus replica training status updates
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      replica_id,
      status,
      progress,
      metadata,
      created_at,
      updated_at
    } = req.body;

    console.log(`Replica ${replica_id} status update:`, {
      status,
      progress,
      category: metadata?.category,
      timestamp: updated_at
    });

    // Handle different replica training statuses
    switch (status) {
      case 'training':
        console.log(`Expert replica ${replica_id} (${metadata?.category}) is training... ${progress}%`);
        break;
      
      case 'ready':
        console.log(`✅ Expert replica ${replica_id} (${metadata?.category}) training completed!`);
        // Here you could update your database or notify users
        break;
      
      case 'failed':
        console.error(`❌ Expert replica ${replica_id} (${metadata?.category}) training failed`);
        // Handle training failure - maybe retry or notify admins
        break;
      
      case 'processing':
        console.log(`🔄 Expert replica ${replica_id} (${metadata?.category}) is processing...`);
        break;
      
      default:
        console.log(`Expert replica ${replica_id} status: ${status}`);
    }

    // You could store this in your database here
    // await updateReplicaStatus(replica_id, status, progress);

    res.status(200).json({ 
      received: true,
      replica_id,
      status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error handling replica callback:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
} 