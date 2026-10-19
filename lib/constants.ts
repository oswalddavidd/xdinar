export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Features', href: '#features' },
  { label: 'Staking', href: '/staking' },
  { label: 'Connect', href: '#connect' },
]

// Status labels intentionally omitted until progress is verified (copy sheet #17).
export const ROADMAP = [
  {
    phase: 'Phase 1',
    period: 'Q1 2026',
    title: 'Foundation',
    items: [
      'Finalize whitepaper & technical documentation',
      'Develop & audit the xDINAR smart contract (BEP-20)',
      'Core team building & advisor recruitment',
      'Official website & social launch · Seed round',
    ],
  },
  {
    phase: 'Phase 2',
    period: 'Q2 2026',
    title: 'Launch',
    items: [
      '$xDINAR token launch on BNB Smart Chain',
      'Listing on prominent DEX (PancakeSwap, etc.)',
      'Launch xDINAR Staking v1 · Private & Public sale',
      'Liquidity pool launch with 10% allocation',
    ],
  },
  {
    phase: 'Phase 3',
    period: 'Q3 2026',
    title: 'Growth',
    items: [
      'Launch xDINAR Swap (proprietary DEX)',
      'Launch Lending & Borrowing protocol',
      'Listing on tier-2 CEX · Ambassador program',
      'First quarterly burn',
    ],
  },
  {
    phase: 'Phase 4',
    period: 'Q4 2026',
    title: 'Expansion',
    items: [
      'Launch xDINAR Pay (payment gateway)',
      'DAO Governance implementation · Tier-1 CEX listing',
      'Expansion into SEA & Middle Eastern markets',
      'Partnerships with Islamic financial institutions',
    ],
  },
  {
    phase: 'Phase 5',
    period: '2027+',
    title: 'Ecosystem Maturity',
    items: [
      'xDINAR mobile app · Cross-chain integration',
      'Launch xDINAR Academy (DeFi education)',
      'Global expansion & institutional adoption',
      'Governance-based protocol review & upgrades',
    ],
  },
]

export const TOKENOMICS = [
  { label: 'Ecosystem', pct: 40, amount: 200000, color: '#C9A84C', desc: 'Product development, grants, partnerships & staking incentives' },
  { label: 'Investor', pct: 20, amount: 100000, color: '#E8C97A', desc: 'Seed, Private & Public Sale' },
  { label: 'Marketing & Ops', pct: 20, amount: 100000, color: '#2A6FDB', desc: 'Marketing, listings & operations' },
  { label: 'Treasury', pct: 10, amount: 50000, color: '#504840', desc: 'Reserve fund & governance, managed by the DAO' },
  { label: 'Liquidity', pct: 10, amount: 50000, color: '#2A2A3A', desc: 'DEX liquidity pool' },
]

export const FEATURES = [
  {
    icon: '🔄',
    title: 'xDINAR Swap',
    desc: 'Decentralized AMM exchange. Swap $xDINAR with other BEP-20 tokens directly, with minimal fees and no intermediaries.',
  },
  {
    icon: '🔒',
    title: 'xDINAR Staking',
    desc: 'Lock your $xDINAR and earn staking rewards, distributed automatically via smart contract.',
  },
  {
    icon: '💸',
    title: 'xDINAR Lending',
    desc: 'Use $xDINAR as collateral to borrow other assets, or lend to earn interest — managed by transparent, tamper-proof smart contracts.',
  },
  {
    icon: '💳',
    title: 'xDINAR Pay',
    desc: 'Dinar-based payment gateway. Real-world utility for merchants and everyday transactions.',
  },
  {
    icon: '🗳️',
    title: 'xDINAR Governance',
    desc: 'Progressive DAO governance. Every $xDINAR holder can vote — 1 token = 1 vote, 10% quorum, 67% supermajority for fundamental changes.',
  },
  {
    icon: '🛡️',
    title: 'Security First',
    desc: 'Smart contracts undergoing independent audit. All burns and treasury activity verifiable on-chain, with monthly treasury reports.',
  },
]

export const SOCIALS = [
  {
    platform: 'Telegram',
    label: 'Join Community',
    href: '#', // TODO: replace with real Telegram URL
    icon: 'telegram',
  },
  {
    platform: 'Twitter/X',
    label: 'Follow @xDINAR',
    href: '#', // TODO: replace with real Twitter/X URL
    icon: 'twitter',
  },
  {
    platform: 'Discord',
    label: 'Join Server',
    href: '#', // TODO: replace with real Discord URL
    icon: 'discord',
  },
  {
    platform: 'Medium',
    label: 'Read Our Blog',
    href: '#', // TODO: replace with real Medium URL
    icon: 'book-open',
  },
  {
    platform: 'GitHub',
    label: 'View Contracts',
    href: '#', // TODO: replace with real GitHub URL
    icon: 'github',
  },
  {
    platform: 'Email',
    label: 'contact@xdinar.io',
    href: 'mailto:contact@xdinar.io',
    icon: 'mail',
  },
]

export const HERO_STATS = [
  { label: 'Max Supply', value: '500,000', suffix: '', mono: true },
  { label: 'Token Std', value: 'BEP-20', suffix: '', mono: true },
  { label: 'Network', value: 'BNB Smart Chain', suffix: '', mono: false },
  { label: 'Mechanism', value: 'Mint & Burn', suffix: '', mono: false },
]

export const MISSION_ITEMS = [
  'Build a DeFi ecosystem accessible to users from all backgrounds',
  'Integrate Dinar values and philosophy into modern protocols',
  'Drive adoption through locally and globally relevant products',
  'Create a sustainable tokenomics model',
]

// Also reachable via the /whitepaper short link (see next.config.js).
export const WHITEPAPER_URL = 'https://xdinar-token.gitbook.io/xdinar-token-docs'
