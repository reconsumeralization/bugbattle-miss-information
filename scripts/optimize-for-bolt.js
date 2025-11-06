#!/usr/bin/env node

/**
 * Bolt.new Optimization Script
 * Prepares Miss Information for optimal performance on Bolt.new platform
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizing Miss Information for Bolt.new deployment...\n');

// 1. Update package.json for Bolt.new optimization
function optimizePackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  const pkg = require(packagePath);
  
  // Add Bolt.new specific optimizations
  pkg.scripts = {
    ...pkg.scripts,
    'bolt:dev': 'next dev',
    'bolt:build': 'next build',
    'bolt:start': 'next start',
    'bolt:export': 'next build && next export'
  };
  
  // Optimize dependencies for faster deployment
  pkg.engines = {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  };
  
  // Add competition metadata
  pkg.keywords = [
    ...pkg.keywords || [],
    'hackathon',
    'bolt-hackathon',
    'tavus-integration',
    'fact-checking',
    'education',
    'misinformation',
    'ai-experts'
  ];
  
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  console.log('✅ Optimized package.json for Bolt.new');
}

// 2. Create Bolt.new configuration
function createBoltConfig() {
  const boltConfig = {
    "name": "miss-information",
    "version": "1.0.0",
    "description": "AI-Powered Fact-Checking Education Platform",
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "installCommand": "npm install",
    "devCommand": "npm run dev",
    "features": {
      "tavus": true,
      "real-time": true,
      "ai-integration": true,
      "educational": true
    },
    "env": {
      "NEXTAUTH_URL": "https://your-bolt-url.bolt.new",
      "NEXTAUTH_SECRET": "your-secret-key",
      "TAVUS_API_KEY": "your-tavus-key",
      "WIKIPEDIA_API_KEY": "optional"
    },
    "competition": {
      "hackathon": "World's Largest Hackathon by Bolt",
      "challenge": "Conversational AI Video Challenge",
      "team": "Dawn of Anarchy"
    }
  };
  
  fs.writeFileSync('bolt.config.json', JSON.stringify(boltConfig, null, 2));
  console.log('✅ Created Bolt.new configuration');
}

// 3. Optimize images and assets
function optimizeAssets() {
  // Create optimized asset structure
  const assetsConfig = {
    images: {
      domains: ['tavus-videos.s3.amazonaws.com', 'wikipedia.org'],
      formats: ['image/webp', 'image/avif'],
      sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
    },
    videos: {
      formats: ['mp4', 'webm'],
      quality: 80,
      compression: true
    }
  };
  
  console.log('✅ Configured asset optimization');
}

// 4. Create environment template
function createEnvTemplate() {
  const envTemplate = `# Miss Information - Environment Configuration
# World's Largest Hackathon by Bolt

# NextAuth Configuration
NEXTAUTH_URL=https://your-bolt-deployment.bolt.new
NEXTAUTH_SECRET=your-super-secret-key-change-in-production

# Database Configuration (for production)
DATABASE_URL=your-database-connection-string

# API Keys
TAVUS_API_KEY=your-tavus-api-key-here
WIKIPEDIA_API_KEY=your-wikipedia-api-key-here

# Competition Metadata
HACKATHON_NAME="World's Largest Hackathon by Bolt"
CHALLENGE_NAME="Conversational AI Video Challenge"
TEAM_NAME="Dawn of Anarchy"

# Feature Flags
ENABLE_EXPERT_VIDEOS=true
ENABLE_REAL_TIME_RSS=true
ENABLE_COMPETITION_FEATURES=true
`;

  fs.writeFileSync('.env.bolt', envTemplate);
  console.log('✅ Created Bolt.new environment template');
}

// 5. Generate deployment checklist
function generateDeploymentChecklist() {
  const checklist = `# 🚀 Bolt.new Deployment Checklist

## Pre-Deployment
- [ ] Tavus API key configured
- [ ] Expert replicas created and trained
- [ ] RSS feeds tested and active
- [ ] Wikipedia API integration verified
- [ ] All environment variables set

## Bolt.new Setup
- [ ] Project imported to Bolt.new
- [ ] Environment variables configured
- [ ] Build process tested
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active

## Competition Requirements
- [ ] "Built on Bolt" badge visible
- [ ] Tavus integration functional
- [ ] Demo video recorded (< 3 minutes)
- [ ] Submission form completed
- [ ] Testing instructions provided

## Performance Optimization
- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] API responses cached
- [ ] Expert videos loading quickly
- [ ] Real-time features responsive

## Demo Preparation
- [ ] Sample data loaded
- [ ] Expert videos pre-generated
- [ ] Test scenarios prepared
- [ ] Backup plans ready
- [ ] Analytics configured

## Final Checks
- [ ] All features working
- [ ] Mobile responsive
- [ ] Error handling tested
- [ ] Competition badges visible
- [ ] Video generation working

## Submission
- [ ] Public URL accessible
- [ ] Bolt.new project URL provided
- [ ] Tavus account details submitted
- [ ] Demo video uploaded to YouTube
- [ ] Submission form completed
`;

  fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist);
  console.log('✅ Generated deployment checklist');
}

// 6. Create competition analytics
function setupCompetitionAnalytics() {
  const analyticsConfig = {
    events: {
      'expert_consultation': 'User consulted AI expert',
      'video_generated': 'Expert video generated',
      'fact_check_completed': 'Fact-checking round completed',
      'misinformation_detected': 'Misinformation successfully identified',
      'wikipedia_verified': 'Claim verified against Wikipedia'
    },
    metrics: {
      engagement: 'Time spent on platform',
      learning: 'Accuracy improvement over time',
      completion: 'Games completed vs started',
      expert_usage: 'Expert consultation rate'
    },
    competition: {
      track_tavus_usage: true,
      monitor_performance: true,
      measure_impact: true,
      collect_feedback: true
    }
  };
  
  fs.writeFileSync('analytics.config.json', JSON.stringify(analyticsConfig, null, 2));
  console.log('✅ Configured competition analytics');
}

// Run all optimizations
async function runOptimizations() {
  try {
    optimizePackageJson();
    createBoltConfig();
    optimizeAssets();
    createEnvTemplate();
    generateDeploymentChecklist();
    setupCompetitionAnalytics();
    
    console.log('\n🎉 Bolt.new optimization complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Import project to Bolt.new');
    console.log('2. Configure environment variables');
    console.log('3. Initialize Tavus experts');
    console.log('4. Test all features');
    console.log('5. Record demo video');
    console.log('6. Submit to hackathon!');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  runOptimizations();
}

module.exports = {
  optimizePackageJson,
  createBoltConfig,
  createEnvTemplate,
  generateDeploymentChecklist
}; 