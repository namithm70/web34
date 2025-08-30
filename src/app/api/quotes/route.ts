import { NextRequest, NextResponse } from 'next/server'
import { SwapQuote, Token } from '@/lib/sdk'

// Mock token data for quotes
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
    const chainId = parseInt(searchParams.get('chainId') || '56')
    const inTokenAddress = searchParams.get('in') || ''
    const outTokenAddress = searchParams.get('out') || ''
    const amount = searchParams.get('amount') || '0'
    const slippage = parseFloat(searchParams.get('slippage') || '0.5')

    // Find tokens
    const inToken = tokens.find(t =>
      t.address.toLowerCase() === inTokenAddress.toLowerCase() && t.chainId === chainId
    )
    const outToken = tokens.find(t =>
      t.address.toLowerCase() === outTokenAddress.toLowerCase() && t.chainId === chainId
    )

    if (!inToken || !outToken) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 400 }
      )
    }

    // Mock quote calculation
    const inputAmount = parseFloat(amount)
    const mockPrice = 1 // Mock exchange rate
    const outputAmount = inputAmount * mockPrice * (1 - 0.005) // 0.5% trading fee
    const priceImpact = Math.random() * 2 // Random price impact 0-2%

    const quote: SwapQuote = {
      route: [inToken, outToken],
      inAmount: amount,
      outAmount: outputAmount.toString(),
      minReceived: (outputAmount * (1 - slippage / 100)).toString(),
      priceImpact: priceImpact,
      feeBps: 30, // 0.3%
      gasEstimate: '200000',
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error getting swap quote:', error)
    return NextResponse.json(
      { error: 'Failed to get swap quote' },
      { status: 500 }
    )
  }
}
