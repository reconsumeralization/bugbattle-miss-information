#!/usr/bin/env node

// Environment Debug Script
// Run with: node scripts/debug-env.js

console.log('🔍 Miss Information Environment Debug\n');

console.log('📋 Required Environment Variables:');
console.log('==================================');

const requiredVars = [
  { name: 'XAI_API_KEY', description: 'X.ai Grok API key for enhanced fact-checking' },
  { name: 'TAVUS_API_KEY', description: 'Tavus API key for expert video generation' },
  { name: 'NEXTAUTH_SECRET', description: 'Next.js authentication secret' }
];

const optionalVars = [
  { name: 'OPENAI_API_KEY', description: 'OpenAI key (optional fallback)' },
  { name: 'WIKIPEDIA_API_KEY', description: 'Wikipedia API key (optional)' }
];

let allRequired = true;

requiredVars.forEach(({ name, description }) => {
  const value = process.env[name];
  const status = value ? '✅' : '❌';
  const display = value ? `${value.substring(0, 8)}...` : 'NOT SET';
  
  console.log(`${status} ${name}: ${display}`);
  console.log(`   ${description}`);
  
  if (!value) allRequired = false;
});

console.log('\n📋 Optional Environment Variables:');
console.log('=================================');

optionalVars.forEach(({ name, description }) => {
  const value = process.env[name];
  const status = value ? '✅' : '⚠️ ';
  const display = value ? `${value.substring(0, 8)}...` : 'NOT SET';
  
  console.log(`${status} ${name}: ${display}`);
  console.log(`   ${description}`);
});

console.log('\n🔧 Current Working Directory:', process.cwd());

// Check for .env file
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

console.log('\n📁 Configuration Files:');
console.log('======================');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
} else {
  console.log('❌ .env file NOT found');
}

if (fs.existsSync(envExamplePath)) {
  console.log('✅ env.example file found');
} else {
  console.log('❌ env.example file NOT found');
}

console.log('\n🎯 Recommendations:');
console.log('==================');

if (!allRequired) {
  console.log('❌ Missing required API keys! To fix:');
  console.log('');
  console.log('1. Copy env.example to .env:');
  console.log('   cp env.example .env');
  console.log('');
  console.log('2. Get your X.ai API key:');
  console.log('   • Visit https://console.x.ai/');
  console.log('   • Create account and get API key');
  console.log('   • Add to .env file: XAI_API_KEY=your_key_here');
  console.log('');
  console.log('3. Get your Tavus API key:');
  console.log('   • Visit https://www.tavus.io/');
  console.log('   • Sign up for developer account');
  console.log('   • Add to .env file: TAVUS_API_KEY=your_key_here');
  console.log('');
  console.log('4. Generate auth secret:');
  console.log('   • Run: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  console.log('   • Add to .env file: NEXTAUTH_SECRET=generated_secret');
  
} else {
  console.log('✅ All required API keys are configured!');
  console.log('🚀 You can now run: npm run dev');
  console.log('🧪 Test enhanced features: node scripts/test-enhanced-xai.js');
}

console.log('\n💡 For development without API keys:');
console.log('   • The system includes fallback modes');
console.log('   • Basic game functionality will work');
console.log('   • X.ai and Tavus features will be simulated');

console.log('\n🏆 Competition Ready Checklist:');
console.log('==============================');
console.log(`${process.env.XAI_API_KEY ? '✅' : '❌'} X.ai Grok integration`);
console.log(`${process.env.TAVUS_API_KEY ? '✅' : '❌'} Tavus expert videos`);
console.log(`${fs.existsSync(path.join(process.cwd(), 'components', 'EnhancedRealTimeDashboard.js')) ? '✅' : '❌'} Enhanced dashboard`);
console.log(`${fs.existsSync(path.join(process.cwd(), 'lib', 'xaiApiEnhanced.js')) ? '✅' : '❌'} Structured outputs`);
console.log(`${fs.existsSync(path.join(process.cwd(), 'pages', 'api', 'xai', 'batch-analyze.js')) ? '✅' : '❌'} Async batch processing`);

console.log('\n🎉 Your Miss Information platform is ready for the Bolt hackathon!'); 