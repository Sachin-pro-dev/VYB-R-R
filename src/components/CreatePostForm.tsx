
import React, { useState } from 'react';
import { Image, Lock, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';
import { postService } from '@/services/api';
import useAuthStore from '@/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

const CreatePostForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate file upload
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };
  
  const removeImage = () => {
    setSelectedImage(null);
  };
  
  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage) {
      toast.error('Please add some content to your post');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await postService.createPost({
        content,
        image: selectedImage || undefined,
        isTokenGated
      });
      
      // Reset form
      setContent('');
      setSelectedImage(null);
      setIsTokenGated(false);
      
      // Invalidate feed query to refresh posts
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10 border border-white/20">
          <img src={user?.avatar || "/placeholder.svg"} alt="Your avatar" />
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            placeholder="What's on your mind?"
            className="border-none bg-transparent focus-visible:ring-0 resize-none h-24 p-0 placeholder:text-gray-500"
            value={content}
            onChange={handleContentChange}
          />
          
          {selectedImage && (
            <div className="relative mt-3 mb-2">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="max-h-64 object-contain w-full"
                />
              </div>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 border border-white/20"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {isUploading && (
            <div className="mt-3 mb-2 py-8 rounded-lg glass flex items-center justify-center">
              <div className="animate-pulse">Uploading...</div>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex space-x-3">
              <label className="cursor-pointer hover:text-white text-gray-400 flex items-center gap-1">
                <Image className="h-5 w-5" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className={`flex items-center gap-1 ${isTokenGated ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setIsTokenGated(!isTokenGated)}
                    >
                      <Lock className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="glass border-white/10">
                    <div className="text-xs">
                      {isTokenGated 
                        ? 'This post will only be visible to your token holders' 
                        : 'Make this post exclusive to your token holders'}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {isTokenGated && (
                <div className="flex items-center text-xs text-white space-x-1">
                  <Info className="h-3 w-3" />
                  <span>Token-gated</span>
                </div>
              )}
            </div>
            
            <Button 
              size="sm" 
              onClick={handleSubmit}
              disabled={(!content.trim() && !selectedImage) || isUploading || isSubmitting}
              className={`bg-white text-black hover:bg-white/90 ${(!content.trim() && !selectedImage) || isUploading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;
