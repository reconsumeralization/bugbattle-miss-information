import React, { useState, useEffect } from 'react';

interface Leader {
  id: number;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  accuracy: number;
  badge: string;
  rank: number;
  country: string;
}

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [category, setCategory] = useState('all');
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Generate mock leaderboard data with Miss Information theme
    const mockLeaders = [
      {
        id: 1,
        name: 'Truth Seeker Alpha',
        avatar: '🏮',
        score: 2847,
        streak: 23,
        accuracy: 94,
        badge: 'Lantern Master',
        rank: 1,
        country: 'United States'
      },
      {
        id: 2,
        name: 'Deception Hunter',
        avatar: '🔍',
        score: 2654,
        streak: 18,
        accuracy: 91,
        badge: 'Truth Guardian',
        rank: 2,
        country: 'Canada'
      },
      {
        id: 3,
        name: 'Fact Warrior',
        avatar: '⚔️',
        score: 2398,
        streak: 15,
        accuracy: 89,
        badge: 'Light Bearer',
        rank: 3,
        country: 'United Kingdom'
      },
      {
        id: 4,
        name: 'Myth Buster Pro',
        avatar: '💎',
        score: 2156,
        streak: 12,
        accuracy: 87,
        badge: 'Evidence Keeper',
        rank: 4,
        country: 'Australia'
      },
      {
        id: 5,
        name: 'Oracle Apprentice',
        avatar: '🔮',
        score: 1987,
        streak: 9,
        accuracy: 85,
        badge: 'Truth Student',
        rank: 5,
        country: 'Germany'
      }
    ];
    setLeaders(mockLeaders);
  }, [timeframe, category]);

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
        
        {/* Floating achievement symbols */}
        <div className="absolute top-20 left-20 text-yellow-500/20 text-2xl animate-pulse">🏆</div>
        <div className="absolute top-40 right-32 text-yellow-500/15 text-2xl animate-pulse">👑</div>
        <div className="absolute bottom-32 left-32 text-yellow-500/25 text-2xl animate-pulse">🥇</div>
        <div className="absolute bottom-20 right-20 text-yellow-500/20 text-2xl animate-pulse">⭐</div>
        
        {/* Lurking eyes watching the champions */}
        <div className="absolute top-32 left-16 w-2 h-2 bg-red-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-60 right-24 w-2 h-2 bg-red-500 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 left-24 w-2 h-2 bg-red-500 rounded-full opacity-35 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-red-900/30 border border-red-800/50 rounded-full text-sm text-yellow-300 mb-6 backdrop-blur-sm">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse shadow-lg shadow-yellow-500/50"></span>
            HALL OF TRUTH CHAMPIONS
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <div className="text-yellow-300 drop-shadow-2xl tracking-wider" style={{ 
              textShadow: '0 0 20px rgba(253, 224, 71, 0.5)' 
            }}>
              THE LANTERN BEARERS
            </div>
          </h1>
          <p className="text-gray-300 text-lg">Those who illuminate the path to truth for all</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex gap-3">
            <span className="text-yellow-300 font-bold tracking-wider">TIME:</span>
            {['weekly', 'monthly', 'all-time'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg font-medium tracking-wide transition-all duration-300 ${
                  timeframe === period
                    ? 'bg-gradient-to-r from-red-700 to-red-600 text-yellow-300 border border-red-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:text-yellow-300 border border-gray-600 hover:border-red-600/50'
                }`}
              >
                {period.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <span className="text-yellow-300 font-bold tracking-wider">QUEST:</span>
            {['all', 'detection', 'verification', 'analysis'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium tracking-wide transition-all duration-300 ${
                  category === cat
                    ? 'bg-gradient-to-r from-red-700 to-red-600 text-yellow-300 border border-red-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:text-yellow-300 border border-gray-600 hover:border-red-600/50'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-600/40 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-yellow-500/50 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-yellow-500/50 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-yellow-500/50 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-yellow-500/50 rounded-br-3xl"></div>
          
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-500/5 via-transparent to-transparent"></div>
          
          <div className="relative">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {leaders.slice(0, 3).map((leader, index) => {
                const positions = [
                  { order: 1, bg: 'from-yellow-600 to-yellow-800', crown: '👑', glow: 'shadow-yellow-500/50' },
                  { order: 0, bg: 'from-gray-400 to-gray-600', crown: '🥈', glow: 'shadow-gray-500/50' },
                  { order: 2, bg: 'from-orange-600 to-orange-800', crown: '🥉', glow: 'shadow-orange-500/50' }
                ];
                const pos = positions[index];
                
                return (
                  <div 
                    key={leader.id} 
                    className={`order-${pos.order} group relative bg-gradient-to-br ${pos.bg} rounded-2xl p-6 text-center overflow-hidden shadow-lg ${pos.glow} transform hover:-translate-y-2 transition-all duration-300`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative">
                      <div className="text-6xl mb-4">{pos.crown}</div>
                      <div className="text-4xl mb-3">{leader.avatar}</div>
                      <h3 className="font-bold text-xl text-white mb-2 tracking-wider">{leader.name}</h3>
                      <div className="text-2xl font-bold text-white mb-2">{leader.score.toLocaleString()}</div>
                      <div className="text-sm text-white/80 mb-3">{leader.badge}</div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-white/60">STREAK</div>
                          <div className="text-white font-bold">{leader.streak}</div>
                        </div>
                        <div>
                          <div className="text-white/60">ACCURACY</div>
                          <div className="text-white font-bold">{leader.accuracy}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Rankings */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-yellow-300 text-center mb-6 tracking-wider">COMPLETE RANKINGS</h3>
              
              {leaders.map((leader, index) => (
                <div key={leader.id} className="group bg-gray-800/50 border border-gray-600 rounded-2xl p-6 hover:border-red-600/50 transition-all duration-300">
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${
                      leader.rank === 1 ? 'bg-gradient-to-br from-yellow-600 to-yellow-800 text-white' :
                      leader.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white' :
                      leader.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white' :
                      'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300'
                    }`}>
                      #{leader.rank}
                    </div>

                    {/* Avatar */}
                    <div className="text-4xl">{leader.avatar}</div>

                    {/* Name and Badge */}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                        {leader.name}
                      </h4>
                      <div className="text-gray-400 text-sm">{leader.badge}</div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="text-2xl font-bold text-yellow-300">{leader.score.toLocaleString()}</div>
                        <div className="text-gray-400 text-xs tracking-wide">TRUTH POINTS</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-400">{leader.streak}</div>
                        <div className="text-gray-400 text-xs tracking-wide">STREAK</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">{leader.accuracy}%</div>
                        <div className="text-gray-400 text-xs tracking-wide">ACCURACY</div>
                      </div>
                    </div>

                    {/* Country Flag/Badge */}
                    <div className="text-right">
                      <div className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 border border-gray-600">
                        {leader.country}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Challenge Section */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 border border-red-600/50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-yellow-300 mb-4 tracking-wider">JOIN THE QUEST</h3>
                <p className="text-gray-300 mb-6">Light your lantern and ascend the ranks of truth champions</p>
                
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-red-500/50 tracking-wider">
                  <span className="mr-3 text-2xl">🏮</span>
                  BEGIN YOUR JOURNEY
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 