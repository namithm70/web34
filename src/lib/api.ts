// API client for DeFi indexer
const API_BASE_URL = '/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Tokens
  async getTokens(chainId?: string, search?: string) {
    const params = new URLSearchParams();
    if (chainId) params.append('chainId', chainId);
    if (search) params.append('search', search);

    return this.request(`/tokens?${params.toString()}`);
  }

  async getToken(address: string, chainId: string) {
    return this.request(`/tokens/${address}?chainId=${chainId}`);
  }

  // Pools
  async getPools(chainId?: string, type?: 'stake' | 'farm') {
    const params = new URLSearchParams();
    if (chainId) params.append('chainId', chainId);
    if (type) params.append('type', type);

    return this.request(`/pools?${params.toString()}`);
  }

  async getPool(id: string) {
    return this.request(`/pools/${id}`);
  }

  // Users
  async getUserPositions(address: string) {
    return this.request(`/users/${address}/positions`);
  }

  async getUserPortfolio(address: string) {
    return this.request(`/users/${address}/portfolio`);
  }

  // Quotes
  async getSwapQuote(
    chainId: string,
    inTokenAddress: string,
    outTokenAddress: string,
    amount: string,
    slippage: string = '0.5'
  ) {
    const params = new URLSearchParams({
      chainId,
      in: inTokenAddress,
      out: outTokenAddress,
      amount,
      slippage,
    });

    return this.request(`/quotes?${params.toString()}`);
  }

  // Stats
  async getStatsOverview(chainId?: string) {
    const params = chainId ? `?chainId=${chainId}` : '';
    return this.request(`/stats/overview${params}`);
  }

  async getTVLStats(chainId?: string) {
    const params = chainId ? `?chainId=${chainId}` : '';
    return this.request(`/stats/tvl${params}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
