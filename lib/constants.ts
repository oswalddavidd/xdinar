export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Features', href: '#features' },
  { label: 'Connect', href: '#connect' },
]

export const ROADMAP = [
  {
    phase: 'Phase 1',
    period: 'Q1 2024',
    title: 'Foundation',
    status: 'completed' as const,
    items: [
      'Token contract deployed on BSC',
      'Smart contract audit initiated',
      'Core team assembled',
      'Whitepaper v1 published',
      'Community channels launched',
    ],
  },
  {
    phase: 'Phase 2',
    period: 'Q2 2024',
    title: 'Launch',
    status: 'completed' as const,
    items: [
      'Public token sale & IDO',
      'DEX listing on PancakeSwap',
      'Staking contract deployed',
      'Initial liquidity provisioned',
      'Marketing campaign Phase 1',
    ],
  },
  {
    phase: 'Phase 3',
    period: 'Q3 2024',
    title: 'Growth',
    status: 'active' as const,
    items: [
      'xDINAR Swap launch (AMM)',
      'Lending protocol beta',
      'DAO governance activation',
      'CEX listing applications',
      'Community ambassador program',
    ],
  },
  {
    phase: 'Phase 4',
    period: 'Q4 2024',
    title: 'Expansion',
    status: 'upcoming' as const,
    items: [
      'xDINAR Pay merchant gateway',
      'Mobile wallet (iOS & Android)',
      'Cross-chain bridge (ETH / Polygon)',
      'Institutional partnerships',
      'Regional market expansion',
    ],
  },
  {
    phase: 'Phase 5',
    period: '2025+',
    title: 'Ecosystem Maturity',
    status: 'upcoming' as const,
    items: [
      'Full DAO governance transition',
      'xDINAR Foundation established',
      'Real-world asset (RWA) integration',
      'Multi-chain presence',
      'Global DeFi protocol status',
    ],
  },
]

export const TOKENOMICS = [
  { label: 'Ecosystem', pct: 40, amount: 200000, color: '#C9A84C', desc: 'Protocol rewards, staking, and grants' },
  { label: 'Investor', pct: 20, amount: 100000, color: '#E8C97A', desc: '12-month vesting, 3-month cliff' },
  { label: 'Marketing & Ops', pct: 20, amount: 100000, color: '#2A6FDB', desc: 'Growth, partnerships, and operations' },
  { label: 'Treasury', pct: 10, amount: 50000, color: '#504840', desc: 'DAO-controlled, multi-sig secured' },
  { label: 'Liquidity', pct: 10, amount: 50000, color: '#2A2A3A', desc: 'DEX liquidity pools and market making' },
]

export const FEATURES = [
  {
    icon: '🔄',
    title: 'xDINAR Swap',
    desc: 'Decentralized AMM exchange. Swap $xDINAR for any BEP-20 token with minimal fees and zero middlemen.',
  },
  {
    icon: '🔒',
    title: 'xDINAR Staking',
    desc: 'Lock tokens, earn competitive yield. Rewards distributed automatically via smart contract.',
  },
  {
    icon: '💸',
    title: 'xDINAR Lending',
    desc: 'Use $xDINAR as collateral to borrow, or lend to earn interest — governed by immutable contracts.',
  },
  {
    icon: '💳',
    title: 'xDINAR Pay',
    desc: 'Dinar-based payment gateway. Real-world utility for merchants and everyday transactions.',
  },
  {
    icon: '🗳️',
    title: 'xDINAR Governance',
    desc: 'Full DAO voting system. Every $xDINAR holder has a voice. 1 token = 1 vote.',
  },
  {
    icon: '🛡️',
    title: 'Security First',
    desc: 'Independent audit, multi-sig treasury, timelock on admin functions, active bug bounty.',
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
  'Shariah-aligned DeFi principles',
  'Transparent on-chain governance',
  'Community-first token distribution',
  'Real-world payment utility',
  'Deflationary tokenomics model',
  'Open-source smart contracts',
  'Accessible to 1.8B Muslim market',
  'Built on battle-tested BNB Chain',
]
