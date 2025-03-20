
import React from 'react';
import { ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TokenStatsProps {
  tokenSymbol: string;
  tokenName: string;
  currentPrice: number;
  priceChange: number;
  marketCap: number;
  volume: number;
  holders: number;
}

const TokenStatsCard: React.FC<TokenStatsProps> = ({
  tokenSymbol,
  tokenName,
  currentPrice,
  priceChange,
  marketCap,
  volume,
  holders
}) => {
  // Format large numbers with K, M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const isPriceUp = priceChange >= 0;
  
  return (
    <div className="glass-card p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center">
            <span className="inline-block h-8 w-8 rounded-full bg-white/10 mr-3 flex items-center justify-center">
              <span className="text-xs font-bold">{tokenSymbol.charAt(0)}</span>
            </span>
            <div>
              <h3 className="font-orbitron font-bold text-lg">${tokenSymbol}</h3>
              <p className="text-sm text-gray-400">{tokenName}</p>
            </div>
          </div>
        </div>
        <div className="flex">
          <Sparkles className="h-5 w-5 text-yellow-400" />
        </div>
      </div>
      
      <div className="mb-5">
        <div className="flex items-end">
          <h2 className="text-3xl font-bold font-orbitron">${currentPrice.toFixed(2)}</h2>
          <div className={`flex items-center ml-3 ${isPriceUp ? 'text-green-400' : 'text-red-400'}`}>
            {isPriceUp ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">{Math.abs(priceChange).toFixed(2)}%</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">Past 24 hours</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center glass p-3 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Market Cap</p>
          <p className="font-medium">${formatNumber(marketCap)}</p>
        </div>
        <div className="text-center glass p-3 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Volume</p>
          <p className="font-medium">${formatNumber(volume)}</p>
        </div>
        <div className="text-center glass p-3 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Holders</p>
          <p className="font-medium">{formatNumber(holders)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-white text-black hover:bg-white/90 font-medium">
          Buy
        </Button>
        <Button variant="outline" className="border-white/20 hover:bg-white/10 font-medium">
          Stake
        </Button>
      </div>
    </div>
  );
};

export default TokenStatsCard;
