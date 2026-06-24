'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { STAKING_ABI } from '@/lib/staking-abi'
import {
  STAKING_CONTRACT_ADDRESS,
  formatTokenDisplay,
  getUnlockDate,
  getCountdown,
  getProgressPercent,
} from '@/lib/staking-contract'
import { cn } from '@/lib/utils'

export function MyStakes() {
  const { address, isConnected } = useAccount()
  const [claimingIndex, setClaimingIndex] = useState<number | null>(null)
  const [claimTxHash, setClaimTxHash] = useState<`0x${string}` | undefined>()
  const [countdowns, setCountdowns] = useState<string[]>([])
  const [progresses, setProgresses] = useState<number[]>([])

  const { data: stakes, refetch } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'getUserStakes',
    args: [address!],
    query: { enabled: isConnected && !!address, refetchInterval: 15_000 },
  })

  const { writeContractAsync } = useWriteContract()

  const { isSuccess: claimSuccess } = useWaitForTransactionReceipt({
    hash: claimTxHash,
    query: { enabled: !!claimTxHash },
  })

  useEffect(() => {
    if (claimSuccess && claimingIndex !== null) {
      setClaimingIndex(null)
      setClaimTxHash(undefined)
      refetch()
    }
  }, [claimSuccess, claimingIndex, refetch])

  useEffect(() => {
    if (!stakes?.length) return
    function update() {
      if (!stakes) return
      setCountdowns(stakes.map((s) => (s.claimed ? '—' : getCountdown(s.unlockTime))))
      setProgresses(stakes.map((s) => getProgressPercent(s.startTime, s.unlockTime)))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [stakes])

  if (!isConnected) return null

  const stakeList = stakes ?? []

  return (
    <div>
      <h2
        className="font-display font-bold text-content mb-6"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
      >
        My Stakes
      </h2>

      {stakeList.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-content-muted font-body">
            No active stakes yet. Use the calculator above to start earning.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stakeList.map((stake, i) => {
            const now = BigInt(Math.floor(Date.now() / 1000))
            const unlocked = now >= stake.unlockTime
            const isClaiming = claimingIndex === i

            const rewardEst =
              (stake.amount * stake.aprBasisPoints * (stake.unlockTime - stake.startTime)) /
              (BigInt(365 * 86400) * 10000n)

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className={cn('glass-card p-5', stake.claimed && 'opacity-50')}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-body text-content-dim">
                    Stake #{i + 1} · {getUnlockDate(stake.startTime)}
                  </span>
                  {stake.claimed ? (
                    <span className="badge-locked line-through">Claimed</span>
                  ) : unlocked ? (
                    <span className="badge-ready">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      Ready to Claim
                    </span>
                  ) : (
                    <span className="badge-locked">Locked</span>
                  )}
                </div>

                <p className="font-mono text-2xl font-bold text-content mb-1">
                  {formatTokenDisplay(stake.amount, 2)}{' '}
                  <span className="text-sm font-normal text-content-dim">XDNR</span>
                </p>

                {!stake.claimed && (
                  <div className="progress-bar-track my-3">
                    <div className="progress-bar-fill" style={{ width: `${progresses[i] ?? 0}%` }} />
                  </div>
                )}

                {!stake.claimed && !unlocked && (
                  <p className="text-xs font-mono text-content-dim mb-3">{countdowns[i] ?? '—'}</p>
                )}

                <div className="flex items-center justify-between text-xs font-body text-content-dim mb-3">
                  <span>Unlock: {getUnlockDate(stake.unlockTime)}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-content-dim font-body">Reward</span>
                  <span className="text-gold font-mono text-sm font-semibold">
                    ≈ {formatTokenDisplay(rewardEst, 4)} XDNR
                  </span>
                </div>

                {!stake.claimed && (
                  unlocked ? (
                    <button
                      onClick={async () => {
                        setClaimingIndex(i)
                        try {
                          const hash = await writeContractAsync({
                            address: STAKING_CONTRACT_ADDRESS,
                            abi: STAKING_ABI,
                            functionName: 'unstake',
                            args: [BigInt(i)],
                          })
                          setClaimTxHash(hash)
                        } catch {
                          setClaimingIndex(null)
                        }
                      }}
                      disabled={isClaiming}
                      className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isClaiming ? (
                        <><Loader2 size={14} className="animate-spin" /> Claiming...</>
                      ) : (
                        'Claim & Unstake →'
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-lg bg-bg-raised text-content-dim text-sm font-body font-medium cursor-not-allowed"
                    >
                      🔒 Locked
                    </button>
                  )
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
