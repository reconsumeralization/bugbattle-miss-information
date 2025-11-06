const RSSFeedParser = require('../../../lib/rssParser');

let rssParser = null;

// Initialize RSS parser if not already done
function getRSSParser() {
  if (!rssParser) {
    rssParser = new RSSFeedParser();
  }
  return rssParser;
}

export default async function handler(req, res) {
  const parser = getRSSParser();

  try {
    switch (req.method) {
      case 'GET':
        await handleGetFeeds(req, res, parser);
        break;
      case 'POST':
        await handleUpdateFeeds(req, res, parser);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('RSS Monitor API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

async function handleGetFeeds(req, res, parser) {
  const { category, search, limit } = req.query;
  
  try {
    if (category) {
      // Get cached articles for specific category
      const articles = parser.getCachedArticles(category, 30 * 60 * 1000); // 30 min cache
      
      if (articles) {
        let filteredArticles = articles;
        
        if (search) {
          filteredArticles = parser.searchArticles(search, category);
        }
        
        if (limit) {
          filteredArticles = filteredArticles.slice(0, parseInt(limit));
        }
        
        res.status(200).json({
          category,
          articles: filteredArticles,
          totalCount: filteredArticles.length,
          cached: true,
          lastUpdated: parser.lastUpdated.get(category) || null
        });
      } else {
        // Cache miss - fetch fresh data
        const result = await parser.parseCategoryFeeds(category);
        
        let articles = result.articles;
        if (search) {
          articles = parser.searchArticles(search, category);
        }
        if (limit) {
          articles = articles.slice(0, parseInt(limit));
        }
        
        res.status(200).json({
          ...result,
          articles,
          totalCount: articles.length,
          cached: false
        });
      }
    } else if (search) {
      // Search across all categories
      const results = parser.searchArticles(search);
      const limitedResults = limit ? results.slice(0, parseInt(limit)) : results;
      
      res.status(200).json({
        articles: limitedResults,
        totalCount: limitedResults.length,
        searchTerm: search,
        cached: true
      });
    } else {
      // Get all categories and their stats
      const categories = parser.getCategories();
      const stats = parser.getStatistics();
      
      res.status(200).json({
        categories,
        statistics: stats,
        availableCategories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          priority: cat.priority,
          articleCount: stats.categoriesStats[cat.id]?.articleCount || 0,
          lastUpdated: stats.categoriesStats[cat.id]?.lastUpdated || null
        }))
      });
    }
  } catch (error) {
    console.error('Error handling GET request:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve RSS feeds',
      message: error.message 
    });
  }
}

async function handleUpdateFeeds(req, res, parser) {
  const { category, forceRefresh = false } = req.body;
  
  try {
    if (category) {
      // Update specific category
      const result = await parser.parseCategoryFeeds(category);
      
      res.status(200).json({
        message: `Updated RSS feeds for category: ${category}`,
        result,
        timestamp: new Date().toISOString()
      });
    } else {
      // Update all categories
      const results = await parser.parseAllFeeds();
      
      const summary = {
        totalCategories: Object.keys(results).length,
        successfulCategories: Object.values(results).filter(r => !r.error).length,
        totalArticles: Object.values(results).reduce((sum, r) => sum + (r.articles?.length || 0), 0),
        categories: Object.keys(results).map(cat => ({
          category: cat,
          success: !results[cat].error,
          articleCount: results[cat].articles?.length || 0,
          error: results[cat].error || null
        }))
      };
      
      res.status(200).json({
        message: 'Updated all RSS feeds',
        summary,
        results,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error handling POST request:', error);
    res.status(500).json({ 
      error: 'Failed to update RSS feeds',
      message: error.message 
    });
  }
} 