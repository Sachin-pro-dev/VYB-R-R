
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Base API client for making HTTP requests
 */
export const apiClient = {
  token: localStorage.getItem('authToken') || '',
  
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  },
  
  clearToken() {
    this.token = '';
    localStorage.removeItem('authToken');
  },
  
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${API_URL}${endpoint}`);
      
      // Add query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'Something went wrong';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Only show toast for non-connection errors
      if (!(error instanceof TypeError && error.message === 'Failed to fetch')) {
        toast.error(errorMessage);
      }
      
      return { data: null, error: errorMessage };
    }
  },
  
  async post<T>(endpoint: string, data: Record<string, any> = {}): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      const responseData = await response.json();
      return { data: responseData, error: null };
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'Something went wrong';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Only show toast for non-connection errors
      if (!(error instanceof TypeError && error.message === 'Failed to fetch')) {
        toast.error(errorMessage);
      }
      
      return { data: null, error: errorMessage };
    }
  },
  
  async put<T>(endpoint: string, data: Record<string, any> = {}): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      const responseData = await response.json();
      return { data: responseData, error: null };
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'Something went wrong';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Only show toast for non-connection errors
      if (!(error instanceof TypeError && error.message === 'Failed to fetch')) {
        toast.error(errorMessage);
      }
      
      return { data: null, error: errorMessage };
    }
  },
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      const responseData = await response.json();
      return { data: responseData, error: null };
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'Something went wrong';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Only show toast for non-connection errors
      if (!(error instanceof TypeError && error.message === 'Failed to fetch')) {
        toast.error(errorMessage);
      }
      
      return { data: null, error: errorMessage };
    }
  }
};

/**
 * Auth service for authentication related API calls
 */
export const authService = {
  async walletAuth(walletAddress: string) {
    const { data, error } = await apiClient.post<{
      token: string,
      user: any
    }>('/auth/wallet-auth', { walletAddress });
    
    if (data && data.token) {
      apiClient.setToken(data.token);
    }
    
    return { data, error };
  },
  
  async checkOnboardingStatus(walletAddress: string) {
    return await apiClient.get<{ isOnboarded: boolean }>(`/auth/onboarding-status?walletAddress=${walletAddress}`);
  },
  
  logout() {
    apiClient.clearToken();
  }
};

/**
 * User service for user related API calls
 */
export const userService = {
  async getCurrentUser() {
    return await apiClient.get<any>('/users/me');
  },
  
  async updateProfile(userData: any) {
    return await apiClient.put<any>('/users/onboarding', userData);
  },
  
  async getUserByHandle(handle: string) {
    return await apiClient.get<any>(`/users/${handle}`);
  },
  
  async followUser(userId: string) {
    return await apiClient.post<any>(`/users/follow/${userId}`);
  },
  
  async unfollowUser(userId: string) {
    return await apiClient.delete<any>(`/users/follow/${userId}`);
  },
  
  async getTopCreators() {
    return await apiClient.get<any[]>('/users');
  }
};

/**
 * Post service for post related API calls
 */
export const postService = {
  async createPost(postData: { content: string, image?: string, isTokenGated?: boolean }) {
    return await apiClient.post<any>('/posts', postData);
  },
  
  async getFeed(page = 1, limit = 10) {
    return await apiClient.get<any>('/posts/feed', { page, limit });
  },
  
  async getUserPosts(userId: string, page = 1, limit = 10) {
    return await apiClient.get<any>(`/posts/user/${userId}`, { page, limit });
  },
  
  async likePost(postId: string) {
    return await apiClient.post<any>(`/posts/${postId}/like`);
  },
  
  async unlikePost(postId: string) {
    return await apiClient.delete<any>(`/posts/${postId}/like`);
  },
  
  async commentOnPost(postId: string, content: string) {
    return await apiClient.post<any>(`/posts/${postId}/comment`, { content });
  },
  
  async getPostComments(postId: string, page = 1, limit = 10) {
    return await apiClient.get<any>(`/posts/${postId}/comments`, { page, limit });
  }
};

/**
 * Token service for token related API calls
 */
export const tokenService = {
  async createToken(tokenData: { tokenSymbol: string, tokenName: string, initialPrice: number }) {
    return await apiClient.post<any>('/tokens', tokenData);
  },
  
  async getTokenBySymbol(symbol: string) {
    return await apiClient.get<any>(`/tokens/${symbol}`);
  },
  
  async getTrendingTokens() {
    return await apiClient.get<any[]>('/tokens');
  }
};

/**
 * Ticket service for ticket related API calls
 */
export const ticketService = {
  async createEvent(eventData: any) {
    return await apiClient.post<any>('/tickets/events', eventData);
  },
  
  async getEvents(status?: string) {
    const params = status ? { status } : {};
    return await apiClient.get<any[]>('/tickets/events', params);
  },
  
  async buyTicket(eventId: string) {
    return await apiClient.post<any>(`/tickets/buy/${eventId}`);
  },
  
  async getUserTickets() {
    return await apiClient.get<any[]>('/tickets/my-tickets');
  }
};

/**
 * Staking service for staking related API calls
 */
export const stakingService = {
  async getStakingPools() {
    return await apiClient.get<any[]>('/staking/pools');
  },
  
  async stakeTokens(poolId: string, amount: number) {
    return await apiClient.post<any>(`/staking/stake/${poolId}`, { amount });
  },
  
  async claimRewards(stakeId: string) {
    return await apiClient.post<any>(`/staking/claim/${stakeId}`);
  },
  
  async getUserStakes() {
    return await apiClient.get<any[]>('/staking/my-stakes');
  }
};

/**
 * Raffle service for raffle related API calls
 */
export const raffleService = {
  async getRaffles() {
    return await apiClient.get<any[]>('/raffles');
  },
  
  async enterRaffle(raffleId: string) {
    return await apiClient.post<any>(`/raffles/enter/${raffleId}`);
  },
  
  async createRaffle(raffleData: any) {
    return await apiClient.post<any>('/raffles', raffleData);
  }
};

/**
 * Interest service for interest related API calls
 */
export const interestService = {
  async getInterests() {
    return await apiClient.get<any[]>('/interests');
  },
  
  async addUserInterests(userId: string, interestIds: string[]) {
    return await apiClient.post<any>('/interests/user', { userId, interestIds });
  },
  
  async getUserInterests(userId: string) {
    return await apiClient.get<any[]>(`/interests/user/${userId}`);
  }
};

/**
 * NFT service for NFT related API calls
 */
export const nftService = {
  async getUserNFTs(userId: string) {
    return await apiClient.get<any[]>(`/nfts/user/${userId}`);
  },
  
  async mintNFT(nftData: { name: string, image: string }) {
    return await apiClient.post<any>('/nfts/mint', nftData);
  }
};
