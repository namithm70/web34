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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Pools
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'locked'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Locked
          </button>
        </div>

                 <div className="text-sm text-gray-600">
           {filteredPools.length} pool{filteredPools.length !== 1 ? 's' : ''} available
         </div>
      </div>

      {/* Pool Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading staking pools...</p>
        </div>
             ) : filteredPools.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredPools.map((pool) => (
            <PoolCard
              key={pool.id}
              pool={pool}
              onStake={handleStake}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No pools available</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'No staking pools are currently available on this network.'
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
