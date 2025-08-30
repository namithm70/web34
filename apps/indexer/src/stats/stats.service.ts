import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  // Mock stats data - in a real app, this would be calculated from real data
  private readonly stats = {
    totalTVL: 15420000,
    totalUsers: 12500,
    totalPools: 24,
    totalVolume24h: 2500000,
    averageAPR: 28.5,
    tvlChange24h: 245000,
    tvlChangePercent24h: 1.62,
    volume7d: 18500000,
    volume30d: 78000000,
    activePools: 22,
    highestAPR: 52.3,
  };

  async getOverviewStats(chainId?: string): Promise<{
    totalTVL: number;
    totalUsers: number;
    totalPools: number;
    totalVolume24h: number;
    averageAPR: number;
  }> {
    // Mock chain-specific adjustments
    let multiplier = 1;
    if (chainId === '56') {
      multiplier = 0.7; // BSC has 70% of total stats
    } else if (chainId === '1') {
      multiplier = 0.3; // Ethereum has 30% of total stats
    }

    return {
      totalTVL: this.stats.totalTVL * multiplier,
      totalUsers: Math.floor(this.stats.totalUsers * multiplier),
      totalPools: Math.floor(this.stats.totalPools * multiplier),
      totalVolume24h: this.stats.totalVolume24h * multiplier,
      averageAPR: this.stats.averageAPR,
    };
  }

  async getTVLStats(chainId?: string): Promise<{
    tvl: number;
    change24h: number;
    changePercent24h: number;
  }> {
    let multiplier = 1;
    if (chainId === '56') {
      multiplier = 0.7;
    } else if (chainId === '1') {
      multiplier = 0.3;
    }

    return {
      tvl: this.stats.totalTVL * multiplier,
      change24h: this.stats.tvlChange24h * multiplier,
      changePercent24h: this.stats.tvlChangePercent24h,
    };
  }

  async getVolumeStats(chainId?: string): Promise<{
    volume24h: number;
    volume7d: number;
    volume30d: number;
  }> {
    let multiplier = 1;
    if (chainId === '56') {
      multiplier = 0.7;
    } else if (chainId === '1') {
      multiplier = 0.3;
    }

    return {
      volume24h: this.stats.totalVolume24h * multiplier,
      volume7d: this.stats.volume7d * multiplier,
      volume30d: this.stats.volume30d * multiplier,
    };
  }

  async getPoolStats(chainId?: string): Promise<{
    totalPools: number;
    activePools: number;
    averageAPR: number;
    highestAPR: number;
  }> {
    let multiplier = 1;
    if (chainId === '56') {
      multiplier = 0.7;
    } else if (chainId === '1') {
      multiplier = 0.3;
    }

    return {
      totalPools: Math.floor(this.stats.totalPools * multiplier),
      activePools: Math.floor(this.stats.activePools * multiplier),
      averageAPR: this.stats.averageAPR,
      highestAPR: this.stats.highestAPR,
    };
  }
}
