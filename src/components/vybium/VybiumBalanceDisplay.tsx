
import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useVybiumToken } from '@/hooks/useVybiumToken';

const VybiumBalanceDisplay: React.FC = () => {
  const { isConnected } = useAccount();
  const { balance, getBalance, isLoading } = useVybiumToken();

  useEffect(() => {
    if (isConnected) {
      getBalance();
    }
  }, [isConnected, getBalance]);

  if (!isConnected) return null;

  return (
    <div className="flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
      <img 
        src="/lovable-uploads/e176984a-2f50-4512-862c-de219621bd47.png"
        alt="VYB" 
        className="h-5 w-5 mr-2 hover:rotate-12 transition-transform duration-300" 
      />
      {isLoading ? (
        <div className="h-4 w-12 bg-white/20 animate-pulse rounded"></div>
      ) : (
        <span className="text-sm font-medium">{Number(balance).toFixed(2)} VYB</span>
      )}
    </div>
  );
};

export default VybiumBalanceDisplay;
