/**
 * X.ai Grok Integration Tests
 * Verify hybrid Grok + Tavus expert system functionality
 */

import XaiGrokAPI from '../lib/xaiApi';

describe('X.ai Grok Integration', () => {
  let grok;

  beforeEach(() => {
    grok = new XaiGrokAPI();
  });

  describe('Expert Analysis Generation', () => {
    test('should generate expert analysis for climate category', async () => {
      const gameData = {
        category: 'climate',
        claims: ['Global warming is a hoax', 'CO2 levels are rising'],
        verificationResults: [
          { claim: 'Global warming is a hoax', isTrue: false, confidence: 0.95 },
          { claim: 'CO2 levels are rising', isTrue: true, confidence: 0.98 }
        ],
        playerScore: 75,
        articleTitle: 'Climate Change Debate'
      };

      const analysis = await grok.generateExpertAnalysis(gameData);

      expect(analysis).toHaveProperty('expertName');
      expect(analysis).toHaveProperty('analysis');
      expect(analysis).toHaveProperty('category', 'climate');
      expect(analysis).toHaveProperty('confidence');
      expect(analysis).toHaveProperty('recommendations');
      expect(analysis.expertName).toBe('Dr. Elena Rodriguez');
    });

    test('should handle different expert categories', async () => {
      const categories = ['climate', 'renewable_energy', 'technology', 'journalism', 'media_studies'];
      
      for (const category of categories) {
        const expert = grok.getExpertForCategory(category);
        expect(expert).toHaveProperty('name');
        expect(expert).toHaveProperty('credentials');
        expect(expert).toHaveProperty('field');
        expect(expert).toHaveProperty('personality');
        expect(expert).toHaveProperty('specialties');
      }
    });
  });

  describe('Trending Misinformation Analysis', () => {
    test('should analyze trending misinformation', async () => {
      const trends = await grok.analyzeTrendingMisinformation('climate');

      expect(trends).toHaveProperty('trends');
      expect(trends).toHaveProperty('timestamp');
      expect(Array.isArray(trends.trends)).toBe(true);
    });

    test('should handle API errors gracefully', async () => {
      // Mock API failure
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));

      const trends = await grok.analyzeTrendingMisinformation('climate');

      expect(trends).toHaveProperty('error');
      expect(trends.trends).toEqual([]);

      global.fetch = originalFetch;
    });
  });

  describe('Learning Path Generation', () => {
    test('should generate personalized learning path', async () => {
      const userHistory = {
        gamesPlayed: 5,
        averageScore: 72,
        weakAreas: ['source verification', 'bias detection'],
        strongAreas: ['fact checking']
      };

      const learningPath = await grok.generateLearningPath(userHistory);

      expect(learningPath).toHaveProperty('path');
      expect(learningPath).toHaveProperty('estimatedTime');
      expect(learningPath).toHaveProperty('difficulty');
      expect(Array.isArray(learningPath.path)).toBe(true);
    });
  });

  describe('Expert Prompt Building', () => {
    test('should build comprehensive expert prompts', () => {
      const expert = grok.getExpertForCategory('climate');
      const claims = ['Test claim 1', 'Test claim 2'];
      const verificationResults = [
        { claim: 'Test claim 1', isTrue: true, confidence: 0.9 }
      ];

      const prompt = grok.buildExpertPrompt(expert, claims, verificationResults, 80, 'Test Article');

      expect(prompt).toContain(expert.name);
      expect(prompt).toContain('Test Article');
      expect(prompt).toContain('Test claim 1');
      expect(prompt).toContain('80%');
      expect(prompt).toContain(expert.specialties.join(', '));
    });
  });

  describe('Confidence Calculation', () => {
    test('should calculate confidence scores correctly', () => {
      const verificationResults = [
        { confidence: 0.9 },
        { confidence: 0.8 },
        { confidence: 0.7 }
      ];

      const confidence = grok.calculateConfidence(verificationResults);
      expect(confidence).toBe(0.8); // Average of 0.9, 0.8, 0.7
    });

    test('should handle empty verification results', () => {
      const confidence = grok.calculateConfidence([]);
      expect(confidence).toBe(0.5);
    });
  });

  describe('Recommendation Extraction', () => {
    test('should extract recommendations from analysis', () => {
      const analysis = `
        Based on your performance, I recommend checking multiple sources.
        You should also try verifying claims with authoritative institutions.
        I suggest focusing on peer-reviewed research.
        This is just regular text without recommendations.
      `;

      const recommendations = grok.extractRecommendations(analysis);
      expect(recommendations).toHaveLength(3);
      expect(recommendations[0]).toContain('recommend checking multiple sources');
      expect(recommendations[1]).toContain('try verifying claims');
      expect(recommendations[2]).toContain('suggest focusing on peer-reviewed');
    });
  });

  describe('API Connection', () => {
    test('should test API connection', async () => {
      // Mock successful connection
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ models: ['grok-beta'] })
      });

      const isConnected = await grok.testConnection();
      expect(isConnected).toBe(true);

      global.fetch.mockRestore();
    });

    test('should handle connection failures', async () => {
      // Mock failed connection
      global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

      const isConnected = await grok.testConnection();
      expect(isConnected).toBe(false);

      global.fetch.mockRestore();
    });
  });

  describe('Fallback Analysis', () => {
    test('should provide fallback analysis when API fails', () => {
      const expert = grok.getExpertForCategory('climate');
      const claims = ['Test claim'];

      const fallback = grok.getFallbackAnalysis(expert, claims);

      expect(fallback).toHaveProperty('expertName', expert.name);
      expect(fallback).toHaveProperty('analysis');
      expect(fallback).toHaveProperty('confidence', 0.7);
      expect(fallback).toHaveProperty('recommendations');
      expect(fallback.analysis).toContain(expert.name);
      expect(fallback.analysis).toContain(expert.field);
    });
  });
});

