
import React from 'react';
import { Sparkles } from 'lucide-react';

interface VybiumBalanceCardProps {
  balance: string;
  isLoading: boolean;
}

const VybiumBalanceCard: React.FC<VybiumBalanceCardProps> = ({ 
  balance, 
  isLoading 
}) => {
  return (
    <div className="relative overflow-hidden">
      <div className="flex flex-col items-center text-center py-6">
        <div className="relative mb-4">
          <img 
            src="/lovable-uploads/e176984a-2f50-4512-862c-de219621bd47.png"
            alt="VYBium Token" 
            className="w-20 h-20 animate-pulse hover:rotate-12 transition-transform duration-300" 
          />
          <span className="absolute -top-1 -right-1">
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </span>
        </div>
        
        <h4 className="text-md font-medium text-gray-400 mb-1">Your Balance</h4>
        
        {isLoading ? (
          <div className="h-10 w-40 glass animate-pulse rounded-lg"></div>
        ) : (
          <div className="flex items-baseline">
            <span className="text-3xl font-orbitron font-bold">{Number(balance).toFixed(4)}</span>
            <span className="ml-2 text-xl font-orbitron text-yellow-500">VYB</span>
          </div>
        )}
        
        <p className="text-sm text-gray-400 mt-2">
          VYBium is the native utility token for the VYB-R8R platform
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="glass p-3 rounded-lg text-center">
          <p className="text-xs text-gray-400 mb-1">Token Address</p>
          <p className="text-sm font-medium truncate">0x123...789a</p>
        </div>
        <div className="glass p-3 rounded-lg text-center">
          <p className="text-xs text-gray-400 mb-1">Network</p>
          <p className="text-sm font-medium">Ethereum</p>
        </div>
      </div>
    </div>
  );
};

export default VybiumBalanceCard;
