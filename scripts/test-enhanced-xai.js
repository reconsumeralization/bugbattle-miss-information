#!/usr/bin/env node

// Simple test script for Enhanced X.ai Integration
// Run with: node scripts/test-enhanced-xai.js

import testEnhancedFeatures from '../tests/xai-enhanced-features-test.js';

async function main() {
  console.log('🚀 Starting Enhanced X.ai Features Test\n');
  
  try {
    const results = await testEnhancedFeatures();
    
    console.log('\n📊 SUMMARY REPORT');
    console.log('='.repeat(50));
    
    // Count successful tests
    const allTests = Object.values(results).flatMap(category => Object.values(category));
    const successfulTests = allTests.filter(test => test.success);
    
    console.log(`✅ Tests Passed: ${successfulTests.length}/${allTests.length}`);
    console.log(`📈 Success Rate: ${(successfulTests.length / allTests.length * 100).toFixed(1)}%`);
    
    // Performance summary
    const responseTimes = successfulTests.filter(test => test.duration).map(test => test.duration);
    if (responseTimes.length > 0) {
      const avgTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
      console.log(`⏱️  Average Response Time: ${Math.round(avgTime)}ms`);
    }
    
    // Feature status
    console.log('\n🎯 Feature Status:');
    console.log(`📋 Structured Outputs: ${results.structured_outputs?.fact_check?.success ? '✅' : '❌'}`);
    console.log(`🔄 Async Batch Processing: ${results.batch_operations?.fact_check?.success ? '✅' : '❌'}`);
    console.log(`🚨 Real-time Alerts: ${results.async_processing?.alerts?.success ? '✅' : '❌'}`);
    console.log(`🔍 Live Search: ${results.async_processing?.live_search?.success ? '✅' : '❌'}`);
    
    if (successfulTests.length === allTests.length) {
      console.log('\n🎉 All enhanced features working perfectly!');
      console.log('Your Miss Information platform is ready for the competition! 🏆');
    } else {
      console.log('\n⚠️  Some features need attention. Check the detailed logs above.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure you have:');
    console.log('   1. Set XAI_API_KEY environment variable');
    console.log('   2. Valid X.ai API access');
    console.log('   3. Network connectivity');
  }
}

main().catch(console.error); 