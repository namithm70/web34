import { NextRequest, NextResponse } from 'next/server'

// Mock TVL calculation - in production, this would be calculated from real data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')

    // Mock TVL data
    let tvl = 15420000 // Total TVL across all chains

    if (chainId === '56') {
      tvl = tvl * 0.7 // BSC has 70% of total TVL
    } else if (chainId === '1') {
      tvl = tvl * 0.3 // Ethereum has 30% of total TVL
    }

    return NextResponse.json({
      tvl: Math.floor(tvl),
      change24h: Math.floor(tvl * 0.0162), // 1.62% change
      changePercent24h: 1.62
    })
  } catch (error) {
    console.error('Error fetching TVL stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch TVL stats' },
      { status: 500 }
    )
  }
}
