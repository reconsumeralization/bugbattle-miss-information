const Parser = require('rss-parser');
const rssSources = require('../data/rssSources.json');

interface RSSSource {
  name: string;
  url: string;
  credibility?: number;
  bias?: string;
}

interface MediaContent {
  mediaContent?: any;
  contentEncoded?: string;
  creator?: string;
}

interface RSSItem {
  title?: string;
  link?: string;
  guid?: string;
  contentSnippet?: string;
  summary?: string;
  pubDate?: string;
  isoDate?: string;
  categories?: string[];
  creator?: string;
  author?: string;
  content?: string;
}

interface ParsedArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  link?: string;
  publishDate: Date;
  source: {
    name: string;
    url: string;
    credibility: number;
    bias: string;
  };
  categories: string[];
  creator: string;
}

interface FeedResult {
  feedTitle: string;
  feedDescription?: string;
  articles: ParsedArticle[];
  lastUpdated: Date;
  sourceInfo: RSSSource;
  error?: string;
}

interface CategoryResult {
  category: string;
  totalSources: number;
  successfulSources: number;
  articles: ParsedArticle[];
  lastUpdated: Date;
  error?: string;
}

interface CategoryInfo {
  id: string;
  name: string;
  priority: string;
}

interface Claim {
  type: 'numerical' | 'comparative' | 'temporal';
  text: string;
  value?: number;
  unit?: string;
  context: string;
}

interface RSSCategories {
  [key: string]: {
    name: string;
    sources: RSSSource[];
  };
}

interface RSSSourcesData {
  categories: RSSCategories;
  categories_priority: { [key: string]: string };
}

