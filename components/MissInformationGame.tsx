import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import usePlayerProgress from '../hooks/usePlayerProgress';
import ExpertVideoPlayer from './ExpertVideoPlayer';
import type { 
  Claim, 
  Article, 
  XAIAnalysis, 
  ExpertAnalysis, 
  GameResult,
  ClaimCategory,
  ExpertSpecialization,
  GameMode,
  BatchAnalysisResult
} from '../types';

interface GameClaim extends Claim {
  isAltered?: boolean;
  originalText?: string;
  verification?: any;
}

interface GameArticle extends Article {
  content?: string;
  summary?: string;
}

interface GameSessionData {
  claims: GameClaim[];
  score: number;
  selectedClaims: Set<string>;
  category: ClaimCategory | string;
  correctSelections: number;
  totalCorrect: number;
  gameMode: GameMode;
  articleTitle?: string;
  timestamp: string;
}

interface VerificationResults {
  results: Array<{
    verification: any;
  }>;
}

interface XAIGameAnalysis {
  batchResults: XAIAnalysis[];
  expertAnalysis: XAIAnalysis | null;
  metadata: any;
  timestamp: string;
}

interface GameResultData {
  claimId: string;
  text: string;
  wasSelected: boolean;
  isCorrect: boolean;
  shouldSelect: boolean;
  explanation: string;
  accuracy?: number;
}

