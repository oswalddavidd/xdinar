'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Flame, Coins } from 'lucide-react'
import { TOKENOMICS } from '@/lib/constants'
import { formatNumber } from '@/lib/utils'

const TOTAL_SUPPLY = 500_000
const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 3

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
}

function lighten(hex: string): string {
  if (hex.startsWith('rgba') || hex.startsWith('#2A') || hex.startsWith('#50')) return hex
  return '#E8C97A'
}

function TokenomicsChart() {
  const [hovered, setHovered] = useState<string | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(chartRef, { once: true, margin: '-100px' })

  let cumulativePct = 0
  const segments = TOKENOMICS.map((t) => {
    const startPct = cumulativePct
    cumulativePct += t.pct
    const dashLength = (t.pct / 100) * (CIRCUMFERENCE - TOKENOMICS.length * GAP)
    const gapLength = CIRCUMFERENCE - dashLength
    const rotationDeg = (startPct / 100) * 360 - 90
    return { ...t, dashLength, gapLength, rotationDeg }
  })

  const active = TOKENOMICS.find((t) => t.label === hovered)

  return (
    <div ref={chartRef} className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible" aria-label="Tokenomics donut chart">
          <circle cx="120" cy="120" r={RADIUS} fill="none" stroke="#1A1A26" strokeWidth="28" />
          {segments.map((seg, index) => (
            <motion.circle
              key={seg.label}
              cx="120"
              cy="120"
              r={RADIUS}
              fill="none"
              stroke={hovered === seg.label ? lighten(seg.color) : seg.color}
              strokeWidth={hovered === seg.label ? 32 : 26}
              strokeDasharray={`${seg.dashLength} ${seg.gapLength}`}
              strokeLinecap="round"
              initial={{ strokeDashoffset: seg.dashLength }}
              animate={{ strokeDashoffset: isInView ? 0 : seg.dashLength }}
              transition={{ duration: 1.1, delay: index * 0.15, ease: 'easeOut' }}
              style={{ transformOrigin: '120px 120px', transform: `rotate(${seg.rotationDeg}deg)`, cursor: 'pointer' }}
              onMouseEnter={() => setHovered(seg.label)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {active ? (
            <>
              <span className="font-mono font-bold text-content text-xl">{active.pct}%</span>
              <span className="font-body text-content-muted text-xs mt-0.5">{active.label}</span>
              <span className="font-mono text-gold text-xs mt-1">{formatNumber(active.amount)}</span>
            </>
          ) : (
            <>
              <span className="font-display font-bold text-gold-gradient text-base leading-tight">$xDINAR</span>
              <span className="font-mono text-content-muted text-xs mt-1">{formatNumber(TOTAL_SUPPLY)}</span>
              <span className="font-body text-content-dim text-[10px]">Max Supply</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        {TOKENOMICS.map((t) => (
          <button key={t.label} className="flex items-center gap-3 text-left group" onMouseEnter={() => setHovered(t.label)} onMouseLeave={() => setHovered(null)}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125" style={{ backgroundColor: t.color }} />
            <span className="text-sm font-body text-content-muted group-hover:text-content flex-1">{t.label}</span>
            <span className="text-sm font-mono text-gold">{t.pct}%</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function TokenomicsSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' })

  const chartRef = useRef<HTMLDivElement>(null)
  const chartInView = useInView(chartRef, { once: true, margin: '-100px' })

  const tableRef = useRef<HTMLDivElement>(null)
  const tableInView = useInView(tableRef, { once: true, margin: '-100px' })

  const tableRowsRef = useRef<HTMLDivElement>(null)
  const tableRowsInView = useInView(tableRowsRef, { once: true, margin: '-100px' })

  const mechanicsRef = useRef<HTMLDivElement>(null)
  const mechanicsInView = useInView(mechanicsRef, { once: true, margin: '-100px' })

  return (
    <section id="tokenomics" className="section-padding bg-bg-surface">
      <div className="section-container">
        <motion.div
          ref={headerRef}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-4">Token Distribution</p>
          <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            <span className="text-gold-gradient">Tokenomics</span> Built to Last
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            ref={chartRef}
            animate={chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex justify-center"
          >
            <TokenomicsChart />
          </motion.div>

          <motion.div
            ref={tableRef}
            animate={tableInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="glass-card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-body font-semibold text-content text-sm">Token Allocation</h3>
            </div>
            <motion.div
              ref={tableRowsRef}
              variants={containerVariants}
              animate={tableRowsInView ? 'visible' : 'hidden'}
              className="divide-y divide-border"
            >
              {TOKENOMICS.map((t) => (
                <motion.div key={t.label} variants={itemVariants} className="flex items-center gap-4 px-6 py-4 hover:bg-bg-raised transition-colors duration-150">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-sm text-content">{t.label}</p>
                    <p className="font-body text-xs text-content-dim truncate">{t.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-sm text-gold">{t.pct}%</p>
                    <p className="font-mono text-xs text-content-dim">{formatNumber(t.amount)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="px-6 py-3 border-t border-border bg-bg-base/40">
              <div className="flex justify-between items-center">
                <span className="text-xs font-body text-content-dim">Total Supply</span>
                <span className="font-mono text-sm text-content font-semibold">{formatNumber(TOTAL_SUPPLY)} xDINAR</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          ref={mechanicsRef}
          variants={containerVariants}
          animate={mechanicsInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={itemVariants} className="glass-card p-6 border-gold/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Flame size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-content text-lg">Burning Mechanism</h3>
                <p className="text-content-dim text-xs font-body">Deflationary by design</p>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                { trigger: 'Every Transaction', rate: '2% burned' },
                { trigger: 'Swap Volume', rate: '0.5% of each swap' },
                { trigger: 'Early Staking Exit', rate: '5% penalty burned' },
                { trigger: 'Treasury Revenue', rate: 'Quarterly burn events' },
              ].map((item) => (
                <li key={item.trigger} className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                  <span className="text-content-muted text-sm font-body">{item.trigger}</span>
                  <span className="text-gold text-sm font-mono font-medium">{item.rate}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 border-accent/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Coins size={20} className="text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-content text-lg">Minting Control</h3>
                <p className="text-content-dim text-xs font-body">Hard cap enforced on-chain</p>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Hard Cap', value: '500,000 xDINAR' },
                { label: 'Staking Rewards', value: 'Programmatic only' },
                { label: 'DAO Mint', value: '67% supermajority' },
                { label: 'Ecosystem Grants', value: 'Governance approval' },
              ].map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                  <span className="text-content-muted text-sm font-body">{item.label}</span>
                  <span className="text-accent text-sm font-mono font-medium">{item.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-content-dim text-xs font-body leading-relaxed">
              Every burn event is logged on-chain and publicly verifiable via BSCScan.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
