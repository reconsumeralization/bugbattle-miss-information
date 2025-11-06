import axios from 'axios';

interface WikiSearchResult {
  title: string;
  snippet: string;
  titleSnippet: string;
  pageId: number;
  size: number;
  wordCount: number;
  url: string;
}

interface WikiPageContent {
  title: string;
  extract: string;
  description: string;
  url: string;
  thumbnail?: string;
  coordinates?: any;
  lastModified: string;
}

interface VerificationResult {
  verified: boolean;
  confidence: number;
  reason: string;
  sources: WikiSource[];
  searchResults?: WikiSearchResult[];
  error?: string;
}

interface WikiSource {
  title: string;
  url: string;
  extract: string;
}

interface ClaimVerification {
  claim: { text: string };
  verification: VerificationResult;
}

interface ArticleVerification {
  articleId: string;
  articleTitle: string;
  totalClaims?: number;
  verifications: ClaimVerification[];
  overallScore?: number;
  riskLevel?: string;
  error?: string;
}

interface ExtractedClaim {
  text: string;
  type: string;
  confidence: number;
}

interface CacheItem {
  data: any;
  timestamp: number;
}

class WikipediaVerifier {
  private baseURL: string;
  private searchURL: string;
  private cache: Map<string, CacheItem>;
  private cacheExpiry: number;

