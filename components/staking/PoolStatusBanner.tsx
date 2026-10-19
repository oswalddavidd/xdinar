'use client'

import { contractsDeployed, isTestnet } from '@/lib/chains'
import { usePools, useStakingGlobals } from '@/hooks/useStaking'
import { TOKEN_SYMBOL, formatTokenDisplay } from '@/lib/staking-contract'
import { cn } from '@/lib/utils'

export function PoolStatusBanner() {
  const { pools, isLoading } = usePools()
  const { rewardTreasury, paused } = useStakingGlobals()

  if (!contractsDeployed) return null

  if (isLoading) {
    return (
      <div className="banner-fade w-full border-b border-gold/20 bg-gold/[0.03] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className="h-3.5 w-24 bg-bg-raised rounded animate-pulse" />
          <div className="h-3.5 w-20 bg-bg-raised rounded animate-pulse" />
          <div className="h-3.5 w-32 bg-bg-raised rounded animate-pulse" />
        </div>
      </div>
    )
  }

  const openCount = pools?.filter((p) => p.isActive).length ?? 0

  return (
    <div className="banner-fade w-full border-b border-gold/20 bg-gold/[0.03] py-3 px-4">
      <div className="max-w-7xl mx-auto sm:px-2 lg:px-4 flex flex-wrap items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2">
          <span
            className={cn('w-2 h-2 rounded-full flex-shrink-0', paused ? 'bg-amber-400' : 'bg-green-400 animate-pulse')}
          />
          <span className="text-xs font-body font-medium text-content-muted">
            {paused ? 'Staking Paused' : 'Staking Live'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-body text-content-dim">Open pools:</span>
          <span className="text-xs font-body font-semibold text-content">
            {openCount} of {pools?.length ?? 0}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-body text-content-dim">Reward fund:</span>
          <span className="text-xs font-mono font-semibold text-gold">
            {rewardTreasury !== undefined ? `${formatTokenDisplay(rewardTreasury, 2)} ${TOKEN_SYMBOL}` : '—'}
          </span>
        </div>

        {isTestnet && (
          <span className="text-xs font-body text-amber-300/90">
            Demo pools: lock periods are minutes long so you can watch them unlock live.
          </span>
        )}
      </div>
    </div>
  )
}
