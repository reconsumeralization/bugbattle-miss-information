Dawn of Anarchy Presents: Misinformation

# 🔍 Miss Information - AI-Powered Fact-Checking Education Platform

**🏆 World's Largest Hackathon by Bolt - Conversational AI Video Challenge Submission**

An innovative educational platform that combats misinformation through gamification, featuring AI expert replicas powered by Tavus that provide personalized video explanations to enhance critical thinking skills.

**🎯 Competition Focus**: Conversational AI Video Challenge ($25,000 Prize)  
**🛠️ Built on**: Bolt.new Platform  
**🎬 Powered by**: Tavus AI Expert Video Generation  
**👥 Team**: Dawn of Anarchy

## 🎯 Features

### 🔍 Real-Time Miss Information Detection
- Live RSS feed scanning from multiple news sources
- Category-based content analysis (climate, energy, technology, politics)
- Wikipedia API integration for fact verification
- Advanced misinformation detection algorithms
- Real-time scoring with educational explanations

### 📊 Intelligence Dashboard
- RSS feed monitoring by category
- Wikipedia cross-reference system
- Misinformation pattern analysis
- Source credibility tracking
- Live fact-checking results

### 🎓 AI Expert Replicas (Tavus Integration)
- Personalized video explanations from subject matter experts
- Real-time expert analysis of fact-checking results
- Category-specific expertise (climate, energy, tech, journalism)
- AI-powered fact-checking insights and education
- Interactive expert consultation system

### 📰 Dynamic Content Sources
- Climate change and renewable energy feeds
- Technology and science news
- Political and social feeds
- Custom RSS feed integration
- Wikipedia article verification

### 👥 Social Learning Features
- User authentication with NextAuth.js
- Global leaderboards for fact-checkers
- Progress tracking and achievement system
- Collaborative verification challenges

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd miss-information
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env.local
# Add your API credentials:
# - TAVUS_API_KEY=your-tavus-api-key
# - WIKIPEDIA_API_KEY=your-wikipedia-api-key (optional)
# - NEXTAUTH_SECRET=your-secret-key
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Enhanced Architecture

```
miss-information/
├── components/          # React components
│   ├── MissInformationGame.js
│   ├── ExpertVideoPlayer.js
│   ├── ExpertAdminPanel.js
│   ├── RSSFeedMonitor.js
│   ├── WikipediaVerifier.js
│   ├── CategoryScanner.js
│   ├── PlayerStats.js
│   ├── Leaderboard.js
│   └── Layout.js
├── pages/              # Next.js pages and API routes
│   ├── api/           # Backend API endpoints
│   │   ├── rss/       # RSS feed handling
│   │   ├── wikipedia/ # Wikipedia verification
│   │   ├── tavus/     # Tavus AI expert system
│   │   └── game/      # Game logic
│   ├── _app.js        # App configuration
│   ├── index.js       # Main dashboard
│   └── categories.js  # Category management
├── lib/               # Core libraries
│   ├── rssParser.js   # RSS feed processing
│   ├── wikipediaApi.js # Wikipedia integration
│   ├── tavusApi.js    # Tavus AI expert integration
│   ├── factChecker.js # Fact verification logic
│   └── db.js          # Database configuration
├── data/              # Configuration and feeds
│   ├── rssSources.json # RSS feed sources by category
│   ├── categories.json # Content categories
│   └── db.json        # Local database
└── public/            # Static assets
```

## 🔧 Core Technology

### RSS Feed Integration
- **Multi-source aggregation**: Climate, energy, tech, politics
- **Real-time parsing**: Live content analysis
- **Category classification**: Automated content sorting
- **Source verification**: Credibility scoring

### Wikipedia Verification Engine
```javascript
// Example verification workflow
async function verifyStatement(text) {
  const claims = extractClaims(text);
  const wikiResults = await Promise.all(
    claims.map(claim => searchWikipedia(claim))
  );
  return calculateVerificationScore(claims, wikiResults);
}
```

### Advanced Misinformation Detection
- **Statistical analysis**: Number manipulation detection
- **Context verification**: Cross-reference with Wikipedia
- **Source tracking**: RSS feed credibility analysis  
- **Pattern recognition**: Common misinformation tactics

## 🎮 Game Mechanics

### Real-Time Challenges
1. **RSS Feed Analysis**: Live articles served for fact-checking
2. **Wikipedia Cross-Check**: Players verify claims against Wikipedia
3. **Category Mastery**: Specialized challenges by topic area
4. **Speed Rounds**: Quick-fire fact verification
5. **Collaborative Mode**: Team-based verification challenges

### Scoring System
- **Correct Detection**: +15 points (verified against Wikipedia)
- **Source Verification**: +10 points (RSS credibility check)
- **Speed Bonus**: +5 points (quick accurate responses)
- **False Positive**: -8 points (flagging accurate information)
- **Missed Misinformation**: -5 points (missing verified false claims)

## 📡 RSS Categories & Sources

### Climate & Environment
- NASA Climate Change
- NOAA Weather Service
- Environmental Protection Agency
- Climate Central
- Carbon Brief

### Renewable Energy
- Solar Power World
- Wind Power Engineering
- Energy Storage News
- Clean Energy Wire
- PV Magazine

### Technology & Science
- MIT Technology Review
- Science Daily
- Nature News
- IEEE Spectrum
- Ars Technica

### Fact-Checking Sources
- Snopes
- FactCheck.org
- PolitiFact
- Reuters Fact Check
- Associated Press Fact Check

## 🌐 Wikipedia Integration

