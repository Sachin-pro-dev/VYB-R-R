
import { create } from 'zustand';
import { authService, userService } from '../services/api';

interface User {
  id: string;
  walletAddress: string;
  username?: string;
  handle?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  followers: number;
  following: number;
  tokenHolders: number;
  isCreator: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  isOnboarded: boolean;
  
  connectWallet: (walletAddress: string) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  checkOnboardingStatus: (walletAddress: string) => Promise<boolean>;
  completeOnboarding: (userData: any) => Promise<boolean>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  user: null,
  isOnboarded: localStorage.getItem('onboardingCompleted') === 'true',
  
  connectWallet: async (walletAddress: string) => {
    set({ isLoading: true });
    
    const { data, error } = await authService.walletAuth(walletAddress);
    
    if (error || !data) {
      set({ isLoading: false });
      return false;
    }
    
    const isOnboarded = data.user.isOnboarded;
    
    set({
      isAuthenticated: true,
      user: data.user,
      isLoading: false,
      isOnboarded
    });
    
    if (isOnboarded) {
      localStorage.setItem('onboardingCompleted', 'true');
    }
    
    return true;
  },
  
  logout: () => {
    authService.logout();
    set({
      isAuthenticated: false,
      user: null
    });
  },
  
  fetchUser: async () => {
    if (!get().isAuthenticated) return;
    
    set({ isLoading: true });
    
    const { data, error } = await userService.getCurrentUser();
    
    if (data && !error) {
      set({
        user: data,
        isOnboarded: !!data.username && !!data.handle,
        isLoading: false
      });
      
      if (!!data.username && !!data.handle) {
        localStorage.setItem('onboardingCompleted', 'true');
      }
    } else {
      set({ isLoading: false });
    }
  },
  
  checkOnboardingStatus: async (walletAddress: string) => {
    const { data, error } = await authService.checkOnboardingStatus(walletAddress);
    
    if (data && !error) {
      set({ isOnboarded: data.isOnboarded });
      
      if (data.isOnboarded) {
        localStorage.setItem('onboardingCompleted', 'true');
      }
      
      return data.isOnboarded;
    }
    
    return false;
  },
  
  completeOnboarding: async (userData: any) => {
    const { data, error } = await userService.updateProfile(userData);
    
    if (data && !error) {
      set({
        user: data,
        isOnboarded: true
      });
      
      localStorage.setItem('onboardingCompleted', 'true');
      return true;
    }
    
    return false;
  }
}));

export default useAuthStore;
