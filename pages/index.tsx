import React, { useState } from 'react';
import type { NextPage } from 'next';
import MissInformationGame from '../components/MissInformationGame';
import NewsFeed from '../components/NewsFeed';
import PlayerStats from '../components/PlayerStats';
import Leaderboard from '../components/Leaderboard';
import EnhancedRealTimeDashboard from '../components/EnhancedRealTimeDashboard';

type TabType = 'game' | 'dashboard' | 'stats' | 'leaderboard' | 'news';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
  desc: string;
}

interface TruthPath {
  text: string;
  glow: string;
}

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('game');

  const tabs: TabConfig[] = [
    { id: 'game', label: 'THE MISSION', icon: '🏮', desc: 'Illuminate Truth' },
    { id: 'dashboard', label: 'SURVEILLANCE', icon: '🔍', desc: 'Monitor Deception' },
    { id: 'stats', label: 'PROGRESS', icon: '📜', desc: 'Track Journey' },
    { id: 'leaderboard', label: 'CHAMPIONS', icon: '👑', desc: 'Truth Seekers' },
    { id: 'news', label: 'INTEL FEED', icon: '📰', desc: 'Latest Reports' }
  ];

  const truthPaths: TruthPath[] = [
    { text: 'VERIFIED', glow: 'shadow-green-500/50' },
    { text: 'FACT-CHECKED', glow: 'shadow-blue-500/50' },
    { text: 'TRUSTED SOURCES', glow: 'shadow-yellow-500/50' },
    { text: 'EVIDENCE-BASED', glow: 'shadow-purple-500/50' }
  ];

  const truthKeepers: string[] = [
    'VERIFIED SOURCES', 
    'FACT CHECKERS', 
    'EVIDENCE GUARDIANS', 
    'TRUTH SEEKERS', 
    'LIGHT BEARERS'
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dark Forest Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 bg-repeat opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='53' cy='53' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        {/* Lurking eyes in the background */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-red-500 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-red-500 rounded-full opacity-30 animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50">
                <span className="text-yellow-300 font-bold text-lg">🏮</span>
              </div>
              <div>
                <span className="text-yellow-300 font-bold text-xl tracking-wider">MISS INFORMATION</span>
                <div className="text-xs text-gray-400 tracking-wide">WHEN TRUTH IS YOUR GUIDE</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-yellow-300 transition-colors font-medium tracking-wide">TRUTH PATH</a>
              <a href="#" className="text-gray-300 hover:text-yellow-300 transition-colors font-medium tracking-wide">EVIDENCE</a>
              <a href="#" className="text-gray-300 hover:text-yellow-300 transition-colors font-medium tracking-wide">VERIFIED</a>
              <a href="#" className="text-gray-300 hover:text-yellow-300 transition-colors font-medium tracking-wide">CONTACT</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-gray-900 to-black"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            {/* Misinformation lurking words */}
            <div className="absolute top-10 left-10 text-gray-700 text-sm opacity-40 transform rotate-12">FAKE NEWS</div>
            <div className="absolute top-20 right-20 text-gray-700 text-sm opacity-30 transform -rotate-12">BIAS</div>
            <div className="absolute bottom-20 left-20 text-gray-700 text-sm opacity-35 transform rotate-6">HOAX</div>
            <div className="absolute bottom-10 right-10 text-gray-700 text-sm opacity-25 transform -rotate-6">MISLEADING</div>
            
            <div className="inline-flex items-center px-6 py-3 bg-red-900/30 border border-red-800/50 rounded-full text-sm text-yellow-300 mb-8 backdrop-blur-sm">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse shadow-lg shadow-yellow-500/50"></span>
              DECEPTION CAN'T HIDE
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <div className="text-yellow-300 drop-shadow-2xl mb-4 tracking-wider" style={{ 
                textShadow: '0 0 20px rgba(253, 224, 71, 0.5), 0 0 40px rgba(253, 224, 71, 0.3)' 
              }}>
                MISS INFORMATION
              </div>
              <div className="text-lg md:text-xl text-gray-300 font-medium tracking-wider">
                WHEN TRUTH IS YOUR GUIDE, DECEPTION CAN'T HIDE
              </div>
            </h1>
            
            {/* Lantern-inspired central element */}
            <div className="relative inline-block mb-12">
              <div className="w-24 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg shadow-2xl animate-pulse" style={{
                  boxShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.4)'
                }}></div>
                <div className="absolute inset-2 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded opacity-80"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-800 rounded-t-lg"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-gray-700 rounded-b-lg"></div>
              </div>
            </div>
            
            {/* Truth Path */}
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {truthPaths.map((item, index) => (
                  <div key={index} className={`px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 border border-yellow-600/30 rounded-lg text-yellow-300 font-bold tracking-wider shadow-lg ${item.glow} transform hover:scale-105 transition-all duration-300`}>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setActiveTab('game')}
              className="group inline-flex items-center px-12 py-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500/50 tracking-wider"
              style={{
                boxShadow: '0 0 30px rgba(220, 38, 38, 0.5), 0 10px 20px rgba(0, 0, 0, 0.5)'
              }}
            >
              <span className="mr-3 text-2xl">🏮</span>
              LIGHT THE PATH TO TRUTH
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Redesigned as Truth Paths */}
      <div className="py-16 bg-gradient-to-b from-black/50 to-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-yellow-300 mb-4 tracking-wider">CHOOSE YOUR PATH</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative p-8 rounded-2xl transition-all duration-500 transform hover:-translate-y-3 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-yellow-300 shadow-2xl scale-105 border border-yellow-500/50'
                    : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 hover:text-yellow-300 border border-gray-700 hover:border-red-600/50'
                }`}
                style={{
                  boxShadow: activeTab === tab.id 
                    ? '0 0 30px rgba(220, 38, 38, 0.4), 0 20px 40px rgba(0, 0, 0, 0.3)'
                    : '0 10px 20px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {tab.icon}
                  </div>
                  <div className="font-bold text-lg tracking-wider mb-2">{tab.label}</div>
                  <div className="text-sm opacity-75">{tab.desc}</div>
                </div>
                
                {activeTab === tab.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900 to-black opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          {activeTab === 'game' && <MissInformationGame />}
          {activeTab === 'dashboard' && <EnhancedRealTimeDashboard />}
          {activeTab === 'stats' && <PlayerStats />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'news' && <NewsFeed />}
        </div>
      </div>

      {/* Footer - Truth Keepers */}
      <div className="py-16 bg-black border-t border-red-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-yellow-300 mb-8 tracking-wider">TRUTH KEEPERS ALLIANCE</h3>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {truthKeepers.map((keeper, index) => (
                <div key={index} className="text-gray-400 font-semibold tracking-wide hover:text-yellow-300 transition-colors cursor-pointer">
                  {keeper}
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <div className="text-yellow-300 font-bold mb-2 tracking-wider">WHEN TRUTH IS YOUR GUIDE</div>
              <div className="text-gray-400 text-sm">DECEPTION CAN'T HIDE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 