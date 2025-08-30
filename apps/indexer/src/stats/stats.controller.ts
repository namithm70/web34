import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  async getOverviewStats(@Query('chainId') chainId?: string): Promise<{
    totalTVL: number;
    totalUsers: number;
    totalPools: number;
    totalVolume24h: number;
    averageAPR: number;
  }> {
    return this.statsService.getOverviewStats(chainId);
  }

  @Get('tvl')
  async getTVLStats(@Query('chainId') chainId?: string): Promise<{
    tvl: number;
    change24h: number;
    changePercent24h: number;
  }> {
    return this.statsService.getTVLStats(chainId);
  }

  @Get('volume')
  async getVolumeStats(@Query('chainId') chainId?: string): Promise<{
    volume24h: number;
    volume7d: number;
    volume30d: number;
  }> {
    return this.statsService.getVolumeStats(chainId);
  }

  @Get('pools')
  async getPoolStats(@Query('chainId') chainId?: string): Promise<{
    totalPools: number;
    activePools: number;
    averageAPR: number;
    highestAPR: number;
  }> {
    return this.statsService.getPoolStats(chainId);
  }
}
