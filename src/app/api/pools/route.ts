import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@/lib/sdk'

// Mock pool data - in production, this would come from a database or indexer
const pools: Pool[] = [
  {
    id: 'pool-1',
    type: 'stake',
    chainId: 56,
    token: {
      chainId: 56,
      address: '0x55d398326f99059fF775485246999027B3197955',
      symbol: 'USDT',
      decimals: 18,
      name: 'Tether USD',
    },
    rewardToken: {
      chainId: 56,
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      symbol: 'USDC',
      decimals: 18,
      name: 'USD Coin',
    },
    apr: 12.5,
    apy: 13.1,
    tvl: 2500000,
    startTime: Date.now() / 1000 - 86400,
    endTime: Date.now() / 1000 + 30 * 24 * 60 * 60,
    isLocked: false,
    status: 'active',
  },
  {
    id: 'pool-2',
    type: 'stake',
    chainId: 56,
    token: {
      chainId: 56,
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      symbol: 'USDC',
      decimals: 18,
      name: 'USD Coin',
    },
    rewardToken: {
      chainId: 56,
      address: '0x55d398326f99059fF775485246999027B3197955',
      symbol: 'USDT',
      decimals: 18,
      name: 'Tether USD',
    },
    apr: 15.2,
    apy: 16.0,
    tvl: 1800000,
    startTime: Date.now() / 1000 - 86400,
    endTime: Date.now() / 1000 + 60 * 24 * 60 * 60,
    isLocked: true,
    boostMultiplier: 12000,
    status: 'active',
  },
  {
    id: 'farm-1',
    type: 'farm',
    chainId: 56,
    token: {
      chainId: 56,
      address: '0x1234567890123456789012345678901234567890',
      symbol: 'USDT-WBNB LP',
      decimals: 18,
      name: 'Pancake LPs',
    },
    lpToken: {
      chainId: 56,
      address: '0x1234567890123456789012345678901234567890',
      symbol: 'USDT-WBNB LP',
      decimals: 18,
      name: 'USDT-WBNB Pancake LPs',
    },
    rewardToken: {
      chainId: 56,
      address: '0x55d398326f99059fF775485246999027B3197955',
      symbol: 'USDT',
      decimals: 18,
      name: 'Tether USD',
    },
    apr: 45.2,
    apy: 49.8,
    tvl: 5200000,
    startTime: Date.now() / 1000 - 86400,
    endTime: Date.now() / 1000 + 30 * 24 * 60 * 60,
    isLocked: false,
    status: 'active',
  },
  {
    id: 'farm-2',
    type: 'farm',
    chainId: 56,
    token: {
      chainId: 56,
      address: '0x2345678901234567890123456789012345678901',
      symbol: 'USDC-WBNB LP',
      decimals: 18,
      name: 'Pancake LPs',
    },
    lpToken: {
      chainId: 56,
      address: '0x2345678901234567890123456789012345678901',
      symbol: 'USDC-WBNB LP',
      decimals: 18,
      name: 'USDC-WBNB Pancake LPs',
    },
    rewardToken: {
      chainId: 56,
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      symbol: 'USDC',
      decimals: 18,
      name: 'USD Coin',
    },
    apr: 38.7,
    apy: 42.1,
    tvl: 3800000,
    startTime: Date.now() / 1000 - 86400,
    endTime: Date.now() / 1000 + 45 * 24 * 60 * 60,
    isLocked: false,
    status: 'active',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')
    const type = searchParams.get('type') as 'stake' | 'farm' | null

    let filteredPools = pools

    if (chainId) {
      filteredPools = filteredPools.filter(pool => pool.chainId === parseInt(chainId))
    }

    if (type) {
      filteredPools = filteredPools.filter(pool => pool.type === type)
    }

    return NextResponse.json(filteredPools)
  } catch (error) {
    console.error('Error fetching pools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pools' },
      { status: 500 }
    )
  }
}
