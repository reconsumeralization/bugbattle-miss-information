/**
 * X.ai Implementation Test Utility
 * Tests both prompt-based and direct API approaches
 */

import XaiGrokAPI from '../lib/xaiApi';
import XaiGrokApiDirect from '../lib/xaiApiDirect';

class XaiImplementationTester {
  constructor() {
    this.promptApi = new XaiGrokAPI();
    this.directApi = new XaiGrokApiDirect();
  }

  /**
   * Test which implementation approach works best
   */
  async testImplementationApproaches() {
    console.log('🧪 Testing X.ai Implementation Approaches...\n');

    const testQuery = 'climate change hoax';
    const testClaim = 'Global warming is not real';

    // Test 1: Endpoint Discovery
    console.log('1️⃣ Testing Direct API Endpoint Availability...');
    const availableEndpoints = await this.directApi.discoverAvailableEndpoints();
    console.log('Available endpoints:', availableEndpoints);

    // Test 2: Live Search Comparison
    console.log('\n2️⃣ Testing Live Search Implementations...');
    
    const promptSearchStart = Date.now();
    const promptSearchResult = await this.promptApi.liveSearchMisinformation(testQuery, { maxResults: 5 });
    const promptSearchTime = Date.now() - promptSearchStart;

    const directSearchStart = Date.now();
    const directSearchResult = await this.directApi.liveSearchMisinformation(testQuery, { maxResults: 5 });
    const directSearchTime = Date.now() - directSearchStart;

    console.log('Prompt-based approach:', {
      success: !promptSearchResult.error,
      responseTime: promptSearchTime + 'ms',
      postsFound: promptSearchResult.posts?.length || 0,
      dataSource: promptSearchResult.dataSource
    });

    console.log('Direct API approach:', {
      success: !directSearchResult.error,
      responseTime: directSearchTime + 'ms',
      postsFound: directSearchResult.posts?.length || 0,
      dataSource: directSearchResult.dataSource
    });

    // Test 3: Sentiment Analysis Comparison
    console.log('\n3️⃣ Testing Sentiment Analysis Implementations...');
    
    const promptSentimentStart = Date.now();
    const promptSentimentResult = await this.promptApi.analyzeMisinformationSentiment(testClaim);
    const promptSentimentTime = Date.now() - promptSentimentStart;

    const directSentimentStart = Date.now();
    const directSentimentResult = await this.directApi.analyzeMisinformationSentiment(testClaim);
    const directSentimentTime = Date.now() - directSentimentStart;

    console.log('Prompt-based sentiment:', {
      success: !promptSentimentResult.error,
      responseTime: promptSentimentTime + 'ms',
      hasData: !!promptSentimentResult.sentiment,
      dataSource: promptSentimentResult.dataSource
    });

    console.log('Direct API sentiment:', {
      success: !directSentimentResult.error,
      responseTime: directSentimentTime + 'ms',
      hasData: !!directSentimentResult.sentiment,
      dataSource: directSentimentResult.dataSource
    });

    // Test 4: JSON Parsing Reliability
    console.log('\n4️⃣ Testing JSON Parsing Reliability...');
    const parsingTests = await this.testJsonParsing();
    console.log('JSON parsing success rates:', parsingTests);

    // Generate recommendation
    const recommendation = this.generateRecommendation({
      availableEndpoints,
      promptSearch: { ...promptSearchResult, responseTime: promptSearchTime },
      directSearch: { ...directSearchResult, responseTime: directSearchTime },
      promptSentiment: { ...promptSentimentResult, responseTime: promptSentimentTime },
      directSentiment: { ...directSentimentResult, responseTime: directSentimentTime },
      parsingTests
    });

    console.log('\n🎯 RECOMMENDATION:', recommendation);
    return recommendation;
  }

  /**
   * Test JSON parsing reliability across multiple requests
   */
  async testJsonParsing() {
    const testQueries = [
      'vaccine misinformation',
      'election fraud claims',
      'crypto scam posts'
    ];

    let promptSuccesses = 0;
    let directSuccesses = 0;
    const totalTests = testQueries.length;

    for (const query of testQueries) {
      try {
        const promptResult = await this.promptApi.liveSearchMisinformation(query, { maxResults: 3 });
        if (promptResult.posts && Array.isArray(promptResult.posts)) {
          promptSuccesses++;
        }
      } catch (error) {
        // Failed to parse
      }

      try {
        const directResult = await this.directApi.liveSearchMisinformation(query, { maxResults: 3 });
        if (directResult.posts && Array.isArray(directResult.posts)) {
          directSuccesses++;
        }
      } catch (error) {
        // Failed to parse
      }
    }

    return {
      promptBased: (promptSuccesses / totalTests) * 100 + '%',
      directApi: (directSuccesses / totalTests) * 100 + '%'
    };
  }

  /**
   * Generate implementation recommendation
   */
  generateRecommendation(testResults) {
    const { availableEndpoints, promptSearch, directSearch, parsingTests } = testResults;

    // Check if direct endpoints are available
    const hasDirectEndpoints = Object.values(availableEndpoints).some(available => available);

    if (hasDirectEndpoints) {
      return {
        approach: 'HYBRID',
        primary: 'Direct API',
        fallback: 'Prompt-based',
        reasoning: 'Direct endpoints available - use them for primary functionality with prompt fallback',
        implementation: 'Use XaiGrokApiDirect as primary, fall back to XaiGrokAPI on errors'
      };
    }

    // If no direct endpoints, check prompt-based reliability
    const promptSuccessRate = parseFloat(parsingTests.promptBased);
    
    if (promptSuccessRate >= 70) {
      return {
        approach: 'PROMPT_BASED',
        primary: 'Enhanced prompts',
        fallback: 'None needed',
        reasoning: `Prompt-based approach works reliably (${parsingTests.promptBased} success rate)`,
        implementation: 'Use enhanced XaiGrokAPI with optimized prompts'
      };
    }

    return {
      approach: 'ENHANCED_PROMPT',
      primary: 'Improved prompt engineering',
      fallback: 'Static data',
      reasoning: 'Neither approach fully reliable - need prompt optimization',
      implementation: 'Enhance prompts and add robust error handling'
    };
  }

  /**
   * Quick connection test
   */
  async quickTest() {
    console.log('🚀 Quick X.ai Connection Test...\n');

    try {
      // Test basic API connection
      const connection = await this.promptApi.testConnection();
      console.log('✅ X.ai API Connection:', connection ? 'SUCCESS' : 'FAILED');

      if (connection) {
        // Test simple live search
        const searchResult = await this.promptApi.liveSearchMisinformation('test misinformation', { maxResults: 1 });
        console.log('✅ Live Search Test:', searchResult.error ? 'FAILED' : 'SUCCESS');
        console.log('   Data source:', searchResult.dataSource);
        console.log('   Posts found:', searchResult.posts?.length || 0);

        return { connection: true, liveSearch: !searchResult.error };
      }
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      return { connection: false, liveSearch: false };
    }
  }
}

// Export for use in other files
export default XaiImplementationTester;

// Also create a simple test runner function
export async function runXaiTests() {
  const tester = new XaiImplementationTester();
  
  console.log('🎯 Starting X.ai Implementation Tests...\n');
  
  // Quick test first
  const quickResults = await tester.quickTest();
  
  if (quickResults.connection) {
    // Full test if connection works
    const fullResults = await tester.testImplementationApproaches();
    return { quick: quickResults, full: fullResults };
  } else {
    console.log('⚠️ Skipping full tests due to connection issues');
    return { quick: quickResults, full: null };
  }
} 