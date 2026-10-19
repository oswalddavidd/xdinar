import { fallback, http } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { net } from './chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'xDINAR Staking',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'YOUR_PROJECT_ID',
  chains: [net.chain],
  transports: {
    [net.chain.id]: fallback(net.rpcUrls.map((u) => http(u))),
  },
  ssr: true,
})
