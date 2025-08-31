'use client'

import { useState, useEffect } from 'react'
import { useChainId } from 'wagmi'
import { Token } from '@/lib/sdk'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface TokenSelectorProps {
  tokens: Token[]
  selectedToken: Token | null
  onTokenSelect: (token: Token) => void
  placeholder?: string
}

export function TokenSelector({
  tokens: initialTokens,
  selectedToken,
  onTokenSelect,
  placeholder = 'Select token'
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tokens, setTokens] = useState<Token[]>(initialTokens)
  const [isLoading, setIsLoading] = useState(false)
  const chainId = useChainId()

  // Fetch tokens from API when search query changes
  useEffect(() => {
    const fetchTokens = async () => {
      if (!isOpen) return

      setIsLoading(true)
      try {
        const { apiClient } = await import('@/lib/api')
        const response = await apiClient.getTokens(chainId.toString(), searchQuery)

        if (response.data && Array.isArray(response.data)) {
          setTokens(response.data)
        } else {
          console.error('Error fetching tokens:', response.error)
          setTokens([]) // Set empty array as fallback
        }
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchTokens, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, isOpen, chainId])

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px]"
      >
        {selectedToken ? (
          <>
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
              {selectedToken.symbol.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-medium">{selectedToken.symbol}</span>
          </>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-80 max-h-96 overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Token List */}
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-8 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading tokens...</p>
                </div>
              ) : filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <button
                    key={`${token.chainId}-${token.address}`}
                    onClick={() => {
                      onTokenSelect(token)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                      {token.symbol.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{token.symbol}</div>
                      <div className="text-sm text-gray-500">{token.name}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No tokens found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
