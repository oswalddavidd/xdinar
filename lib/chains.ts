import { bsc, bscTestnet, type Chain } from 'viem/chains'
import { NETWORKS, NETWORK_NAME } from './networks'

type Address = `0x${string}`
export type NetworkName = 'testnet' | 'mainnet'

export interface NetworkConfig {
  name: NetworkName
  chain: Chain
  rpcUrls: string[]
  /** Token proxy address; undefined until deployed on this network. */
  tokenAddress: Address | undefined
  /** Staking proxy address; undefined until deployed on this network. */
  stakingAddress: Address | undefined
  explorer: string
}

const CHAINS: Record<NetworkName, Chain> = { testnet: bscTestnet, mainnet: bsc }

function build(name: NetworkName): NetworkConfig {
  const data = NETWORKS[name]
  return {
    name,
    chain: CHAINS[name],
    rpcUrls: data.rpcUrls,
    tokenAddress: data.tokenAddress as Address | undefined,
    stakingAddress: data.stakingAddress as Address | undefined,
    explorer: data.explorer,
  }
}

export const networks: Record<NetworkName, NetworkConfig> = {
  testnet: build('testnet'),
  mainnet: build('mainnet'),
}

/** Active network, selected by NEXT_PUBLIC_NETWORK (default "testnet"). */
export const net = networks[NETWORK_NAME]

export const isTestnet = net.name !== 'mainnet'

/** False while the active network's proxy addresses are still placeholders. */
export const contractsDeployed = Boolean(net.tokenAddress && net.stakingAddress)
