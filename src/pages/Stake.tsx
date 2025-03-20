
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, TrendingUp, Clock, Award, Lock, ArrowRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface StakingPool {
  id: string;
  name: string;
  icon: string;
  apy: number;
  totalStaked: number;
  lockPeriod: string;
  minStake: number;
  yourStake: number;
  rewards: number;
  tokenPrice: number;
}

const mockPools: StakingPool[] = [
  {
    id: '1',
    name: 'VYB Token',
    icon: '/placeholder.svg',
    apy: 12.5,
    totalStaked: 1250000,
    lockPeriod: '30 days',
    minStake: 100,
    yourStake: 0,
    rewards: 0,
    tokenPrice: 0.15
  },
  {
    id: '2',
    name: 'CryptoArtist',
    icon: '/placeholder.svg',
    apy: 18.2,
    totalStaked: 75000,
    lockPeriod: '60 days',
    minStake: 20,
    yourStake: 150,
    rewards: 4.2,
    tokenPrice: 1.2
  },
  {
    id: '3',
    name: 'MusicCreator',
    icon: '/placeholder.svg',
    apy: 15.8,
    totalStaked: 42000,
    lockPeriod: '90 days',
    minStake: 50,
    yourStake: 0,
    rewards: 0,
    tokenPrice: 0.75
  },
  {
    id: '4',
    name: 'GameDeveloper',
    icon: '/placeholder.svg',
    apy: 22.5,
    totalStaked: 28000,
    lockPeriod: '180 days',
    minStake: 10,
    yourStake: 75,
    rewards: 6.8,
    tokenPrice: 2.5
  }
];

interface RaffleEvent {
  id: string;
  name: string;
  image: string;
  endTime: string;
  participants: number;
  entryCost: number;
  prize: string;
}

const mockRaffles: RaffleEvent[] = [
  {
    id: '1',
    name: 'Exclusive NFT Drop',
    image: '/placeholder.svg',
    endTime: '23:45:12',
    participants: 348,
    entryCost: 100,
    prize: 'Limited Edition NFT + 1000 VYB'
  },
  {
    id: '2',
    name: 'Creator Meetup VIP Access',
    image: '/placeholder.svg',
    endTime: '11:23:45',
    participants: 124,
    entryCost: 250,
    prize: 'VIP Pass + Merchandise Pack'
  },
  {
    id: '3',
    name: 'Token Launch Whitelist',
    image: '/placeholder.svg',
    endTime: '47:15:32',
    participants: 782,
    entryCost: 50,
    prize: 'Guaranteed Whitelist Spot'
  }
];

