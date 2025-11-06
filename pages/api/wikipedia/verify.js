const WikipediaVerifier = require('../../../lib/wikipediaApi');

let wikipediaVerifier = null;

// Initialize Wikipedia verifier if not already done
function getWikipediaVerifier() {
  if (!wikipediaVerifier) {
    wikipediaVerifier = new WikipediaVerifier();
  }
  return wikipediaVerifier;
}

export default async function handler(req, res) {
  const verifier = getWikipediaVerifier();

  try {
    switch (req.method) {
      case 'POST':
        await handleVerification(req, res, verifier);
        break;
      case 'GET':
        await handleSearch(req, res, verifier);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Wikipedia Verify API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

async function handleVerification(req, res, verifier) {
  const { claim, claims, article, category } = req.body;
  
  if (!claim && !claims && !article) {
    return res.status(400).json({ 
      error: 'Missing required parameters',
      message: 'Provide either "claim", "claims" array, or "article" object'
    });
  }

  try {
    if (article) {
      // Verify entire article
      const verification = await verifier.verifyArticleClaims(article);
      
      res.status(200).json({
        type: 'article_verification',
        result: verification,
        timestamp: new Date().toISOString()
      });
    } else if (claims && Array.isArray(claims)) {
      // Verify multiple claims
      const verificationPromises = claims.map(claimText => 
        verifier.verifyClaim(claimText, category)
      );
      const verifications = await Promise.all(verificationPromises);
      
      res.status(200).json({
        type: 'batch_verification',
        results: claims.map((claim, index) => ({
          claim,
          verification: verifications[index]
        })),
        summary: {
          totalClaims: claims.length,
          verifiedClaims: verifications.filter(v => v.verified).length,
          averageConfidence: verifications.reduce((sum, v) => sum + (v.confidence || 0), 0) / verifications.length
        },
        timestamp: new Date().toISOString()
      });
    } else if (claim) {
      // Verify single claim
      const verification = await verifier.verifyClaim(claim, category);
      
      res.status(200).json({
        type: 'single_verification',
        claim,
        verification,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ 
      error: 'Verification failed',
      message: error.message 
    });
  }
}

async function handleSearch(req, res, verifier) {
  const { query, limit = 5, page } = req.query;
  
  if (!query) {
    return res.status(400).json({ 
      error: 'Missing query parameter',
      message: 'Provide a search query'
    });
  }

  try {
    if (page) {
      // Get specific Wikipedia page content
      const content = await verifier.getPageContent(page);
      
      if (!content) {
        return res.status(404).json({
          error: 'Page not found',
          message: `Wikipedia page "${page}" not found`
        });
      }
      
      res.status(200).json({
        type: 'page_content',
        page,
        content,
        timestamp: new Date().toISOString()
      });
    } else {
      // Search Wikipedia
      const searchResults = await verifier.searchWikipedia(query, parseInt(limit));
      
      res.status(200).json({
        type: 'search_results',
        query,
        results: searchResults,
        totalResults: searchResults.length,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ 
      error: 'Search failed',
      message: error.message 
    });
  }
} 