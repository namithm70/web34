import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')

    if (!chainId) {
      return NextResponse.json(
        { error: 'Chain ID is required' },
        { status: 400 }
      )
    }

    // Mock popular tokens - in production, this would be based on trading volume
    const popularTokens = [
      {
        chainId: parseInt(chainId),
        address: '0x55d398326f99059fF775485246999027B3197955',
        symbol: 'USDT',
        decimals: 18,
        name: 'Tether USD',
      },
      {
        chainId: parseInt(chainId),
        address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        symbol: 'USDC',
        decimals: 18,
        name: 'USD Coin',
      },
      {
        chainId: parseInt(chainId),
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        symbol: 'WBNB',
        decimals: 18,
        name: 'Wrapped BNB',
      },
    ]

    return NextResponse.json(popularTokens)
  } catch (error) {
    console.error('Error fetching popular tokens:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular tokens' },
      { status: 500 }
    )
  }
}
