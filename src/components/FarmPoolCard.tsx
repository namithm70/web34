'use client'

import { Pool, formatPercentage, formatUSD } from '@/lib/sdk'
import { Button } from '@/lib/ui'
import { CurrencyDollarIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface FarmPoolCardProps {
  pool: Pool
  onFarm: (pool: Pool) => void
}

export function FarmPoolCard({ pool, onFarm }: FarmPoolCardProps) {
  const timeLeft = pool.endTime - (Date.now() / 1000)
  const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-purple-600">
              {pool.token.symbol.split('-')[0].slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{pool.token.symbol}</h3>
            <p className="text-sm text-gray-600">Rewards in {pool.rewardToken.symbol}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <ChartBarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">LP</span>
        </div>
      </div>

      {/* LP Token Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="text-sm text-gray-600 mb-1">Liquidity Pool</div>
        <div className="text-sm font-medium text-gray-900">
          {pool.token.symbol.replace(' LP', '').replace('-', ' + ')}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">APR</span>
          <span className="font-semibold text-green-600">{formatPercentage(pool.apr)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">APY</span>
          <span className="font-semibold text-green-600">{formatPercentage(pool.apy)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">TVL</span>
          <span className="font-semibold text-gray-900">{formatUSD(pool.tvl)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Time Left</span>
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">
              {daysLeft > 0 ? `${daysLeft}d` : 'Ended'}
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            pool.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {pool.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={() => onFarm(pool)}
        className="w-full"
        disabled={pool.status !== 'active' || daysLeft <= 0}
      >
        {pool.status !== 'active'
          ? 'Farm Inactive'
          : daysLeft <= 0
          ? 'Farm Ended'
          : 'Farm LP Tokens'
        }
      </Button>

      {/* Additional Info */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        Stake your LP tokens to earn rewards
      </div>
    </div>
  )
}
