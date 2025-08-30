'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits, erc20Abi } from 'viem'
import { Button } from '@/lib/ui'
import { Token, SwapQuote } from '@/lib/sdk'
import { TokenSelector } from './TokenSelector'
import { SwapSettings } from './SwapSettings'
import { SwapQuote as SwapQuoteDisplay } from './SwapQuote'
import { ArrowDownIcon, ArrowsRightLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

// Common tokens for BSC and Ethereum
const COMMON_TOKENS: Token[] = [
  {
    chainId: 56,
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: 'USDT',
    decimals: 18,
    name: 'Tether USD',
  },
  {
    chainId: 56,
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    symbol: 'USDC',
    decimals: 18,
    name: 'USD Coin',
  },
  {
    chainId: 56,
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    symbol: 'WBNB',
    decimals: 18,
    name: 'Wrapped BNB',
  },
  {
    chainId: 1,
    address: '0xA0b86a33E6441e88C5F2712C3E9b74Ae40B8c46F',
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
  },
  {
    chainId: 1,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
  {
    chainId: 1,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    decimals: 18,
    name: 'Wrapped Ether',
  },
]

interface SwapSettings {
  slippage: number
  deadline: number
  gasPrice?: string
}

export function SwapInterface() {
  const { address, isConnected, chainId } = useAccount()
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null)
  const [settings, setSettings] = useState<SwapSettings>({
    slippage: 0.5,
    deadline: 20,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Filter tokens by current chain
  const availableTokens = COMMON_TOKENS.filter(token => token.chainId === chainId)

  // Get token balances
  const { data: fromBalance } = useReadContract({
    address: fromToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!fromToken && !!address,
    },
  })

  const { data: toBalance } = useReadContract({
    address: toToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!toToken && !!address,
    },
  })

  // Swap tokens function
  const swapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount('')
    setSwapQuote(null)
  }

  // Get quote function using API
  const getQuote = async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      setSwapQuote(null)
      return
    }

    setIsLoading(true)

    try {
      const { apiClient } = await import('@/lib/api')
      const response = await apiClient.getSwapQuote(
        chainId?.toString() || '',
        fromToken.address,
        toToken.address,
        fromAmount,
        settings.slippage.toString()
      )

      if (response.data) {
        setToAmount(response.data.outAmount)
        setSwapQuote(response.data)
      } else {
        console.error('Error getting quote:', response.error)
        setSwapQuote(null)
      }
    } catch (error) {
      console.error('Error getting quote:', error)
      setSwapQuote(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Get quote when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getQuote()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [fromToken, toToken, fromAmount, settings.slippage])

  // Swap execution
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const executeSwap = () => {
    if (!swapQuote || !fromToken) return

    // This is a simplified swap execution
    // In a real implementation, this would call the DEX router contract
    console.log('Executing swap:', swapQuote)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Swap Tokens</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <SwapSettings
            settings={settings}
            onSettingsChange={setSettings}
          />
        </div>
      )}

      {/* From Token */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">From</label>
          {fromBalance && (
            <span className="text-sm text-gray-500">
              Balance: {formatUnits(fromBalance, fromToken?.decimals || 18)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="w-full text-2xl font-semibold border-none outline-none bg-transparent"
            />
          </div>
          <TokenSelector
            tokens={availableTokens}
            selectedToken={fromToken}
            onTokenSelect={setFromToken}
            placeholder="Select token"
          />
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-4">
        <button
          onClick={swapTokens}
          className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
          disabled={!fromToken || !toToken}
        >
          <ArrowsRightLeftIcon className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* To Token */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">To</label>
          {toBalance && (
            <span className="text-sm text-gray-500">
              Balance: {formatUnits(toBalance, toToken?.decimals || 18)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="w-full text-2xl font-semibold border-none outline-none bg-transparent text-gray-400"
            />
          </div>
          <TokenSelector
            tokens={availableTokens}
            selectedToken={toToken}
            onTokenSelect={setToToken}
            placeholder="Select token"
          />
        </div>
      </div>

      {/* Quote Display */}
      {swapQuote && (
        <div className="mb-6">
          <SwapQuoteDisplay quote={swapQuote} />
        </div>
      )}

      {/* Swap Button */}
      <Button
        onClick={executeSwap}
        disabled={!isConnected || !swapQuote || isLoading || isConfirming}
        loading={isLoading || isConfirming}
        className="w-full"
        size="lg"
      >
        {!isConnected
          ? 'Connect Wallet'
          : !swapQuote
          ? 'Enter Amount'
          : isConfirming
          ? 'Confirming...'
          : 'Swap Tokens'
        }
      </Button>

      {!isConnected && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Connect your wallet to start trading
        </p>
      )}
    </div>
  )
}
