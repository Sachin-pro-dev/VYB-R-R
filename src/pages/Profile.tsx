import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PostCard, { PostData } from '@/components/PostCard';
import TokenStatsCard from '@/components/TokenStatsCard';
import MissionTracker from '@/components/MissionTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, Settings, Users, FileText, Sparkles, Lock, Share2, Trophy } from 'lucide-react';

const userProfile = {
  name: 'Alex Rivera',
  handle: 'alexr',
  bio: 'Music producer and Web3 enthusiast. Creating immersive audio experiences on the blockchain.',
  avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80',
  banner: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80',
  followers: 1248,
  following: 342,
  tokenHolders: 876,
};

const tokenData = {
  tokenSymbol: 'ALEX',
  tokenName: 'Alex Creator Token',
  currentPrice: 1.92,
  priceChange: -2.3,
  marketCap: 1680000,
  volume: 340000,
  holders: 876
};

const userPosts: PostData[] = [
  {
    id: '1',
    avatar: userProfile.avatar,
    username: userProfile.name,
    handle: userProfile.handle,
    time: '2h ago',
    content: 'Just launched my Creator DAO! My token holders now have voting rights on my future content. Web3 is revolutionizing how creators interact with their communities.',
    likes: 256,
    comments: 42,
    shares: 20,
    reposts: 35,
  },
  {
    id: '2',
    avatar: userProfile.avatar,
    username: userProfile.name,
    handle: userProfile.handle,
    time: '1d ago',
    content: 'Working on a new immersive audio experience that will be exclusive to my token holders. Stay tuned for the drop next week!',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80',
    likes: 178,
    comments: 23,
    shares: 11,
    reposts: 15,
  },
  {
    id: '3',
    avatar: userProfile.avatar,
    username: userProfile.name,
    handle: userProfile.handle,
    time: '2d ago',
    content: 'The future of creator monetization is here with VYB-R8R. Instead of relying on ad revenue and platforms that take huge cuts, creators can directly engage with their most dedicated fans.',
    likes: 142,
    comments: 18,
    shares: 9,
    reposts: 12,
  },
];

const tokenHolderPosts: PostData[] = [
  {
    id: '4',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80',
    username: 'Mark Johnson',
    handle: 'markj',
    time: '5h ago',
    content: 'Proud to be a holder of $ALEX tokens! The community calls we get access to are incredibly insightful.',
    likes: 58,
    comments: 4,
    shares: 2,
    reposts: 3,
  },
  {
    id: '5',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80',
    username: 'Sophia Chen',
    handle: 'sophiac',
    time: '1d ago',
    content: 'Just staked my $ALEX tokens for the exclusive upcoming NFT drop. The tokenomics of this creator economy are brilliant!',
    likes: 72,
    comments: 8,
    shares: 5,
    reposts: 7,
  },
];

