'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnect } from './WalletConnect'
import { cn } from '@/lib/ui'

const navigation = [
  { name: 'Trade', href: '/trade' },
  { name: 'Stake', href: '/stake' },
  { name: 'Farm', href: '/farm' },
  { name: 'Portfolio', href: '/portfolio' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold text-gray-900">DeFi App</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-blue-600',
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-500'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  )
}