const MissInformationGame: React.FC = () => {
  const [rssArticles, setRssArticles] = useState<GameArticle[]>([]);
  const [currentArticle, setCurrentArticle] = useState<GameArticle | null>(null);
  const [claims, setClaims] = useState<GameClaim[]>([]);
  const [selectedClaims, setSelectedClaims] = useState<Set<string>>(new Set());
  const [verificationResults, setVerificationResults] = useState<VerificationResults | null>(null);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('climate');
  const [gameMode, setGameMode] = useState<GameMode>('detect' as GameMode);
  const [showExpertAnalysis, setShowExpertAnalysis] = useState<boolean>(false);
  const [expertCategory, setExpertCategory] = useState<ExpertSpecialization | null>(null);
  const [gameResults, setGameResults] = useState<GameResult | null>(null);
  const [xaiAnalysis, setXaiAnalysis] = useState<XAIGameAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [gameStreak, setGameStreak] = useState<number>(0);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  const { misinformationBestScore, recordMisinformationScore, isLoadingProgress } = usePlayerProgress();
  const { data: session } = useSession();

  // Enhanced timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const handleTimeUp = () => {
    if (!gameOver) {
      setFeedback('Time\'s up! The shadows of misinformation grow stronger...');
      setLives(prev => Math.max(0, prev - 1));
      if (lives <= 1) {
        endGame();
      } else {
        setupNewGame(rssArticles);
      }
    }
  };

  const startTimer = (seconds: number = 120) => {
    setTimeRemaining(seconds);
    setIsTimerActive(true);
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    setTimeRemaining(0);
  };

  // Load RSS categories and initial articles
  useEffect(() => {
    loadCategories();
    loadRSSArticles(selectedCategory);
  }, [selectedCategory]);

  const loadCategories = async (): Promise<void> => {
    try {
      const response = await fetch('/api/rss/monitor');
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadRSSArticles = async (category: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // First try to get cached articles
      const response = await fetch(`/api/rss/monitor?category=${category}&limit=10`);
      let data = await response.json();
      
      // If no cached data, trigger a refresh
      if (!data.articles || data.articles.length === 0) {
        const refreshResponse = await fetch('/api/rss/monitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category })
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          data = refreshData.result;
        }
      }
      
      if (data.articles && data.articles.length > 0) {
        setRssArticles(data.articles);
        setupNewGame(data.articles);
      } else {
        setFeedback('No articles found for this category. Try another category.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to load RSS articles:', error);
      setFeedback('Failed to load articles. Please try again.');
      setIsLoading(false);
    }
  };

  const setupNewGame = async (articles: GameArticle[]): Promise<void> => {
    try {
      // Select a random article for the game
      const randomArticle = articles[Math.floor(Math.random() * articles.length)];
      setCurrentArticle(randomArticle);
      
      // Extract claims from the article
      const extractedClaims = extractClaims(randomArticle);
      
      // If in verify mode, get Wikipedia verification for all claims
      if (gameMode === 'verify') {
        const claimTexts = extractedClaims.map(c => c.text);
        const verifyResponse = await fetch('/api/wikipedia/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            claims: claimTexts, 
            category: selectedCategory 
          })
        });
        
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          setVerificationResults(verifyData);
          
          // Add verification info to claims
          const verifiedClaims = extractedClaims.map((claim, index) => ({
            ...claim,
            verification: verifyData.results[index]?.verification
          }));
          setClaims(verifiedClaims);
        } else {
          setClaims(extractedClaims);
        }
      } else {
        // In detect mode, randomly alter some claims
        const alteredClaims = extractedClaims.map(claim => ({
          ...claim,
          isAltered: Math.random() > 0.6, // 40% chance to alter
          originalText: claim.text
        }));
        
        // Apply alterations
        alteredClaims.forEach(claim => {
          if (claim.isAltered) {
            claim.text = alterClaim(claim.originalText || claim.text);
          }
        });
        
        setClaims(alteredClaims);
      }
      
      setSelectedClaims(new Set());
      setGameOver(false);
      setFeedback('');
      setXaiAnalysis(null);
      setIsLoading(false);
      
      // Start timer for enhanced difficulty
      if (playerLevel > 3) {
        startTimer(Math.max(60, 180 - (playerLevel * 10)));
      }
    } catch (error) {
      console.error('Failed to setup game:', error);
      setFeedback('Failed to setup game. Please try again.');
      setIsLoading(false);
    }
  };

  // Enhanced X.ai analysis of game session
  const performXaiAnalysis = async (gameSessionData: GameSessionData): Promise<void> => {
    try {
      setIsAnalyzing(true);
      
      // Batch analyze all claims for better performance
      const claimTexts = gameSessionData.claims.map(claim => claim.text);
      
      const batchResponse = await fetch('/api/xai/batch-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claims: claimTexts,
          batchType: 'fact-check'
        })
      });

      if (batchResponse.ok) {
        const batchResults = await batchResponse.json();
        
        // Also get expert analysis with live data
        const expertResponse = await fetch('/api/xai/analyze-structured', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            claim: `Game analysis for ${selectedCategory} category with claims: ${claimTexts.join('; ')}`,
            analysisType: 'fact-check',
            context: `Player scored ${gameSessionData.score} points, selected claims: ${Array.from(gameSessionData.selectedClaims).join(', ')}`
          })
        });

        let expertAnalysis = null;
        if (expertResponse.ok) {
          expertAnalysis = await expertResponse.json();
        }

        setXaiAnalysis({
          batchResults: batchResults.results,
          expertAnalysis,
          metadata: batchResults.metadata,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('X.ai analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Extract verifiable claims from article content
  const extractClaims = (article: GameArticle): GameClaim[] => {
    const content = `${article.title} ${article.content || ''} ${article.summary || ''}`;
    const claims: GameClaim[] = [];
    let claimId = 0;

    // Extract numerical claims
    const numberRegex = /([^.!?]*\b\d+(?:\.\d+)?\s*(?:%|percent|degrees?|years?|million|billion|trillion)[^.!?]*)/gi;
    let match;
    while ((match = numberRegex.exec(content)) !== null && claims.length < 8) {
      claims.push({
        id: (claimId++).toString(),
        text: match[1].trim(),
        type: 'numerical',
        priority: 'high'
      });
    }

    // Extract comparative claims
    const comparativeRegex = /([^.!?]*\b(?:more|less|higher|lower|faster|slower|better|worse|increase|decrease)\b[^.!?]*)/gi;
    while ((match = comparativeRegex.exec(content)) !== null && claims.length < 8) {
      claims.push({
        id: (claimId++).toString(),
        text: match[1].trim(),
        type: 'comparative',
        priority: 'medium'
      });
    }

    // Extract definitive statements
    const definitiveRegex = /([^.!?]*\b(?:always|never|all|none|every|only|exactly|precisely)\b[^.!?]*)/gi;
    while ((match = definitiveRegex.exec(content)) !== null && claims.length < 8) {
      claims.push({
        id: (claimId++).toString(),
        text: match[1].trim(),
        type: 'definitive',
        priority: 'high'
      });
    }

    // If we don't have enough claims, extract sentences with keywords
    if (claims.length < 3) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const keywordSentences = sentences.filter(sentence => 
        /\b(solar|climate|energy|carbon|renewable|temperature|emission|technology|power)\b/i.test(sentence)
      );
      
      keywordSentences.slice(0, 5 - claims.length).forEach(sentence => {
        claims.push({
          id: (claimId++).toString(),
          text: sentence.trim(),
          type: 'general',
          priority: 'low'
        });
      });
    }

    return claims.filter(claim => claim.text.length > 10);
  };

  const alterClaim = (text: string): string => {
    const alterations = [
      // Numerical alterations
      (text: string) => text.replace(/(\d+(?:\.\d+)?)\s*%/g, (match, num) => {
        const altered = (parseFloat(num) * (0.7 + Math.random() * 0.6)).toFixed(1);
        return `${altered}%`;
      }),
      
      // Year alterations
      (text: string) => text.replace(/\b(19|20)\d{2}\b/g, (match) => {
        const year = parseInt(match);
        const alteredYear = year + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5 + 1);
        return alteredYear.toString();
      }),
      
      // Magnitude alterations
      (text: string) => text.replace(/\b(\d+(?:\.\d+)?)\s*(million|billion|trillion)\b/gi, (match, num, magnitude) => {
        const magnitudes = ['thousand', 'million', 'billion', 'trillion'];
        const currentIndex = magnitudes.indexOf(magnitude.toLowerCase());
        const newIndex = Math.max(0, Math.min(magnitudes.length - 1, currentIndex + (Math.random() > 0.5 ? 1 : -1)));
        return `${num} ${magnitudes[newIndex]}`;
      }),
      
      // Comparative alterations
      (text: string) => text.replace(/\b(more|less|higher|lower|faster|slower)\b/gi, (match) => {
        const opposites: { [key: string]: string } = {
          'more': 'less', 'less': 'more',
          'higher': 'lower', 'lower': 'higher', 
          'faster': 'slower', 'slower': 'faster'
        };
        return opposites[match.toLowerCase()] || match;
      }),
      
      // Definitive statement alterations
      (text: string) => text.replace(/\b(always|never|all|none|every|only)\b/gi, (match) => {
        const alternatives: { [key: string]: string } = {
          'always': 'usually', 'never': 'rarely',
          'all': 'most', 'none': 'few',
          'every': 'many', 'only': 'primarily'
        };
        return alternatives[match.toLowerCase()] || match;
      })
    ];

    // Apply random alteration
    const alteration = alterations[Math.floor(Math.random() * alterations.length)];
    return alteration(text);
  };

  const handleClaimSelection = (claimId: string) => {
    if (gameOver) return;
    
    const newSelected = new Set(selectedClaims);
    if (newSelected.has(claimId)) {
      newSelected.delete(claimId);
    } else {
      newSelected.add(claimId);
    }
    setSelectedClaims(newSelected);
  };

  const checkAnswers = () => {
    if (selectedClaims.size === 0) {
      setFeedback('Please select at least one claim to check.');
      return;
    }

    stopTimer();
    let score = 0;
    let correctSelections = 0;
    let totalCorrect = 0;
    const results: GameResultData[] = [];

    claims.forEach(claim => {
      const wasSelected = selectedClaims.has(claim.id.toString());
      let isCorrect = false;

      if (gameMode === 'detect') {
        // In detect mode, correct claims are the altered ones
        isCorrect = claim.isAltered || false;
        if (claim.isAltered) totalCorrect++;
        
        results.push({
          claimId: claim.id.toString(),
          text: claim.text,
          wasSelected,
          isCorrect,
          shouldSelect: claim.isAltered || false,
          explanation: claim.isAltered 
            ? `This claim was altered from: "${claim.originalText}"` 
            : 'This claim is accurate as presented.'
        });
      } else {
        // In verify mode, use Wikipedia verification results
        const verification = claim.verification;
        isCorrect = verification && (
          verification.accuracy_score < 70 || 
          verification.contains_misinformation
        );
        if (isCorrect) totalCorrect++;
        
        results.push({
          claimId: claim.id.toString(),
          text: claim.text,
          wasSelected,
          isCorrect,
          shouldSelect: isCorrect,
          explanation: verification?.summary || 'No verification data available',
          accuracy: verification?.accuracy_score || 0
        });
      }

      if (wasSelected && isCorrect) {
        correctSelections++;
        score += 10;
      } else if (wasSelected && !isCorrect) {
        score -= 5; // Penalty for false positives
      }
    });

    // Bonus points for perfect accuracy and speed
    const accuracyBonus = correctSelections === totalCorrect && correctSelections > 0 ? 50 : 0;
    const speedBonus = timeRemaining > 0 ? Math.floor(timeRemaining / 10) : 0;
    const finalScore = Math.max(0, score + accuracyBonus + speedBonus);
    
    setCurrentScore(prev => prev + finalScore);
    
    // Update streak and level
    if (correctSelections === totalCorrect && correctSelections > 0) {
      setGameStreak(prev => prev + 1);
      if (gameStreak > 0 && gameStreak % 5 === 0) {
        setPlayerLevel(prev => prev + 1);
      }
    } else {
      setGameStreak(0);
      setLives(prev => Math.max(0, prev - 1));
    }
    
    // Prepare game results for expert analysis
    const gameSessionData: GameSessionData = {
      claims: claims,
      selectedClaims: selectedClaims,
      score: finalScore,
      correctSelections,
      totalCorrect,
      gameMode,
      category: selectedCategory,
      articleTitle: currentArticle?.title,
      timestamp: new Date().toISOString()
    };

    const gameResultData: GameResult = {
      ...gameSessionData,
      results,
      verificationResults,
      correct: correctSelections > 0,
      points: finalScore,
      explanation: `You correctly identified ${correctSelections} out of ${totalCorrect} issues.`
    } as unknown as GameResult;

    setGameResults(gameResultData);

    // Perform X.ai analysis
    performXaiAnalysis(gameSessionData);

    // Record score
    if (session && currentScore + finalScore > (misinformationBestScore || 0)) {
      recordMisinformationScore(currentScore + finalScore);
    }

    let feedbackMessage = `You scored ${finalScore} points! `;
    feedbackMessage += `You correctly identified ${correctSelections} out of ${totalCorrect} issues.`;
    
    if (correctSelections === totalCorrect && correctSelections > 0) {
      feedbackMessage += ' Perfect! 🎉';
      if (accuracyBonus > 0) feedbackMessage += ` Accuracy bonus: +${accuracyBonus}!`;
      if (speedBonus > 0) feedbackMessage += ` Speed bonus: +${speedBonus}!`;
    } else if (correctSelections > totalCorrect / 2) {
      feedbackMessage += ' Good job! 👍';
    } else {
      feedbackMessage += ' Keep practicing! 📚';
    }

    setFeedback(feedbackMessage);
    
    if (lives <= 1 && correctSelections < totalCorrect / 2) {
      endGame();
    } else {
      setGameOver(true);
    }
  };

  const endGame = () => {
    setGameOver(true);
    setLives(3);
    setGameStreak(0);
    setCurrentScore(0);
    setPlayerLevel(1);
    stopTimer();
  };

  const switchGameMode = () => {
    const newMode: GameMode = gameMode === 'detect' ? ('verify' as GameMode) : ('detect' as GameMode);
    setGameMode(newMode);
    if (rssArticles.length > 0) {
      setupNewGame(rssArticles);
    }
  };

  const showExpertForCategory = (category: string) => {
    setExpertCategory(category as ExpertSpecialization);
    setShowExpertAnalysis(true);
  };

  const closeExpertAnalysis = () => {
    setShowExpertAnalysis(false);
    setExpertCategory(null);
  };

  const handleVideoGenerated = (videoId: string) => {
    console.log('Expert video generated:', videoId);
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showExpertAnalysis && expertCategory) {
    return (
      <ExpertVideoPlayer
        category={expertCategory}
        gameResults={gameResults ? [gameResults] : undefined}
        onVideoGenerated={handleVideoGenerated}
        onClose={closeExpertAnalysis}
      />
    );
  }

  if (isLoading || isLoadingProgress) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-4 border border-gray-700">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            🔬 Analyzing Information
          </h3>
          <p className="text-gray-400 text-lg">
            {gameMode === 'verify' ? 'Verifying claims with Wikipedia...' : 'Loading latest news articles...'}
          </p>
          <div className="mt-6 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
        {/* Lurking misinformation words */}
        <div className="absolute top-20 left-10 text-gray-700 opacity-30 transform rotate-12 text-sm animate-pulse">FAKE NEWS</div>
        <div className="absolute top-40 right-20 text-gray-700 opacity-25 transform -rotate-12 text-sm animate-pulse">BIAS</div>
        <div className="absolute bottom-40 left-20 text-gray-700 opacity-20 transform rotate-6 text-sm animate-pulse">HOAX</div>
        <div className="absolute bottom-20 right-10 text-gray-700 opacity-30 transform -rotate-6 text-sm animate-pulse">MISLEADING</div>
        
        {/* Pulsing red eyes */}
        <div className="absolute top-32 left-32 w-2 h-2 bg-red-500 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-60 right-40 w-2 h-2 bg-red-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-60 left-40 w-2 h-2 bg-red-500 rounded-full opacity-35 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Enhanced Game Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-red-900/30 border border-red-800/50 rounded-full text-sm text-yellow-300 mb-6 backdrop-blur-sm">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse shadow-lg shadow-yellow-500/50"></span>
            TRUTH DETECTION MISSION ACTIVE - LEVEL {playerLevel}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <div className="text-yellow-300 drop-shadow-2xl tracking-wider" style={{ 
              textShadow: '0 0 20px rgba(253, 224, 71, 0.5)' 
            }}>
              THE LANTERN'S LIGHT
            </div>
          </h1>
          <p className="text-gray-300 text-lg">Navigate through the darkness of misinformation</p>
          
          {/* Timer Display */}
          {isTimerActive && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-red-900/40 border border-red-700/50 rounded-full">
              <span className="mr-2">⏰</span>
              <span className={`font-mono text-lg ${timeRemaining < 30 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {[
            { label: 'Truth Points', value: currentScore, icon: '🏮', color: 'text-yellow-300' },
            { label: 'Lives', value: lives, icon: '❤️', color: 'text-red-400' },
            { label: 'Streak', value: gameStreak, icon: '🔥', color: 'text-orange-400' },
            { label: 'Level', value: playerLevel, icon: '⭐', color: 'text-blue-400' },
            { label: 'Mode', value: gameMode.toUpperCase(), icon: '🎯', color: 'text-purple-400' }
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-600/30 rounded-2xl p-4 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className={`text-xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-gray-400 text-xs tracking-wide">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Game Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={switchGameMode}
            className="px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-600 text-white font-bold rounded-lg border border-purple-500/50 hover:shadow-lg transition-all duration-300"
          >
            Switch to {gameMode === 'detect' ? 'VERIFY' : 'DETECT'} Mode
          </button>
          
          <button
            onClick={toggleHints}
            className="px-6 py-3 bg-gradient-to-r from-green-700 to-green-600 text-white font-bold rounded-lg border border-green-500/50 hover:shadow-lg transition-all duration-300"
          >
            {showHints ? 'Hide' : 'Show'} Hints
          </button>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg border border-gray-600 hover:border-yellow-500/50 transition-all duration-300"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Main Game Area */}
        {currentArticle && claims.length > 0 ? (
          <div className="relative">
            {/* Enhanced Article Display */}
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-600/40 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-yellow-500/50 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-yellow-500/50 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-yellow-500/50 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-yellow-500/50 rounded-br-3xl"></div>
              
              <div className="relative">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-red-900/40 border border-red-700/50 rounded-full text-yellow-300 text-sm font-medium tracking-wider">
                    <span className="mr-2">📜</span>
                    {gameMode === 'detect' ? 'DETECT ALTERED CLAIMS' : 'VERIFY CLAIM ACCURACY'}
                  </div>
                </div>
                
                <blockquote className="text-xl md:text-2xl text-white leading-relaxed text-center mb-8 font-medium relative">
                  <span className="text-6xl text-yellow-500/30 absolute -top-4 -left-2">"</span>
                  {currentArticle.title}
                  <span className="text-6xl text-yellow-500/30 absolute -bottom-8 -right-2">"</span>
                </blockquote>
                
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-full text-gray-300 text-sm">
                    <span className="mr-2">📍</span>
                    Source: {currentArticle.source?.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Claims Display */}
            <div className="grid gap-6 mb-8">
              {claims.map((claim, index) => (
                <div
                  key={claim.id}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                    selectedClaims.has(claim.id.toString())
                      ? 'bg-gradient-to-br from-blue-800/50 to-blue-900/50 border-blue-500/70 shadow-lg shadow-blue-500/20'
                      : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50 hover:border-yellow-500/50'
                  }`}
                  onClick={() => handleClaimSelection(claim.id.toString())}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedClaims.has(claim.id.toString())
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white text-lg leading-relaxed mb-2">{claim.text}</p>
                      
                      {showHints && (
                        <div className="text-sm text-gray-400 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                          <span className="font-semibold">Hint:</span> Look for {claim.type} patterns
                          {claim.priority === 'high' && <span className="ml-2 text-red-400">⚠️ High Priority</span>}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          claim.type === 'numerical' ? 'bg-blue-900/50 text-blue-300' :
                          claim.type === 'comparative' ? 'bg-green-900/50 text-green-300' :
                          claim.type === 'definitive' ? 'bg-red-900/50 text-red-300' :
                          'bg-gray-900/50 text-gray-300'
                        }`}>
                          {claim.type?.toUpperCase()}
                        </span>
                        
                        {claim.priority && (
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            claim.priority === 'high' ? 'bg-red-900/50 text-red-300' :
                            claim.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-gray-900/50 text-gray-300'
                          }`}>
                            {claim.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedClaims.has(claim.id.toString())
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-500'
                    }`}>
                      {selectedClaims.has(claim.id.toString()) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Action Button */}
            <div className="text-center mb-8">
              <button
                onClick={checkAnswers}
                disabled={gameOver || selectedClaims.size === 0}
                className="group inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-yellow-300 font-bold text-xl rounded-xl border border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider shadow-2xl"
                style={{
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'
                }}
              >
                <span className="mr-3 text-2xl">🔮</span>
                {isAnalyzing ? 'CONSULTING THE ORACLE...' : 'SEEK AI WISDOM'}
                <div className="ml-3 w-6 h-6 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              {selectedClaims.size === 0 && (
                <p className="text-gray-400 text-sm mt-4">Select at least one claim to analyze</p>
              )}
            </div>
          </div>
        ) : (
          // Enhanced Game Over Screen
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 rounded-full shadow-2xl animate-pulse" style={{
                  boxShadow: '0 0 50px rgba(251, 191, 36, 0.6)'
                }}></div>
                <div className="absolute inset-4 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-full opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">🏮</div>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-yellow-300 mb-4 tracking-wider">
              {lives <= 0 ? 'MISSION FAILED' : 'MISSION COMPLETE'}
            </h2>
            <p className="text-xl text-gray-300 mb-4">
              Your lantern has illuminated {currentScore} truths
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Level {playerLevel} • Streak: {gameStreak} • Best: {misinformationBestScore || 0}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setupNewGame(rssArticles)}
                className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500/50 tracking-wider"
              >
                <span className="mr-3 text-2xl">🏮</span>
                {lives <= 0 ? 'RESTART MISSION' : 'LIGHT A NEW PATH'}
              </button>
              
              <button
                onClick={() => showExpertForCategory(selectedCategory)}
                className="inline-flex items-center px-8 py-6 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-500/50 tracking-wider"
              >
                <span className="mr-3 text-2xl">🎓</span>
                CONSULT EXPERT
              </button>
            </div>
          </div>
        )}

        {/* Enhanced AI Analysis Results */}
        {xaiAnalysis && xaiAnalysis.expertAnalysis && (
          <div className="mt-8 bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
            
            <div className="relative">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-6 py-3 bg-blue-900/40 border border-blue-700/50 rounded-full text-blue-300 font-bold tracking-wider">
                  <span className="mr-3 text-xl">🔮</span>
                  ORACLE'S WISDOM
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-600">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="font-bold text-lg text-yellow-300">{xaiAnalysis.expertAnalysis.verdict}</div>
                  <div className="text-gray-400 text-sm">Verdict</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-600">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-bold text-lg text-blue-300">{xaiAnalysis.expertAnalysis.confidence_level}%</div>
                  <div className="text-gray-400 text-sm">Confidence</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-600">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-bold text-lg text-purple-300">{xaiAnalysis.expertAnalysis.category}</div>
                  <div className="text-gray-400 text-sm">Category</div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600">
                <h4 className="font-bold text-yellow-300 mb-3 tracking-wide">ORACLE'S REASONING:</h4>
                <p className="text-gray-300 leading-relaxed">{xaiAnalysis.expertAnalysis.reasoning}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Feedback Display */}
        {feedback && (
          <div className="mt-8 bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center">
              <span className="text-2xl mr-4">💡</span>
              <p className="text-white text-lg font-medium">{feedback}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MissInformationGame;