export const STAKING_ABI = [
  {
    "inputs": [],
    "name": "getPool",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "lockDuration",   "type": "uint256" },
          { "internalType": "uint256", "name": "aprBasisPoints", "type": "uint256" },
          { "internalType": "uint256", "name": "maxCap",         "type": "uint256" },
          { "internalType": "uint256", "name": "totalStaked",    "type": "uint256" },
          { "internalType": "bool",    "name": "isActive",       "type": "bool"    }
        ],
        "internalType": "struct xDinarStaking.Pool",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "previewReward",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserStakes",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "amount",         "type": "uint256" },
          { "internalType": "uint256", "name": "startTime",      "type": "uint256" },
          { "internalType": "uint256", "name": "unlockTime",     "type": "uint256" },
          { "internalType": "uint256", "name": "aprBasisPoints", "type": "uint256" },
          { "internalType": "bool",    "name": "claimed",        "type": "bool"    }
        ],
        "internalType": "struct xDinarStaking.StakeInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserStakeCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address",  "name": "_user",       "type": "address"  },
      { "internalType": "uint256",  "name": "_stakeIndex", "type": "uint256"  }
    ],
    "name": "isUnlocked",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardTreasury",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_stakeIndex", "type": "uint256" }],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "internalType": "address", "name": "user",       "type": "address" },
      { "indexed": false, "internalType": "uint256",  "name": "stakeIndex", "type": "uint256" },
      { "indexed": false, "internalType": "uint256",  "name": "amount",     "type": "uint256" },
      { "indexed": false, "internalType": "uint256",  "name": "unlockTime", "type": "uint256" }
    ],
    "name": "Staked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true,  "internalType": "address", "name": "user",       "type": "address" },
      { "indexed": false, "internalType": "uint256",  "name": "stakeIndex", "type": "uint256" },
      { "indexed": false, "internalType": "uint256",  "name": "principal",  "type": "uint256" },
      { "indexed": false, "internalType": "uint256",  "name": "reward",     "type": "uint256" }
    ],
    "name": "Unstaked",
    "type": "event"
  }
] as const

export const ERC20_APPROVE_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount",  "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner",   "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const