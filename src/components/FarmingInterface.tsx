'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Pool, Token, formatPercentage, calculateAPR } from '@/lib/sdk'
import { FarmPoolCard } from './FarmPoolCard'
import { FarmModal } from './FarmModal'



export function FarmingInterface() {
  const { address, isConnected, chainId } = useAccount()
  const [pools, setPools] = useState<Pool[]>([])
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [showFarmModal, setShowFarmModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'high-yield' | 'new'>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch pools from API
  useEffect(() => {
    const fetchPools = async () => {
      try {
        const { apiClient } = await import('@/lib/api')
        const response = await apiClient.getPools(chainId?.toString(), 'farm')

        if (response.data && Array.isArray(response.data)) {
          setPools(response.data)
        } else {
          console.error('Error fetching farm pools:', response.error)
          setPools([]) // Set empty array as fallback
        }
      } catch (error) {
        console.error('Error fetching farm pools:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (chainId) {
      fetchPools()
    }
  }, [chainId])

  // Filter pools
  const filteredPools = pools.filter(pool => {
    if (filter === 'all') return true
    if (filter === 'high-yield') return pool.apr >= 40
    if (filter === 'new') {
      const poolAge = (Date.now() / 1000 - pool.startTime) / (24 * 60 * 60)
      return poolAge <= 7 // New pools (started within 7 days)
    }
    return true
  })

  // Filter by chain
  const chainFilteredPools = filteredPools.filter(pool => pool.chainId === chainId)

  const handleFarm = (pool: Pool) => {
    setSelectedPool(pool)
    setShowFarmModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">ℹ️</span>
            </div>
          </div>
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">How Farming Works</p>
            <p className="text-blue-800">
              Provide liquidity to earn rewards. First, add liquidity to a DEX pool to get LP tokens,
              then stake those tokens here to earn farming rewards.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Farms
          </button>
          <button
            onClick={() => setFilter('high-yield')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'high-yield'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            High Yield (40%+ APR)
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'new'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            New Farms
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {chainFilteredPools.length} farm{chainFilteredPools.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Pool Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading farming pools...</p>
        </div>
      ) : chainFilteredPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chainFilteredPools.map((pool) => (
            <FarmPoolCard
              key={pool.id}
              pool={pool}
              onFarm={handleFarm}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No farms available</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'No farming pools are currently available on this network.'
              : `No ${filter} farms are currently available on this network.`
            }
          </p>
        </div>
      )}

      {/* Farm Modal */}
      {showFarmModal && selectedPool && (
        <FarmModal
          pool={selectedPool}
          onClose={() => {
            setShowFarmModal(false)
            setSelectedPool(null)
          }}
        />
      )}
    </div>
  )
}
