'use client'

import { Header } from '@/components/Header'
import { PortfolioDashboard } from '@/components/PortfolioDashboard'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
          <p className="text-gray-600">Track your positions and earnings in one place</p>
        </div>

        <PortfolioDashboard />
      </main>
    </div>
  )
}
