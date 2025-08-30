'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/lib/ui'
import { formatTokenAmount, shortenAddress } from '@/lib/sdk'
import { ChevronDownIcon, WalletIcon } from '@heroicons/react/24/outline'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [isOpen, setIsOpen] = useState(false)

  const supportedChains = [
    { id: 1, name: 'Ethereum' },
    { id: 56, name: 'BSC' },
    { id: 97, name: 'BSC Testnet' },
  ]

  const currentChain = supportedChains.find(chain => chain.id === chainId)

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Chain Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            {currentChain?.name || 'Unknown'}
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {isOpen && (
            <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
              {supportedChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => {
                    switchChain({ chainId: chain.id })
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                >
                  {chain.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wallet Info */}
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <WalletIcon className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            {shortenAddress(address)}
          </span>
        </div>

        {/* Disconnect Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          loading={isPending}
          className="w-full"
        >
          <WalletIcon className="w-4 h-4 mr-2" />
          Connect {connector.name}
        </Button>
      ))}
    </div>
  )
}
