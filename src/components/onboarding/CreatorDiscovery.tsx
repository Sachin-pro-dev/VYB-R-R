
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, Search, X } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  tokenSymbol: string;
  tokenPrice: number;
  followers: number;
}

interface CreatorDiscoveryProps {
  selectedInterests: string[];
  onCreatorsFollowed: (creatorIds: string[]) => void;
}

// Mock creators data with Indian names
const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Vikram Singh',
    handle: 'vikrammusic',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    category: 'music',
    tokenSymbol: 'VIKR',
    tokenPrice: 1.92,
    followers: 1248
  },
  {
    id: '2',
    name: 'Meera Patel',
    handle: 'meeratech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    category: 'tech',
    tokenSymbol: 'MEER',
    tokenPrice: 3.45,
    followers: 8765
  },
  {
    id: '3',
    name: 'Aryan Joshi',
    handle: 'aryancrypto',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    category: 'art',
    tokenSymbol: 'ARYJ',
    tokenPrice: 2.15,
    followers: 3457
  },
  {
    id: '4',
    name: 'Neha Verma',
    handle: 'nehadev',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    category: 'gaming',
    tokenSymbol: 'NEHA',
    tokenPrice: 1.05,
    followers: 5678
  },
  {
    id: '5',
    name: 'Rahul Gupta',
    handle: 'rahulfinance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    category: 'finance',
    tokenSymbol: 'RGPT',
    tokenPrice: 4.30,
    followers: 12564
  },
  {
    id: '6',
    name: 'Anjali Desai',
    handle: 'anjalidesigns',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    category: 'fashion',
    tokenSymbol: 'ADES',
    tokenPrice: 2.75,
    followers: 7823
  },
];

const CreatorDiscovery: React.FC<CreatorDiscoveryProps> = ({ selectedInterests, onCreatorsFollowed }) => {
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  
  useEffect(() => {
    // Filter creators based on selected interests and search term
    let creators = mockCreators;
    
    if (selectedInterests.length > 0) {
      creators = creators.filter(creator => 
        selectedInterests.includes(creator.category)
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      creators = creators.filter(creator => 
        creator.name.toLowerCase().includes(term) || 
        creator.handle.toLowerCase().includes(term)
      );
    }
    
    setFilteredCreators(creators);
  }, [selectedInterests, searchTerm]);
  
  const toggleFollow = (creatorId: string) => {
    if (followedCreators.includes(creatorId)) {
      setFollowedCreators(followedCreators.filter(id => id !== creatorId));
    } else {
      setFollowedCreators([...followedCreators, creatorId]);
    }
  };
  
  const handleContinue = () => {
    if (followedCreators.length > 0) {
      onCreatorsFollowed(followedCreators);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-orbitron font-bold mb-3">Discover Creators</h2>
      <p className="text-gray-400 mb-6">
        Follow creators based on your interests to personalize your feed
      </p>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search creators..."
          className="w-full glass px-10 py-3 rounded-lg border border-white/10 focus:border-white/30 focus:outline-none bg-black/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="mb-6">
        {followedCreators.length > 0 && (
          <div className="flex items-center mb-4">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">
              Following {followedCreators.length} creators
            </span>
          </div>
        )}
        
        <div className="grid gap-3">
          {filteredCreators.map(creator => {
            const isFollowing = followedCreators.includes(creator.id);
            
            return (
              <div 
                key={creator.id}
                className="flex items-center justify-between p-4 glass border border-white/10 rounded-xl hover:border-white/20 transition-all"
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={creator.avatar} 
                      alt={creator.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{creator.name}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>@{creator.handle}</span>
                      <span className="mx-2">•</span>
                      <span>${creator.tokenSymbol}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant={isFollowing ? "default" : "outline"}
                  size="sm"
                  className={isFollowing 
                    ? "bg-white text-black hover:bg-white/90" 
                    : "border-white/20 hover:bg-white/10"
                  }
                  onClick={() => toggleFollow(creator.id)}
                >
                  {isFollowing ? (
                    <span className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Following
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Follow
                    </span>
                  )}
                </Button>
              </div>
            );
          })}
          
          {filteredCreators.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No creators found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
      
      <Button 
        className="w-full bg-white text-black hover:bg-white/90 py-6"
        onClick={handleContinue}
        disabled={followedCreators.length === 0}
      >
        Continue with {followedCreators.length} {followedCreators.length === 1 ? 'Creator' : 'Creators'}
      </Button>
    </div>
  );
};

export default CreatorDiscovery;
