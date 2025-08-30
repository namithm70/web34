import { Injectable } from '@nestjs/common';
import { UserPosition, Token, formatTokenAmount } from '@defi-app/sdk';

@Injectable()
export class UsersService {
  // Mock user position data - in a real app, this would come from a database or indexer
  private readonly userPositions: { [address: string]: UserPosition[] } = {
    '0x1234567890123456789012345678901234567890': [
      {
        address: '0x1234567890123456789012345678901234567890',
        poolId: 'pool-1',
        deposited: '1000',
        pendingRewards: '25.50',
        lastAction: Date.now() / 1000 - 86400,
      },
      {
        address: '0x1234567890123456789012345678901234567890',
        poolId: 'farm-1',
        deposited: '500',
        pendingRewards: '89.20',
        lastAction: Date.now() / 1000 - 172800,
      },
    ],
    '0x9876543210987654321098765432109876543210': [
      {
        address: '0x9876543210987654321098765432109876543210',
        poolId: 'pool-2',
        deposited: '2500',
        pendingRewards: '125.75',
        lastAction: Date.now() / 1000 - 432000,
        lockExpiry: Date.now() / 1000 + 30 * 24 * 60 * 60,
      },
    ],
  };

  async getUserPositions(address: string): Promise<UserPosition[]> {
    return this.userPositions[address.toLowerCase()] || [];
  }

  async getUserPortfolio(address: string): Promise<{
    totalValue: number;
    totalRewards: number;
    positions: UserPosition[];
  }> {
    const positions = await this.getUserPositions(address);

    let totalValue = 0;
    let totalRewards = 0;

    // Mock calculation - in a real app, this would use current prices
    positions.forEach(position => {
      const depositedValue = parseFloat(position.deposited) * 1; // Mock price
      const rewardsValue = parseFloat(position.pendingRewards) * 1; // Mock price

      totalValue += depositedValue;
      totalRewards += rewardsValue;
    });

    return {
      totalValue,
      totalRewards,
      positions,
    };
  }

  async getUserStats(address: string): Promise<{
    totalStaked: number;
    totalFarmed: number;
    totalRewardsEarned: number;
    activePositions: number;
  }> {
    const positions = await this.getUserPositions(address);

    let totalStaked = 0;
    let totalFarmed = 0;
    let totalRewardsEarned = 0;

    positions.forEach(position => {
      const deposited = parseFloat(position.deposited);
      const rewards = parseFloat(position.pendingRewards);

      // Mock logic to determine if it's staking or farming based on pool ID
      if (position.poolId.startsWith('pool-')) {
        totalStaked += deposited;
      } else if (position.poolId.startsWith('farm-')) {
        totalFarmed += deposited;
      }

      totalRewardsEarned += rewards;
    });

    return {
      totalStaked,
      totalFarmed,
      totalRewardsEarned,
      activePositions: positions.length,
    };
  }
}
