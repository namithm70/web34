import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')

    // Mock stats data
    let totalTVL = 15420000
    let totalUsers = 12500
    let totalPools = 24
    let totalVolume24h = 2500000
    const averageAPR = 28.5

    // Adjust based on chain
    if (chainId === '56') {
      totalTVL = totalTVL * 0.7
      totalUsers = Math.floor(totalUsers * 0.7)
      totalPools = Math.floor(totalPools * 0.7)
      totalVolume24h = totalVolume24h * 0.7
    } else if (chainId === '1') {
      totalTVL = totalTVL * 0.3
      totalUsers = Math.floor(totalUsers * 0.3)
      totalPools = Math.floor(totalPools * 0.3)
      totalVolume24h = totalVolume24h * 0.3
    }

    return NextResponse.json({
      totalTVL: Math.floor(totalTVL),
      totalUsers,
      totalPools,
      totalVolume24h: Math.floor(totalVolume24h),
      averageAPR,
    })
  } catch (error) {
    console.error('Error fetching stats overview:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats overview' },
      { status: 500 }
    )
  }
}
