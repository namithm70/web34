import { NextRequest, NextResponse } from 'next/server'

// Mock APR calculation - in production, this would be calculated from real data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainId = searchParams.get('chainId')
    const type = searchParams.get('type') as 'stake' | 'farm' | null

    let averageApr = 28.5 // Overall average APR

    // Adjust based on filters
    if (type === 'stake') {
      averageApr = 14.0
    } else if (type === 'farm') {
      averageApr = 42.0
    }

    if (chainId === '56') {
      averageApr *= 1.1 // BSC might have slightly higher APR
    } else if (chainId === '1') {
      averageApr *= 0.9 // Ethereum might have slightly lower APR
    }

    return NextResponse.json({
      averageApr: Math.round(averageApr * 100) / 100
    })
  } catch (error) {
    console.error('Error fetching APR stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch APR stats' },
      { status: 500 }
    )
  }
}
