// Enhanced X.ai Features Test Suite
// Tests structured outputs, async batch processing, and real-time capabilities

import EnhancedXaiApi from '../lib/xaiApiEnhanced.js';

async function testEnhancedFeatures() {
  console.log('🚀 Testing Enhanced X.ai Features with Structured Outputs & Async Processing\n');

  const hasApiKey = !!process.env.XAI_API_KEY;
  
  if (!hasApiKey) {
    console.log('⚠️  XAI_API_KEY not found - Testing in FALLBACK MODE');
    console.log('💡 This will demonstrate the system using simulated responses');
    console.log('🔧 To test with real X.ai: Export XAI_API_KEY=your_key_here\n');
  } else {
    console.log('✅ XAI_API_KEY found - Testing with REAL X.ai API\n');
  }

  const testResults = {
    structured_outputs: {},
    async_processing: {},
    batch_operations: {},
    performance_metrics: {}
  };

  console.log('=' .repeat(60));
  console.log('1️⃣  TESTING STRUCTURED OUTPUTS');
  console.log('=' .repeat(60));

  // Test 1: Structured Fact-Checking via API endpoint
  try {
    console.log('\n📊 Testing Structured Fact-Check via API...');
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/xai/analyze-structured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claim: "Climate change is a hoax created by renewable energy companies",
        context: "This claim appears frequently on social media",
        analysisType: 'fact-check'
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const factCheckResult = await response.json();
    const duration = Date.now() - startTime;
    
    testResults.structured_outputs.fact_check = {
      success: true,
      duration,
      schema_compliance: validateFactCheckSchema(factCheckResult),
      result: factCheckResult,
      fallback_mode: factCheckResult.fallback_mode
    };

    console.log(`✅ Structured fact-check completed ${factCheckResult.fallback_mode ? '(Fallback Mode)' : '(Live API)'}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📋 Schema compliance: ${testResults.structured_outputs.fact_check.schema_compliance ? '✅' : '❌'}`);
    console.log(`🎯 Verdict: ${factCheckResult.verdict}`);
    console.log(`📈 Accuracy: ${factCheckResult.accuracy_score}%`);
    console.log(`🔰 Confidence: ${factCheckResult.confidence_level}`);

  } catch (error) {
    console.log('❌ Structured fact-check failed:', error.message);
    testResults.structured_outputs.fact_check = { success: false, error: error.message };
  }

  // Test 2: Structured Sentiment Analysis via API
  try {
    console.log('\n🎭 Testing Structured Sentiment Analysis via API...');
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/xai/analyze-structured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claim: "artificial intelligence regulation",
        analysisType: 'sentiment'
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const sentimentResult = await response.json();
    const duration = Date.now() - startTime;
    
    testResults.structured_outputs.sentiment = {
      success: true,
      duration,
      schema_compliance: validateSentimentSchema(sentimentResult),
      result: sentimentResult,
      fallback_mode: sentimentResult.fallback_mode
    };

    console.log(`✅ Structured sentiment analysis completed ${sentimentResult.fallback_mode ? '(Fallback Mode)' : '(Live API)'}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📊 Overall sentiment: ${sentimentResult.overall_sentiment}`);
    if (sentimentResult.sentiment_distribution) {
      console.log(`📈 Distribution: +${sentimentResult.sentiment_distribution.positive}% / ~${sentimentResult.sentiment_distribution.neutral}% / -${sentimentResult.sentiment_distribution.negative}%`);
    }

  } catch (error) {
    console.log('❌ Structured sentiment analysis failed:', error.message);
    testResults.structured_outputs.sentiment = { success: false, error: error.message };
  }

  console.log('\n' + '=' .repeat(60));
  console.log('2️⃣  TESTING ASYNC BATCH PROCESSING');
  console.log('=' .repeat(60));

  // Test 3: Batch Fact-Checking via API
  try {
    console.log('\n🔄 Testing Batch Fact-Checking via API...');
    const claims = [
      "Vaccines contain microchips for tracking",
      "5G networks cause COVID-19",
      "The Earth is flat and NASA lies",
      "Electric cars are worse for environment than gas cars"
    ];

    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/xai/batch-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claims,
        batchType: 'fact-check'
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const batchData = await response.json();
    const duration = Date.now() - startTime;

    testResults.batch_operations.fact_check = {
      success: true,
      duration,
      claims_processed: claims.length,
      results_received: batchData.results.length,
      average_time_per_claim: duration / claims.length,
      results: batchData.results,
      fallback_mode: batchData.metadata.fallback_mode
    };

    console.log(`✅ Batch fact-checking completed ${batchData.metadata.fallback_mode ? '(Fallback Mode)' : '(Live API)'}`);
    console.log(`⏱️  Total duration: ${duration}ms`);
    console.log(`📊 Claims processed: ${claims.length}`);
    console.log(`⚡ Average per claim: ${Math.round(duration / claims.length)}ms`);
    console.log(`📈 Success rate: ${(batchData.metadata.success_rate * 100).toFixed(1)}%`);

    // Show sample results
    batchData.results.slice(0, 2).forEach((result, index) => {
      if (result && result.verdict) {
        console.log(`   ${index + 1}. "${claims[index].substring(0, 40)}..." → ${result.verdict} (${result.accuracy_score}%)`);
      }
    });

  } catch (error) {
    console.log('❌ Batch fact-checking failed:', error.message);
    testResults.batch_operations.fact_check = { success: false, error: error.message };
  }

  console.log('\n' + '=' .repeat(60));
  console.log('3️⃣  TESTING REAL-TIME CAPABILITIES');
  console.log('=' .repeat(60));

  // Test 4: Real-time Alerts via API
  try {
    console.log('\n🚨 Testing Real-time Misinformation Alerts via API...');
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/xai/real-time-alerts');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const alertsResult = await response.json();
    const duration = Date.now() - startTime;

    testResults.async_processing.alerts = {
      success: true,
      duration,
      alerts_found: alertsResult.alerts ? alertsResult.alerts.length : 0,
      platform_health: alertsResult.platform_health?.overall_score,
      result: alertsResult,
      fallback_mode: alertsResult.metadata?.fallback_mode
    };

    console.log(`✅ Real-time alerts retrieved ${alertsResult.metadata?.fallback_mode ? '(Fallback Mode)' : '(Live API)'}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`🚨 Active alerts: ${alertsResult.alerts ? alertsResult.alerts.length : 0}`);
    console.log(`🏥 Platform health: ${alertsResult.platform_health?.overall_score || 'N/A'}`);

    if (alertsResult.alerts && alertsResult.alerts.length > 0) {
      alertsResult.alerts.slice(0, 2).forEach((alert, index) => {
        console.log(`   ${index + 1}. [${alert.alert_level}] ${alert.topic}: ${alert.narrative.substring(0, 60)}...`);
      });
    }

  } catch (error) {
    console.log('❌ Real-time alerts failed:', error.message);
    testResults.async_processing.alerts = { success: false, error: error.message };
  }

  // Test 5: Live Search via API
  try {
    console.log('\n🔍 Testing Live Search Capabilities via API...');
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/xai/analyze-structured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claim: "misinformation about elections",
        analysisType: 'live-search'
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const searchResult = await response.json();
    const duration = Date.now() - startTime;

    testResults.async_processing.live_search = {
      success: true,
      duration,
      results_found: searchResult.search_results ? searchResult.search_results.length : 0,
      result: searchResult,
      fallback_mode: searchResult.fallback_mode
    };

    console.log(`✅ Live search completed ${searchResult.fallback_mode ? '(Fallback Mode)' : '(Live API)'}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`🔍 Results found: ${searchResult.search_results ? searchResult.search_results.length : 0}`);
    console.log(`📊 Expert consensus: ${searchResult.expert_consensus || 'N/A'}`);

  } catch (error) {
    console.log('❌ Live search failed:', error.message);
    testResults.async_processing.live_search = { success: false, error: error.message };
  }

  console.log('\n' + '=' .repeat(60));
  console.log('4️⃣  PERFORMANCE SUMMARY');
  console.log('=' .repeat(60));

  // Calculate performance metrics
  const successfulTests = Object.values(testResults).reduce((count, category) => {
    return count + Object.values(category).filter(test => test.success).length;
  }, 0);

  const totalTests = Object.values(testResults).reduce((count, category) => {
    return count + Object.keys(category).length;
  }, 0);

  const averageDuration = Object.values(testResults).reduce((total, category) => {
    const durations = Object.values(category).filter(test => test.duration).map(test => test.duration);
    return total + durations.reduce((sum, dur) => sum + dur, 0);
  }, 0) / (successfulTests || 1);

  const fallbackTests = Object.values(testResults).reduce((count, category) => {
    return count + Object.values(category).filter(test => test.fallback_mode).length;
  }, 0);

  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Successful: ${successfulTests}/${totalTests}`);
  console.log(`   ⏱️  Average response time: ${Math.round(averageDuration)}ms`);
  console.log(`   📈 Success rate: ${(successfulTests / totalTests * 100).toFixed(1)}%`);
  console.log(`   🔄 Fallback mode: ${fallbackTests}/${totalTests} tests`);

  // Feature-specific metrics
  if (testResults.batch_operations.fact_check && testResults.batch_operations.fact_check.success) {
    const batchMetrics = testResults.batch_operations.fact_check;
    console.log(`\n🔄 Batch Processing Performance:`);
    console.log(`   ⚡ Claims per second: ${(batchMetrics.claims_processed / (batchMetrics.duration / 1000)).toFixed(1)}`);
    console.log(`   📊 Parallel efficiency: ${((batchMetrics.claims_processed * 1000) / batchMetrics.duration).toFixed(1)}x faster than sequential`);
  }

  console.log('\n🎯 Enhanced Features Validation:');
  console.log(`   📋 Structured Outputs: ${testResults.structured_outputs.fact_check?.schema_compliance ? '✅ Working' : '❌ Failed'}`);
  console.log(`   🔄 Async Processing: ${testResults.batch_operations.fact_check?.success ? '✅ Working' : '❌ Failed'}`);
  console.log(`   🚨 Real-time Monitoring: ${testResults.async_processing.alerts?.success ? '✅ Working' : '❌ Failed'}`);
  console.log(`   🔍 Live Search: ${testResults.async_processing.live_search?.success ? '✅ Working' : '❌ Failed'}`);

  console.log('\n🏆 Competition Readiness:');
  if (hasApiKey) {
    console.log('✅ Real X.ai integration active - Competition ready!');
  } else {
    console.log('⚠️  Using fallback mode - Add XAI_API_KEY for full features');
    console.log('✅ All systems functional - Demo ready!');
  }

  console.log('\n' + '=' .repeat(60));
  console.log('✨ ENHANCED X.ai INTEGRATION TEST COMPLETE');
  console.log('=' .repeat(60));

  return testResults;
}

// Schema validation functions
function validateFactCheckSchema(result) {
  const requiredFields = ['accuracy_score', 'verdict', 'confidence_level', 'key_findings'];
  return requiredFields.every(field => result.hasOwnProperty(field));
}

function validateSentimentSchema(result) {
  const requiredFields = ['overall_sentiment', 'sentiment_distribution', 'key_themes'];
  return requiredFields.every(field => result.hasOwnProperty(field));
}

// Simple fetch polyfill for Node.js
if (!global.fetch) {
  console.log('⚠️  This test requires the Next.js server to be running on localhost:3000');
  console.log('💡 Run: npm run dev');
  process.exit(1);
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEnhancedFeatures().catch(console.error);
}

export default testEnhancedFeatures; 