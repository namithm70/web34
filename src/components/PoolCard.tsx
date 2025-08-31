'use client'

import { Pool, formatPercentage, formatUSD } from '@/lib/sdk'
import { Button } from '@/lib/ui'
import { LockClosedIcon, ClockIcon } from '@heroicons/react/24/outline'

interface PoolCardProps {
  pool: Pool
  onStake: (pool: Pool) => void
}

export function PoolCard({ pool, onStake }: PoolCardProps) {
  const timeLeft = pool.endTime - (Date.now() / 1000)
  const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">
              {pool.token.symbol.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{pool.token.symbol} Pool</h3>
            <p className="text-sm text-gray-600">Rewards in {pool.rewardToken.symbol}</p>
          </div>
        </div>

        {pool.isLocked && (
          <div className="flex items-center space-x-1 text-orange-600">
            <LockClosedIcon className="w-4 h-4" />
            <span className="text-xs font-medium">Locked</span>
          </div>
        )}
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

        {pool.isLocked && pool.boostMultiplier && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Boost</span>
            <span className="font-semibold text-orange-600">
              {((pool.boostMultiplier - 10000) / 100)}%
            </span>
          </div>
        )}
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
        onClick={() => onStake(pool)}
        className="w-full"
        disabled={pool.status !== 'active' || daysLeft <= 0}
      >
        {pool.status !== 'active'
          ? 'Pool Inactive'
          : daysLeft <= 0
          ? 'Pool Ended'
          : 'Stake Tokens'
        }
      </Button>

      {/* Additional Info */}
      {pool.isLocked && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Locked pools offer boosted rewards but require commitment
        </div>
      )}
    </div>
  )
}
