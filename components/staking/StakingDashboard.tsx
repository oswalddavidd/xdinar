'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { STAKING_ABI } from '@/lib/abi/xDinarStaking'
import { net, contractsDeployed } from '@/lib/chains'
import { usePools, useStakingGlobals, useStakingEventRefresh } from '@/hooks/useStaking'
import { PoolSelector } from './PoolSelector'
import { StakingCalculator } from './StakingCalculator'
import { MyStakes } from './MyStakes'

export function StakingDashboard() {
  const { address } = useAccount()
  const { pools, isLoading, isError } = usePools()
  const { rewardTreasury, paused } = useStakingGlobals()
  useStakingEventRefresh()

  // Same query as MyStakes (deduped by react-query) — used to keep pools with open positions visible.
  const { data: stakes } = useReadContract({
    address: net.stakingAddress,
    abi: STAKING_ABI,
    functionName: 'getUserStakes',
    args: [address!],
    chainId: net.chain.id,
    query: { enabled: contractsDeployed && !!address, refetchInterval: 15_000 },
  })
  const positionPoolIds = useMemo(
    () => new Set((stakes ?? []).filter((s) => !s.claimed).map((s) => Number(s.poolId))),
    [stakes]
  )

  const [selectedId, setSelectedId] = useState<number | null>(null)

  // Default to the first open pool; move off a pool if it gets closed.
  useEffect(() => {
    if (!pools?.length) return
    if (selectedId !== null && pools[selectedId]?.isActive) return
    const firstOpen = pools.findIndex((p) => p.isActive)
    setSelectedId(firstOpen === -1 ? null : firstOpen)
  }, [pools, selectedId])

  if (!contractsDeployed) {
    return (
      <div className="glass-card p-6 sm:p-8 max-w-xl mx-auto text-center mb-24">
        <h2 className="font-display font-bold text-content mb-3" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
          Staking Coming Soon
        </h2>
        <p className="text-content-muted font-body text-sm">
          Staking is not yet available on {net.chain.name}. Check back after launch.
        </p>
      </div>
    )
  }

  const selectedPool = selectedId !== null ? pools?.[selectedId] : undefined

  return (
    <>
      <section className="mb-12" aria-labelledby="pools-heading">
        <h2 id="pools-heading" className="eyebrow text-center mb-6">
          Choose a Pool
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="glass-card h-64 animate-pulse" />
            ))}
          </div>
        ) : isError || !pools ? (
          <div className="glass-card p-6 text-center text-red-400 font-body text-sm">
            Couldn&apos;t load staking pools. Check your connection and refresh.
          </div>
        ) : (
          <PoolSelector
            pools={pools}
            selectedId={selectedId}
            onSelect={setSelectedId}
            positionPoolIds={positionPoolIds}
          />
        )}
      </section>

      {selectedId !== null && selectedPool && (
        <div className="mb-24">
          <StakingCalculator poolId={selectedId} pool={selectedPool} rewardTreasury={rewardTreasury} paused={paused} />
        </div>
      )}

      <div className="mb-24">
        <MyStakes pools={pools} />
      </div>
    </>
  )
}
