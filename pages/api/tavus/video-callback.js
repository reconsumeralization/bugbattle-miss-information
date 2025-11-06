// Webhook callback for Tavus video generation status updates
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      video_id,
      status,
      download_url,
      duration,
      metadata,
      created_at,
      updated_at
    } = req.body;

    console.log(`Video ${video_id} status update:`, {
      status,
      duration,
      type: metadata?.type,
      category: metadata?.category,
      timestamp: updated_at
    });

    // Handle different video generation statuses
    switch (status) {
      case 'generating':
        console.log(`🎬 Video ${video_id} (${metadata?.category}) is generating...`);
        break;
      
      case 'completed':
        console.log(`✅ Video ${video_id} (${metadata?.category}) generation completed!`);
        console.log(`📥 Download URL: ${download_url}`);
        console.log(`⏱️ Duration: ${duration}s`);
        
        // Here you could:
        // - Update database with video URL
        // - Send notification to user
        // - Cache video for quick access
        break;
      
      case 'failed':
        console.error(`❌ Video ${video_id} (${metadata?.category}) generation failed`);
        // Handle generation failure - maybe retry or notify user
        break;
      
      case 'processing':
        console.log(`🔄 Video ${video_id} (${metadata?.category}) is processing...`);
        break;
      
      default:
        console.log(`Video ${video_id} status: ${status}`);
    }

    // You could store this in your database here
    // await updateVideoStatus(video_id, status, download_url);

    res.status(200).json({ 
      received: true,
      video_id,
      status,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error handling video callback:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
} 