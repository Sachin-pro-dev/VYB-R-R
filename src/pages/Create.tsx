
import React from 'react';
import Layout from '@/components/Layout';
import CreatePostForm from '@/components/CreatePostForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Video, Music, Calendar, Sparkles } from 'lucide-react';

const Create: React.FC = () => {
  return (
    <Layout>
      <div className="py-4">
        <div className="glass-card p-6 mb-6">
          <h1 className="text-2xl font-orbitron font-bold mb-2 text-glow">Create Content</h1>
          <p className="text-gray-400">Share content with your community and engage with your fans</p>
        </div>
        
        <Tabs defaultValue="post">
          <div className="mb-4">
            <TabsList className="glass w-full justify-start p-1">
              <TabsTrigger value="post" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Post</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span>Video</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-1">
                <Music className="h-4 w-4" />
                <span>Audio</span>
              </TabsTrigger>
              <TabsTrigger value="event" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Event</span>
              </TabsTrigger>
              <TabsTrigger value="nft" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>NFT</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="post" className="mt-0">
            <CreatePostForm />
          </TabsContent>
          
          <TabsContent value="video" className="mt-0">
            <div className="glass-card p-6 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <Video className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-orbitron mb-2">Upload Video</h3>
                <p className="text-gray-400 mb-4 max-w-md">
                  Share exclusive video content with your token holders. Supports mp4, mov, and webm formats.
                </p>
                <button className="glass-button py-3 px-8 rounded-lg text-white font-medium hover:bg-white/10 mt-2">
                  Select Video
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="mt-0">
            <div className="glass-card p-6 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <Music className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-orbitron mb-2">Upload Audio</h3>
                <p className="text-gray-400 mb-4 max-w-md">
                  Share music, podcasts, or exclusive audio content with your community. Supports mp3, wav, and ogg formats.
                </p>
                <button className="glass-button py-3 px-8 rounded-lg text-white font-medium hover:bg-white/10 mt-2">
                  Select Audio
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="event" className="mt-0">
            <div className="glass-card p-6 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-orbitron mb-2">Create Event</h3>
                <p className="text-gray-400 mb-4 max-w-md">
                  Schedule live streams, AMAs, or token-gated virtual events for your community.
                </p>
                <button className="glass-button py-3 px-8 rounded-lg text-white font-medium hover:bg-white/10 mt-2">
                  Schedule Event
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="nft" className="mt-0">
            <div className="glass-card p-6 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <Sparkles className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-orbitron mb-2">Mint NFT</h3>
                <p className="text-gray-400 mb-4 max-w-md">
                  Create and sell exclusive NFTs directly to your community. Set rarity, price, and special perks.
                </p>
                <button className="glass-button py-3 px-8 rounded-lg text-white font-medium hover:bg-white/10 mt-2">
                  Create NFT
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Create;
