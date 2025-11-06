// Miss Information - Type Definitions

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface GameStats {
  score: number;
  lives: number;
  streak: number;
  level: number;
  accuracy: number;
  totalClaims: number;
  correctAnswers: number;
}

export interface Claim {
  id: string | number;
  text: string;
  source?: string;
  category?: ClaimCategory;
  isTrue?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  timestamp?: string;
  type?: string;
  priority?: string;
  metadata?: {
    url?: string;
    author?: string;
    publishedDate?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  content?: string;
  source: {
    name: string;
    credibility: number;
    url?: string;
  };
  link: string;
  publishedDate: string;
  category: string;
}

export interface XAIAnalysis {
  verdict: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED';
  confidence: number;
  reasoning: string;
  category: string;
  accuracy_score: number;
  confidence_level: string;
  key_findings: string[];
  sources?: string[];
  processing_time?: number;
}

export interface ExpertAnalysis {
  expertName: string;
  expertise: string;
  videoUrl?: string;
  analysis: string;
  recommendations: string[];
  credibilityScore: number;
}

export interface DashboardStats {
  claims_analyzed: number;
  fake_detected: number;
  sources_verified: number;
  accuracy_rate: number;
}

export interface AlertData {
  id: string;
  alert_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  topic: string;
  narrative: string;
  timestamp: string;
  source?: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  viral_metrics?: {
    estimated_reach: number;
    growth_velocity: string;
  };
  fact_check_priority: number;
}

export interface PerformanceMetrics {
  responseTime: number;
  apiVersion: string;
  structuredOutputs: boolean;
  platformHealth?: number;
  batchSize?: number;
  successRate?: number;
  lastAnalysis?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  accuracy: number;
  badge: string;
  rank: number;
  country: string;
  totalClaims?: number;
  joinDate?: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  category: string;
  credibilityScore: number;
  url?: string;
  imageUrl?: string;
}

export interface TavusExpert {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  avatarUrl?: string;
  credibilityScore: number;
  videoCount: number;
  specialization: ExpertSpecialization;
}

export interface GameResult {
  score: any;
  correct: boolean;
  points: number;
  explanation: string;
  expertAnalysis?: ExpertAnalysis;
  timestamp: Date;
}

export interface BatchAnalysisResult {
  results: XAIAnalysis[];
  metadata: {
    batch_size: number;
    processing_time_ms: number;
    success_rate: number;
    api_version: string;
  };
}

// Enums
export enum ClaimCategory {
  CLIMATE = 'climate',
  TECHNOLOGY = 'technology',
  HEALTH = 'health',
  POLITICS = 'politics',
  ECONOMICS = 'economics',
  SCIENCE = 'science',
  SOCIAL = 'social',
  GENERAL = 'general'
}

export enum ExpertSpecialization {
  CLIMATE_SCIENCE = 'climate_science',
  TECHNOLOGY = 'technology',
  HEALTHCARE = 'healthcare',
  FACT_CHECKING = 'fact_checking',
  MEDIA_LITERACY = 'media_literacy',
  GENERAL_NEWS = 'general_news',
  RENEWABLE_ENERGY = 'renewable_energy'
}

export enum GameMode {
  DETECT = 'detect',
  VERIFY = 'verify',
  ANALYZE = 'analyze'
}

// Component Props Types
export interface MissInformationGameProps {
  initialStats?: GameStats;
  onScoreUpdate?: (stats: GameStats) => void;
  expertMode?: boolean;
}

export interface DashboardProps {
  refreshInterval?: number;
  showAdvancedMetrics?: boolean;
}

export interface LeaderboardProps {
  timeframe?: 'weekly' | 'monthly' | 'all-time';
  category?: ClaimCategory | 'all';
  maxEntries?: number;
}

export interface ExpertVideoPlayerProps {
  category: ExpertSpecialization;
  gameResults?: GameResult[];
  onVideoGenerated?: (videoUrl: string) => void;
  onClose: () => void;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface XAIAPIResponse extends APIResponse {
  data: {
    expertAnalysis: XAIAnalysis;
    batchResults?: XAIAnalysis[];
    metadata: PerformanceMetrics;
  };
}

export interface AlertsAPIResponse extends APIResponse {
  data: {
    alerts: AlertData[];
    platform_health: {
      overall_score: number;
      status: string;
    };
  };
}

// Utility Types
export type Theme = 'dark' | 'light';
export type SortOrder = 'asc' | 'desc';
export type GameDifficulty = 'beginner' | 'intermediate' | 'expert';
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  institution?: string;
  message: string;
  budget?: 'educational' | 'research' | 'commercial';
}

export interface FeedbackFormData {
  rating: number;
  category: 'bug' | 'feature' | 'improvement' | 'general';
  message: string;
  email?: string;
}

// Configuration Types
export interface AppConfig {
  apiBaseUrl: string;
  enableExpertMode: boolean;
  maxClaimsPerSession: number;
  defaultDifficulty: GameDifficulty;
  refreshIntervals: {
    dashboard: number;
    leaderboard: number;
    newsFeed: number;
  };
}

// Hook Return Types
export interface UseGameState {
  stats: GameStats;
  currentClaim: Claim | null;
  gameOver: boolean;
  loading: boolean;
  submitAnswer: (answer: boolean) => Promise<void>;
  resetGame: () => void;
  getNextClaim: () => Promise<void>;
}

export interface UseDashboard {
  data: {
    alerts: AlertData[];
    stats: DashboardStats;
    threatLevel: ThreatLevel;
  };
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} 