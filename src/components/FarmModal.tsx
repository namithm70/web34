'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits, erc20Abi } from 'viem'
import { Pool, formatPercentage, formatTokenAmount } from '@/lib/sdk'
import { Button } from '@/lib/ui'
import { MASTER_CHEF_ABI } from '@/lib/sdk'
import { XMarkIcon, ArrowDownIcon, ArrowUpIcon, ClockIcon, ExternalLinkIcon } from '@heroicons/react/24/outline'

interface FarmModalProps {
  pool: Pool
  onClose: () => void
}

export function FarmModal({ pool, onClose }: FarmModalProps) {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake' | 'claim'>('stake')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock contract addresses
  const masterChefAddress = '0x1234567890123456789012345678901234567890' as `0x${string}`
  const lpTokenAddress = pool.lpToken?.address as `0x${string}` || pool.token.address as `0x${string}`

  // Read contract data
  const { data: lpBalance } = useReadContract({
    address: lpTokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: stakedBalance } = useReadContract({
    address: masterChefAddress,
    abi: MASTER_CHEF_ABI,
    functionName: 'userInfo',
    args: address && pool.id ? [pool.id.split('-')[1], address] : undefined, // Extract pool ID number
  })

  const { data: pendingRewards } = useReadContract({
    address: masterChefAddress,
    abi: MASTER_CHEF_ABI,
    functionName: 'pendingReward',
    args: address && pool.id ? [pool.id.split('-')[1], address] : undefined,
  })

  // Write contract functions
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleStake = async () => {
    if (!amount || !address) return

    setIsLoading(true)
    try {
      // First approve the LP token
      await writeContract({
        address: lpTokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [masterChefAddress, parseUnits(amount, pool.token.decimals)],
      })

      // Then deposit to farm
      const poolId = parseInt(pool.id.split('-')[1]) // Extract pool ID
      await writeContract({
        address: masterChefAddress,
        abi: MASTER_CHEF_ABI,
        functionName: 'deposit',
        args: [BigInt(poolId), parseUnits(amount, pool.token.decimals)],
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
      const poolId = parseInt(pool.id.split('-')[1])
      await writeContract({
        address: masterChefAddress,
        abi: MASTER_CHEF_ABI,
        functionName: 'withdraw',
        args: [BigInt(poolId), parseUnits(amount, pool.token.decimals)],
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
      const poolId = parseInt(pool.id.split('-')[1])
      await writeContract({
        address: masterChefAddress,
        abi: MASTER_CHEF_ABI,
        functionName: 'withdraw',
        args: [BigInt(poolId), 0n], // Withdraw 0 to claim rewards
      })
    } catch (error) {
      console.error('Claim failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setMaxAmount = () => {
    if (activeTab === 'stake') {
      setAmount(lpBalance ? formatUnits(lpBalance, pool.token.decimals) : '0')
    } else if (activeTab === 'unstake') {
      const stakedAmount = stakedBalance ? stakedBalance[0] : 0n
      setAmount(formatUnits(stakedAmount, pool.token.decimals))
    }
  }

  const getLPUrl = () => {
    // This would link to the DEX where users can get LP tokens
    return `https://pancakeswap.finance/add/${pool.token.symbol.replace(' LP', '').replace('-', '/')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-purple-600">
                {pool.token.symbol.split('-')[0].slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {pool.token.symbol}
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

        {/* Get LP Tokens Link */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <a
            href={getLPUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 text-sm text-blue-700 hover:text-blue-800 font-medium"
          >
            <span>Get {pool.token.symbol.replace(' LP', '').replace('-', '/')} LP Tokens</span>
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
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
                  ? 'text-purple-600 border-b-2 border-purple-600'
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
              <span className="text-gray-600">LP Balance:</span>
              <span className="font-medium">
                {lpBalance ? formatTokenAmount(lpBalance.toString(), pool.token.decimals) : '0'} {pool.token.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Staked:</span>
              <span className="font-medium">
                {stakedBalance ? formatTokenAmount(stakedBalance[0].toString(), pool.token.decimals) : '0'} {pool.token.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pending Rewards:</span>
              <span className="font-medium text-green-600">
                {pendingRewards ? formatTokenAmount(pendingRewards.toString(), pool.rewardToken.decimals) : '0'} {pool.rewardToken.symbol}
              </span>
            </div>
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
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
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
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  {pool.token.symbol}
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm text-purple-800">
              <p className="font-medium mb-1">Farming Rewards</p>
              <p>Earn {pool.rewardToken.symbol} rewards by staking your LP tokens. Rewards are distributed continuously based on your stake proportion.</p>
            </div>
          </div>

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
