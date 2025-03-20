
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Gift, Heart, MessageSquare, Share2, Repeat2, ArrowRight, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import PostCard, { PostData } from '@/components/PostCard';

interface TutorialSectionProps {
  onTutorialCompleted: () => void;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action: string;
  reward: number;
  completed: boolean;
}

// Mock post for the tutorial
const tutorialPost: PostData = {
  id: 'tutorial',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80',
  username: 'VYB Guide',
  handle: 'vybguide',
  time: 'Just now',
  content: 'Welcome to VYB-R8R! This is an example post to help you learn how to interact with content on the platform. Try out the different actions below to earn your first rewards.',
  likes: 42,
  comments: 7,
  shares: 3,
  reposts: 8,
};

const TutorialSection: React.FC<TutorialSectionProps> = ({ onTutorialCompleted }) => {
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([
    {
      id: 'like',
      title: 'Like a Post',
      description: 'Click the heart icon on a post to show your appreciation.',
      action: 'Like the example post',
      reward: 10,
      completed: false
    },
    {
      id: 'comment',
      title: 'Leave a Comment',
      description: 'Engage with creators by leaving comments on their posts.',
      action: 'Click the comment icon',
      reward: 15,
      completed: false
    },
    {
      id: 'share',
      title: 'Share Content',
      description: 'Share posts with your followers or on other platforms.',
      action: 'Click the share icon',
      reward: 20,
      completed: false
    },
    {
      id: 'repost',
      title: 'Repost Content',
      description: 'Repost content to your followers while giving credit to the original creator.',
      action: 'Click the repost icon',
      reward: 25,
      completed: false
    },
    {
      id: 'follow',
      title: 'Support Creators',
      description: 'Follow creators and consider buying their tokens to support them.',
      action: 'Learn about creator tokens',
      reward: 30,
      completed: false
    }
  ]);
  
  const completeTutorialStep = (stepId: string) => {
    setTutorialSteps(steps => 
      steps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };
  
  const calculateProgress = () => {
    const completedSteps = tutorialSteps.filter(step => step.completed).length;
    return (completedSteps / tutorialSteps.length) * 100;
  };
  
  const totalEarned = tutorialSteps
    .filter(step => step.completed)
    .reduce((sum, step) => sum + step.reward, 0);
  
  const allCompleted = tutorialSteps.every(step => step.completed);
  
  const handlePostAction = (action: string) => {
    if (action === 'like') completeTutorialStep('like');
    if (action === 'comment') completeTutorialStep('comment');
    if (action === 'share') completeTutorialStep('share');
    if (action === 'repost') completeTutorialStep('repost');
  };
  
  const handleLearnTokens = () => {
    completeTutorialStep('follow');
  };
  
  const handleFinishTutorial = () => {
    onTutorialCompleted();
  };
  
  // Custom PostCard with action tracking for the tutorial
  const TutorialPostCard = () => {
    const [isLiked, setIsLiked] = useState(false);
    
    const handleLike = () => {
      setIsLiked(!isLiked);
      handlePostAction('like');
    };
    
    return (
      <div className="glass-card p-4 mb-4">
        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
            <img 
              src={tutorialPost.avatar} 
              alt={tutorialPost.username} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium">{tutorialPost.username}</h3>
              <span className="text-gray-400 text-sm ml-2">@{tutorialPost.handle}</span>
              <span className="text-gray-400 text-xs ml-2">•</span>
              <span className="text-gray-400 text-xs ml-2">{tutorialPost.time}</span>
            </div>
            <p className="my-2">{tutorialPost.content}</p>
            
            <div className="flex justify-between mt-4">
              <button 
                className={`flex items-center text-sm ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                onClick={handleLike}
              >
                <Heart className="h-4 w-4 mr-1" />
                <span>{isLiked ? tutorialPost.likes + 1 : tutorialPost.likes}</span>
              </button>
              <button 
                className="flex items-center text-sm text-gray-400 hover:text-white"
                onClick={() => handlePostAction('comment')}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{tutorialPost.comments}</span>
              </button>
              <button 
                className="flex items-center text-sm text-gray-400 hover:text-white"
                onClick={() => handlePostAction('repost')}
              >
                <Repeat2 className="h-4 w-4 mr-1" />
                <span>{tutorialPost.reposts}</span>
              </button>
              <button 
                className="flex items-center text-sm text-gray-400 hover:text-white"
                onClick={() => handlePostAction('share')}
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span>{tutorialPost.shares}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="text-2xl font-orbitron font-bold mb-3">Learn & Earn</h2>
      <p className="text-gray-400 mb-6">
        Complete these quick tasks to learn how VYB-R8R works and earn your first rewards
      </p>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-400">Tutorial Progress</p>
          <p className="text-sm font-bold">{Math.round(calculateProgress())}%</p>
        </div>
        <Progress value={calculateProgress()} className="h-2 glass" />
      </div>
      
      <div className="glass bg-white/5 p-4 rounded-lg flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Gift className="h-5 w-5 text-yellow-400 mr-3" />
          <span>VYB Earned:</span>
        </div>
        <span className="font-orbitron font-bold text-xl text-yellow-400">{totalEarned}</span>
      </div>
      
      <TutorialPostCard />
      
      <div className="glass-card p-4 mb-6">
        <h3 className="font-medium mb-4">Tutorial Tasks</h3>
        
        <div className="space-y-4">
          {tutorialSteps.map(step => (
            <div 
              key={step.id}
              className={`glass border ${
                step.completed 
                  ? 'border-green-500/30 bg-green-500/10' 
                  : 'border-white/10 bg-white/5'
              } p-3 rounded-lg flex justify-between items-center transition-all`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  step.completed 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-white/10 text-white'
                }`}>
                  {step.completed ? <Check className="h-4 w-4" /> : <span>{tutorialSteps.findIndex(s => s.id === step.id) + 1}</span>}
                </div>
                <div>
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-xs text-gray-400">{step.action}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-yellow-500/20 text-yellow-400 text-xs py-1 px-2 rounded-full flex items-center mr-2">
                  <Gift className="h-3 w-3 mr-1" />
                  <span>{step.reward}</span>
                </div>
                {step.id === 'follow' && !step.completed && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-xs"
                    onClick={handleLearnTokens}
                  >
                    Learn <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {allCompleted && (
        <Button 
          className="w-full bg-white text-black hover:bg-white/90 py-6"
          onClick={handleFinishTutorial}
        >
          <Star className="h-5 w-5 mr-2 text-yellow-400" />
          Complete Tutorial & Claim 100 VYB
        </Button>
      )}
    </div>
  );
};

export default TutorialSection;
