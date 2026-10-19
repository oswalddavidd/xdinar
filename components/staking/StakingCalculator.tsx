'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEventLogs } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { STAKING_ABI } from '@/lib/abi/xDinarStaking'
import { TOKEN_ABI } from '@/lib/abi/xDinarToken'
import { net } from '@/lib/chains'
import { useRefreshStakingData } from '@/hooks/useStaking'
import { SwitchNetworkButton } from './SwitchNetworkButton'
import {
  type Pool,
  TOKEN_SYMBOL,
  toTokenUnits,
  fromTokenUnits,
  formatTokenDisplay,
  formatDuration,
  formatPercent,
  formatPayoutMultiple,
  lockReturnPercent,
} from '@/lib/staking-contract'
import { cn } from '@/lib/utils'
import { GoldParticles } from './GoldParticles'

type TxStep = 'idle' | 'approving' | 'staking' | 'success' | 'error'

const ERROR_MAP: Record<string, string> = {
  'Pool is not active': 'This pool is closed to new stakes.',
  'Pool cap reached': 'This pool is full. Try a smaller amount or another pool.',
  'Insufficient reward treasury': 'The reward fund can’t cover this stake. Try a smaller amount.',
  EnforcedPause: 'Staking is temporarily paused.',
  'Amount must be > 0': 'Please enter an amount greater than 0.',
  'User rejected': 'Transaction cancelled.',
  'User denied': 'Transaction cancelled.',
}

function getFriendlyError(error: Error): string {
  for (const [key, msg] of Object.entries(ERROR_MAP)) {
    if (error.message.includes(key)) return msg
  }
  return 'Something went wrong. Please try again.'
}

interface StakingCalculatorProps {
  poolId: number
  pool: Pool
  rewardTreasury: bigint | undefined
  paused: boolean
}

