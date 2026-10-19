'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEventLogs } from 'viem'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react'
import { STAKING_ABI } from '@/lib/abi/xDinarStaking'
import { net } from '@/lib/chains'
import { useRefreshStakingData } from '@/hooks/useStaking'
import { SwitchNetworkButton } from './SwitchNetworkButton'
import {
  type Pool,
  TOKEN_SYMBOL,
  calculateReward,
  formatCountdown,
  formatDuration,
  formatPercent,
  formatTokenDisplay,
  getProgressPercent,
  lockReturnPercent,
} from '@/lib/staking-contract'
import { cn } from '@/lib/utils'

const staking = { address: net.stakingAddress, abi: STAKING_ABI, chainId: net.chain.id } as const

function useNowSeconds(active: boolean) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [active])
  return now
}

interface EarlyUnstakeTarget {
  stakeIndex: number
  amount: bigint
  fullReward: bigint
}

function EarlyUnstakeDialog({
  target,
  secondsLeft,
  unlocked,
  onCancel,
  onConfirm,
}: {
  target: EarlyUnstakeTarget
  secondsLeft: number
  unlocked: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const principal = `${formatTokenDisplay(target.amount, 4)} ${TOKEN_SYMBOL}`
  const reward = `${formatTokenDisplay(target.fullReward, 6)} ${TOKEN_SYMBOL}`

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="early-unstake-title"
        aria-describedby="early-unstake-desc"
        onClick={(e) => e.stopPropagation()}
        className="relative glass-card w-full max-w-md p-6 border-amber-400/30"
      >
        {unlocked ? (
          <>
            <h3 id="early-unstake-title" className="font-display font-semibold text-content text-lg mb-3">
              This stake just unlocked
            </h3>
            <p id="early-unstake-desc" className="text-sm font-body text-content-muted mb-6">
              Nothing is forfeited now. Claim to receive your {principal} principal plus the {reward} reward.
            </p>
          </>
        ) : (
          <>
            <h3
              id="early-unstake-title"
              className="flex items-center gap-2 font-display font-semibold text-content text-lg mb-3"
            >
              <AlertTriangle size={18} className="text-amber-400" /> Unstake early?
            </h3>
            <p id="early-unstake-desc" className="text-sm font-body text-content-muted mb-3">
              {secondsLeft > 0 ? (
                <>
                  This stake unlocks in{' '}
                  <span className="font-mono text-content tabular-nums">{formatCountdown(secondsLeft)}</span>.
                </>
              ) : (
                <>This stake is unlocking now — waiting for the next block.</>
              )}{' '}
              Unstaking now returns your <span className="text-content">{principal}</span> principal, but you&apos;ll
              forfeit the <span className="text-amber-300">{reward}</span> reward.
            </p>
            <p className="text-xs font-body text-content-dim mb-6">
              {secondsLeft > 0
                ? 'Wait for the countdown to finish to claim the full reward.'
                : 'Wait a few seconds and you can claim the full reward.'}
            </p>
          </>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button ref={cancelRef} onClick={onCancel} className="btn-secondary flex-1 justify-center">
            {unlocked ? 'Cancel' : 'Keep Staking'}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'flex-1 justify-center',
              unlocked
                ? 'btn-primary'
                : 'inline-flex items-center px-4 py-2.5 rounded-lg border border-amber-400/50 bg-amber-400/10 text-amber-300 text-sm font-body font-semibold hover:bg-amber-400/20 transition-colors'
            )}
          >
            {unlocked ? 'Claim →' : 'Unstake Early'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function MyStakes({ pools }: { pools: readonly Pool[] | undefined }) {
  const { address, isConnected, chainId: walletChainId } = useAccount()
  const wrongNetwork = isConnected && walletChainId !== net.chain.id
  const refresh = useRefreshStakingData()

  const [claimingIndex, setClaimingIndex] = useState<number | null>(null)
  const [claimTxHash, setClaimTxHash] = useState<`0x${string}` | undefined>()
  const [claimResult, setClaimResult] = useState<{ principal: bigint; reward: bigint; early: boolean } | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<EarlyUnstakeTarget | null>(null)
  // Full reward the claiming stake would earn on time — tells a 0 reward from an early exit apart
  // from one that simply rounds to 0 on a tiny stake.
  const pendingFullReward = useRef(0n)
  const [claimError, setClaimError] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const { data: stakes } = useReadContract({
    ...staking,
    functionName: 'getUserStakes',
    args: [address!],
    query: { enabled: !!address, refetchInterval: 15_000 },
  })

  // Keep the original array index: it is the stakeIndex the contract expects.
  const indexed = useMemo(() => (stakes ?? []).map((s, stakeIndex) => ({ ...s, stakeIndex })), [stakes])
  const open = indexed.filter((s) => !s.claimed).reverse()
  const history = indexed.filter((s) => s.claimed).reverse()

  const now = useNowSeconds(open.length > 0)
  const anyCountingDown = open.some((s) => Number(s.unlockTime) > now - 15)

  // The contract's isUnlocked() (chain time) is the source of truth for enabling Unstake.
  const { data: unlockedFlags } = useReadContracts({
    contracts: open.map((s) => ({
      ...staking,
      functionName: 'isUnlocked' as const,
      args: [address!, BigInt(s.stakeIndex)] as const,
    })),
    query: { enabled: !!address && open.length > 0, refetchInterval: anyCountingDown ? 3_000 : 15_000 },
  })
  const isUnlocked = (stakeIndex: number) => {
    const i = open.findIndex((s) => s.stakeIndex === stakeIndex)
    return unlockedFlags?.[i]?.result === true
  }

  const closeConfirm = useCallback(() => setConfirmTarget(null), [])

  const { writeContractAsync } = useWriteContract()
  const { data: claimReceipt } = useWaitForTransactionReceipt({
    hash: claimTxHash,
    chainId: net.chain.id,
    query: { enabled: !!claimTxHash },
  })

  useEffect(() => {
    if (!claimReceipt || claimingIndex === null) return
    const [unstaked] = parseEventLogs({ abi: STAKING_ABI, eventName: 'Unstaked', logs: claimReceipt.logs })
    if (claimReceipt.status === 'success' && unstaked) {
      const { principal, reward } = unstaked.args
      setClaimResult({ principal, reward, early: reward === 0n && pendingFullReward.current > 0n })
    } else {
      setClaimError('Unstake failed on-chain. Please try again.')
    }
    setClaimingIndex(null)
    setClaimTxHash(undefined)
    refresh()
  }, [claimReceipt, claimingIndex, refresh])

  async function handleUnstake(stakeIndex: number, fullReward: bigint) {
    pendingFullReward.current = fullReward
    setConfirmTarget(null)
    setClaimingIndex(stakeIndex)
    setClaimResult(null)
    setClaimError('')
    try {
      const hash = await writeContractAsync({
        address: net.stakingAddress!,
        abi: STAKING_ABI,
        functionName: 'unstake',
        args: [BigInt(stakeIndex)],
        chainId: net.chain.id,
      })
      setClaimTxHash(hash)
    } catch (err) {
      setClaimingIndex(null)
      const msg = (err as Error).message
      setClaimError(
        /User (rejected|denied)/.test(msg)
          ? 'Transaction cancelled.'
          : msg.includes('Already unstaked')
            ? 'This stake has already been unstaked.'
            : 'Something went wrong. Please try again.'
      )
    }
  }

  if (!isConnected) return null

  return (
    <div>
      <h2 className="font-display font-bold text-content mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
        My Stakes
      </h2>

      {claimResult &&
        (claimResult.early ? (
          <div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 mb-4 text-sm font-body text-amber-300">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            Unstaked early: {formatTokenDisplay(claimResult.principal, 4)} {TOKEN_SYMBOL} principal returned, reward
            forfeited.
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 mb-4 text-sm font-body text-green-400">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            Claimed: {formatTokenDisplay(claimResult.principal, 4)} {TOKEN_SYMBOL} principal +{' '}
            {formatTokenDisplay(claimResult.reward, 6)} {TOKEN_SYMBOL} reward received.
          </div>
        ))}
      {claimError && (
        <div className="flex items-center gap-2 text-red-400 text-sm font-body mb-4">
          <AlertCircle size={14} /> {claimError}
        </div>
      )}

      {open.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-content-muted font-body">No active stakes. Pick a pool above to start earning.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {open.map((stake, i) => {
            const pool = pools?.[Number(stake.poolId)]
            const secondsLeft = Number(stake.unlockTime) - now
            const unlocked = isUnlocked(stake.stakeIndex)
            const isClaiming = claimingIndex === stake.stakeIndex
            const duration = stake.unlockTime - stake.startTime
            // Same terms the contract will pay: this stake's own APR and duration.
            const reward = calculateReward(stake.amount, duration, stake.aprBasisPoints)
            const pct = lockReturnPercent({ lockDuration: duration, aprBasisPoints: stake.aprBasisPoints })

            return (
              <motion.div
                key={stake.stakeIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className={cn('glass-card p-5', unlocked && 'border-gold/40')}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-body text-content-dim">Stake #{stake.stakeIndex + 1}</p>
                    <p className="text-xs font-body text-content-muted mt-0.5">
                      Pool {Number(stake.poolId)} · {formatDuration(duration)} lock · +{formatPercent(pct)}
                    </p>
                  </div>
                  {unlocked ? (
                    <span className="badge-ready">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      Ready
                    </span>
                  ) : (
                    <span className="badge-locked">Locked</span>
                  )}
                </div>

                {pool && !pool.isActive && (
                  <p className="text-[11px] font-body text-amber-400/90 mb-3">
                    Pool closed to new stakes — this position still pays out on schedule.
                  </p>
                )}

                <p className="font-mono text-2xl font-bold text-content mb-1">
                  {formatTokenDisplay(stake.amount, 4)} <span className="text-sm font-normal text-content-dim">{TOKEN_SYMBOL}</span>
                </p>

                <div className="progress-bar-track my-3">
                  <div
                    className="progress-bar-fill transition-[width] duration-1000 ease-linear"
                    style={{ width: `${getProgressPercent(stake.startTime, stake.unlockTime, now)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-content-dim font-body">
                    {unlocked ? 'Unlocked' : secondsLeft > 0 ? 'Unlocks in' : 'Unlocking…'}
                  </span>
                  <span
                    className={cn('font-mono text-lg font-semibold tabular-nums', unlocked ? 'text-gold' : 'text-content')}
                    aria-live="off"
                  >
                    {unlocked ? '00:00' : formatCountdown(secondsLeft)}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-content-dim font-body">Reward</span>
                  <span className="text-gold font-mono text-sm font-semibold">
                    +{formatTokenDisplay(reward, 6)} {TOKEN_SYMBOL}
                  </span>
                </div>

                {wrongNetwork ? (
                  <SwitchNetworkButton compact />
                ) : (
                  <button
                    onClick={() =>
                      unlocked
                        ? handleUnstake(stake.stakeIndex, reward)
                        : setConfirmTarget({ stakeIndex: stake.stakeIndex, amount: stake.amount, fullReward: reward })
                    }
                    disabled={claimingIndex !== null}
                    className={cn(
                      'w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed',
                      unlocked ? 'btn-primary' : 'btn-secondary'
                    )}
                  >
                    {isClaiming ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" /> {unlocked ? 'Claiming...' : 'Unstaking...'}
                      </span>
                    ) : unlocked ? (
                      'Claim →'
                    ) : (
                      'Unstake Early'
                    )}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {confirmTarget &&
        (() => {
          const target = open.find((s) => s.stakeIndex === confirmTarget.stakeIndex)
          if (!target) return null
          const targetUnlocked = isUnlocked(target.stakeIndex)
          return (
            <EarlyUnstakeDialog
              target={confirmTarget}
              secondsLeft={Number(target.unlockTime) - now}
              unlocked={targetUnlocked}
              onCancel={closeConfirm}
              onConfirm={() => handleUnstake(confirmTarget.stakeIndex, confirmTarget.fullReward)}
            />
          )
        })()}

      {history.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="text-xs font-body text-content-dim hover:text-gold transition-colors"
          >
            {showHistory ? 'Hide' : 'Show'} claimed stakes ({history.length})
          </button>
          {showHistory && (
            <ul className="mt-3 divide-y divide-border/50 glass-card">
              {history.map((s) => (
                <li key={s.stakeIndex} className="flex items-center justify-between gap-4 px-4 py-3 text-xs font-body">
                  <span className="text-content-dim">
                    Stake #{s.stakeIndex + 1} · Pool {Number(s.poolId)}
                  </span>
                  <span className="font-mono text-content-muted">
                    {formatTokenDisplay(s.amount, 4)} {TOKEN_SYMBOL} · claimed
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
