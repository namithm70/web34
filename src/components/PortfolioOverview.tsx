'use client'

import { formatUSD, formatPercentage } from '@/lib/sdk'
import { TrendingUpIcon, TrendingDownIcon, CubeIcon, BanknotesIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface PortfolioOverviewProps {
  portfolio: {
    totalValue: number
    totalChange24h: number
    totalChangePercent24h: number
    positions: any[]
  }
  balance?: {
    formatted: string
    symbol: string
  }
}

export function PortfolioOverview({ portfolio, balance }: PortfolioOverviewProps) {
  const isPositive = portfolio.totalChange24h >= 0

  return (
    <div className="space-y-6">
      {/* Total Value Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-gray-900">{formatUSD(portfolio.totalValue)}</p>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive ? (
              <TrendingUpIcon className="w-4 h-4" />
            ) : (
              <TrendingDownIcon className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{formatUSD(portfolio.totalChange24h)} ({formatPercentage(portfolio.totalChangePercent24h)})
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Staking Positions</p>
              <p className="text-2xl font-bold text-gray-900">
                {portfolio.positions.filter(p => p.type === 'staking').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BanknotesIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Farming Positions</p>
              <p className="text-2xl font-bold text-gray-900">
                {portfolio.positions.filter(p => p.type === 'farming').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {balance ? `${balance.formatted} ${balance.symbol}` : '0 ETH'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUpIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Staked 1000 USDT</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-600">+{formatUSD(25.50)}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BanknotesIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Harvested farming rewards</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-600">+{formatUSD(89.20)}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CubeIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Swapped ETH for USDC</p>
                <p className="text-sm text-gray-600">3 days ago</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600">2.5 ETH → 4200 USDC</span>
          </div>
        </div>
      </div>
    </div>
  )
}
