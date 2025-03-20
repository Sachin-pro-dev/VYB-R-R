
import React from 'react';
import { Flame, Trophy, Sparkles } from 'lucide-react';

const RightSidebar: React.FC = () => {
  // Sample trending data
  const trendingCreators = [
    { id: 1, name: 'CryptoArtist', tokenSymbol: 'CART', change: '+12.4%' },
    { id: 2, name: 'MusicDAO', tokenSymbol: 'MDAO', change: '+8.7%' },
    { id: 3, name: 'TechInfluencer', tokenSymbol: 'TECH', change: '+5.2%' },
    { id: 4, name: 'GamersUnite', tokenSymbol: 'GAME', change: '-2.1%' },
  ];

  // Sample upcoming events
  const upcomingEvents = [
    { id: 1, title: 'NFT Drop: Cyber Collection', time: '2h 30m', creator: 'CryptoArtist' },
    { id: 2, title: 'Live AMA Session', time: '1d 4h', creator: 'TechInfluencer' },
    { id: 3, title: 'Token Staking Event', time: '3d', creator: 'VYB-R8R Team' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto glass-card py-4 px-4 m-2">
      {/* Trending Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Flame className="w-4 h-4 mr-2 text-white" />
          <h2 className="font-orbitron text-lg font-semibold">Trending Tokens</h2>
        </div>
        
        <div className="space-y-3">
          {trendingCreators.map((creator) => (
            <div key={creator.id} className="glass p-3 rounded-lg hover-scale">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{creator.name}</p>
                  <p className="text-xs text-gray-400">${creator.tokenSymbol}</p>
                </div>
                <span className={`text-sm font-medium ${creator.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {creator.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Trophy className="w-4 h-4 mr-2 text-white" />
          <h2 className="font-orbitron text-lg font-semibold">Top Creators</h2>
        </div>
        
        <div className="glass-card p-3 rounded-lg">
          <div className="space-y-4">
            {[1, 2, 3].map((position) => (
              <div key={position} className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 mr-3">
                  <span className="text-xs font-semibold">{position}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-800 mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Creator {position}</p>
                  <p className="text-xs text-gray-400">15.{position}K Holders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center mb-4">
          <Sparkles className="w-4 h-4 mr-2 text-white" />
          <h2 className="font-orbitron text-lg font-semibold">Events</h2>
        </div>
        
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="glass p-3 rounded-lg hover-scale">
              <p className="text-sm font-medium">{event.title}</p>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-400">by {event.creator}</p>
                <p className="text-xs font-medium text-white/80">In {event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
