
import React from 'react';
import { ArrowUpRight, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreatorCardProps {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  tokenSymbol: string;
  tokenPrice: number;
  priceChange: string;
  holdersCount: number;
  description: string;
  bannerImage?: string;
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  id,
  name,
  handle,
  avatar,
  tokenSymbol,
  tokenPrice,
  priceChange,
  holdersCount,
  description,
  bannerImage
}) => {
  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] hover-scale">
      {/* Banner Image */}
      <div className="h-24 w-full relative overflow-hidden">
        <img
          src={bannerImage || '/placeholder.svg'}
          alt={`${name}'s banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
      </div>
      
      {/* Profile Info */}
      <div className="px-4 pt-4 pb-3 relative">
        <div className="flex items-start">
          <div className="h-16 w-16 rounded-full border-4 border-background overflow-hidden -mt-10 z-10">
            <img
              src={avatar || '/placeholder.svg'}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3 mt-1 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{name}</h3>
                <p className="text-sm text-gray-400">@{handle}</p>
              </div>
              
              <Button 
                size="sm" 
                className="bg-white text-black hover:bg-white/90 text-xs rounded-full px-4"
              >
                Follow
              </Button>
            </div>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-gray-300 line-clamp-2">{description}</p>
        
        {/* Token Stats */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-400 mb-1">Token</p>
            <p className="font-orbitron font-medium">${tokenSymbol}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">Price</p>
            <div className="flex items-center">
              <p className="font-medium">${tokenPrice.toFixed(2)}</p>
              <span className={`text-xs ml-2 flex items-center ${priceChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange}
                {priceChange.startsWith('+') ? 
                  <TrendingUp className="h-3 w-3 ml-1" /> : 
                  <ArrowUpRight className="h-3 w-3 ml-1 transform rotate-90" />
                }
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">Holders</p>
            <div className="flex items-center">
              <p className="font-medium">{holdersCount}</p>
              <Users className="h-3 w-3 ml-2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="px-4 py-3 bg-white/5 flex space-x-2">
        <Button 
          className="flex-1 bg-white text-black hover:bg-white/90 text-xs font-medium"
        >
          Buy Token
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 border-white/20 text-white hover:bg-white/10 text-xs font-medium"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default CreatorCard;
