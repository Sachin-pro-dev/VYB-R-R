
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import PostCard, { PostData } from '@/components/PostCard';
import CreatePostForm from '@/components/CreatePostForm';
import { Button } from '@/components/ui/button';
import { Gift, Trophy, ArrowRight, X } from 'lucide-react';
import { useAccount } from 'wagmi';
import { postService } from '@/services/api';
import useAuthStore from '@/store/useAuthStore';

// Example posts to display when API is not available
const EXAMPLE_POSTS: PostData[] = [
  {
    id: '1',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    username: 'Arjun Sharma',
    handle: 'arjunblockchain',
    time: '2 hours ago',
    content: 'Just launched my new NFT collection! Check it out 🚀 #NFTartist #cryptoart',
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=800&q=80',
    likes: 42,
    comments: 12,
    shares: 5,
    reposts: 2,
    isTokenGated: false
  },
  {
    id: '2',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    username: 'Priya Mehta',
    handle: 'priyatech',
    time: '1 day ago',
    content: 'Enjoying the sunny day in my garden! Web3 is exciting but we all need to disconnect sometimes 🌱🌿',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80',
    likes: 124,
    comments: 34,
    shares: 15,
    reposts: 8,
    isTokenGated: false
  },
  {
    id: '3',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    username: 'Raj Kapoor',
    handle: 'rajkrypto',
    time: '3 days ago',
    content: 'Last night\'s Web3 party was incredible! Met so many brilliant minds in the crypto space. Building in the bear market is where the real innovation happens. Working on something special for my token holders. Stay tuned! 🔒',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    comments: 23,
    shares: 7,
    reposts: 4,
    isTokenGated: true
  },
  {
    id: '4',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80',
    username: 'Ananya Desai',
    handle: 'ananyaartist',
    time: '5 days ago',
    content: 'My latest flower photography series explores the relationship between nature and technology. What do you think? 🌸📸',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80',
    likes: 156,
    comments: 42,
    shares: 18,
    reposts: 12,
    isTokenGated: false
  }
];

const Index: React.FC = () => {
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { isOnboarded, connectWallet } = useAuthStore();
  
  // Fetch posts from API
  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const response = await postService.getFeed();
      return response.data;
    },
    enabled: isConnected && isOnboarded,
    retry: false
  });
  
  // Initialize showWelcomeBanner based on onboarding status
  useEffect(() => {
    if (isOnboarded) {
      setShowWelcomeBanner(false);
    }
  }, [isOnboarded]);
  
  // Connect wallet when address is available
  useEffect(() => {
    if (isConnected && address && !isOnboarded) {
      // Just connect the wallet but don't auto-navigate
      connectWallet(address);
    }
  }, [isConnected, address, isOnboarded, connectWallet]);
  
  const handleStartOnboarding = () => {
    console.log('Navigating to onboarding from Index');
    navigate('/onboarding');
  };
  
  return (
    <Layout>
      <div className="pt-4">
        {!isOnboarded && showWelcomeBanner && (
          <div className="glass-card mb-6 p-4 border border-blue-500/20 relative">
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setShowWelcomeBanner(false)}
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <Trophy className="h-16 w-16 text-yellow-400" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-orbitron font-bold mb-2">Welcome to VYB-R8R!</h2>
                <p className="text-gray-300 mb-4">
                  Get started by completing the onboarding process to earn your first rewards and learn how to use the platform.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="bg-white/10 py-1 px-3 rounded-full flex items-center text-sm">
                    <Gift className="h-4 w-4 mr-1 text-green-400" />
                    <span>50 VYB Welcome Bonus</span>
                  </div>
                  <div className="bg-white/10 py-1 px-3 rounded-full flex items-center text-sm">
                    <Gift className="h-4 w-4 mr-1 text-green-400" />
                    <span>Soulbound Identity NFT</span>
                  </div>
                  <div className="bg-white/10 py-1 px-3 rounded-full flex items-center text-sm">
                    <Gift className="h-4 w-4 mr-1 text-green-400" />
                    <span>Exclusive Creator Access</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleStartOnboarding}
                  className="bg-white text-black hover:bg-white/90"
                >
                  Start Onboarding <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <CreatePostForm />
        
        {isLoading ? (
          <div className="glass-card p-4 text-center">
            <p>Loading posts...</p>
          </div>
        ) : error || !postsData ? (
          // When API fails or no data, show example posts
          <>
            <div className="glass-card p-4 mb-4 text-center bg-blue-500/10 border border-blue-500/20">
              <p>Showing example content. Connect your wallet and complete onboarding to see real posts.</p>
            </div>
            {EXAMPLE_POSTS.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        ) : postsData && postsData.posts && postsData.posts.length > 0 ? (
          postsData.posts.map((post: any) => (
            <PostCard 
              key={post.id} 
              post={{
                id: post.id,
                avatar: post.author.avatar || '/placeholder.svg',
                username: post.author.username || 'User',
                handle: post.author.handle || 'user',
                time: new Date(post.createdAt).toLocaleDateString(),
                content: post.content,
                image: post.image,
                likes: post.likes,
                comments: post.comments,
                shares: post.shares,
                reposts: post.reposts,
                isTokenGated: post.isTokenGated
              }} 
            />
          ))
        ) : (
          // When API returns empty array, show example posts
          <>
            <div className="glass-card p-4 mb-4 text-center bg-blue-500/10 border border-blue-500/20">
              <p>No posts found. Here are some examples:</p>
            </div>
            {EXAMPLE_POSTS.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
