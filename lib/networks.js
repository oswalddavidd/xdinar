// Plain-JS network data, shared by lib/chains.ts (the app) and next.config.js (the CSP).
// next.config.js can't import TypeScript in Next 14, so this file must stay CommonJS.
// Contract addresses are the UUPS PROXY addresses, never the implementations.

/**
 * @typedef {Object} NetworkData
 * @property {number} chainId
 * @property {string[]} rpcUrls  Tried in order; later entries are fallbacks.
 * @property {string | undefined} tokenAddress
 * @property {string | undefined} stakingAddress
 * @property {string} explorer
 */

/** @type {{ testnet: NetworkData, mainnet: NetworkData }} */
const NETWORKS = {
  testnet: {
    chainId: 97,
    rpcUrls: [
      'https://bsc-testnet-rpc.publicnode.com',
      'https://data-seed-prebsc-1-s1.binance.org:8545',
    ],
    tokenAddress: '0xD9EFFC5710db7bD7067f7ac216661e035Dc0B2Bf', // xDinarToken proxy (multi-pool deployment)
    stakingAddress: '0xd006c3BE027767ba774778a6a04e82D069a5Df15', // xDinarStaking proxy (multi-pool)
    explorer: 'https://testnet.bscscan.com',
  },
  mainnet: {
    chainId: 56,
    rpcUrls: [process.env.NEXT_PUBLIC_BSC_RPC_URL, 'https://bsc-dataseed.bnbchain.org'].filter(
      /** @returns {u is string} */ (u) => Boolean(u)
    ),
    tokenAddress: undefined, // TODO: mainnet proxy address
    stakingAddress: undefined, // TODO: mainnet proxy address
    explorer: 'https://bscscan.com',
  },
}

/** @type {'testnet' | 'mainnet'} */
const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'

module.exports = { NETWORKS, NETWORK_NAME }
