'use client'

import { useReadContract } from 'wagmi'
import { STAKING_ABI } from '@/lib/staking-abi'
import { STAKING_CONTRACT_ADDRESS, bpsToPercent, secondsToDays } from '@/lib/staking-contract'
import { cn } from '@/lib/utils'

export function PoolStatusBanner() {
  const { data: pool, isLoading } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'getPool',
    query: { refetchInterval: 30_000 },
  })

  if (isLoading) {
    return (
      <div className="banner-fade w-full border-b border-gold/20 bg-gold/[0.03] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className="h-3.5 w-24 bg-bg-raised rounded animate-pulse" />
          <div className="h-3.5 w-20 bg-bg-raised rounded animate-pulse" />
          <div className="h-3.5 w-16 bg-bg-raised rounded animate-pulse" />
          <div className="h-2 w-32 bg-bg-raised rounded-full animate-pulse" />
        </div>
      </div>
    )
  }

  const isActive = pool?.isActive ?? false
  const lockDays = pool ? secondsToDays(pool.lockDuration) : 0
  const aprStr = pool ? bpsToPercent(pool.aprBasisPoints) : '0.00'
  const maxCap = pool?.maxCap ?? 0n
  const totalStaked = pool?.totalStaked ?? 0n
  const fillPct = maxCap > 0n ? Number((totalStaked * 100n) / maxCap) : 0
  const almostFull = fillPct > 90

  return (
    <div className="banner-fade w-full border-b border-gold/20 bg-gold/[0.03] py-3 px-4">
      <div className="max-w-7xl mx-auto sm:px-2 lg:px-4 flex flex-wrap items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full flex-shrink-0',
              isActive ? 'bg-green-400 animate-pulse' : 'bg-amber-400'
            )}
          />
          <span className="text-xs font-body font-medium text-content-muted">
            {isActive ? 'Pool Active' : 'Pool Paused'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-body text-content-dim">Lock Period:</span>
          <span className="text-xs font-body font-semibold text-content">{lockDays}d</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-body text-content-dim">APR:</span>
          <span className="text-xs font-body font-semibold text-gold">{aprStr}%</span>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <span className="text-xs font-body text-content-dim whitespace-nowrap">Capacity:</span>
          <div className="flex-1 h-1.5 rounded-full bg-bg-raised overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${fillPct}%`, background: 'linear-gradient(90deg, #C9A84C, #E8C97A)' }}
            />
          </div>
          <span className="text-xs font-mono text-content-muted whitespace-nowrap">{fillPct}%</span>
        </div>

        {almostFull && (
          <span className="text-xs font-body text-amber-400">⚠ Almost full</span>
        )}
      </div>
    </div>
  )
}
