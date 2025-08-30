import { Controller, Get, Query, Param } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { Pool } from '@defi-app/sdk';

@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Get()
  async getPools(
    @Query('chainId') chainId?: string,
    @Query('type') type?: 'stake' | 'farm',
  ): Promise<Pool[]> {
    return this.poolsService.getPools(chainId, type);
  }

  @Get(':id')
  async getPool(@Param('id') id: string): Promise<Pool | null> {
    return this.poolsService.getPool(id);
  }

  @Get('stats/tvl')
  async getTotalTVL(@Query('chainId') chainId?: string): Promise<{ tvl: number }> {
    return this.poolsService.getTotalTVL(chainId);
  }

  @Get('stats/apr')
  async getAverageAPR(
    @Query('chainId') chainId?: string,
    @Query('type') type?: 'stake' | 'farm'
  ): Promise<{ averageApr: number }> {
    return this.poolsService.getAverageAPR(chainId, type);
  }
}
