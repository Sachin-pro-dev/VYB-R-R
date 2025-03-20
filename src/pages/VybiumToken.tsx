
import React from 'react';
import Layout from '@/components/Layout';
import VybiumWalletSection from '@/components/vybium/VybiumWalletSection';
import TokenStatsCard from '@/components/TokenStatsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, BarChart, Book, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VybiumToken: React.FC = () => {
  return (
    <Layout>
      <div className="pt-4">
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <img 
                  src="/lovable-uploads/e176984a-2f50-4512-862c-de219621bd47.png"
                  alt="VYBium Token" 
                  className="w-32 h-32 md:w-40 md:h-40 animate-pulse hover:rotate-12 transition-transform duration-300" 
                />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-2">
                VYBium Token (VYB)
              </h1>
              <p className="text-gray-400 mb-4 max-w-2xl">
                The native utility token of the VYB-R8R platform. Stake VYB to earn platform revenue, 
                participate in creator economies, and unlock premium features.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                <div className="bg-white/10 py-1 px-3 rounded-full flex items-center text-sm">
                  <BarChart className="h-4 w-4 mr-1 text-green-400" />
                  <span>Staking Rewards</span>
                </div>
                <div className="bg-white/10 py-1 px-3 rounded-full flex items-center text-sm">
                  <Gift className="h-4 w-4 mr-1 text-green-400" />
                  <span>Creator Token Access</span>
                </div>
                <div className="bg-white/10 py-1 px-3 rounded-full flex items-center text-sm">
                  <Book className="h-4 w-4 mr-1 text-green-400" />
                  <span>Governance Rights</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button className="bg-white text-black hover:bg-white/90">
                  Buy VYB <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/10">
                  Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="wallet" className="w-full">
              <TabsList className="glass w-full justify-start p-1 mb-6">
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="history">Transaction History</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="wallet" className="focus-visible:outline-none">
                <VybiumWalletSection />
              </TabsContent>
              
              <TabsContent value="history" className="focus-visible:outline-none">
                <div className="glass-card p-6 text-center">
                  <p className="text-gray-400">
                    Connect your wallet to view transaction history
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="rewards" className="focus-visible:outline-none">
                <div className="glass-card p-6 text-center">
                  <p className="text-gray-400">
                    Connect your wallet to view staking and liquidity rewards
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <TokenStatsCard
              tokenSymbol="VYB"
              tokenName="VYBium"
              currentPrice={2.45}
              priceChange={3.2}
              marketCap={24500000}
              volume={1250000}
              holders={3400}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VybiumToken;
