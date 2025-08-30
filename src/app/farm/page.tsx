'use client'

import { Header } from '@/components/Header'
import { FarmingInterface } from '@/components/FarmingInterface'

export default function FarmPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm</h1>
          <p className="text-gray-600">Provide liquidity and earn farming rewards</p>
        </div>

        <FarmingInterface />
      </main>
    </div>
  )
}
