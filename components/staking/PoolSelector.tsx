'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  type Pool,
  TOKEN_SYMBOL,
  formatApr,
  formatDuration,
  formatPayoutMultiple,
  formatPercent,
  formatTokenDisplay,
  lockReturnPercent,
} from '@/lib/staking-contract'

interface PoolSelectorProps {
  pools: readonly Pool[]
  selectedId: number | null
  onSelect: (poolId: number) => void
  /** Pool ids where the connected wallet has an unclaimed stake. */
  positionPoolIds: Set<number>
}

export function PoolSelector({ pools, selectedId, onSelect, positionPoolIds }: PoolSelectorProps) {
  // Inactive pools are closed to new stakes. Hide them unless the user still has a position there.
  const visible = pools
    .map((pool, id) => ({ pool, id }))
    .filter(({ pool, id }) => pool.isActive || positionPoolIds.has(id))

  if (visible.length === 0) {
    return (
      <div className="glass-card p-6 text-center text-content-muted font-body text-sm">
        No staking pools are open right now.
      </div>
    )
  }

  return (
    <div role="radiogroup" aria-label="Staking pool" className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {visible.map(({ pool, id }, i) => {
        const selected = selectedId === id
        const pct = lockReturnPercent(pool)

        return (
          <motion.button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={!pool.isActive}
            disabled={!pool.isActive}
            onClick={() => onSelect(id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className={cn(
              'glass-card p-5 text-left transition-all duration-200 relative',
              pool.isActive && 'hover:border-gold/40 cursor-pointer',
              selected && 'border-gold/60 glow-gold-sm',
              !pool.isActive && 'opacity-60 cursor-not-allowed'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-content-dim">Pool {id}</span>
              {pool.isActive ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-body text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Open
                </span>
              ) : (
                <span className="text-xs font-body text-amber-400">Closed to new stakes</span>
              )}
            </div>

            <p className="font-display font-bold text-content text-2xl leading-none mb-1">
              {formatDuration(pool.lockDuration)}
            </p>
            <p className="text-xs font-body text-content-dim mb-4">lock period</p>

            <p className="font-mono font-semibold text-gold text-lg leading-tight">+{formatPercent(pct)}</p>
            <p className="text-xs font-body text-content-muted mb-4">
              reward after {formatDuration(pool.lockDuration)} · returns {formatPayoutMultiple(pct)} your stake
            </p>

            <div className="border-t border-border/60 pt-3 space-y-1.5">
              <div className="flex justify-between gap-2 text-xs font-body">
                <span className="text-content-dim">APR (annualised)</span>
                <span className="font-mono text-content-muted">{formatApr(pool.aprBasisPoints)}</span>
              </div>
              <div className="flex justify-between gap-2 text-xs font-body">
                <span className="text-content-dim">Total staked</span>
                <span className="font-mono text-content-muted">
                  {formatTokenDisplay(pool.totalStaked, 2)}
                  {pool.maxCap > 0n && ` / ${formatTokenDisplay(pool.maxCap, 0)}`} {TOKEN_SYMBOL}
                </span>
              </div>
            </div>

            {positionPoolIds.has(id) && (
              <span className="absolute -top-2 right-4 rounded-full bg-gold text-bg-base text-[10px] font-body font-semibold px-2 py-0.5">
                Your position
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
