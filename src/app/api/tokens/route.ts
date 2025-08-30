import { NextRequest, NextResponse } from 'next/server'
import { Token } from '@/lib/sdk'

// Mock token data - in production, this would come from a database or indexer
const tokens: Token[] = [
  {
    chainId: 56,
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: 'USDT',
    decimals: 18,
    name: 'Tether USD',
  },
  {
    chainId: 56,
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    symbol: 'USDC',
    decimals: 18,
    name: 'USD Coin',
  },
  {
    chainId: 56,
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    symbol: 'WBNB',
    decimals: 18,
    name: 'Wrapped BNB',
  },
  {
    chainId: 1,
    address: '0xA0b86a33E6441e88C5F2712C3E9b74Ae40B8c46F',
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
  },
  {
    chainId: 1,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
  {
    chainId: 1,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    decimals: 18,
    name: 'Wrapped Ether',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')
    const search = searchParams.get('search')

    let filteredTokens = tokens

    if (chainId) {
      filteredTokens = filteredTokens.filter(token => token.chainId === parseInt(chainId))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredTokens = filteredTokens.filter(token =>
        token.symbol.toLowerCase().includes(searchLower) ||
        token.name.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(filteredTokens)
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}
