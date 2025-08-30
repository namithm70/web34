'use client'

import { SwapQuote as SwapQuoteType, formatPercentage, formatUSD } from '@/lib/sdk'
import { ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface SwapQuoteProps {
  quote: SwapQuoteType
}

export function SwapQuote({ quote }: SwapQuoteProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const priceImpactColor = quote.priceImpact > 5 ? 'text-red-600' : quote.priceImpact > 1 ? 'text-yellow-600' : 'text-green-600'

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Swap Quote</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          {isExpanded ? 'Less' : 'More'} details
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4 ml-1" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          )}
        </button>
      </div>

      <div className="space-y-2">
        {/* Route */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Route:</span>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{quote.route[0].symbol}</span>
            <span className="text-gray-400">→</span>
            <span className="font-medium">{quote.route[1].symbol}</span>
          </div>
        </div>

        {/* Minimum Received */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Minimum received:</span>
          <span className="font-medium">
            {quote.minReceived} {quote.route[1].symbol}
          </span>
        </div>

        {/* Price Impact */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Price impact:</span>
          <span className={`font-medium ${priceImpactColor}`}>
            {formatPercentage(quote.priceImpact)}
          </span>
        </div>

        {/* Fee */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Trading fee:</span>
          <span className="font-medium">
            {quote.feeBps / 100}% ({formatUSD(parseFloat(quote.outAmount) * quote.feeBps / 10000)})
          </span>
        </div>

        {/* Gas Estimate */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Estimated gas:</span>
          <span className="font-medium">
            ~{quote.gasEstimate} gas units
          </span>
        </div>

        {/* Exchange Rate */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Exchange rate:</span>
          <span className="font-medium">
            1 {quote.route[0].symbol} = {(parseFloat(quote.outAmount) / parseFloat(quote.inAmount)).toFixed(6)} {quote.route[1].symbol}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              {/* Detailed Breakdown */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Transaction Breakdown</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Input amount:</span>
                    <span>{quote.inAmount} {quote.route[0].symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected output:</span>
                    <span>{quote.outAmount} {quote.route[1].symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum output (after slippage):</span>
                    <span>{quote.minReceived} {quote.route[1].symbol}</span>
                  </div>
                </div>
              </div>

              {/* Price Impact Warning */}
              {quote.priceImpact > 2 && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">High price impact</p>
                    <p className="text-yellow-700">
                      This trade has a {formatPercentage(quote.priceImpact)} price impact.
                      Consider trading a smaller amount or using multiple transactions.
                    </p>
                  </div>
                </div>
              )}

              {/* Route Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Route Information</h4>
                <div className="text-sm text-gray-600">
                  <p>This swap will be executed through the following path:</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {quote.route.map((token, index) => (
                      <div key={token.address} className="flex items-center space-x-2">
                        <span className="font-medium">{token.symbol}</span>
                        {index < quote.route.length - 1 && (
                          <span className="text-gray-400">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs">
                    Routes are automatically optimized for best rates and lowest fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
