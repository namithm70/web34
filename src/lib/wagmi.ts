import { createConfig, http } from 'wagmi'
import { mainnet, bsc, bscTestnet } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = createConfig({
  chains: [mainnet, bsc, bscTestnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http('https://bsc-dataseed.binance.org/'),
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
