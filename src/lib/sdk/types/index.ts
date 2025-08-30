export interface Token {
  chainId: number
  address: `0x${string}`
  symbol: string
  decimals: number
  name: string
  logoURI?: string
  coingeckoId?: string
}

export interface Pool {
  id: string
  type: 'stake' | 'farm'
  chainId: number
  token: Token
  lpToken?: Token
  rewardToken: Token
  apr: number
  apy: number
  tvl: number
  startTime: number
  endTime: number
  isLocked: boolean
  boostMultiplier?: number
  status: 'active' | 'inactive' | 'paused'
}

export interface UserPosition {
  address: `0x${string}`
  poolId: string
  deposited: string
  pendingRewards: string
  lastAction: number
  lockExpiry?: number
}

export interface SwapQuote {
  route: Token[]
  inAmount: string
  outAmount: string
  minReceived: string
  priceImpact: number
  feeBps: number
  gasEstimate: string
}

export interface ChainConfig {
  chainId: number
  name: string
  rpcUrls: string[]
  blockExplorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  ammRouter: `0x${string}`
  wrappedNative: `0x${string}`
}

export interface StakingPoolConfig {
  rewardRate: string
  startTime: number
  endTime: number
  lockupDays?: number
  boostMultiplier?: number
  penaltyBps?: number
}

export interface MasterChefConfig {
  rewardsPerSecond: string
  totalAllocPoint: number
  bonusMultiplier?: number
  bonusEndBlock?: number
}
