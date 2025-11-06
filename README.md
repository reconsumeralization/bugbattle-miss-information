# BugBattle - Miss Information Security Research Platform

A gamified security research and bug hunting platform focused on information security, misinformation detection, and API vulnerability analysis. Built as an interactive learning environment for security researchers and ethical hackers.

## Features

### Core Security Features

- **Interactive Bug Hunting**: Gamified challenges for discovering security vulnerabilities
- **API Abuse Prevention**: Real-time monitoring and rate limiting demonstrations
- **Information Security Testing**: Hands-on practice with real-world scenarios
- **Real-Time Scoring System**: Track and compete with other security researchers
- **Multi-Category Challenges**: Climate, energy, technology, and political information security

### AI-Powered Analysis

- **Automated Vulnerability Detection**: AI-powered pattern recognition for security flaws
- **Expert Consultation System**: AI security experts providing guidance (Tavus integration)
- **Sentiment Analysis**: Detect manipulation patterns in content
- **Real-Time Threat Alerts**: XAI-powered security monitoring

### Technical Architecture

- **Next.js Framework**: Modern React-based architecture
- **Multi-API Integration**: RSS feeds, Wikipedia verification, AI analysis
- **Rate Limiting & Throttling**: Demonstrated API abuse prevention
- **Authentication System**: Secure user management with NextAuth.js
- **Real-Time Dashboard**: Live security metrics and alerts

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/bugbattle-miss-information.git
cd bugbattle-miss-information
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys (see `.env.example` for details)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Monitoring and Analysis
npm run rss:monitor      # Start RSS feed monitoring
npm run wikipedia:refresh # Update Wikipedia cache
npm run analyze:feeds    # Run content analysis

# Testing
npm run test:rss         # Test RSS integration
npm run test:wikipedia   # Test Wikipedia API
npm run test:verification # Test verification system
```

## Architecture

```
bugbattle/
├── components/          # React components
│   ├── MissInformationGame.tsx
│   ├── ExpertVideoPlayer.tsx
│   ├── ExpertAdminPanel.tsx
│   ├── Leaderboard.tsx
│   └── PlayerStats.tsx
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   │   ├── auth/     # Authentication
│   │   ├── game/     # Game logic
│   │   ├── rss/      # RSS feed handling
│   │   ├── tavus/    # AI expert system
│   │   ├── wikipedia/ # Verification API
│   │   └── xai/      # AI analysis
│   ├── index.tsx     # Main dashboard
│   └── _app.tsx      # App configuration
├── lib/               # Core libraries
│   ├── rssParser.js
│   ├── wikipediaApi.js
│   ├── tavusApi.js
│   └── db.js
├── data/              # Configuration
│   └── rssSources.json
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── public/            # Static assets
```

## Security Features

### API Abuse Prevention

The platform demonstrates multiple security techniques:

- **Rate Limiting**: Request throttling per endpoint
- **Authentication**: Secure session management
- **Input Validation**: Sanitization of user inputs
- **CORS Protection**: Proper origin validation
- **Error Handling**: Secure error messages

See [docs/API_SECURITY.md](docs/API_SECURITY.md) for detailed documentation.

### Privacy & Data Protection

- Minimal data collection
- No tracking cookies
- Local-first storage where possible
- Transparent data handling
- User data deletion options

See [docs/PRIVACY_POLICY.md](docs/PRIVACY_POLICY.md) for details.

## Technologies

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Authentication**: NextAuth.js
- **AI/ML**: OpenAI API, Tavus AI, XAI Grok
- **Data Sources**: RSS Parser, Wikipedia API
- **Database**: LowDB (local), configurable for PostgreSQL/MongoDB
- **Deployment**: Vercel-ready, Docker support

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This is a security research platform. If you discover a vulnerability:

1. Do NOT open a public issue
2. Email security@yourdomain.com with details
3. Allow 90 days for coordinated disclosure

See [SECURITY.md](SECURITY.md) and [VULNERABILITY_DISCLOSURE.md](VULNERABILITY_DISCLOSURE.md) for our security policy.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Demo

For demo video and screenshots, see [docs/DEMO.md](docs/DEMO.md)

## Acknowledgments

- Tavus AI for expert video generation
- Wikipedia Foundation for verification data
- Open-source security research community
- RSS feed providers for real-time content

## Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/bugbattle-miss-information/issues)
- Discussions: [GitHub Discussions](https://github.com/YOUR_USERNAME/bugbattle-miss-information/discussions)

## Roadmap

- [ ] Multi-language support
- [ ] Advanced threat detection models
- [ ] Browser extension for real-time analysis
- [ ] Mobile application
- [ ] Enterprise features
- [ ] API marketplace integration

---

Built with security research and education in mind.
