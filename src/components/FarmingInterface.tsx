'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Pool } from '@/lib/sdk'
import { FarmPoolCard } from './FarmPoolCard'
import { FarmModal } from './FarmModal'



export function FarmingInterface() {
  const { chainId } = useAccount()
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

        console.log('Farming pools response:', response) // Debug log

        if (response.data && Array.isArray(response.data)) {
          setPools(response.data)
        } else {
          console.error('Error fetching farm pools:', response.error)
          setPools([]) // Set empty array as fallback
        }
      } catch (error) {
        console.error('Error fetching farm pools:', error)
        setPools([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    // Always fetch pools, even without chainId
    fetchPools()
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Yield Farming
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Maximize your returns by providing liquidity and earning farming rewards
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl">🌾</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">How Farming Works</h3>
            <p className="text-purple-800 leading-relaxed">
              Provide liquidity to earn rewards. First, add liquidity to a DEX pool to get LP tokens,
              then stake those tokens here to earn farming rewards with competitive APRs.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <div className="flex items-center space-x-3">
          {[
            { id: 'all', label: 'All Farms', icon: '🌾' },
            { id: 'high-yield', label: 'High Yield', icon: '🚀' },
            { id: 'new', label: 'New Farms', icon: '🆕' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as typeof filter)}
              className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                filter === filterOption.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200/50'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">{filterOption.icon}</span>
                <span>{filterOption.label}</span>
              </span>
              {filter === filterOption.id && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-white/80 rounded-xl border border-gray-200/50">
            <span className="text-sm font-medium text-gray-700">
              {chainFilteredPools.length} farm{chainFilteredPools.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>
      </div>

      {/* Pool Grid */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto animate-pulse"></div>
          </div>
          <p className="text-gray-600 mt-6 text-lg font-medium">Loading farming pools...</p>
          <div className="mt-4 space-y-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
            <div className="w-24 h-2 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      ) : chainFilteredPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {chainFilteredPools.map((pool, index) => (
            <div
              key={pool.id}
              className="transform transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FarmPoolCard
                pool={pool}
                onFarm={handleFarm}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="relative">
            <div className="text-gray-400 text-8xl mb-6 animate-bounce">🌾</div>
            <div className="absolute inset-0 text-gray-300 text-8xl mb-6 animate-pulse">🚀</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No farms available</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === 'all'
              ? 'No farming pools are currently available on this network. Check back later for new opportunities!'
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
