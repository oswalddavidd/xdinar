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
    tokenAddress: '0x55e0f92b67dc64159c7f376dfaf5869ff92cd46b',
    stakingAddress: '0x8E22876abDCF31Ba3A95d0Ea53D0eD2816d5983B',
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