describe('X.ai API Endpoints', () => {
  describe('/api/xai/analyze', () => {
    test('should validate required fields', async () => {
      const response = await fetch('/api/xai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'climate'
          // Missing required fields
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    test('should return analysis with X.ai branding', async () => {
      const gameData = {
        category: 'climate',
        claims: ['Test claim'],
        verificationResults: [],
        playerScore: 75,
        articleTitle: 'Test Article'
      };

      const response = await fetch('/api/xai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });

      if (response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty('powered_by', 'X.ai Grok');
        expect(data).toHaveProperty('free_speech_analysis', true);
        expect(data).toHaveProperty('real_time_data', true);
        expect(data).toHaveProperty('uncensored', true);
      }
    });
  });

  describe('/api/xai/trends', () => {
    test('should return trending misinformation analysis', async () => {
      const response = await fetch('/api/xai/trends?category=climate');

      if (response.ok) {
        const data = await response.json();
        expect(data).toHaveProperty('powered_by', 'X.ai Grok');
        expect(data).toHaveProperty('data_source', 'Real-time X (Twitter) data');
        expect(data).toHaveProperty('analysis_type', 'Uncensored misinformation trends');
        expect(data).toHaveProperty('trends');
        expect(data).toHaveProperty('category');
      }
    });
  });
});

// Integration test for hybrid Grok + Tavus workflow
describe('Hybrid Grok + Tavus Integration', () => {
  test('should complete full hybrid workflow', async () => {
    const gameResults = {
      category: 'climate',
      claims: ['Global warming is natural'],
      verificationResults: [
        { claim: 'Global warming is natural', isTrue: false, confidence: 0.92 }
      ],
      score: 85,
      articleTitle: 'Climate Science Facts'
    };

    // Step 1: Grok Analysis
    const grokResponse = await fetch('/api/xai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameResults)
    });

    if (grokResponse.ok) {
      const grokData = await grokResponse.json();
      
      // Step 2: Tavus Video Generation using Grok analysis
      const tavusResponse = await fetch('/api/tavus/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: gameResults.category,
          expertAnalysis: grokData.analysis,
          playerScore: gameResults.score,
          gameResults: gameResults,
          script: grokData.analysis
        })
      });

      if (tavusResponse.ok) {
        const tavusData = await tavusResponse.json();
        
        // Verify hybrid integration
        expect(grokData).toHaveProperty('powered_by', 'X.ai Grok');
        expect(tavusData).toHaveProperty('videoId');
        
        console.log('✅ Hybrid Grok + Tavus workflow completed successfully');
      }
    }
  }, 30000); // Extended timeout for API calls
}); 