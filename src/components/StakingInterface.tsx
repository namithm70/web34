'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Pool } from '@/lib/sdk'
import { PoolCard } from './PoolCard'
import { StakeModal } from './StakeModal'

export function StakingInterface() {
  const { chainId } = useAccount()
  const [pools, setPools] = useState<Pool[]>([])
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'locked'>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch pools from API
  useEffect(() => {
    const fetchPools = async () => {
      try {
        const { apiClient } = await import('@/lib/api')
        const response = await apiClient.getPools(chainId?.toString(), 'stake')

        console.log('Staking pools response:', response) // Debug log

        if (response.data && Array.isArray(response.data)) {
          setPools(response.data)
        } else {
          console.error('Error fetching pools:', response.error)
          setPools([]) // Set empty array as fallback
        }
      } catch (error) {
        console.error('Error fetching pools:', error)
        setPools([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    // Always fetch pools, even without chainId
    fetchPools()
  }, [chainId])

  // Filter pools based on selected filter
  const filteredPools = pools.filter(pool => {
    if (filter === 'all') return true
    if (filter === 'active') return pool.status === 'active'
    if (filter === 'locked') return pool.isLocked
    return true
  })

  const handleStake = (pool: Pool) => {
    setSelectedPool(pool)
    setShowStakeModal(true)
  }

    return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Staking Pools
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Earn rewards by staking your tokens in our secure and high-yield staking pools
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <div className="flex items-center space-x-3">
          {[
            { id: 'all', label: 'All Pools', icon: '🏦' },
            { id: 'active', label: 'Active', icon: '✅' },
            { id: 'locked', label: 'Locked', icon: '🔒' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as typeof filter)}
              className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === filterOption.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200/50'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">{filterOption.icon}</span>
                <span>{filterOption.label}</span>
              </span>
              {filter === filterOption.id && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-white/80 rounded-xl border border-gray-200/50">
            <span className="text-sm font-medium text-gray-700">
              {filteredPools.length} pool{filteredPools.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>
      </div>

      {/* Pool Grid */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto animate-pulse"></div>
          </div>
          <p className="text-gray-600 mt-6 text-lg font-medium">Loading staking pools...</p>
          <div className="mt-4 space-y-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
            <div className="w-24 h-2 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      ) : filteredPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPools.map((pool, index) => (
            <div
              key={pool.id}
              className="transform transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PoolCard
                pool={pool}
                onStake={handleStake}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="relative">
            <div className="text-gray-400 text-8xl mb-6 animate-bounce">🏦</div>
            <div className="absolute inset-0 text-gray-300 text-8xl mb-6 animate-pulse">💎</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No pools available</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === 'all'
              ? 'No staking pools are currently available on this network. Check back later for new opportunities!'
              : `No ${filter} pools are currently available on this network.`
            }
          </p>
        </div>
      )}

      {/* Stake Modal */}
      {showStakeModal && selectedPool && (
        <StakeModal
          pool={selectedPool}
          onClose={() => {
            setShowStakeModal(false)
            setSelectedPool(null)
          }}
        />
      )}
    </div>
  )
}
