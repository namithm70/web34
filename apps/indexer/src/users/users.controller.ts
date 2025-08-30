import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserPosition } from '@defi-app/sdk';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':address/positions')
  async getUserPositions(@Param('address') address: string): Promise<UserPosition[]> {
    return this.usersService.getUserPositions(address);
  }

  @Get(':address/portfolio')
  async getUserPortfolio(@Param('address') address: string): Promise<{
    totalValue: number;
    totalRewards: number;
    positions: UserPosition[];
  }> {
    return this.usersService.getUserPortfolio(address);
  }

  @Get(':address/stats')
  async getUserStats(@Param('address') address: string): Promise<{
    totalStaked: number;
    totalFarmed: number;
    totalRewardsEarned: number;
    activePositions: number;
  }> {
    return this.usersService.getUserStats(address);
  }
}
