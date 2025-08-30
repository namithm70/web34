'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { SwapInterface } from '@/components/SwapInterface'

export default function TradePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trade</h1>
          <p className="text-gray-600">Swap tokens with the best rates across multiple DEXs</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <SwapInterface />
        </div>
      </main>
    </div>
  )
}
