import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, UserPlus, Gift, Compass, Star, Trophy, CalendarCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import WalletConnectSection from '@/components/onboarding/WalletConnectSection';
import InterestSelection from '@/components/onboarding/InterestSelection';
import CreatorDiscovery from '@/components/onboarding/CreatorDiscovery';
import TutorialSection from '@/components/onboarding/TutorialSection';
import { toast } from 'sonner';

const steps = [
  { id: 'connect', title: 'Connect Wallet', icon: Wallet },
  { id: 'interests', title: 'Select Interests', icon: Compass },
  { id: 'creators', title: 'Discover Creators', icon: Star },
  { id: 'tutorial', title: 'Learn & Earn', icon: Gift },
  { id: 'complete', title: 'Get Started', icon: Trophy },
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  // Skip the wallet connect step if the wallet is already connected
  useEffect(() => {
    if (isConnected && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [isConnected, currentStep]);

  // This effect handles navigation after onboarding is completed
  useEffect(() => {
    if (onboardingComplete) {
      // Store onboarding completion status in localStorage
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Wait for toast to show before redirecting
      const timer = setTimeout(() => {
        console.log('Navigating to home after onboarding completion');
        navigate('/', { state: { onboardingCompleted: true }, replace: true });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [onboardingComplete, navigate]);

  const handleWalletConnected = (address: string) => {
    toast.success('Wallet connected successfully!');
    toast.success('You received a Soulbound Token (SBT) as your digital identity!');
    toast.success('Airdrop: 50 VYB tokens added to your wallet!');
    goToNextStep();
  };

  const handleInterestsSelected = (interests: string[]) => {
    setSelectedInterests(interests);
    toast.success(`${interests.length} interests selected!`);
    goToNextStep();
  };

  const handleCreatorsFollowed = (creators: string[]) => {
    setFollowedCreators(creators);
    toast.success(`You're now following ${creators.length} creators!`);
    goToNextStep();
  };

  const handleTutorialCompleted = () => {
    setTutorialComplete(true);
    toast.success('Tutorial completed! You earned 100 VYB tokens!');
    goToNextStep();
  };

  const handleOnboardingComplete = () => {
    toast.success('Onboarding complete! Welcome to VYB-R8R!');
    setOnboardingComplete(true);
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / (steps.length - 1)) * 100;
  };

  // If user somehow returns to onboarding after completing it, redirect to home
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted') === 'true';
    if (hasCompletedOnboarding) {
      console.log('User already completed onboarding, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="py-6">
        <div className="glass-card p-6 mb-6">
          <h1 className="text-2xl font-orbitron font-bold mb-2 text-glow">Welcome to VYB-R8R</h1>
          <p className="text-gray-400">Let's get you started with the future of creator economy</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">Onboarding Progress</p>
            <p className="text-sm font-bold">{Math.round(getProgressPercentage())}%</p>
          </div>
          <Progress value={getProgressPercentage()} className="h-2 glass" />
        </div>

        <div className="glass-card p-6 mb-6 relative">
          <div className="flex justify-between mb-8 overflow-x-auto py-2 scrollbar-hide">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex flex-col items-center mx-2 ${
                  index < currentStep 
                    ? 'text-green-400' 
                    : index === currentStep 
                    ? 'text-white' 
                    : 'text-gray-500'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep 
                    ? 'bg-green-400/20 border border-green-400' 
                    : index === currentStep 
                    ? 'bg-white/10 border border-white' 
                    : 'bg-gray-800 border border-gray-700'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{step.title}</span>
              </div>
            ))}
          </div>

          {currentStep === 0 && (
            <WalletConnectSection onWalletConnected={handleWalletConnected} />
          )}

          {currentStep === 1 && (
            <InterestSelection onInterestsSelected={handleInterestsSelected} />
          )}

          {currentStep === 2 && (
            <CreatorDiscovery 
              selectedInterests={selectedInterests}
              onCreatorsFollowed={handleCreatorsFollowed} 
            />
          )}

          {currentStep === 3 && (
            <TutorialSection onTutorialCompleted={handleTutorialCompleted} />
          )}

          {currentStep === 4 && (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-orbitron font-bold mb-4">You're All Set!</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                You've completed the onboarding process and received your first tokens.
                Start exploring the platform, engage with creators, and earn more rewards!
              </p>
              
              <div className="glass bg-white/5 p-6 rounded-xl mb-6 max-w-md mx-auto">
                <h3 className="font-orbitron text-lg mb-4">Your Rewards</h3>
                <div className="flex justify-between mb-2">
                  <span>Welcome Airdrop:</span>
                  <span className="font-bold text-green-400">50 VYB</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tutorial Completion:</span>
                  <span className="font-bold text-green-400">100 VYB</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>First Follows:</span>
                  <span className="font-bold text-green-400">25 VYB</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-green-400">175 VYB</span>
                </div>
              </div>
              
              <Button 
                className="bg-white text-black hover:bg-white/90 text-lg py-6 px-8"
                onClick={handleOnboardingComplete}
              >
                Start Exploring VYB-R8R
              </Button>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                className="border-white/20 hover:bg-white/10"
                onClick={goToPreviousStep}
              >
                Back
              </Button>
            )}
            {currentStep > 0 && currentStep < 4 && (
              <Button 
                className="bg-white text-black hover:bg-white/90 ml-auto"
                onClick={goToNextStep}
              >
                Skip
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;

