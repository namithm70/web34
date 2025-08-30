'use client'

import { formatUSD, formatPercentage, formatTokenAmount } from '@/lib/sdk'
import { Button } from '@/lib/ui'
import { CubeIcon, BanknotesIcon, WalletIcon, ArrowUpIcon } from '@heroicons/react/24/outline'

interface Position {
  id: string
  type: 'staking' | 'farming' | 'wallet'
  token: string
  amount: number
  value: number
  rewards: number
  apr: number
  poolName: string
}

interface PositionsListProps {
  positions: Position[]
}

export function PositionsList({ positions }: PositionsListProps) {
  const getPositionIcon = (type: string) => {
    switch (type) {
      case 'staking':
        return <CubeIcon className="w-5 h-5 text-blue-600" />
      case 'farming':
        return <BanknotesIcon className="w-5 h-5 text-purple-600" />
      case 'wallet':
        return <WalletIcon className="w-5 h-5 text-green-600" />
      default:
        return <WalletIcon className="w-5 h-5 text-gray-600" />
    }
  }

  const getPositionColor = (type: string) => {
    switch (type) {
      case 'staking':
        return 'border-blue-200 bg-blue-50'
      case 'farming':
        return 'border-purple-200 bg-purple-50'
      case 'wallet':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="space-y-4">
      {positions.map((position) => (
        <div
          key={position.id}
          className={`rounded-xl border p-6 ${getPositionColor(position.type)}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                {getPositionIcon(position.type)}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {position.token}
                </h3>
                <p className="text-sm text-gray-600">{position.poolName}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-500">
                    {formatTokenAmount(position.amount.toString(), 18)} tokens
                  </span>
                  <span className={`text-sm font-medium ${
                    position.type === 'staking' ? 'text-blue-600' :
                    position.type === 'farming' ? 'text-purple-600' :
                    'text-green-600'
                  }`}>
                    APR: {formatPercentage(position.apr)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">
                {formatUSD(position.value)}
              </p>
              {position.rewards > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  +{formatUSD(position.rewards)} rewards
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Actions:</span>
              {position.type === 'staking' && (
                <>
                  <Button size="sm" variant="outline">
                    Claim Rewards
                  </Button>
                  <Button size="sm" variant="outline">
                    Unstake
                  </Button>
                </>
              )}
              {position.type === 'farming' && (
                <>
                  <Button size="sm" variant="outline">
                    Harvest
                  </Button>
                  <Button size="sm" variant="outline">
                    Unstake LP
                  </Button>
                </>
              )}
              {position.type === 'wallet' && (
                <Button size="sm" variant="outline">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  Stake
                </Button>
              )}
            </div>

            <div className="text-sm text-gray-500">
              {position.type === 'staking' && 'Staking Pool'}
              {position.type === 'farming' && 'Farming Pool'}
              {position.type === 'wallet' && 'Wallet Balance'}
            </div>
          </div>
        </div>
      ))}

      {positions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No positions found</h3>
          <p className="text-gray-600 mb-6">
            You don&apos;t have any active positions yet. Start by staking tokens or providing liquidity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              Start Staking
            </Button>
            <Button variant="outline">
              Start Farming
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
