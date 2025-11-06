import React, { useState, useEffect } from 'react';
import type { ExpertVideoPlayerProps, GameResult } from '../types';

interface Expert {
  name?: string;
  expertise?: string;
  background?: string;
  currentStatus?: string;
  trainingProgress?: number;
}

interface VideoStatus {
  videoId: string;
  status: string;
  duration?: number;
  createdAt?: string;
}

interface Claim {
  text: string;
  source: string;
  confidence: number;
}

interface VerificationResult {
  claim: string;
  verified: boolean;
  confidence: number;
  sources: string[];
}

interface GrokAnalysis {
  misinformationPatterns: string[];
  credibilityScore: number;
  contextualInsights: string[];
  realTimeRelevance: number;
}

const ExpertVideoPlayer: React.FC<ExpertVideoPlayerProps> = ({ 
  category, 
  gameResults, 
  onVideoGenerated, 
  onClose 
}) => {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [videoStatus, setVideoStatus] = useState<VideoStatus | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [grokAnalysis, setGrokAnalysis] = useState<GrokAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    if (category) {
      loadExpertInfo();
      performGrokAnalysis();
    }
  }, [category, gameResults]);

  const loadExpertInfo = async () => {
    try {
      const response = await fetch(`/api/tavus/experts?category=${category}&status=true`);
      const data = await response.json();
      
      if (response.ok) {
        setExpert(data.expert);
      } else {
        setError(data.message || 'Failed to load expert information');
      }
    } catch (error) {
      console.error('Error loading expert:', error);
      setError('Failed to load expert information');
    }
  };

  const performGrokAnalysis = async () => {
    if (!gameResults) return;

    setIsAnalyzing(true);
    try {
      const resultsData = Array.isArray(gameResults) ? gameResults[0] : gameResults;
      
      const response = await fetch('/api/grok/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          claims: (resultsData as any)?.claims || [],
          verificationResults: (resultsData as any)?.verificationResults,
          articleTitle: (resultsData as any)?.title || 'Unknown Article'
        })
      });

      if (response.ok) {
        const analysis = await response.json();
        setGrokAnalysis(analysis);
      }
    } catch (error) {
      console.error('Error performing Grok analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateExplanationVideo = async () => {
    if (!expert || !gameResults) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Handle both single game result object and array of results
      const resultsData = Array.isArray(gameResults) ? gameResults[0] : gameResults;
      
      // Enhanced video generation with Grok-powered script generation
      const response = await fetch('/api/tavus/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          claims: (resultsData as any)?.claims || [],
          verificationResults: (resultsData as any)?.verificationResults,
          playerScore: (resultsData as any)?.totalScore || resultsData?.score || 0,
          articleTitle: (resultsData as any)?.title || 'Unknown Article',
          grokAnalysis: grokAnalysis, // Include Grok insights for enhanced script generation
          useGrokScriptGeneration: true // Flag to enable Grok-powered script creation
        })
      });

      const data = await response.json();

      if (response.ok) {
        setVideoStatus({
          videoId: data.videoId,
          status: data.status
        });
        
        // Poll for video completion
        pollVideoStatus(data.videoId);
        
        if (onVideoGenerated) {
          onVideoGenerated(data.videoId);
        }
      } else {
        setError(data.message || 'Failed to generate video');
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Error generating video:', error);
      setError('Failed to generate explanation video');
      setIsGenerating(false);
    }
  };

  const pollVideoStatus = async (videoId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/tavus/generate-video?videoId=${videoId}`);
        const data = await response.json();

        if (response.ok) {
          setVideoStatus(prev => ({ ...prev, ...data }));

          if (data.status === 'completed' && data.downloadUrl) {
            setVideoUrl(data.downloadUrl);
            setIsGenerating(false);
          } else if (data.status === 'failed') {
            setError('Video generation failed');
            setIsGenerating(false);
          } else if (data.status === 'generating' || data.status === 'processing') {
            // Continue polling
            setTimeout(checkStatus, 3000);
          }
        }
      } catch (error) {
        console.error('Error checking video status:', error);
        setTimeout(checkStatus, 5000); // Retry in 5 seconds
      }
    };

    checkStatus();
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-600">Error</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => {
            setError(null);
            loadExpertInfo();
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expert information...</p>
        </div>
      </div>
    );
  }

  // Handle both single game result object and array of results
  const resultsData = Array.isArray(gameResults) ? gameResults[0] : gameResults;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          🎓 AI-Enhanced Expert Analysis
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        )}
      </div>

      {/* Expert Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {expert.name?.charAt(0) || '?'}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800">
              {expert.name || 'Expert'}
            </h4>
            <p className="text-blue-600 font-medium">
              {expert.expertise || 'Subject Matter Expert'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {expert.background || 'Professional background information'}
            </p>
            {expert.currentStatus && (
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  expert.currentStatus === 'ready' 
                    ? 'bg-green-100 text-green-800' 
                    : expert.currentStatus === 'training'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  Status: {expert.currentStatus}
                  {expert.trainingProgress && ` (${expert.trainingProgress}%)`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grok AI Analysis Section */}
      {grokAnalysis && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <h4 className="text-lg font-semibold mb-3 text-purple-800 flex items-center">
            🤖 Grok AI Deep Analysis
            {isAnalyzing && (
              <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            )}
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-purple-700">Credibility Score:</span>
                <div className="flex-1 bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${grokAnalysis.credibilityScore * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-purple-800">
                  {(grokAnalysis.credibilityScore * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-purple-700">Real-time Relevance:</span>
                <div className="flex-1 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${grokAnalysis.realTimeRelevance * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-blue-800">
                  {(grokAnalysis.realTimeRelevance * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Detected Patterns:</p>
              <ul className="text-xs text-purple-600 space-y-1">
                {grokAnalysis.misinformationPatterns.slice(0, 3).map((pattern, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {grokAnalysis.contextualInsights.length > 0 && (
            <div className="mt-3 p-2 bg-white rounded border-l-4 border-purple-400">
              <p className="text-sm font-medium text-purple-700">Key Insight:</p>
              <p className="text-sm text-purple-600 italic">
                "{grokAnalysis.contextualInsights[0]}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Video Section */}
      <div className="mb-6">
        {videoUrl ? (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">📹 AI-Generated Personalized Explanation</h4>
            <div className="bg-black rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-auto"
                poster="/api/placeholder/800/450"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Duration: {videoStatus?.duration}s | 
                Generated: {videoStatus?.createdAt ? new Date(videoStatus.createdAt).toLocaleString() : 'Unknown'}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                ✨ Enhanced with Grok AI
              </span>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h4 className="text-lg font-semibold mb-2">🎬 Generating AI-Enhanced Explanation</h4>
            <p className="text-gray-600 mb-4">
              {expert.name} is creating a personalized video explanation powered by Grok AI insights...
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-800 mb-1">
                🤖 Grok AI is enhancing the script with real-time context and pattern analysis
              </p>
              {videoStatus && (
                <div className="mt-2">
                  <p className="text-sm text-blue-800">
                    Status: <span className="font-medium">{videoStatus.status}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Video ID: {videoStatus.videoId}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : gameResults && expert.currentStatus === 'ready' ? (
          <div className="text-center py-6">
            <h4 className="text-lg font-semibold mb-4">
              Get an AI-Enhanced Personalized Explanation
            </h4>
            <p className="text-gray-600 mb-4">
              {expert.name} can create a custom video explanation enhanced with Grok AI insights, 
              providing real-time context and advanced pattern analysis of your fact-checking results.
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-lg mb-4 max-w-md mx-auto">
              <p className="text-sm text-purple-700">
                ✨ <strong>New:</strong> Videos now include Grok AI's real-time misinformation pattern detection 
                and contextual insights from across the web and X platform.
              </p>
            </div>
            <button
              onClick={generateExplanationVideo}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
            >
              🎥 Generate AI-Enhanced Video
            </button>
          </div>
        ) : expert.currentStatus !== 'ready' ? (
          <div className="text-center py-6 bg-yellow-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-2 text-yellow-800">
              Expert Training in Progress
            </h4>
            <p className="text-yellow-700">
              {expert.name}'s AI replica is currently being trained with Grok AI enhancements. 
              Video generation will be available once training is complete.
            </p>
            {expert.trainingProgress && (
              <div className="mt-4 max-w-xs mx-auto">
                <div className="bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${expert.trainingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-yellow-600 mt-1">
                  {expert.trainingProgress}% complete
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">No Game Results</h4>
            <p className="text-gray-600">
              Complete a fact-checking game to get a personalized AI-enhanced explanation video.
            </p>
          </div>
        )}
      </div>

      {/* Expert Insights */}
      {gameResults && resultsData && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-blue-800">
            💡 AI-Enhanced Insights from {expert.name}
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              • You scored <strong>{(resultsData as any)?.totalScore || resultsData?.score || 0}</strong> points in this round
            </p>
            <p>
              • Analyzed <strong>{(resultsData as any)?.claims?.length || 0}</strong> claims 
              from "{(resultsData as any)?.title || 'Unknown Article'}"
            </p>
            {(resultsData as any)?.verificationResults && (
              <p>
                • Wikipedia verification confidence: <strong>
                  {((resultsData as any).verificationResults.summary?.averageConfidence * 100).toFixed(1)}%
                </strong>
              </p>
            )}
            {grokAnalysis && (
              <p>
                • <strong>Grok AI Analysis:</strong> Detected {grokAnalysis.misinformationPatterns.length} potential 
                misinformation patterns with {(grokAnalysis.credibilityScore * 100).toFixed(1)}% overall credibility
              </p>
            )}
            <p className="italic pt-2 border-t border-blue-200">
              "With Grok AI's real-time analysis and pattern recognition, we can now provide deeper insights 
              into misinformation tactics and contextual relevance. Keep practicing to improve your media literacy skills!" - {expert.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpertVideoPlayer; 