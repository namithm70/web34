'use client'

import { useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { Button } from '@/lib/ui'
import { PortfolioOverview } from './PortfolioOverview'
import { PositionsList } from './PositionsList'
import { PerformanceChart } from './PerformanceChart'
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

// Mock portfolio data
const MOCK_PORTFOLIO = {
  totalValue: 15420.50,
  totalChange24h: 245.30,
  totalChangePercent24h: 1.62,
  positions: [
    {
      id: 'pos-1',
      type: 'staking' as const,
      token: 'USDT',
      amount: 5000,
      value: 5000,
      rewards: 125.50,
      apr: 12.5,
      poolName: 'USDT Staking Pool',
    },
    {
      id: 'pos-2',
      type: 'farming' as const,
      token: 'USDT-WBNB LP',
      amount: 2500,
      value: 2500,
      rewards: 89.20,
      apr: 45.2,
      poolName: 'USDT-WBNB Farm',
    },
    {
      id: 'pos-3',
      type: 'wallet' as const,
      token: 'WBNB',
      amount: 2.5,
      value: 7920,
      rewards: 0,
      apr: 0,
      poolName: 'Wallet Balance',
    },
  ],
  history: [
    { date: '2025-08-01', value: 14200 },
    { date: '2025-08-02', value: 14350 },
    { date: '2025-08-03', value: 14180 },
    { date: '2025-08-04', value: 14420 },
    { date: '2025-08-05', value: 14650 },
    { date: '2025-08-06', value: 14980 },
    { date: '2025-08-07', value: 15200 },
    { date: '2025-08-08', value: 15420 },
  ],
}

export function PortfolioDashboard() {
  const { address, isConnected } = useAccount()
  const [portfolio] = useState(MOCK_PORTFOLIO)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'history'>('overview')

  const { data: balance } = useBalance({
    address,
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/JSON file
    const dataStr = JSON.stringify(portfolio, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `portfolio-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect your wallet</h3>
        <p className="text-gray-600 mb-6">
          Connect your wallet to view your portfolio and track your positions.
        </p>
        <Button size="lg">
          Connect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'positions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            History
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={isRefreshing}
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <PortfolioOverview portfolio={portfolio} balance={balance} />
      )}

      {activeTab === 'positions' && (
        <PositionsList positions={portfolio.positions} />
      )}

      {activeTab === 'history' && (
        <PerformanceChart history={portfolio.history} />
      )}
    </div>
  )
}