class RSSFeedParser {
  private parser: any;
  private cache: Map<string, ParsedArticle[]>;
  private lastUpdated: Map<string, Date>;

  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      customFields: {
        item: [
          ['media:content', 'mediaContent'],
          ['content:encoded', 'contentEncoded'],
          ['dc:creator', 'creator']
        ]
      }
    });
    this.cache = new Map();
    this.lastUpdated = new Map();
  }

  // Get all RSS sources for a specific category
  getCategorySources(category: string): RSSSource[] {
    const sources = (rssSources as RSSSourcesData);
    return sources.categories[category]?.sources || [];
  }

  // Get all available categories
  getCategories(): CategoryInfo[] {
    const sources = (rssSources as RSSSourcesData);
    return Object.keys(sources.categories).map(key => ({
      id: key,
      name: sources.categories[key].name,
      priority: sources.categories_priority[key] || 'low_priority'
    }));
  }

  // Parse a single RSS feed
  async parseFeed(url: string, source: RSSSource = {} as RSSSource): Promise<FeedResult> {
    try {
      const feed = await this.parser.parseURL(url);
      
      const articles: ParsedArticle[] = feed.items.map((item: RSSItem) => ({
        id: this.generateId(item.link || item.guid || ''),
        title: this.cleanText(item.title || ''),
        content: this.extractContent(item),
        summary: this.cleanText(item.contentSnippet || item.summary || ''),
        link: item.link,
        publishDate: new Date(item.pubDate || item.isoDate || Date.now()),
        source: {
          name: source.name || feed.title,
          url: url,
          credibility: source.credibility || 0.5,
          bias: source.bias || 'unknown'
        },
        categories: item.categories || [],
        creator: item.creator || item.author || 'Unknown'
      }));

      return {
        feedTitle: feed.title,
        feedDescription: feed.description,
        articles: articles.slice(0, 20), // Limit to most recent 20 articles
        lastUpdated: new Date(),
        sourceInfo: source
      };
    } catch (error: any) {
      console.error(`Error parsing RSS feed ${url}:`, error.message);
      return {
        feedTitle: source.name || 'Unknown Feed',
        articles: [],
        error: error.message,
        lastUpdated: new Date(),
        sourceInfo: source
      };
    }
  }

  // Parse all feeds for a category
  async parseCategoryFeeds(category: string): Promise<CategoryResult> {
    const sources = this.getCategorySources(category);
    const promises = sources.map(source => this.parseFeed(source.url, source));
    
    try {
      const results = await Promise.allSettled(promises);
      const successfulFeeds = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<FeedResult>).value);

      // Combine all articles and sort by publish date
      const allArticles = successfulFeeds
        .flatMap(feed => feed.articles)
        .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

      // Cache the results
      this.cache.set(category, allArticles);
      this.lastUpdated.set(category, new Date());

      return {
        category,
        totalSources: sources.length,
        successfulSources: successfulFeeds.length,
        articles: allArticles,
        lastUpdated: new Date()
      };
    } catch (error: any) {
      console.error(`Error parsing category ${category}:`, error);
      return {
        category,
        articles: this.cache.get(category) || [],
        error: error.message,
        lastUpdated: this.lastUpdated.get(category) || new Date(),
        totalSources: sources.length,
        successfulSources: 0
      };
    }
  }

  // Parse all feeds across all categories
  async parseAllFeeds(): Promise<{ [key: string]: CategoryResult }> {
    const categories = this.getCategories();
    const results: { [key: string]: CategoryResult } = {};

    for (const category of categories) {
      results[category.id] = await this.parseCategoryFeeds(category.id);
    }

    return results;
  }

  // Get cached articles for a category
  getCachedArticles(category: string, maxAge: number = 30 * 60 * 1000): ParsedArticle[] | null { // 30 minutes default
    const articles = this.cache.get(category);
    const lastUpdate = this.lastUpdated.get(category);
    
    if (!articles || !lastUpdate) {
      return null;
    }

    const age = Date.now() - lastUpdate.getTime();
    if (age > maxAge) {
      return null; // Cache expired
    }

    return articles;
  }

  // Search articles by keywords
  searchArticles(query: string, category: string | null = null): ParsedArticle[] {
    const searchTerm = query.toLowerCase();
    let articles: ParsedArticle[] = [];

    if (category) {
      articles = this.cache.get(category) || [];
    } else {
      // Search across all categories
      for (const [cat, arts] of Array.from(this.cache.entries())) {
        articles = articles.concat(arts);
      }
    }

    return articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.summary.toLowerCase().includes(searchTerm)
    );
  }

  // Extract potential claims for fact-checking
  extractClaims(article: ParsedArticle): Claim[] {
    const content = `${article.title} ${article.content} ${article.summary}`;
    const claims: Claim[] = [];

    // Extract numerical claims
    const numberRegex = /\b(\d+(?:\.\d+)?)\s*(%|percent|degrees?|years?|million|billion|trillion)\b/gi;
    let match;
    while ((match = numberRegex.exec(content)) !== null) {
      claims.push({
        type: 'numerical',
        text: match[0],
        value: parseFloat(match[1]),
        unit: match[2],
        context: this.getContextAroundMatch(content, match.index, 50)
      });
    }

    // Extract comparative claims
    const comparativeRegex = /\b(more|less|higher|lower|faster|slower|better|worse|increase|decrease|rise|fall)\b/gi;
    while ((match = comparativeRegex.exec(content)) !== null) {
      claims.push({
        type: 'comparative',
        text: match[0],
        context: this.getContextAroundMatch(content, match.index, 100)
      });
    }

    // Extract temporal claims
    const temporalRegex = /\b(always|never|usually|often|rarely|sometimes|frequently)\b/gi;
    while ((match = temporalRegex.exec(content)) !== null) {
      claims.push({
        type: 'temporal',
        text: match[0],
        context: this.getContextAroundMatch(content, match.index, 100)
      });
    }

    return claims;
  }

  // Generate unique ID for articles
  private generateId(input: string): string {
    return Buffer.from(input).toString('base64').substring(0, 16);
  }

  // Clean text content
  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  // Extract content from RSS item
  private extractContent(item: RSSItem & MediaContent): string {
    return this.cleanText(
      item.contentEncoded || item.content || item.summary || item.title || ''
    );
  }

  // Get context around a regex match
  private getContextAroundMatch(text: string, index: number, contextLength: number): string {
    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + contextLength);
    return text.substring(start, end).trim();
  }

  // Get statistics about cached data
  getStatistics(): { [key: string]: any } {
    const stats: { [key: string]: any } = {
      totalCategories: this.cache.size,
      totalArticles: 0,
      oldestUpdate: null,
      newestUpdate: null
    };

    for (const [category, articles] of Array.from(this.cache.entries())) {
      stats.totalArticles += articles.length;
      stats[`${category}_count`] = articles.length;
      
      const lastUpdate = this.lastUpdated.get(category);
      if (lastUpdate) {
        if (!stats.oldestUpdate || lastUpdate < stats.oldestUpdate) {
          stats.oldestUpdate = lastUpdate;
        }
        if (!stats.newestUpdate || lastUpdate > stats.newestUpdate) {
          stats.newestUpdate = lastUpdate;
        }
      }
    }

    return stats;
  }
}

module.exports = RSSFeedParser;
export default RSSFeedParser; 