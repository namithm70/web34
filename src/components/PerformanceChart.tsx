'use client'

import { formatUSD } from '@/lib/sdk'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

interface HistoryPoint {
  date: string
  value: number
}

interface PerformanceChartProps {
  history: HistoryPoint[]
}

export function PerformanceChart({ history }: PerformanceChartProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📈</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No performance data</h3>
          <p className="text-gray-600">
            Performance data will appear here once you start using the platform.
          </p>
        </div>
      </div>
    )
  }

  const latestValue = history[history.length - 1]?.value || 0
  const previousValue = history[history.length - 2]?.value || latestValue
  const change24h = latestValue - previousValue
  const changePercent24h = previousValue > 0 ? (change24h / previousValue) * 100 : 0
  const isPositive = change24h >= 0

  // Simple chart visualization using CSS
  const maxValue = Math.max(...history.map(h => h.value))
  const minValue = Math.min(...history.map(h => h.value))
  const range = maxValue - minValue

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Performance</h3>
          <p className="text-sm text-gray-600">Last 7 days</p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{formatUSD(latestValue)}</p>
          <div className={`flex items-center space-x-1 text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>
              {isPositive ? '+' : ''}{formatUSD(change24h)} ({changePercent24h.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Simple Chart */}
      <div className="relative h-64 mb-4">
        <div className="absolute inset-0 flex items-end justify-between">
          {history.map((point) => {
            const height = range > 0 ? ((point.value - minValue) / range) * 100 : 50
            return (
              <div
                key={point.date}
                className="flex flex-col items-center flex-1 max-w-12"
              >
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Highest</p>
          <p className="font-semibold text-gray-900">{formatUSD(maxValue)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Lowest</p>
          <p className="font-semibold text-gray-900">{formatUSD(minValue)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Average</p>
          <p className="font-semibold text-gray-900">
            {formatUSD(history.reduce((sum, h) => sum + h.value, 0) / history.length)}
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-center space-x-2 mt-6 pt-4 border-t border-gray-200">
        {['7D', '30D', '90D', '1Y'].map((period) => (
          <button
            key={period}
            className="px-3 py-1 text-sm font-medium rounded-md transition-colors bg-blue-600 text-white"
          >
            {period}
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Note:</strong> Portfolio values are estimates based on current market prices and may fluctuate.
          Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  )
}
