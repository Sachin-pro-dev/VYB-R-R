
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CreatorCard from '@/components/CreatorCard';
import TokenStatsCard from '@/components/TokenStatsCard';
import { Search, TrendingUp, Users, Sparkles, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const creatorData = [
  {
    id: '1',
    name: 'Mark Johnson',
    handle: 'markj',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80',
    tokenSymbol: 'MARK',
    tokenPrice: 2.54,
    priceChange: '+8.2%',
    holdersCount: 1245,
    description: 'Digital artist and NFT creator. Exploring the boundaries of art and technology.',
  },
  {
    id: '2',
    name: 'Sophia Chen',
    handle: 'sophiac',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1554147090-e1221a04a025?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80',
    tokenSymbol: 'SOPH',
    tokenPrice: 3.87,
    priceChange: '+12.5%',
    holdersCount: 2437,
    description: 'Tech influencer and blockchain educator. Building the future of decentralized communities.',
  },
  {
    id: '3',
    name: 'Alex Rivera',
    handle: 'alexr',
    avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80',
    tokenSymbol: 'ALEX',
    tokenPrice: 1.92,
    priceChange: '-2.3%',
    holdersCount: 876,
    description: 'Music producer and Web3 enthusiast. Creating immersive audio experiences on the blockchain.',
  },
  {
    id: '4',
    name: 'Jade Williams',
    handle: 'jadew',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80',
    tokenSymbol: 'JADE',
    tokenPrice: 5.12,
    priceChange: '+4.7%',
    holdersCount: 3210,
    description: 'Fashion designer and virtual clothing creator. Bridging the gap between physical and digital fashion.',
  },
];

const tokenData = {
  tokenSymbol: 'VYB',
  tokenName: 'VYB Token',
  currentPrice: 3.75,
  priceChange: 8.2,
  marketCap: 12500000,
  volume: 3400000,
  holders: 45600
};

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Layout>
      <div className="py-4">
        <div className="relative mb-6">
          <div className="glass-card p-4 flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              type="text"
              placeholder="Search creators, tokens, or hashtags..."
              className="border-none bg-transparent focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="creators">
          <div className="mb-4">
            <TabsList className="glass w-full justify-start p-1">
              <TabsTrigger value="creators" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Creators</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </TabsTrigger>
              <TabsTrigger value="tokens" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>Tokens</span>
              </TabsTrigger>
              <TabsTrigger value="nfts" className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>NFTs</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="creators" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creatorData.map((creator) => (
                <CreatorCard key={creator.id} {...creator} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            <div className="glass-card p-4 mb-6">
              <h2 className="font-orbitron font-bold text-lg mb-4">Trending Hashtags</h2>
              <div className="space-y-3">
                {['#NFTcollection', '#CreatorEconomy', '#SocialFi', '#Web3', '#VYB'].map((tag, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass rounded-lg hover-scale">
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 mr-3">
                        <span>{index + 1}</span>
                      </span>
                      <span className="font-medium">{tag}</span>
                    </div>
                    <span className="text-sm text-gray-400">{Math.floor(Math.random() * 10000)} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tokens" className="mt-0">
            <div className="mb-6">
              <TokenStatsCard {...tokenData} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creatorData.map((creator) => (
                <div key={creator.id} className="glass-card p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium">{creator.name}</h3>
                      <p className="text-xs text-gray-400">@{creator.handle}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Token Price</p>
                      <p className="font-orbitron font-bold">${creator.tokenPrice.toFixed(2)}</p>
                    </div>
                    <span className={`text-sm font-medium ${creator.priceChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {creator.priceChange}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="nfts" className="mt-0">
            <div className="glass-card p-6 text-center">
              <h2 className="font-orbitron text-xl mb-2">NFT Marketplace</h2>
              <p className="text-gray-400 mb-6">Coming soon! Explore and trade exclusive NFTs from your favorite creators.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square glass rounded-xl animate-pulse-glow overflow-hidden shimmer"></div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Explore;