const StakingPoolCard: React.FC<{ pool: StakingPool }> = ({ pool }) => {
  const [stakeAmount, setStakeAmount] = useState<number>(pool.minStake);
  const [isStaking, setIsStaking] = useState<boolean>(false);
  
  const handleStakeChange = (value: number[]) => {
    setStakeAmount(value[0]);
  };
  
  const handleStake = () => {
    setIsStaking(true);
    
    // Simulate staking process
    setTimeout(() => {
      toast.success(`Successfully staked ${stakeAmount} ${pool.name} tokens`);
      setIsStaking(false);
    }, 1500);
  };
  
  const handleClaim = () => {
    if (pool.rewards > 0) {
      toast.success(`Claimed ${pool.rewards} ${pool.name} tokens`);
    } else {
      toast.error('No rewards available to claim');
    }
  };
  
  const projectedRewards = (stakeAmount * pool.apy / 100).toFixed(2);
  
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-white/10">
              <img src={pool.icon} alt={pool.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="font-orbitron font-medium">{pool.name}</h3>
              <div className="flex items-center text-sm text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>{pool.apy}% APY</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-400">Price</div>
            <div className="font-medium">${pool.tokenPrice}</div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Min. Stake: {pool.minStake} tokens</span>
          <span className="text-gray-400">Lock: {pool.lockPeriod}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Total Pool</span>
            <span>{pool.totalStaked.toLocaleString()} tokens</span>
          </div>
          <Progress value={75} className="h-2 glass" />
        </div>
        
        {pool.yourStake > 0 ? (
          <div className="glass bg-white/5 p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Your Stake</span>
              <span className="font-medium">{pool.yourStake} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Pending Rewards</span>
              <span className="font-medium text-green-400">{pool.rewards} tokens</span>
            </div>
            <Button 
              onClick={handleClaim}
              className="w-full mt-4 bg-white text-black hover:bg-white/90"
              disabled={pool.rewards <= 0}
            >
              Claim Rewards
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Stake Amount</span>
                <span>{stakeAmount} tokens</span>
              </div>
              <Slider 
                defaultValue={[pool.minStake]} 
                min={pool.minStake} 
                max={1000} 
                step={10} 
                onValueChange={handleStakeChange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Projected Rewards (Annual)</span>
                <span className="text-green-400">{projectedRewards} tokens</span>
              </div>
            </div>
            
            <Button 
              onClick={handleStake}
              className="w-full bg-white text-black hover:bg-white/90"
              disabled={isStaking}
            >
              {isStaking ? 'Staking...' : 'Stake Tokens'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const RaffleCard: React.FC<{ raffle: RaffleEvent }> = ({ raffle }) => {
  const [isEntering, setIsEntering] = useState(false);
  
  const handleEnterRaffle = () => {
    setIsEntering(true);
    
    // Simulate raffle entry
    setTimeout(() => {
      toast.success(`You've entered the "${raffle.name}" raffle!`);
      setIsEntering(false);
    }, 1500);
  };
  
  return (
    <div className="glass-card overflow-hidden group hover-scale">
      <div className="h-40 relative">
        <img src={raffle.image} alt={raffle.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-orbitron text-lg font-medium">{raffle.name}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>Ends in: {raffle.endTime}</span>
          </div>
          <div className="flex items-center text-sm">
            <Award className="h-4 w-4 mr-2 text-gray-400" />
            <span>{raffle.participants} entries</span>
          </div>
        </div>
        
        <div className="glass bg-white/5 p-3 rounded-lg mb-4">
          <p className="text-sm font-medium">{raffle.prize}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Entry Cost</p>
            <p className="font-orbitron font-medium">{raffle.entryCost} VYB</p>
          </div>
          
          <Button 
            onClick={handleEnterRaffle}
            className="bg-white text-black hover:bg-white/90"
            disabled={isEntering}
          >
            {isEntering ? 'Entering...' : 'Enter Raffle'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Stake: React.FC = () => {
  return (
    <Layout>
      <div className="py-4">
        <div className="glass-card p-6 mb-6">
          <h1 className="text-2xl font-orbitron font-bold mb-2 text-glow">Staking & Raffles</h1>
          <p className="text-gray-400">Stake tokens to earn rewards and participate in exclusive raffles</p>
        </div>
        
        <Tabs defaultValue="staking">
          <div className="mb-6">
            <TabsList className="glass w-full justify-start p-1">
              <TabsTrigger value="staking" className="flex items-center gap-1">
                <Coins className="h-4 w-4" />
                <span>Staking</span>
              </TabsTrigger>
              <TabsTrigger value="raffles" className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>Raffles</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Rewards</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="staking" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-4 mb-6 lg:col-span-2">
                <div className="flex flex-wrap md:flex-nowrap gap-3 justify-between">
                  <div className="glass bg-white/5 p-4 rounded-lg flex-1">
                    <p className="text-sm text-gray-400">Total Value Staked</p>
                    <p className="font-orbitron text-2xl font-bold text-glow">$1,245,382</p>
                  </div>
                  <div className="glass bg-white/5 p-4 rounded-lg flex-1">
                    <p className="text-sm text-gray-400">Your Total Staked</p>
                    <p className="font-orbitron text-2xl font-bold text-glow">$340</p>
                  </div>
                  <div className="glass bg-white/5 p-4 rounded-lg flex-1">
                    <p className="text-sm text-gray-400">Available Rewards</p>
                    <p className="font-orbitron text-2xl font-bold text-green-400">$11.34</p>
                  </div>
                </div>
              </div>
              
              {mockPools.map(pool => (
                <StakingPoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="raffles" className="mt-0">
            <div className="glass-card p-4 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="font-orbitron font-medium text-lg mb-1">Active Raffles</h3>
                  <p className="text-sm text-gray-400">Enter raffles with your VYB tokens for a chance to win exclusive prizes</p>
                </div>
                <Button className="mt-3 md:mt-0">
                  VYB Balance: 450 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRaffles.map(raffle => (
                <RaffleCard key={raffle.id} raffle={raffle} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rewards" className="mt-0">
            <div className="glass-card p-6 text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <Lock className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-orbitron mb-2">Start Staking to Earn Rewards</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Stake your tokens to earn passive income and gain access to exclusive platform benefits.
                </p>
                <Button className="bg-white text-black hover:bg-white/90">
                  Explore Staking Options
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Stake;
