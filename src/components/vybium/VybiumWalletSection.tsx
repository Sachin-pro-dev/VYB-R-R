
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Wallet, ArrowRight, BarChart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVybiumToken } from '@/hooks/useVybiumToken';
import VybiumTransferForm from './VybiumTransferForm';
import VybiumLiquidityForm from './VybiumLiquidityForm';
import VybiumBalanceCard from './VybiumBalanceCard';
import { toast } from 'sonner';

const VybiumWalletSection: React.FC = () => {
  const { isConnected } = useAccount();
  const { balance, isLoading, getBalance } = useVybiumToken();
  const [activeTab, setActiveTab] = useState('balance');

  useEffect(() => {
    if (isConnected) {
      getBalance();
    }
  }, [isConnected, getBalance]);

  const handleRefreshBalance = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    await getBalance();
    toast.success('Balance refreshed');
  };

  if (!isConnected) {
    return (
      <div className="glass-card p-6 text-center">
        <img 
          src="/lovable-uploads/e176984a-2f50-4512-862c-de219621bd47.png" 
          alt="VYBium Token" 
          className="w-24 h-24 mx-auto mb-4 hover:rotate-12 transition-all duration-300" 
        />
        <h3 className="text-xl font-orbitron font-bold mb-2">VYBium Wallet</h3>
        <p className="text-gray-400 mb-4">
          Connect your wallet to manage your VYBium tokens, transfer funds, and add liquidity.
        </p>
        <Button className="bg-white text-black hover:bg-white/90">
          Connect Wallet <Wallet className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-orbitron font-bold">VYBium Wallet</h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleRefreshBalance}
          disabled={isLoading}
          className="hover:bg-white/10"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass w-full justify-center p-1 mb-4">
          <TabsTrigger value="balance" className="flex items-center gap-1">
            <Wallet className="h-4 w-4" />
            <span>Balance</span>
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-1">
            <ArrowRight className="h-4 w-4" />
            <span>Send VYB</span>
          </TabsTrigger>
          <TabsTrigger value="liquidity" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Liquidity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="focus-visible:outline-none">
          <VybiumBalanceCard balance={balance} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="transfer" className="focus-visible:outline-none">
          <VybiumTransferForm />
        </TabsContent>

        <TabsContent value="liquidity" className="focus-visible:outline-none">
          <VybiumLiquidityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VybiumWalletSection;
