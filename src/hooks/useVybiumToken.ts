
import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { VYBIUM_TOKEN_ABI, VYBIUM_TOKEN_ADDRESS } from '../contracts/VybiumToken';

export const useVybiumToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Format token amount with proper decimals
  const formatTokenAmount = useCallback((amount: ethers.BigNumber): string => {
    return ethers.utils.formatUnits(amount, 18); // Assuming 18 decimals, adjust if different
  }, []);

  // Parse token amount from user input to BigNumber
  const parseTokenAmount = useCallback((amount: string): ethers.BigNumber => {
    return ethers.utils.parseUnits(amount, 18); // Assuming 18 decimals, adjust if different
  }, []);

  // Get contract instance for read operations
  const getReadContract = useCallback(() => {
    if (!publicClient) return null;
    const provider = new ethers.providers.JsonRpcProvider(publicClient.chain.rpcUrls.default.http[0]);
    return new ethers.Contract(VYBIUM_TOKEN_ADDRESS, VYBIUM_TOKEN_ABI, provider);
  }, [publicClient]);

  // Get contract instance for write operations
  const getWriteContract = useCallback(async () => {
    if (!walletClient) return null;
    
    // Convert walletClient to ethers signer
    const provider = new ethers.providers.JsonRpcProvider(walletClient.chain.rpcUrls.default.http[0]);
    const walletAddress = walletClient.account.address;
    
    // Create a ethers wallet using the walletClient's connection info
    const signer = provider.getSigner(walletAddress);
    return new ethers.Contract(VYBIUM_TOKEN_ADDRESS, VYBIUM_TOKEN_ABI, signer);
  }, [walletClient]);

  // Get balance of current user
  const getBalance = useCallback(async (): Promise<string> => {
    if (!address) return '0';
    
    try {
      setIsLoading(true);
      const contract = getReadContract();
      
      if (!contract) {
        throw new Error("Contract not available");
      }
      
      const balanceResult = await contract.balanceOf(address);
      const formattedBalance = formatTokenAmount(balanceResult);
      setBalance(formattedBalance);
      return formattedBalance;
    } catch (error) {
      console.error('Error fetching VYBium balance:', error);
      toast.error('Failed to fetch VYBium balance');
      return '0';
    } finally {
      setIsLoading(false);
    }
  }, [address, getReadContract, formatTokenAmount]);

  // Transfer tokens to another address
  const transferTokens = useCallback(async (
    recipientAddress: string,
    amount: string
  ): Promise<boolean> => {
    if (!address || !walletClient) {
      toast.error('Wallet not connected or contract not available');
      return false;
    }
    
    try {
      setIsLoading(true);
      const contract = await getWriteContract();
      
      if (!contract) {
        throw new Error("Contract not available");
      }
      
      const parsedAmount = parseTokenAmount(amount);
      
      // Check if user has enough balance
      const currentBalance = await contract.balanceOf(address);
      if (currentBalance.lt(parsedAmount)) {
        toast.error('Insufficient VYBium balance for this transfer');
        return false;
      }
      
      const tx = await contract.transfer(recipientAddress, parsedAmount);
      toast.info('Transaction submitted! Waiting for confirmation...');
      
      await tx.wait();
      toast.success('VYBium tokens transferred successfully!');
      
      // Refresh balance after transfer
      await getBalance();
      return true;
    } catch (error) {
      console.error('Error transferring VYBium tokens:', error);
      toast.error('Failed to transfer VYBium tokens');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient, getWriteContract, parseTokenAmount, getBalance]);

  // Add liquidity to the pool
  const addLiquidity = useCallback(async (
    tokenAmount: string,
    stablecoinAmount: string
  ): Promise<boolean> => {
    if (!address || !walletClient) {
      toast.error('Wallet not connected or contract not available');
      return false;
    }
    
    try {
      setIsLoading(true);
      const contract = await getWriteContract();
      
      if (!contract) {
        throw new Error("Contract not available");
      }
      
      const parsedTokenAmount = parseTokenAmount(tokenAmount);
      const parsedStablecoinAmount = parseTokenAmount(stablecoinAmount);
      
      // Check if user has enough token balance
      const currentBalance = await contract.balanceOf(address);
      if (currentBalance.lt(parsedTokenAmount)) {
        toast.error('Insufficient VYBium balance for adding liquidity');
        return false;
      }
      
      const tx = await contract.addLiquidity(parsedTokenAmount, parsedStablecoinAmount);
      toast.info('Adding liquidity. Transaction submitted!');
      
      await tx.wait();
      toast.success('Liquidity added successfully!');
      
      // Refresh balance after operation
      await getBalance();
      return true;
    } catch (error) {
      console.error('Error adding liquidity:', error);
      toast.error('Failed to add liquidity');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient, getWriteContract, parseTokenAmount, getBalance]);

  return {
    balance,
    isLoading,
    getBalance,
    transferTokens,
    addLiquidity,
    formatTokenAmount,
    parseTokenAmount
  };
};