export function StakingCalculator({ poolId, pool, rewardTreasury, paused }: StakingCalculatorProps) {
  const { address, isConnected, chainId: walletChainId } = useAccount()
  const wrongNetwork = isConnected && walletChainId !== net.chain.id
  const refresh = useRefreshStakingData()

  const [amount, setAmount] = useState('')
  const [debouncedAmount, setDebouncedAmount] = useState('')
  const [txStep, setTxStep] = useState<TxStep>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showParticles, setShowParticles] = useState(false)
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>()
  const [stakeTxHash, setStakeTxHash] = useState<`0x${string}` | undefined>()
  const [confirmed, setConfirmed] = useState<{ stakeIndex: bigint; unlockTime: bigint } | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedAmount(amount), 300)
    return () => clearTimeout(t)
  }, [amount])

  // Switching pools starts a fresh quote.
  useEffect(() => {
    setTxStep('idle')
    setErrorMsg('')
    setConfirmed(null)
  }, [poolId])

  const pct = lockReturnPercent(pool)

  const { data: balance } = useReadContract({
    address: net.tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address!],
    chainId: net.chain.id,
    query: { enabled: !!address, refetchInterval: 15_000 },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: net.tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: [address!, net.stakingAddress!],
    chainId: net.chain.id,
    query: { enabled: !!address, refetchInterval: 10_000 },
  })

  const parsedDebounced =
    debouncedAmount && !isNaN(parseFloat(debouncedAmount)) && parseFloat(debouncedAmount) > 0
      ? toTokenUnits(debouncedAmount)
      : 0n

  const { data: previewReward, isFetching: previewLoading } = useReadContract({
    address: net.stakingAddress,
    abi: STAKING_ABI,
    functionName: 'previewReward',
    args: [BigInt(poolId), parsedDebounced],
    chainId: net.chain.id,
    query: { enabled: parsedDebounced > 0n },
  })

  const { writeContractAsync } = useWriteContract()

  const { data: approveReceipt } = useWaitForTransactionReceipt({
    hash: approveTxHash,
    chainId: net.chain.id,
    query: { enabled: !!approveTxHash },
  })

  const { data: stakeReceipt } = useWaitForTransactionReceipt({
    hash: stakeTxHash,
    chainId: net.chain.id,
    query: { enabled: !!stakeTxHash },
  })

  useEffect(() => {
    if (!approveReceipt || txStep !== 'approving') return
    if (approveReceipt.status !== 'success') {
      setTxStep('error')
      setErrorMsg('Approval failed on-chain. Please try again.')
      return
    }
    setTxStep('idle')
    refetchAllowance()
  }, [approveReceipt, txStep, refetchAllowance])

  // Confirm via the Staked event in the receipt, not just the tx status.
  useEffect(() => {
    if (!stakeReceipt || txStep !== 'staking') return
    const [staked] = parseEventLogs({ abi: STAKING_ABI, eventName: 'Staked', logs: stakeReceipt.logs })
    if (stakeReceipt.status !== 'success' || !staked) {
      setTxStep('error')
      setErrorMsg('Stake failed on-chain. Please try again.')
      return
    }
    setConfirmed({ stakeIndex: staked.args.stakeIndex, unlockTime: staked.args.unlockTime })
    setTxStep('success')
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 3000)
    refresh()
  }, [stakeReceipt, txStep, refresh])

  const amountBig =
    amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ? toTokenUnits(amount) : 0n
  const amountIsCurrent = amount === debouncedAmount

  const needsApproval = allowance === undefined ? true : allowance < amountBig
  const hasEnough = (balance ?? 0n) >= amountBig
  const capLeft = pool.maxCap > 0n ? pool.maxCap - pool.totalStaked : undefined
  const exceedsCap = capLeft !== undefined && amountBig > capLeft
  // Mirrors the contract's `rewardTreasury >= reward` check so users get a clear message, not a revert.
  const treasuryShort =
    amountIsCurrent && previewReward !== undefined && rewardTreasury !== undefined && previewReward > rewardTreasury

  const balanceNum = balance ? parseFloat(fromTokenUnits(balance)) : 0
  const progressPct = balanceNum > 0 ? Math.min(100, ((parseFloat(amount) || 0) / balanceNum) * 100) : 0

  const rewardBig = amountIsCurrent ? (previewReward ?? 0n) : 0n
  const totalAtUnlock = amountBig + rewardBig

  async function handleApprove() {
    if (amountBig <= 0n) return
    setTxStep('approving')
    setErrorMsg('')
    try {
      const hash = await writeContractAsync({
        address: net.tokenAddress!,
        abi: TOKEN_ABI,
        functionName: 'approve',
        args: [net.stakingAddress!, amountBig],
        chainId: net.chain.id,
      })
      setApproveTxHash(hash)
    } catch (err) {
      setTxStep('error')
      setErrorMsg(getFriendlyError(err as Error))
    }
  }

  async function handleStake() {
    if (amountBig <= 0n) return
    setTxStep('staking')
    setErrorMsg('')
    try {
      const hash = await writeContractAsync({
        address: net.stakingAddress!,
        abi: STAKING_ABI,
        functionName: 'stake',
        args: [BigInt(poolId), amountBig],
        chainId: net.chain.id,
      })
      setStakeTxHash(hash)
    } catch (err) {
      setTxStep('error')
      setErrorMsg(getFriendlyError(err as Error))
    }
  }

  function handleReset() {
    setAmount('')
    setTxStep('idle')
    setErrorMsg('')
    setConfirmed(null)
    setApproveTxHash(undefined)
    setStakeTxHash(undefined)
  }

  const disabledBtn = (label: string) => (
    <button
      disabled
      className="w-full py-4 rounded-xl bg-bg-raised text-content-dim font-body font-semibold text-base cursor-not-allowed"
    >
      {label}
    </button>
  )

  function renderCTA() {
    if (!isConnected) {
      return (
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button onClick={openConnectModal} className="btn-primary w-full justify-center text-base py-4">
              Connect Wallet to Stake
            </button>
          )}
        </ConnectButton.Custom>
      )
    }

    if (txStep === 'success') {
      return (
        <button
          onClick={handleReset}
          className="w-full py-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-400 font-body font-semibold text-base flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} /> Staked! Stake Again?
        </button>
      )
    }
    if (txStep === 'approving') {
      return (
        <button disabled className="btn-primary w-full justify-center text-base py-4 opacity-70">
          <Loader2 size={18} className="animate-spin" /> Approving...
        </button>
      )
    }
    if (txStep === 'staking') {
      return (
        <button disabled className="btn-primary w-full justify-center text-base py-4 opacity-70">
          <Loader2 size={18} className="animate-spin" /> Staking...
        </button>
      )
    }

    if (paused) return disabledBtn('Staking Paused')
    if (!pool.isActive) return disabledBtn('Pool Closed to New Stakes')
    if (amountBig === 0n) return disabledBtn('Enter an amount')
    if (!hasEnough) return disabledBtn('Insufficient Balance')
    if (exceedsCap) return disabledBtn(`Exceeds Pool Cap (${formatTokenDisplay(capLeft ?? 0n, 2)} left)`)
    if (!amountIsCurrent || previewLoading) return disabledBtn('Calculating reward…')
    if (treasuryShort) return disabledBtn('Reward Fund Too Low — Try Less')

    if (needsApproval) {
      return (
        <button onClick={handleApprove} className="btn-primary w-full justify-center text-base py-4">
          Approve {TOKEN_SYMBOL}
        </button>
      )
    }
    return (
      <button onClick={handleStake} className="btn-primary w-full justify-center text-base py-4 animate-pulse-gold">
        Stake in Pool {poolId} →
      </button>
    )
  }

  if (wrongNetwork) {
    return (
      <div className="glass-card p-6 sm:p-8 max-w-xl mx-auto text-center">
        <h2 className="font-display font-bold text-content mb-3" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
          Wrong Network
        </h2>
        <p className="text-content-muted font-body text-sm mb-6">
          Your wallet is connected to a different network. xDINAR staking runs on {net.chain.name}.
        </p>
        <SwitchNetworkButton />
      </div>
    )
  }

  const showStepHint =
    isConnected && needsApproval && amountBig > 0n && hasEnough && txStep !== 'success' && txStep !== 'error'

  return (
    <>
      {showParticles && <GoldParticles />}

      <div className="glass-card p-6 sm:p-8 max-w-xl mx-auto">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="font-display font-bold text-content" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            Stake {TOKEN_SYMBOL}
          </h2>
          <span className="text-xs font-body text-content-dim whitespace-nowrap">
            Pool {poolId} · {formatDuration(pool.lockDuration)} lock
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="stake-amount" className="text-xs font-body text-content-dim">Amount</label>
            {isConnected && balance !== undefined && (
              <button
                onClick={() => setAmount(fromTokenUnits(balance))}
                className="text-xs font-body text-gold hover:text-gold-light transition-colors"
              >
                Max: {formatTokenDisplay(balance, 2)} {TOKEN_SYMBOL}
              </button>
            )}
          </div>
          <input
            id="stake-amount"
            type="number"
            inputMode="decimal"
            className="stake-input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              if (txStep === 'error') setTxStep('idle')
            }}
            min="0"
            disabled={txStep === 'approving' || txStep === 'staking' || txStep === 'success'}
          />
        </div>

        <div className="mb-6">
          <input
            type="range"
            aria-label="Percent of balance"
            className="stake-slider w-full"
            min="0"
            max="100"
            value={Math.round(progressPct)}
            style={{ '--progress': `${progressPct}%` } as React.CSSProperties}
            onChange={(e) => {
              if (balance && balance > 0n) {
                const newAmount = (balance * BigInt(e.target.value)) / 100n
                setAmount(newAmount > 0n ? fromTokenUnits(newAmount) : '')
              }
            }}
            disabled={!isConnected || !balance || txStep === 'success'}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-content-dim font-body">0%</span>
            <span className="text-xs text-content-dim font-body">100%</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Lock Period', value: formatDuration(pool.lockDuration), gold: false },
            { label: 'Reward', value: `+${formatPercent(pct)}`, gold: true },
            { label: 'You Get Back', value: formatPayoutMultiple(pct), gold: false },
          ].map((item) => (
            <div key={item.label} className="bg-bg-raised rounded-xl p-3 text-center">
              <p className="text-xs text-content-dim font-body mb-1">{item.label}</p>
              <p className={cn('font-mono font-semibold text-sm', item.gold ? 'text-gold' : 'text-content')}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {amountBig > 0n && txStep !== 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-gold/30 bg-gold/5 p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-body text-content-dim">Estimated Reward</span>
              <span className="text-gold font-mono font-semibold">
                {amountIsCurrent && !previewLoading ? `+${formatTokenDisplay(rewardBig, 6)} ${TOKEN_SYMBOL}` : '…'}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-body text-content-dim">Total at Unlock</span>
              <span className="text-content font-mono text-sm">
                {formatTokenDisplay(totalAtUnlock, 6)} {TOKEN_SYMBOL}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-body text-content-dim">Unlocks</span>
              <span className="text-content-muted font-mono text-xs">
                {formatDuration(pool.lockDuration)} after confirmation
              </span>
            </div>
          </motion.div>
        )}

        {txStep === 'success' && confirmed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 mb-6 text-sm font-body text-content-muted"
          >
            Stake #{Number(confirmed.stakeIndex) + 1} confirmed. Unlocks at{' '}
            <span className="font-mono text-content">
              {new Date(Number(confirmed.unlockTime) * 1000).toLocaleTimeString()}
            </span>
            . Watch it count down in My Stakes below.
          </motion.div>
        )}

        {showStepHint && (
          <p className="text-xs text-content-dim font-body text-center mb-3">
            Step 1 of 2: <span className="text-content">Approve</span> → Step 2: Stake
          </p>
        )}

        {renderCTA()}

        {txStep === 'error' && errorMsg && (
          <div className="flex items-center gap-2 text-red-400 text-sm font-body mt-3">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </>
  )
}
