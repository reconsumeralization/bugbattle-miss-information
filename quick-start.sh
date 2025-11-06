#!/bin/bash

# Miss Information - AI-Powered Fact-Checking Education Platform - Quick Start Setup
echo "🔍 Setting up Miss Information - AI-Powered Fact-Checking Education Platform..."

# Create Next.js project
npx create-next-app@latest miss-information --typescript --tailwind --eslint
cd miss-information

# Install core dependencies
npm install next-auth lowdb@1 # Using lowdb@1 for CommonJS compatibility
npm install @types/node # For TypeScript support
npm install framer-motion # For animations and UI enhancements
npm install rss-parser # For RSS feed parsing
npm install node-fetch # For API requests

# Create comprehensive directory structure
mkdir -p components data hooks lib pages/api/game pages/api/auth pages/api/rss pages/api/wikipedia pages/api/tavus pages/api/xai utils tests

# Create essential component files
touch components/MissInformationGame.js
touch components/ExpertVideoPlayer.js
touch components/GrokTavusExpertPlayer.js
touch components/ExpertAdminPanel.js
touch components/RSSFeedMonitor.js
touch components/WikipediaVerifier.js
touch components/CategoryScanner.js
touch components/PlayerStats.js
touch components/Layout.js
touch components/Leaderboard.js
touch components/UIEnhancements.js

# Create API route files
touch pages/api/rss/feeds.js
touch pages/api/rss/monitor.js
touch pages/api/wikipedia/verify.js
touch pages/api/wikipedia/search.js
touch pages/api/tavus/generate-video.js
touch pages/api/tavus/video-callback.js
touch pages/api/xai/analyze.js
touch pages/api/xai/analyze-structured.js
touch pages/api/game/score.js
touch pages/api/game/leaderboard.js

# Create core library files
touch lib/rssParser.js
touch lib/wikipediaApi.js
touch lib/tavusApi.js
touch lib/xaiApi.js
touch lib/xaiApiDirect.js
touch lib/xaiApiEnhanced.js
touch lib/factChecker.js
touch lib/db.js

# Create data configuration files
touch data/rssSources.json
touch data/categories.json
touch data/users.json
touch data/db.json

# Create utility files
touch utils/api.ts
touch hooks/usePlayerProgress.ts

# Create test files
touch tests/xai-implementation-test.js
touch tests/xai-enhanced-features-test.js

# Create additional page files
touch pages/categories.js
touch pages/dashboard.js

# Create environment example
touch .env.example

echo "✅ Miss Information project structure created!"
echo "📝 Next steps:"
echo "1. Copy .env.example to .env.local and add your API keys:"
echo "   - TAVUS_API_KEY=your-tavus-api-key"
echo "   - XAI_API_KEY=your-xai-api-key"
echo "   - WIKIPEDIA_API_KEY=your-wikipedia-api-key (optional)"
echo "   - NEXTAUTH_SECRET=your-secret-key"
echo "2. Configure RSS sources in data/rssSources.json"
echo "3. Set up content categories in data/categories.json"
echo "4. Implement the AI expert system components"
echo "5. Configure Tavus video generation pipeline"
echo "6. Set up X.ai Grok integration for analysis"
echo "7. Run 'npm run dev' to start the development server"
echo "8. Visit http://localhost:3000 to see your fact-checking platform"

echo "🚀 Ready to combat misinformation with AI-powered education!"