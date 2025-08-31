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
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105 hover:border-blue-300/50">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-bold text-sm">
                  {pool.token.symbol.slice(0, 2).toUpperCase()}
                </span>
              </div>
              {pool.isLocked && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <LockClosedIcon className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {pool.token.symbol} Pool
              </h3>
              <p className="text-sm text-gray-600">Rewards in {pool.rewardToken.symbol}</p>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              pool.status === 'active'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              {pool.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-green-700 uppercase tracking-wide">APR</span>
              <span className="text-xs text-green-600">💎</span>
            </div>
            <span className="text-xl font-bold text-green-600">{formatPercentage(pool.apr)}</span>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">APY</span>
              <span className="text-xs text-blue-600">📈</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{formatPercentage(pool.apy)}</span>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">TVL</span>
              <span className="text-xs text-purple-600">💰</span>
            </div>
            <span className="text-lg font-bold text-purple-600">{formatUSD(pool.tvl)}</span>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">Time Left</span>
              <ClockIcon className="w-3 h-3 text-orange-600" />
            </div>
            <span className="text-lg font-bold text-orange-600">
              {daysLeft > 0 ? `${daysLeft}d` : 'Ended'}
            </span>
          </div>
        </div>

        {/* Boost Info */}
        {pool.isLocked && pool.boostMultiplier && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-700">Boost Multiplier</span>
              <span className="text-lg font-bold text-orange-600">
                {((pool.boostMultiplier - 10000) / 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={() => onStake(pool)}
          className="w-full group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105"
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
          <div className="mt-4 text-xs text-gray-500 text-center bg-orange-50 rounded-lg p-2 border border-orange-200/50">
            🔒 Locked pools offer boosted rewards but require commitment
          </div>
        )}
      </div>
    </div>
  )
}