### Verification Pipeline
1. **Claim Extraction**: NLP-based fact identification
2. **Wikipedia Search**: Automated article lookup
3. **Content Matching**: Semantic similarity analysis
4. **Citation Tracking**: Source verification
5. **Confidence Scoring**: Reliability assessment

### API Usage
```javascript
// Wikipedia verification example
const wikiVerification = await verifyAgainstWikipedia({
  claim: "Solar panels are 20% efficient",
  category: "renewable-energy"
});
// Returns: { verified: true, confidence: 0.87, sources: [...] }
```

## 🎓 Tavus AI Expert System

### Expert Replicas
Our platform features 5 specialized AI expert replicas powered by Tavus:

- **🌍 Dr. Elena Rodriguez** - Climate Science & Environmental Policy
- **⚡ Professor Marcus Chen** - Renewable Energy & Sustainable Technology  
- **💻 Dr. Sarah Kim** - Technology Ethics & Digital Literacy
- **🔍 Jonathan Mitchell** - Investigative Journalism & Fact-Checking
- **📚 Dr. Amara Okafor** - Media Studies & Information Science

### Video Generation Pipeline
1. **Game Completion**: Player finishes fact-checking challenge
2. **Result Analysis**: System analyzes player performance and claims
3. **Expert Selection**: Matching expert based on content category
4. **Script Generation**: AI creates personalized explanation script
5. **Video Creation**: Tavus generates custom expert video
6. **Educational Delivery**: Player receives personalized insights

### Expert Consultation Features
```javascript
// Example expert video generation
const expertVideo = await generateExplanationVideo({
  category: 'climate',
  claims: extractedClaims,
  verificationResults: wikiResults,
  playerScore: 85,
  articleTitle: 'Solar Panel Efficiency Breakthrough'
});
// Returns: { videoId, status, expertCategory, downloadUrl }
```

### Admin Management
- **Expert Initialization**: Create and train AI replicas
- **Status Monitoring**: Track training progress and availability
- **Video Management**: Monitor generation queue and completion
- **Performance Analytics**: Expert usage and effectiveness metrics

## 🏆 Educational Impact

### Learning Objectives
- **Critical Analysis**: Develop fact-checking skills
- **Source Evaluation**: Learn to assess credibility
- **Information Literacy**: Understand bias and manipulation
- **Scientific Reasoning**: Evidence-based thinking
- **Media Awareness**: Recognize propaganda techniques

### Real-World Application
- **News Consumption**: Better media literacy
- **Academic Research**: Improved source verification
- **Social Media**: Misinformation detection
- **Public Discourse**: Fact-based discussions
- **Professional Skills**: Information verification abilities

## 🔒 Data Privacy & Ethics

### Responsible AI
- **Transparent Algorithms**: Open verification processes
- **Bias Detection**: Multi-perspective analysis
- **Human Oversight**: Expert validation system
- **Continuous Learning**: Adaptive fact-checking

### Privacy Protection
- **Minimal Data**: Only necessary game progress
- **Local Storage**: Offline capability
- **Anonymization**: Privacy-first design
- **User Control**: Data deletion options

## 🌱 Scaling & Future Features

### Advanced Features
- **Multi-language Support**: Global misinformation detection
- **Video Analysis**: Deepfake and manipulated media detection
- **Image Verification**: Reverse image search integration
- **Audio Analysis**: Podcast and speech fact-checking
- **Browser Extension**: Real-time web page analysis

### Educational Integration
- **Classroom Tools**: Teacher dashboards
- **Curriculum Alignment**: Educational standards mapping
- **Assessment Integration**: Learning outcome tracking
- **Certification System**: Fact-checking credentials

## 🤖 AI & Machine Learning

### Natural Language Processing
- **Claim Extraction**: Automated fact identification
- **Semantic Analysis**: Context understanding
- **Sentiment Detection**: Bias identification
- **Entity Recognition**: Person, place, organization tracking

### Pattern Recognition
- **Misinformation Templates**: Common false claim patterns
- **Source Analysis**: Credibility assessment algorithms
- **Network Analysis**: Information spread tracking
- **Temporal Analysis**: Claim evolution over time

## 📈 Bolt.new Hackathon Adaptation

### Competition Advantages
- **Real-time Data**: Live RSS feeds demonstrate platform capabilities
- **Educational Impact**: Strong social good angle for judges
- **Technical Innovation**: Wikipedia integration showcases API skills
- **Scalable Architecture**: Production-ready system design
- **Interactive Demo**: Engaging gameplay for presentations

### Implementation Strategy
- **Bolt.new Integration**: Real-time collaborative editing
- **Live Deployment**: Instant RSS feed processing
- **Public Dashboard**: Real-time misinformation tracking
- **Social Features**: Community-driven fact-checking

## 🛠️ Development

### Running with RSS Feeds
```bash
# Start RSS feed monitoring
npm run rss:monitor

# Update Wikipedia cache
npm run wikipedia:refresh

# Run fact-checking analysis
npm run analyze:feeds
```

### Testing
```bash
# Test RSS parsing
npm run test:rss

# Verify Wikipedia integration
npm run test:wikipedia

# Run full fact-checking suite
npm run test:verification
```

## 🤝 Contributing

We welcome contributions to improve fact-checking algorithms, add new RSS sources, enhance Wikipedia integration, and expand educational features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **RSS Feed Sources**: News organizations providing public feeds
- **Wikipedia Foundation**: Free access to human knowledge
- **Fact-Checking Organizations**: Professional verification standards
- **Educational Community**: Feedback on learning effectiveness
- **Open Source Contributors**: Platform development and maintenance

---

**🎯 Ready to revolutionize how people detect misinformation? Let's build a more informed world through interactive learning and real-time verification!** 