  constructor() {
    this.baseURL = 'https://en.wikipedia.org/api/rest_v1';
    this.searchURL = 'https://en.wikipedia.org/w/api.php';
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Search Wikipedia for articles related to a query
  async searchWikipedia(query: string, limit: number = 5): Promise<WikiSearchResult[]> {
    const cacheKey = `search:${query}:${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(this.searchURL, {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: query,
          srlimit: limit,
          srprop: 'snippet|titlesnippet',
          origin: '*'
        },
        timeout: 10000
      });

      const results = (response.data as any)?.query?.search || [];
      const searchResults: WikiSearchResult[] = results.map((item: any) => ({
        title: item.title,
        snippet: this.cleanSnippet(item.snippet),
        titleSnippet: item.titlesnippet,
        pageId: item.pageid,
        size: item.size,
        wordCount: item.wordcount,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/\s/g, '_'))}`
      }));

      this.setCache(cacheKey, searchResults);
      return searchResults;
    } catch (error: any) {
      console.error('Wikipedia search error:', error.message);
      return [];
    }
  }

  // Get the content of a specific Wikipedia page
  async getPageContent(title: string): Promise<WikiPageContent | null> {
    const cacheKey = `content:${title}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.baseURL}/page/summary/${encodeURIComponent(title)}`, {
        timeout: 10000
      });

      const data = response.data as any;
      const content: WikiPageContent = {
        title: data.title,
        extract: data.extract,
        description: data.description,
        url: data.content_urls?.desktop?.page,
        thumbnail: data.thumbnail?.source,
        coordinates: data.coordinates,
        lastModified: data.timestamp
      };

      this.setCache(cacheKey, content);
      return content;
    } catch (error: any) {
      console.error(`Wikipedia content error for ${title}:`, error.message);
      return null;
    }
  }

  // Verify a claim against Wikipedia content
  async verifyClaim(claim: string, category: string | null = null): Promise<VerificationResult> {
    try {
      // Extract key terms from the claim
      const keyTerms = this.extractKeyTerms(claim);
      if (keyTerms.length === 0) {
        return {
          verified: false,
          confidence: 0,
          reason: 'No verifiable terms found in claim',
          sources: []
        };
      }

      // Search for relevant Wikipedia articles
      const searchQuery = keyTerms.join(' ');
      const searchResults = await this.searchWikipedia(searchQuery, 3);
      
      if (searchResults.length === 0) {
        return {
          verified: false,
          confidence: 0,
          reason: 'No relevant Wikipedia articles found',
          sources: []
        };
      }

      // Get content for the most relevant articles
      const contentPromises = searchResults.slice(0, 2).map(result => 
        this.getPageContent(result.title)
      );
      const articles = await Promise.all(contentPromises);
      const validArticles = articles.filter((article): article is WikiPageContent => article !== null);

      if (validArticles.length === 0) {
        return {
          verified: false,
          confidence: 0,
          reason: 'Could not retrieve Wikipedia content',
          sources: searchResults.map(r => ({ title: r.title, url: r.url, extract: r.snippet }))
        };
      }

      // Analyze claim against Wikipedia content
      const verification = this.analyzeClaimAgainstContent(claim, validArticles);
      
      return {
        ...verification,
        sources: validArticles.map(article => ({
          title: article.title,
          url: article.url,
          extract: article.extract.substring(0, 200) + '...'
        })),
        searchResults: searchResults.map(r => ({
          title: r.title,
          snippet: r.snippet,
          titleSnippet: r.titleSnippet,
          pageId: r.pageId,
          size: r.size,
          wordCount: r.wordCount,
          url: r.url
        }))
      };
    } catch (error: any) {
      console.error('Claim verification error:', error);
      return {
        verified: false,
        confidence: 0,
        reason: 'Error during verification process',
        error: error.message,
        sources: []
      };
    }
  }

  // Verify multiple claims from an article
  async verifyArticleClaims(article: { id: string; title: string; content?: string; summary?: string; category?: string }): Promise<ArticleVerification> {
    const claims = this.extractClaimsFromText(article.content || article.summary || '');
    const verificationPromises = claims.map(claim => 
      this.verifyClaim(claim.text, article.category)
    );

    try {
      const verifications = await Promise.all(verificationPromises);
      
      return {
        articleId: article.id,
        articleTitle: article.title,
        totalClaims: claims.length,
        verifications: claims.map((claim, index) => ({
          claim: claim,
          verification: verifications[index]
        })),
        overallScore: this.calculateOverallScore(verifications),
        riskLevel: this.assessRiskLevel(verifications)
      };
    } catch (error: any) {
      console.error('Article verification error:', error);
      return {
        articleId: article.id,
        articleTitle: article.title,
        error: error.message,
        verifications: []
      };
    }
  }

  // Extract key terms for Wikipedia search
  private extractKeyTerms(text: string): string[] {
    // Remove common words and focus on meaningful terms
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    // Prioritize scientific/technical terms
    const priorityTerms = words.filter(word => 
      /^(solar|climate|energy|carbon|renewable|environment|temperature|emission|technology)/i.test(word)
    );

    return priorityTerms.length > 0 ? priorityTerms.slice(0, 3) : words.slice(0, 5);
  }

  // Extract claims from text
  private extractClaimsFromText(text: string): ExtractedClaim[] {
    if (!text) return [];

    // Split into sentences and filter for factual claims
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
    
    const claims: ExtractedClaim[] = [];
    
    sentences.forEach(sentence => {
      // Look for numerical claims
      if (/\d+/.test(sentence)) {
        claims.push({
          text: sentence,
          type: 'numerical',
          confidence: 0.8
        });
      }
      
      // Look for definitive statements
      else if (/(is|are|will|has|have)\s/i.test(sentence)) {
        claims.push({
          text: sentence,
          type: 'definitive',
          confidence: 0.6
        });
      }
      
      // Look for comparative claims
      else if (/(more|less|better|worse|higher|lower|increase|decrease)/i.test(sentence)) {
        claims.push({
          text: sentence,
          type: 'comparative',
          confidence: 0.7
        });
      }
    });

    // Return top claims by confidence
    return claims.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  // Analyze claim against Wikipedia content
  private analyzeClaimAgainstContent(claim: string, articles: WikiPageContent[]): { verified: boolean; confidence: number; reason: string } {
    const claimLower = claim.toLowerCase();
    let totalRelevance = 0;
    let supportingEvidence = 0;
    let contradictingEvidence = 0;

    articles.forEach(article => {
      const contentLower = (article.extract + ' ' + article.description).toLowerCase();
      
      // Check for key term overlap
      const claimWords = claimLower.split(/\s+/);
      const contentWords = new Set(contentLower.split(/\s+/));
      const overlap = claimWords.filter(word => contentWords.has(word)).length;
      const relevance = overlap / claimWords.length;
      
      totalRelevance += relevance;
      
      // Look for supporting or contradicting language
      if (relevance > 0.3) {
        // Check for numbers if claim contains numbers
        const claimNumbers = this.extractNumbers(claim);
        const contentNumbers = this.extractNumbers(article.extract);
        
        if (claimNumbers.length > 0 && contentNumbers.length > 0) {
          const numberMatch = this.checkNumberConsistency(claimNumbers, contentNumbers);
          if (numberMatch > 0.8) supportingEvidence++;
          else if (numberMatch < 0.3) contradictingEvidence++;
        }
        
        // Check for contradictory words
        if (/(not|no|never|false|incorrect|wrong|misleading)/i.test(contentLower)) {
          contradictingEvidence++;
        } else if (/(confirm|support|evidence|research|study|data)/i.test(contentLower)) {
          supportingEvidence++;
        }
      }
    });

    const avgRelevance = totalRelevance / articles.length;
    
    if (avgRelevance < 0.2) {
      return {
        verified: false,
        confidence: 0.2,
        reason: 'Claim not sufficiently covered in Wikipedia sources'
      };
    }
    
    if (contradictingEvidence > supportingEvidence) {
      return {
        verified: false,
        confidence: Math.min(0.8, avgRelevance + (contradictingEvidence * 0.2)),
        reason: 'Wikipedia sources contain contradictory information'
      };
    }
    
    if (supportingEvidence > 0) {
      return {
        verified: true,
        confidence: Math.min(0.9, avgRelevance + (supportingEvidence * 0.1)),
        reason: 'Claim supported by Wikipedia sources'
      };
    }
    
    return {
      verified: false,
      confidence: avgRelevance,
      reason: 'Insufficient evidence in Wikipedia sources'
    };
  }

  // Extract numbers from text
  private extractNumbers(text: string): number[] {
    const matches = text.match(/\d+\.?\d*/g);
    return matches ? matches.map(Number).filter(n => !isNaN(n)) : [];
  }

  // Check consistency between claim numbers and content numbers
  private checkNumberConsistency(claimNumbers: number[], contentNumbers: number[]): number {
    if (claimNumbers.length === 0 || contentNumbers.length === 0) return 0;
    
    let matches = 0;
    let total = claimNumbers.length;
    
    claimNumbers.forEach(claimNum => {
      const closest = contentNumbers.reduce((prev, curr) => 
        Math.abs(curr - claimNum) < Math.abs(prev - claimNum) ? curr : prev
      );
      
      const percentDiff = Math.abs(claimNum - closest) / claimNum;
      if (percentDiff < 0.1) matches++; // Within 10%
    });
    
    return matches / total;
  }

  // Calculate overall score for article verification
  private calculateOverallScore(verifications: VerificationResult[]): number {
    if (verifications.length === 0) return 0;
    
    const totalConfidence = verifications.reduce((sum, v) => sum + v.confidence, 0);
    return Math.round((totalConfidence / verifications.length) * 100);
  }

  // Assess risk level based on verifications
  private assessRiskLevel(verifications: VerificationResult[]): string {
    const falseCount = verifications.filter(v => !v.verified && v.confidence > 0.6).length;
    const totalCount = verifications.length;
    
    if (totalCount === 0) return 'unknown';
    
    const falseRatio = falseCount / totalCount;
    
    if (falseRatio > 0.7) return 'high';
    if (falseRatio > 0.4) return 'medium';
    return 'low';
  }

  // Cache management
  private setCache(key: string, value: any): void {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now()
    });
  }

  private getFromCache(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  // Clean HTML snippets
  private cleanSnippet(snippet: string): string {
    return snippet.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export default WikipediaVerifier; 