const mockedNFTs = [
  { id: 1, name: 'Sonic Wavelength #42', image: 'https://images.unsplash.com/photo-1525857597365-5d6949fa03ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Beat Maker Pass', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Studio Session #3', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Harmony Collection', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80' },
];

const Profile: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  
  return (
    <Layout>
      <div className="pb-4">
        <div className="relative mb-20">
          <div className="h-48 w-full overflow-hidden rounded-t-xl">
            <img
              src={userProfile.banner}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
          </div>
          
          <div className="absolute -bottom-16 left-6 flex items-end">
            <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="ml-4 mb-2">
              <h1 className="text-2xl font-bold">{userProfile.name}</h1>
              <p className="text-gray-400">@{userProfile.handle}</p>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button size="icon" variant="ghost" className="bg-black/40 backdrop-blur-sm hover:bg-black/60">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="bg-black/40 backdrop-blur-sm hover:bg-black/60">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="default" className="bg-white text-black hover:bg-white/90 text-xs">
              <Edit className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          </div>
        </div>
        
        <div className="glass-card p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">Posts</p>
              <p className="font-bold">{userPosts.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Followers</p>
              <p className="font-bold">{userProfile.followers.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Token Holders</p>
              <p className="font-bold">{userProfile.tokenHolders.toLocaleString()}</p>
            </div>
          </div>
          
          <p className="mb-4">{userProfile.bio}</p>
          
          <div className="flex justify-between">
            <Button 
              variant={isFollowing ? "outline" : "default"}
              className={isFollowing 
                ? "border-white/20 hover:bg-white/10" 
                : "bg-white text-black hover:bg-white/90"
              }
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            
            <Button variant="outline" className="border-white/20 hover:bg-white/10">
              Buy $ALEX
            </Button>
          </div>
        </div>
        
        <MissionTracker />
        
        <div className="mb-6">
          <TokenStatsCard {...tokenData} />
        </div>
        
        <Tabs defaultValue="posts">
          <TabsList className="glass w-full justify-start p-1">
            <TabsTrigger value="posts" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="token-holders" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Token Holders</span>
            </TabsTrigger>
            <TabsTrigger value="nfts" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>NFTs</span>
            </TabsTrigger>
            <TabsTrigger value="exclusive" className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              <span>Exclusive</span>
            </TabsTrigger>
            <TabsTrigger value="poaps" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>POAPs</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-4">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>
          
          <TabsContent value="token-holders" className="mt-4">
            <div className="glass-card p-4 mb-4">
              <h3 className="font-orbitron font-bold mb-3">Token Holder Discussions</h3>
              <p className="text-sm text-gray-400 mb-4">
                Join the conversation with other $ALEX token holders.
              </p>
              
              {tokenHolderPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="nfts" className="mt-4">
            <div className="glass-card p-4 mb-4">
              <h3 className="font-orbitron font-bold mb-3">Creator NFT Collection</h3>
              <p className="text-sm text-gray-400 mb-4">
                Exclusive digital collectibles from Alex Rivera.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {mockedNFTs.map((nft) => (
                  <div key={nft.id} className="glass p-2 rounded-xl overflow-hidden hover-scale">
                    <div className="aspect-square rounded-lg overflow-hidden mb-2">
                      <img 
                        src={nft.image} 
                        alt={nft.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium truncate">{nft.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="exclusive" className="mt-4">
            <div className="glass-card p-6 text-center">
              <Lock className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="font-orbitron text-xl mb-2">Token-Gated Content</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                This exclusive content is only available to $ALEX token holders. Purchase tokens to gain access.
              </p>
              <Button className="bg-white text-black hover:bg-white/90">
                Buy $ALEX Tokens
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="poaps" className="mt-4">
            <div className="glass-card p-4 mb-4">
              <h3 className="font-orbitron font-bold mb-3">Proof of Attendance (POAPs)</h3>
              <p className="text-sm text-gray-400 mb-4">
                Collect POAPs by attending events and engaging with VYB-R8R
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="glass p-3 rounded-xl overflow-hidden hover-scale text-center">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-purple-500/20 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-purple-400" />
                  </div>
                  <p className="text-sm font-medium">Early Adopter</p>
                  <p className="text-xs text-gray-400">May 2023</p>
                </div>
                
                <div className="glass p-3 rounded-xl overflow-hidden hover-scale text-center">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-green-500/20 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-green-400" />
                  </div>
                  <p className="text-sm font-medium">VYB Launch Event</p>
                  <p className="text-xs text-gray-400">June 2023</p>
                </div>
                
                <div className="glass p-3 rounded-xl overflow-hidden hover-scale text-center opacity-50">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gray-500/20 flex items-center justify-center">
                    <Lock className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Creator Summit</p>
                  <p className="text-xs text-gray-400">Not Collected</p>
                </div>
                
                <div className="glass p-3 rounded-xl overflow-hidden hover-scale text-center opacity-50">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gray-500/20 flex items-center justify-center">
                    <Lock className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Staking Reward</p>
                  <p className="text-xs text-gray-400">Not Collected</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
