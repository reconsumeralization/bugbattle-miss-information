// Enhanced Real-Time Misinformation Dashboard with Structured Outputs
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { 
  DashboardStats, 
  AlertData, 
  ThreatLevel,
  PerformanceMetrics 
} from '../types';

interface DashboardData {
  isRunning: any;
  alerts: AlertData[];
  sentiment: any;
  liveSearch: any[];
  batchResults: any[];
}

interface ClaimItem {
  id: number;
  text: string;
  verdict: string;
  confidence: number;
  severity: string;
  timestamp: string;
  source: string;
}

const EnhancedRealTimeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('alerts');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DashboardData>({
    isRunning: false,
    alerts: [],
    sentiment: null,
    liveSearch: [],
    batchResults: []
  });
  const [performance, setPerformance] = useState<PerformanceMetrics & { platformHealth?: number; batchSize?: number; successRate?: number; lastAnalysis?: string }>({
    responseTime: 0,
    apiVersion: 'enhanced-structured',
    structuredOutputs: true
  });
  const [error, setError] = useState<string | null>(null);
  
  // Add missing state variables for the Miss Information aesthetic
  const [stats, setStats] = useState<DashboardStats>({
    claims_analyzed: 15847,
    fake_detected: 3251,
    sources_verified: 12596,
    accuracy_rate: 94
  });
  
  const [claims, setClaims] = useState<ClaimItem[]>([
    {
      id: 1,
      text: "Breaking: New study shows climate change effects accelerating faster than predicted.",
      verdict: "TRUE",
      confidence: 89,
      severity: "medium",
      timestamp: "2 minutes ago",
      source: "Climate Central"
    },
    {
      id: 2,
      text: "URGENT: Social media platform announces complete ban on fact-checking.",
      verdict: "FALSE",
      confidence: 95,
      severity: "high",
      timestamp: "5 minutes ago",
      source: "Viral Tweet"
    },
    {
      id: 3,
      text: "Tech company releases new AI model with 99.9% accuracy in misinformation detection.",
      verdict: "MISLEADING",
      confidence: 72,
      severity: "medium",
      timestamp: "8 minutes ago",
      source: "TechCrunch"
    },
    {
      id: 4,
      text: "Government announces new funding for digital literacy programs in schools.",
      verdict: "TRUE",
      confidence: 91,
      severity: "low",
      timestamp: "12 minutes ago",
      source: "Department of Education"
    }
  ]);
  
  const [threatLevel, setThreatLevel] = useState('MEDIUM');

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchRealTimeAlerts();
    const interval = setInterval(fetchRealTimeAlerts, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        claims_analyzed: prev.claims_analyzed + Math.floor(Math.random() * 3) + 1,
        fake_detected: prev.fake_detected + Math.floor(Math.random() * 2),
        sources_verified: prev.sources_verified + Math.floor(Math.random() * 2) + 1
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeAlerts = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/xai/real-time-alerts');
      const result = await response.json();
      
      if (response.ok) {
        setData(prev => ({ ...prev, alerts: result.alerts }));
        setPerformance({
          responseTime: Date.now() - startTime,
          apiVersion: result.metadata?.api_version || 'enhanced-structured',
          structuredOutputs: true,
          platformHealth: result.platform_health?.overall_score
        });
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch alerts');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const performStructuredAnalysis = async (query: string, analysisType: string) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/xai/analyze-structured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim: query,
          analysisType,
          context: 'Enhanced dashboard analysis'
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        if (analysisType === 'sentiment') {
          setData(prev => ({ ...prev, sentiment: result }));
        } else if (analysisType === 'live-search') {
          setData(prev => ({ ...prev, liveSearch: result.search_results || [] }));
        }
        
        setPerformance(prev => ({
          ...prev,
          responseTime: Date.now() - startTime,
          lastAnalysis: analysisType
        }));
        setError(null);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Analysis error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const performBatchAnalysis = async (claims: string[]) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/xai/batch-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claims,
          batchType: 'fact-check'
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setData(prev => ({ ...prev, batchResults: result.results }));
        setPerformance(prev => ({
          ...prev,
          responseTime: result.metadata.processing_time_ms,
          batchSize: result.metadata.batch_size,
          successRate: result.metadata.success_rate
        }));
        setError(null);
      } else {
        setError(result.error || 'Batch analysis failed');
      }
    } catch (err) {
      setError('Batch error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const AlertsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">🚨 Real-Time Alerts</h3>
        <button
          onClick={fetchRealTimeAlerts}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      <div className="grid gap-4">
        {data.alerts.length > 0 ? (
          data.alerts.map((alert: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${getAlertStyle(alert.alert_level)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getAlertBadgeStyle(alert.alert_level)}`}>
                      {alert.alert_level}
                    </span>
                    <span className="text-white font-medium">{alert.topic}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{alert.narrative}</p>
                  
                  {alert.viral_metrics && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Reach:</span>
                        <p className="text-white">{alert.viral_metrics.estimated_reach?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Growth:</span>
                        <p className="text-white">{alert.viral_metrics.growth_velocity || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Priority:</span>
                        <p className="text-white">{alert.fact_check_priority}/10</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No active alerts found</p>
            <p className="text-sm text-gray-500">Platform appears healthy ✅</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const SentimentTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">🎭 Sentiment Analysis</h3>
        <input
          type="text"
          placeholder="Topic to analyze..."
          className="px-3 py-2 bg-gray-700 text-white rounded-lg"
          onKeyPress={(e) => {
            const target = e.target as HTMLInputElement;
            if (e.key === 'Enter' && target.value.trim()) {
              performStructuredAnalysis(target.value.trim(), 'sentiment');
              target.value = '';
            }
          }}
        />
      </div>

      {data.sentiment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="mb-4">
            <h4 className="text-white font-medium mb-2">Overall Sentiment</h4>
            <span className={`px-3 py-1 rounded-lg ${getSentimentStyle(data.sentiment.overall_sentiment)}`}>
              {data.sentiment.overall_sentiment}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-green-400 text-2xl font-bold">
                {data.sentiment.sentiment_distribution?.positive || 0}%
              </p>
              <p className="text-gray-400 text-sm">Positive</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-2xl font-bold">
                {data.sentiment.sentiment_distribution?.neutral || 0}%
              </p>
              <p className="text-gray-400 text-sm">Neutral</p>
            </div>
            <div className="text-center">
              <p className="text-red-400 text-2xl font-bold">
                {data.sentiment.sentiment_distribution?.negative || 0}%
              </p>
              <p className="text-gray-400 text-sm">Negative</p>
            </div>
          </div>

          {data.sentiment.key_themes && (
            <div>
              <h5 className="text-white font-medium mb-2">Key Themes</h5>
              <div className="flex flex-wrap gap-2">
                {data.sentiment.key_themes.map((theme: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-600 text-white text-sm rounded">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  const BatchTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">🔄 Batch Analysis</h3>
        <button
          onClick={() => {
            const sampleClaims = [
              "COVID vaccines alter DNA",
              "5G causes coronavirus", 
              "Climate change is natural cycles",
              "Electric cars are worse for environment"
            ];
            performBatchAnalysis(sampleClaims);
          }}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? '⏳ Processing...' : '🚀 Run Sample Batch'}
        </button>
      </div>

      {data.batchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {data.batchResults.map((result: any, index: number) => (
            result && (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-sm ${getVerdictStyle(result.verdict)}`}>
                    {result.verdict}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {result.accuracy_score}% accuracy
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-white text-sm">{result.key_findings?.[0] || 'Analysis complete'}</p>
                </div>
              </div>
            )
          ))}
        </motion.div>
      )}
    </motion.div>
  );

  function setIsRunning(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  function clearData(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
        {/* Surveillance eyes */}
        <div className="absolute top-20 left-16 w-2 h-2 bg-red-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-24 w-2 h-2 bg-red-500 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-red-500 rounded-full opacity-35 animate-pulse"></div>
        
        {/* Lurking misinformation */}
        <div className="absolute top-32 left-20 text-gray-700 opacity-20 transform rotate-6 text-xs">DECEPTION</div>
        <div className="absolute top-56 right-16 text-gray-700 opacity-25 transform -rotate-12 text-xs">LIES</div>
        <div className="absolute bottom-40 left-24 text-gray-700 opacity-20 transform rotate-12 text-xs">PROPAGANDA</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-red-900/30 border border-red-800/50 rounded-full text-sm text-yellow-300 mb-6 backdrop-blur-sm">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse shadow-lg shadow-yellow-500/50"></span>
            SURVEILLANCE NETWORK ACTIVE
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <div className="text-yellow-300 drop-shadow-2xl tracking-wider" style={{ 
              textShadow: '0 0 20px rgba(253, 224, 71, 0.5)' 
            }}>
              THE ORACLE'S WATCH
            </div>
          </h1>
          <p className="text-gray-300 text-lg">Real-time misinformation detection across the digital realm</p>
        </div>

        {/* Stats Grid - Redesigned as Crystal Orbs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {Object.entries(stats).map(([key, value]: [string, any], index: number) => {
            const statConfig = {
              claims_analyzed: { icon: '🔮', label: 'Claims Analyzed', color: 'text-blue-400', glow: 'shadow-blue-500/50' },
              fake_detected: { icon: '⚠️', label: 'Deceptions Found', color: 'text-red-400', glow: 'shadow-red-500/50' },
              sources_verified: { icon: '✅', label: 'Sources Verified', color: 'text-green-400', glow: 'shadow-green-500/50' },
              accuracy_rate: { icon: '🎯', label: 'Accuracy Rate', color: 'text-yellow-300', glow: 'shadow-yellow-500/50' }
            }[key] || { icon: '📊', label: key.replace('_', ' '), color: 'text-gray-400', glow: 'shadow-gray-500/50' };

            return (
              <div key={key} className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-600/30 rounded-3xl p-8 text-center overflow-hidden shadow-lg ${statConfig.glow} transition-all duration-500 hover:-translate-y-2`}>
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {statConfig.icon}
                  </div>
                  <div className={`text-3xl font-bold ${statConfig.color} mb-2 tracking-wider`}>
                    {key === 'accuracy_rate' ? `${value}%` : value?.toLocaleString() || '0'}
                  </div>
                  <div className="text-gray-400 text-sm tracking-wide font-medium">
                    {statConfig.label.toUpperCase()}
                  </div>
                </div>
                
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full opacity-75 animate-pulse"></div>
              </div>
            );
          })}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Feed - Redesigned as Ancient Scroll */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-600/40 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-yellow-500/50 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-yellow-500/50 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-yellow-500/50 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-yellow-500/50 rounded-br-3xl"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-yellow-300 text-xl">📜</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-300 tracking-wider">LIVE INTELLIGENCE FEED</h3>
                      <p className="text-gray-400 text-sm">Real-time monitoring</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700/50 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 text-sm font-medium tracking-wide">ACTIVE</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {claims.slice(0, 8).map((claim: ClaimItem, index: number) => (
                    <div key={index} className="group bg-gray-800/50 border border-gray-600 rounded-2xl p-6 hover:border-red-600/50 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          claim.severity === 'high' ? 'bg-red-900/50 border border-red-600/50' :
                          claim.severity === 'medium' ? 'bg-orange-900/50 border border-orange-600/50' :
                          'bg-blue-900/50 border border-blue-600/50'
                        }`}>
                          <span className="text-xl">
                            {claim.severity === 'high' ? '🚨' : claim.severity === 'medium' ? '⚠️' : '📊'}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                              claim.verdict === 'FALSE' ? 'bg-red-900/50 text-red-300 border border-red-600/30' :
                              claim.verdict === 'MISLEADING' ? 'bg-orange-900/50 text-orange-300 border border-orange-600/30' :
                              claim.verdict === 'TRUE' ? 'bg-green-900/50 text-green-300 border border-green-600/30' :
                              'bg-gray-800/50 text-gray-300 border border-gray-600/30'
                            }`}>
                              {claim.verdict}
                            </span>
                            <span className="text-gray-500 text-xs">{claim.timestamp}</span>
                          </div>
                          
                          <p className="text-gray-200 leading-relaxed mb-3 group-hover:text-white transition-colors">
                            {claim.text}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">
                              📍 {claim.source || 'Unknown Source'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Confidence:</span>
                              <span className={`text-sm font-bold ${
                                claim.confidence > 80 ? 'text-green-400' :
                                claim.confidence > 60 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                {claim.confidence}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Oracle's Insights */}
          <div className="space-y-8">
            {/* Threat Level */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-red-600/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-300 text-lg">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-300 tracking-wider">THREAT LEVEL</h4>
                    <p className="text-gray-400 text-sm">Current risk assessment</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${
                    threatLevel === 'HIGH' ? 'text-red-400' :
                    threatLevel === 'MEDIUM' ? 'text-orange-400' :
                    'text-green-400'
                  }`}>
                    {threatLevel}
                  </div>
                  <div className="text-gray-400 text-sm">Misinformation Activity</div>
                </div>
              </div>
            </div>

            {/* Platform Status */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-600/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-300 text-lg">⚡</span>
                </div>
                <div>
                  <h4 className="font-bold text-yellow-300 tracking-wider">SYSTEM STATUS</h4>
                  <p className="text-gray-400 text-sm">Oracle network health</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'X.ai Analysis', status: 'operational', uptime: '99.9%' },
                  { name: 'Tavus Experts', status: 'operational', uptime: '98.7%' },
                  { name: 'Data Processing', status: 'operational', uptime: '99.5%' },
                  { name: 'Real-time Monitoring', status: 'operational', uptime: '100%' }
                ].map((service: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'operational' ? 'bg-green-400' : 'bg-red-400'
                      } animate-pulse`}></div>
                      <span className="text-gray-300 text-sm">{service.name}</span>
                    </div>
                    <span className="text-green-400 text-xs font-medium">{service.uptime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-600/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-300 text-lg">📈</span>
                </div>
                <div>
                  <h4 className="font-bold text-yellow-300 tracking-wider">ACTIVITY PULSE</h4>
                  <p className="text-gray-400 text-sm">Last 24 hours</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Claims Analyzed</span>
                  <span className="text-blue-400 font-bold">+{(stats.claims_analyzed * 0.1).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">False Claims Blocked</span>
                  <span className="text-red-400 font-bold">+{(stats.fake_detected * 0.15).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Expert Videos Created</span>
                  <span className="text-purple-400 font-bold">+{Math.floor(Math.random() * 12) + 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 text-center">
          <div className="inline-flex gap-4">
            <button
              onClick={() => setIsRunning(!data.isRunning)}
              className={`group px-8 py-4 rounded-xl font-bold text-lg tracking-wider border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                data.isRunning 
                  ? 'bg-gradient-to-r from-red-700 to-red-600 text-yellow-300 border-red-500/50' 
                  : 'bg-gradient-to-r from-green-700 to-green-600 text-yellow-300 border-green-500/50'
              }`}
              style={{
                boxShadow: data.isRunning 
                  ? '0 0 20px rgba(220, 38, 38, 0.3)' 
                  : '0 0 20px rgba(34, 197, 94, 0.3)'
              }}
            >
              <span className="mr-3 text-xl">{data.isRunning ? '⏸️' : '▶️'}</span>
              {data.isRunning ? 'PAUSE SURVEILLANCE' : 'RESUME SURVEILLANCE'}
            </button>

            <button
              onClick={clearData}
              className="group px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 rounded-xl font-bold text-lg tracking-wider border-2 border-gray-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:text-white hover:border-gray-400/50"
            >
              <span className="mr-3 text-xl">🧹</span>
              CLEAR DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility functions for styling
const getAlertStyle = (level: string) => {
  const styles: { [key: string]: string } = {
    CRITICAL: 'bg-red-900 border-red-500',
    HIGH: 'bg-orange-900 border-orange-500',
    MEDIUM: 'bg-yellow-900 border-yellow-500',
    LOW: 'bg-blue-900 border-blue-500'
  };
  return styles[level] || styles.LOW;
};

const getAlertBadgeStyle = (level: string) => {
  const styles: { [key: string]: string } = {
    CRITICAL: 'bg-red-600 text-white',
    HIGH: 'bg-orange-600 text-white',
    MEDIUM: 'bg-yellow-600 text-black',
    LOW: 'bg-blue-600 text-white'
  };
  return styles[level] || styles.LOW;
};

const getSentimentStyle = (sentiment: string) => {
  const styles: { [key: string]: string } = {
    VERY_POSITIVE: 'bg-green-600 text-white',
    POSITIVE: 'bg-green-500 text-white',
    NEUTRAL: 'bg-gray-600 text-white',
    NEGATIVE: 'bg-red-500 text-white',
    VERY_NEGATIVE: 'bg-red-600 text-white'
  };
  return styles[sentiment] || styles.NEUTRAL;
};

const getVerdictStyle = (verdict: string) => {
  const styles: { [key: string]: string } = {
    TRUE: 'bg-green-600 text-white',
    FALSE: 'bg-red-600 text-white',
    MISLEADING: 'bg-orange-600 text-white',
    UNVERIFIED: 'bg-gray-600 text-white',
    CONTEXT_NEEDED: 'bg-yellow-600 text-black'
  };
  return styles[verdict] || styles.UNVERIFIED;
};

export default EnhancedRealTimeDashboard; 