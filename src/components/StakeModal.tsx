    'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits, erc20Abi } from 'viem'
import { Pool, formatPercentage, formatTokenAmount } from '@/lib/sdk'
import { Button } from '@/lib/ui'
import { STAKING_POOL_ABI } from '@/lib/sdk'
import { XMarkIcon, ArrowDownIcon, ArrowUpIcon, ClockIcon } from '@heroicons/react/24/outline'

interface StakeModalProps {
  pool: Pool
  onClose: () => void
}

export function StakeModal({ pool, onClose }: StakeModalProps) {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake' | 'claim'>('stake')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock contract address (in a real app, this would come from pool data)
  const stakingPoolAddress = '0x1234567890123456789012345678901234567890' as `0x${string}`

  // Read contract data
  const { data: userBalance } = useReadContract({
    address: pool.token.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: stakedBalance } = useReadContract({
    address: stakingPoolAddress,
    abi: STAKING_POOL_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: pendingRewards } = useReadContract({
    address: stakingPoolAddress,
    abi: STAKING_POOL_ABI,
    functionName: 'earned',
    args: undefined,
  })

  // Note: This staking pool doesn't have locking functionality
  // const { data: lockExpiry } = useReadContract({
  //   address: stakingPoolAddress,
  //   abi: STAKING_POOL_ABI,
  //   functionName: 'userInfo',
  //   args: address ? [address] : undefined,
  // })

  // Write contract functions
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleStake = async () => {
    if (!amount || !address) return

    setIsLoading(true)
    try {
      // First approve the token
      await writeContract({
        address: pool.token.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [stakingPoolAddress, parseUnits(amount, pool.token.decimals)],
      })

      // Then stake
      await writeContract({
        address: stakingPoolAddress,
        abi: STAKING_POOL_ABI,
        functionName: 'stake',
        args: [parseUnits(amount, pool.token.decimals)],
      })

      setAmount('')
    } catch (error) {
      console.error('Staking failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnstake = async () => {
    if (!amount || !address) return

    setIsLoading(true)
    try {
      await writeContract({
        address: stakingPoolAddress,
        abi: STAKING_POOL_ABI,
        functionName: 'withdraw',
        args: [parseUnits(amount, pool.token.decimals)],
      })

      setAmount('')
    } catch (error) {
      console.error('Unstaking failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      await writeContract({
        address: stakingPoolAddress,
        abi: STAKING_POOL_ABI,
        functionName: 'claim',
      })
    } catch (error) {
      console.error('Claim failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setMaxAmount = () => {
    if (activeTab === 'stake') {
      setAmount(userBalance ? formatUnits(userBalance, pool.token.decimals) : '0')
    } else if (activeTab === 'unstake') {
      setAmount(stakedBalance ? formatUnits(stakedBalance, pool.token.decimals) : '0')
    }
  }

  // This staking pool doesn't have locking functionality
  const lockExpiryDate = null
  const isLocked = false

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">
                {pool.token.symbol.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {pool.token.symbol} Pool
              </h2>
              <p className="text-sm text-gray-600">
                APR: {formatPercentage(pool.apr)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'stake', label: 'Stake', icon: ArrowDownIcon },
            { id: 'unstake', label: 'Unstake', icon: ArrowUpIcon },
            { id: 'claim', label: 'Claim', icon: ClockIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Position Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Wallet Balance:</span>
              <span className="font-medium">
                {userBalance ? formatTokenAmount(userBalance.toString(), pool.token.decimals) : '0'} {pool.token.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Staked:</span>
              <span className="font-medium">
                {stakedBalance ? formatTokenAmount(stakedBalance.toString(), pool.token.decimals) : '0'} {pool.token.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pending Rewards:</span>
              <span className="font-medium text-green-600">
                {pendingRewards ? formatTokenAmount(pendingRewards.toString(), pool.rewardToken.decimals) : '0'} {pool.rewardToken.symbol}
              </span>
            </div>
                         {/* Lock expiry information removed - this staking pool doesn't have locking */}
          </div>

          {/* Amount Input */}
          {activeTab !== 'claim' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {activeTab === 'stake' ? 'Stake Amount' : 'Unstake Amount'}
                </label>
                <button
                  onClick={setMaxAmount}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  MAX
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  {pool.token.symbol}
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {activeTab === 'unstake' && isLocked && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <ClockIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Early Unstaking Penalty</p>
                                     <p className="text-yellow-700 mt-1">
                     This staking pool doesn&apos;t have locking functionality.
                   </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={
              activeTab === 'stake'
                ? handleStake
                : activeTab === 'unstake'
                ? handleUnstake
                : handleClaim
            }
            disabled={!isConnected || (activeTab !== 'claim' && !amount) || isLoading || isConfirming}
            loading={isLoading || isConfirming}
            className="w-full"
            size="lg"
          >
            {!isConnected
              ? 'Connect Wallet'
              : isConfirming
              ? 'Confirming...'
              : activeTab === 'stake'
              ? `Stake ${pool.token.symbol}`
              : activeTab === 'unstake'
              ? `Unstake ${pool.token.symbol}`
              : `Claim ${pool.rewardToken.symbol}`
            }
          </Button>
        </div>
      </div>
    </div>
  )
}
