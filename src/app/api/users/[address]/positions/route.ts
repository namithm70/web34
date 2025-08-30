import { NextRequest, NextResponse } from 'next/server'
import { UserPosition } from '@defi-app/sdk'

interface RouteParams {
  params: {
    address: string
  }
}

// Mock user positions - in production, this would come from a database
const mockUserPositions: { [address: string]: UserPosition[] } = {
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
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const address = params.address.toLowerCase()
    const positions = mockUserPositions[address] || []

    return NextResponse.json(positions)
  } catch (error) {
    console.error('Error fetching user positions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user positions' },
      { status: 500 }
    )
  }
}
