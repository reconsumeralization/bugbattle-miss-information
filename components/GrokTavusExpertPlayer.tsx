import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GameResults {
  category: string;
  claims: any[];
  verificationResults: any[];
  score: number;
  articleTitle: string;
}

interface GrokAnalysis {
  analysis: string;
  recommendations?: string[];
}

interface TavusVideo {
  videoUrl: string;
  thumbnailUrl?: string;
  videoId?: string;
}

interface Expert {
  avatar: string;
  name: string;
  credentials: string;
}

interface GrokTavusExpertPlayerProps {
  gameResults: GameResults;
  onClose: () => void;
}

// Hybrid Expert System: Grok Analysis + Tavus Video Generation
export default function GrokTavusExpertPlayer({ gameResults, onClose }: GrokTavusExpertPlayerProps) {
  const [analysisStep, setAnalysisStep] = useState<string>('grok-analysis');
  const [grokAnalysis, setGrokAnalysis] = useState<GrokAnalysis | null>(null);
  const [tavusVideo, setTavusVideo] = useState<TavusVideo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gameResults) {
      generateHybridExpertResponse();
    }
  }, [gameResults]);

  const generateHybridExpertResponse = async () => {
    try {
      setLoading(true);
      setAnalysisStep('grok-analysis');

      // Step 1: Generate analysis using X.ai Grok
      console.log('🔄 Generating Grok analysis...');
      const grokResponse = await fetch('/api/xai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: gameResults.category,
          claims: gameResults.claims,
          verificationResults: gameResults.verificationResults,
          playerScore: gameResults.score,
          articleTitle: gameResults.articleTitle
        })
      });

      if (!grokResponse.ok) throw new Error('Grok analysis failed');
      
      const grokData = await grokResponse.json();
      setGrokAnalysis(grokData);
      console.log('✅ Grok analysis complete');

      // Step 2: Generate Tavus video using Grok's analysis
      setAnalysisStep('tavus-video');
      console.log('🔄 Generating Tavus video...');

      const tavusResponse = await fetch('/api/tavus/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: gameResults.category,
          expertAnalysis: grokData.analysis,
          playerScore: gameResults.score,
          gameResults: gameResults,
          script: grokData.analysis // Use Grok analysis as Tavus script
        })
      });

      if (!tavusResponse.ok) throw new Error('Tavus video generation failed');
      
      const tavusData = await tavusResponse.json();
      setTavusVideo(tavusData);
      console.log('✅ Tavus video ready');

      setAnalysisStep('complete');

    } catch (error: any) {
      console.error('Hybrid expert generation error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const expert = getExpertForCategory(gameResults?.category);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header with X.ai + Tavus Branding */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{expert.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold">{expert.name}</h2>
                <p className="text-purple-200">{expert.credentials}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-black/30 px-3 py-1 rounded-full text-sm">
                    🤖 Powered by X.ai Grok
                  </span>
                  <span className="bg-black/30 px-3 py-1 rounded-full text-sm">
                    🎬 Video by Tavus
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Analysis Steps Progress */}
        <div className="bg-slate-800 p-4">
          <div className="flex items-center gap-4">
            {['grok-analysis', 'tavus-video', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${analysisStep === step ? 'bg-blue-500 text-white animate-pulse' : 
                    ['grok-analysis', 'tavus-video', 'complete'].indexOf(analysisStep) > index ?
                    'bg-green-500 text-white' : 'bg-slate-600 text-slate-400'}
                `}>
                  {step === 'grok-analysis' ? '🧠' : step === 'tavus-video' ? '🎬' : '✨'}
                </div>
                <span className="text-white text-sm">
                  {step === 'grok-analysis' ? 'Grok Analysis' : 
                   step === 'tavus-video' ? 'Tavus Video' : 'Complete'}
                </span>
                {index < 2 && <div className="w-8 h-0.5 bg-slate-600" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
              <p className="text-red-200">Error: {error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
              />
              <p className="text-white">
                {analysisStep === 'grok-analysis' ? 'Grok is analyzing your performance...' :
                 analysisStep === 'tavus-video' ? 'Tavus is creating your personalized video...' :
                 'Finalizing your expert consultation...'}
              </p>
            </div>
          )}

          {/* Grok Analysis Display */}
          {grokAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-slate-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h3 className="text-lg font-bold text-white">X.ai Grok Analysis</h3>
                  <span className="bg-purple-600 px-2 py-1 rounded text-xs text-white">
                    Uncensored • Real-time
                  </span>
                </div>
                <div className="text-gray-300 leading-relaxed">
                  {grokAnalysis.analysis}
                </div>
                
                {grokAnalysis.recommendations && grokAnalysis.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-white mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {grokAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-300 text-sm">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tavus Video Display */}
          {tavusVideo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎬</span>
                  <h3 className="text-lg font-bold text-white">Personalized Expert Video</h3>
                  <span className="bg-green-600 px-2 py-1 rounded text-xs text-white">
                    AI Generated • Personalized
                  </span>
                </div>
                
                {tavusVideo.videoUrl ? (
                  <div className="relative rounded-lg overflow-hidden">
                    <video
                      src={tavusVideo.videoUrl}
                      controls
                      className="w-full h-64 object-cover"
                      poster={tavusVideo.thumbnailUrl}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/80 rounded px-2 py-1">
                      <span className="text-white text-xs">
                        Generated by Tavus using Grok analysis
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-700 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-2">{expert.avatar}</div>
                    <p className="text-white">Video generating... Check back in a few minutes</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Tavus ID: {tavusVideo.videoId}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {analysisStep === 'complete' && grokAnalysis && tavusVideo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/50 rounded-lg p-4 text-center"
            >
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-lg font-bold text-white mb-2">
                Expert Consultation Complete
              </h3>
              <p className="text-gray-300 text-sm">
                Your personalized analysis combines X.ai Grok's uncensored insights 
                with Tavus AI's expert video generation for maximum learning impact.
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-800 p-4 flex items-center justify-between text-sm">
          <div className="text-gray-400">
            Hybrid AI System: X.ai Grok + Tavus Video Generation
          </div>
          <div className="text-gray-400">
            Free Speech Analysis • Uncensored • Real-time
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function getExpertForCategory(category: string): Expert {
  const experts = {
    'climate': {
      name: 'Dr. Elena Rodriguez',
      credentials: 'Climate Science Expert',
      avatar: '🌍'
    },
    'renewable_energy': {
      name: 'Professor Marcus Chen',
      credentials: 'Renewable Energy Expert',
      avatar: '⚡'
    },
    'technology': {
      name: 'Dr. Sarah Kim',
      credentials: 'Technology Ethics Expert',
      avatar: '🤖'
    },
    'journalism': {
      name: 'Jonathan Mitchell',
      credentials: 'Fact-Checking Journalist',
      avatar: '📰'
    },
    'media_studies': {
      name: 'Dr. Amara Okafor',
      credentials: 'Media Studies Expert',
      avatar: '🎓'
    }
  };

  return experts[category as keyof typeof experts] || experts['media_studies'];
} 