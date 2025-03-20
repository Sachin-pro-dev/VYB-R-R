
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccount } from 'wagmi';

interface WalletConnectSectionProps {
  onWalletConnected: (address: string) => void;
}

const WalletConnectSection: React.FC<WalletConnectSectionProps> = ({ onWalletConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { address, isConnected } = useAccount();
  const [hasTriggeredCallback, setHasTriggeredCallback] = useState(false);
  
  // Only trigger the callback when the wallet is connected AND the user clicks continue
  useEffect(() => {
    if (isConnected && address && !hasTriggeredCallback) {
      // Just update the UI to show the connected state, but don't auto-trigger the callback
      console.log('Wallet is connected, waiting for user to click continue');
    }
  }, [isConnected, address, hasTriggeredCallback, onWalletConnected]);
  
  const handleContinue = () => {
    if (isConnected && address) {
      console.log('User clicked continue, triggering callback');
      setHasTriggeredCallback(true);
      onWalletConnected(address);
    }
  };
  
  const handleWalletConnect = (walletType: string) => {
    setIsConnecting(true);
    
    // Simulate wallet connection if not already connected
    if (!isConnected) {
      setTimeout(() => {
        const mockAddress = '0x' + Math.random().toString(16).substring(2, 14) + '...';
        setIsConnecting(false);
        // Just update UI, don't auto-trigger callback
      }, 1500);
    } else {
      setIsConnecting(false);
    }
  };
  
  // If wallet is already connected, show connected state
  if (isConnected && address) {
    return (
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-orbitron font-bold mb-3">Wallet Connected</h2>
        <p className="text-gray-400 mb-6">
          Your wallet ({address.substring(0, 6)}...{address.substring(address.length - 4)}) is connected
        </p>
        <Button
          className="bg-white text-black hover:bg-white/90"
          onClick={handleContinue}
        >
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-orbitron font-bold mb-3">Connect Your Wallet</h2>
      <p className="text-gray-400 mb-6">
        Connect your Web3 wallet to create your on-chain identity and receive your welcome airdrop
      </p>
      
      <Tabs defaultValue="wallet" className="mb-8">
        <TabsList className="glass w-full justify-center p-1 mb-6">
          <TabsTrigger value="wallet" className="flex items-center gap-1">
            <Wallet className="h-4 w-4" />
            <span>Web3 Wallet</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Social Login</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallet" className="mt-0">
          <div className="grid gap-4">
            <Button 
              className="glass-button flex items-center justify-between py-6"
              onClick={() => handleWalletConnect('MetaMask')}
              disabled={isConnecting}
            >
              <div className="flex items-center">
                <span className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white mr-3">
                  M
                </span>
                <span className="font-medium">MetaMask</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
            
            <Button 
              className="glass-button flex items-center justify-between py-6"
              onClick={() => handleWalletConnect('WalletConnect')}
              disabled={isConnecting}
            >
              <div className="flex items-center">
                <span className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                  W
                </span>
                <span className="font-medium">WalletConnect</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
            
            <Button 
              className="glass-button flex items-center justify-between py-6"
              onClick={() => handleWalletConnect('Coinbase')}
              disabled={isConnecting}
            >
              <div className="flex items-center">
                <span className="h-8 w-8 bg-blue-400 rounded-full flex items-center justify-center text-white mr-3">
                  C
                </span>
                <span className="font-medium">Coinbase Wallet</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
          
          <div className="glass-card bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mt-6">
            <h3 className="text-sm font-medium mb-2 text-blue-400">Why connect a wallet?</h3>
            <p className="text-sm text-gray-300">
              By connecting your wallet, you'll receive an on-chain Soulbound Token (SBT) that serves as your digital identity on VYB-R8R. This allows you to earn, hold, and trade creator tokens and NFTs securely.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="mt-0">
          <div className="grid gap-4">
            <Button 
              className="glass-button flex items-center justify-between py-6"
              onClick={() => handleWalletConnect('Google')}
              disabled={isConnecting}
            >
              <div className="flex items-center">
                <span className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-black mr-3">
                  G
                </span>
                <span className="font-medium">Google</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
            
            <Button 
              className="glass-button flex items-center justify-between py-6"
              onClick={() => handleWalletConnect('Twitter')}
              disabled={isConnecting}
            >
              <div className="flex items-center">
                <span className="h-8 w-8 bg-blue-400 rounded-full flex items-center justify-center text-white mr-3">
                  T
                </span>
                <span className="font-medium">Twitter</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
            
            <Button 
              className="glass-button flex items-center justify-between py-6"
              onClick={() => handleWalletConnect('Discord')}
              disabled={isConnecting}
            >
              <div className="flex items-center">
                <span className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-3">
                  D
                </span>
                <span className="font-medium">Discord</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
          
          <div className="glass-card bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg mt-6">
            <h3 className="text-sm font-medium mb-2 text-purple-400">Social Login + Wallet</h3>
            <p className="text-sm text-gray-300">
              We'll create a secure wallet for you behind the scenes when you sign in with your social account. This gives you the best of both worlds - easy login and full Web3 capabilities.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletConnectSection;
