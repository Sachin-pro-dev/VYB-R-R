
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  completed: boolean;
}

const mockMissions: Mission[] = [
  {
    id: 'onboarding',
    title: 'Complete Onboarding',
    description: 'Go through the platform introduction process',
    reward: 100,
    progress: 100,
    completed: true
  },
  {
    id: 'follow',
    title: 'Follow 3 Creators',
    description: 'Follow creators that interest you',
    reward: 50,
    progress: 100,
    completed: true
  },
  {
    id: 'post',
    title: 'Make Your First Post',
    description: 'Create and share your first content',
    reward: 75,
    progress: 0,
    completed: false
  },
  {
    id: 'token',
    title: 'Buy Creator Tokens',
    description: 'Invest in your first creator token',
    reward: 150,
    progress: 0,
    completed: false
  },
  {
    id: 'refer',
    title: 'Invite Friends',
    description: 'Refer 3 friends to join VYB-R8R',
    reward: 200,
    progress: 33,
    completed: false
  }
];

const MissionTracker: React.FC = () => {
  const navigate = useNavigate();
  
  const completedMissions = mockMissions.filter(mission => mission.completed).length;
  const totalMissions = mockMissions.length;
  const overallProgress = (completedMissions / totalMissions) * 100;
  
  const handleContinueMission = (missionId: string) => {
    if (missionId === 'onboarding') {
      navigate('/onboarding');
    } else if (missionId === 'post') {
      navigate('/create');
    } else if (missionId === 'token') {
      navigate('/marketplace');
    }
  };
  
  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-orbitron text-lg font-bold">Onboarding Missions</h2>
        <div className="flex items-center">
          <Trophy className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="text-sm">{completedMissions}/{totalMissions} Completed</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Overall Progress</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <Progress value={overallProgress} className="h-2 glass" />
      </div>
      
      <div className="space-y-4">
        {mockMissions.map(mission => (
          <div 
            key={mission.id}
            className={`glass border ${
              mission.completed 
                ? 'border-green-500/30 bg-green-500/10' 
                : 'border-white/10 hover:border-white/30'
            } p-3 rounded-lg transition-all`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center">
                {mission.completed && (
                  <Star className="h-4 w-4 text-green-400 mr-1" />
                )}
                {mission.title}
              </h3>
              <div className="bg-yellow-500/20 text-yellow-400 text-xs py-1 px-2 rounded-full flex items-center">
                <Gift className="h-3 w-3 mr-1" />
                <span>{mission.reward}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mb-2">{mission.description}</p>
            
            {!mission.completed && (
              <>
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{Math.round(mission.progress)}%</span>
                </div>
                <Progress value={mission.progress} className="h-1.5 glass mb-3" />
              </>
            )}
            
            {!mission.completed && (
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs border-white/20 hover:bg-white/10"
                onClick={() => handleContinueMission(mission.id)}
              >
                Continue <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionTracker;
