#!/usr/bin/env node

/**
 * X.ai Integration Test Script
 * Run this when you get your X.ai API key to test the implementation
 * 
 * Usage: node scripts/test-xai-integration.js
 */

import { runXaiTests } from '../tests/xai-implementation-test.js';

async function main() {
  console.log('🚀 X.ai Integration Test Suite');
  console.log('===============================\n');

  // Check if API key is set
  if (!process.env.XAI_API_KEY) {
    console.log('❌ XAI_API_KEY environment variable not set');
    console.log('Please add your X.ai API key to your .env file:\n');
    console.log('XAI_API_KEY=your-xai-api-key-here\n');
    process.exit(1);
  }

  console.log('✅ XAI_API_KEY found in environment');
  console.log('🔄 Starting integration tests...\n');

  try {
    const results = await runXaiTests();
    
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    
    if (results.quick) {
      console.log('🔗 Connection Test:', results.quick.connection ? '✅ PASS' : '❌ FAIL');
      console.log('🔍 Live Search Test:', results.quick.liveSearch ? '✅ PASS' : '❌ FAIL');
    }

    if (results.full) {
      console.log('🎯 Recommended Approach:', results.full.approach);
      console.log('📝 Implementation:', results.full.implementation);
      console.log('💭 Reasoning:', results.full.reasoning);
    }

    console.log('\n🎉 Testing complete! Check the output above for implementation guidance.');

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Verify your X.ai API key is correct');
    console.error('2. Check your internet connection');
    console.error('3. Ensure X.ai API access is activated');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 