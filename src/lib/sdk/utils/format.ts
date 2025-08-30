import { formatUnits, parseUnits } from 'viem'

export function formatTokenAmount(amount: string | bigint, decimals: number): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount
  return formatUnits(value, decimals)
}

export function parseTokenAmount(amount: string, decimals: number): bigint {
  return parseUnits(amount, decimals)
}

export function formatUSD(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function calculateAPR(rewardsPerSecond: string, rewardTokenPrice: number, tvl: number): number {
  const rewardsPerYear = parseFloat(rewardsPerSecond) * rewardTokenPrice * 31536000
  return tvl > 0 ? rewardsPerYear / tvl : 0
}

export function calculateAPY(apr: number, compoundsPerYear: number = 365): number {
  return Math.pow(1 + apr / compoundsPerYear, compoundsPerYear) - 1
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 2) return address
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatGasPrice(gasPrice: string | bigint): string {
  const value = typeof gasPrice === 'string' ? BigInt(gasPrice) : gasPrice
  const gwei = Number(formatUnits(value, 9))
  return `${gwei.toFixed(2)} Gwei`
}
