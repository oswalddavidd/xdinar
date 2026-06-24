'use client'

import { useState, useEffect } from 'react'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId
} from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { STAKING_ABI, ERC20_APPROVE_ABI } from '@/lib/staking-abi'
import {
  STAKING_CONTRACT_ADDRESS,
  XDINAR_TOKEN_ADDRESS,
  toTokenUnits,
  fromTokenUnits,
  formatTokenDisplay,
  secondsToDays,
  formatLockDuration,
  bpsToPercent,
  getUnlockDate,
} from '@/lib/staking-contract'
import { cn } from '@/lib/utils'
import { GoldParticles } from './GoldParticles'

type TxStep = 'idle' | 'approving' | 'approved' | 'staking' | 'success' | 'error'

const ERROR_MAP: Record<string, string> = {
  'Pool is not active': 'Staking is temporarily paused.',
  'Pool cap reached': 'This pool is full. Check back later.',
  'Insufficient reward treasury': 'Pool rewards are being refilled. Try again shortly.',
  'Still locked': 'Your tokens are still locked. Check the unlock date.',
  'Already unstaked': 'This stake has already been claimed.',
  'Amount must be > 0': 'Please enter an amount greater than 0.',
  'User rejected': 'Transaction cancelled.',
}

function getFriendlyError(error: Error): string {
  for (const [key, msg] of Object.entries(ERROR_MAP)) {
    if (error.message.includes(key)) return msg
  }
  return 'Something went wrong. Please try again.'
}

export function StakingCalculator() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [amount, setAmount] = useState('')
  const [debouncedAmount, setDebouncedAmount] = useState('')
  const [txStep, setTxStep] = useState<TxStep>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showParticles, setShowParticles] = useState(false)
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>()
  const [stakeTxHash, setStakeTxHash] = useState<`0x${string}` | undefined>()

  console.log('chainId:', chainId)
  console.log('contract:', STAKING_CONTRACT_ADDRESS)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedAmount(amount), 300)
    return () => clearTimeout(t)
  }, [amount])

  const { data: pool, error: poolError } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'getPool',
    query: { refetchInterval: 30_000 },
  })

  console.log('pool data:', pool)
  console.log('pool error:', poolError)

  const isActive = pool?.isActive ?? true
  const lockDuration = pool?.lockDuration ?? 0n
  const aprBps = pool?.aprBasisPoints ?? 0n
  const lockDays = secondsToDays(lockDuration)
  const aprStr = bpsToPercent(aprBps)
  const unlockDateStr =
    lockDuration > 0n
      ? getUnlockDate(BigInt(Math.floor(Date.now() / 1000)) + lockDuration)
      : '—'

  const { data: balance } = useReadContract({
    address: XDINAR_TOKEN_ADDRESS,
    abi: ERC20_APPROVE_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: isConnected && !!address, refetchInterval: 15_000 },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: XDINAR_TOKEN_ADDRESS,
    abi: ERC20_APPROVE_ABI,
    functionName: 'allowance',
    args: [address!, STAKING_CONTRACT_ADDRESS],
    query: { enabled: isConnected && !!address, refetchInterval: 10_000 },
  })

  const parsedDebounced =
    debouncedAmount && !isNaN(parseFloat(debouncedAmount)) && parseFloat(debouncedAmount) > 0
      ? toTokenUnits(debouncedAmount)
      : 0n

  const { data: previewRewardRaw } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'previewReward',
    args: [parsedDebounced],
    query: { enabled: parsedDebounced > 0n },
  })

  const { writeContractAsync } = useWriteContract()

  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveTxHash,
    query: { enabled: !!approveTxHash },
  })

  const { isSuccess: stakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeTxHash,
    query: { enabled: !!stakeTxHash },
  })

  useEffect(() => {
    if (approveSuccess && txStep === 'approving') {
      setTxStep('approved')
      refetchAllowance()
    }
  }, [approveSuccess, txStep, refetchAllowance])

  useEffect(() => {
    if (stakeSuccess && txStep === 'staking') {
      setTxStep('success')
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 3000)
    }
  }, [stakeSuccess, txStep])

  const amountBig =
    amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0
      ? toTokenUnits(amount)
      : 0n

  const needsApproval = allowance === undefined ? true : allowance < amountBig
  const hasEnough = (balance ?? 0n) >= amountBig && amountBig > 0n

  const balanceNum = balance ? parseFloat(fromTokenUnits(balance)) : 0
  const progressPct = balanceNum > 0 ? Math.min(100, (parseFloat(amount) || 0) / balanceNum * 100) : 0

  const rewardBig = previewRewardRaw ?? 0n
  const totalAtUnlock = amountBig + rewardBig
  const dailyReward = lockDays > 0 ? rewardBig / BigInt(Math.ceil(lockDays)) : 0n

  async function handleApprove() {
    if (amountBig <= 0n) return
    setTxStep('approving')
    setErrorMsg('')
    try {
      const hash = await writeContractAsync({
        address: XDINAR_TOKEN_ADDRESS,
        abi: ERC20_APPROVE_ABI,
        functionName: 'approve',
        args: [STAKING_CONTRACT_ADDRESS, amountBig],
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
        address: STAKING_CONTRACT_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'stake',
        args: [amountBig],
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
    setApproveTxHash(undefined)
    setStakeTxHash(undefined)
  }

  function renderCTA() {
    console.log('txStep:', txStep)
    console.log('needsApproval:', needsApproval)
    console.log('allowance:', allowance?.toString())
    console.log('amountBig:', amountBig?.toString())
    if (!isConnected) {
      return (
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button
              onClick={openConnectModal}
              className="btn-primary w-full justify-center text-base py-4"
            >
              Connect Wallet to Stake
            </button>
          )}
        </ConnectButton.Custom>
      )
    }

    if (!isActive) {
      return (
        <button
          disabled
          className="w-full py-4 rounded-xl bg-bg-raised text-content-dim font-body font-semibold text-base cursor-not-allowed"
        >
          Pool Paused
        </button>
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

    if (!hasEnough && amountBig > 0n) {
      return (
        <button
          disabled
          className="w-full py-4 rounded-xl bg-bg-raised text-content-dim font-body font-semibold text-base cursor-not-allowed"
        >
          Insufficient Balance
        </button>
      )
    }

    if (amountBig > 0n && needsApproval) {
      return (
        <button onClick={handleApprove} className="btn-primary w-full justify-center text-base py-4">
          Approve xDINAR
        </button>
      )
    }

    if (amountBig > 0n && !needsApproval) {
      return (
        <button
          onClick={handleStake}
          className="btn-primary w-full justify-center text-base py-4 animate-pulse-gold"
        >
          Stake Now →
        </button>
      )
    }

    return (
      <button
        disabled
        className="w-full py-4 rounded-xl bg-bg-raised text-content-dim font-body font-semibold text-base cursor-not-allowed"
      >
        Enter an amount
      </button>
    )
  }

  const showStepHint =
    isConnected && needsApproval && amountBig > 0n && txStep !== 'success' && txStep !== 'error'

  return (
    <>
      {showParticles && <GoldParticles />}

      <div className="glass-card p-6 sm:p-8 max-w-xl mx-auto">
        <h2
          className="font-display font-bold text-content mb-6"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
        >
          Stake xDINAR
        </h2>

        {/* Amount input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-body text-content-dim">Amount</label>
            {isConnected && balance !== undefined && (
              <button
                onClick={() => setAmount(fromTokenUnits(balance))}
                className="text-xs font-body text-gold hover:text-gold-light transition-colors"
              >
                Max: {formatTokenDisplay(balance, 2)} XDNR
              </button>
            )}
          </div>
          <input
            type="number"
            className="stake-input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            disabled={txStep === 'approving' || txStep === 'staking' || txStep === 'success'}
          />
        </div>

        {/* Slider */}
        <div className="mb-6">
          <input
            type="range"
            className="stake-slider w-full"
            min="0"
            max="100"
            value={Math.round(progressPct)}
            style={{ '--progress': `${progressPct}%` } as React.CSSProperties}
            onChange={(e) => {
              if (balance && balance > 0n) {
                const pct = parseFloat(e.target.value) / 100
                const newAmount = parseFloat(fromTokenUnits(balance)) * pct
                setAmount(newAmount > 0 ? newAmount.toFixed(4) : '')
              }
            }}
            disabled={!isConnected || !balance}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-content-dim font-body">0%</span>
            <span className="text-xs text-content-dim font-body">100%</span>
          </div>
        </div>

        {/* Pool info grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Lock Period', value: formatLockDuration(lockDuration), gold: false },
            { label: 'APR', value: `${aprStr}%`, gold: true },
            { label: 'Unlock Date', value: unlockDateStr, gold: false },
          ].map((item) => (
            <div key={item.label} className="bg-bg-raised rounded-xl p-3 text-center">
              <p className="text-xs text-content-dim font-body mb-1">{item.label}</p>
              <p className={cn('font-mono font-semibold text-sm', item.gold ? 'text-gold' : 'text-content')}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Reward preview */}
        {amountBig > 0n && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-gold/30 bg-gold/5 p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-body text-content-dim">Estimated Reward</span>
              <span className="text-gold font-mono font-semibold">
                +{formatTokenDisplay(rewardBig, 4)} XDNR
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-body text-content-dim">Total at Unlock</span>
              <span className="text-content font-mono text-sm">
                {formatTokenDisplay(totalAtUnlock, 4)} XDNR
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-body text-content-dim">Daily Reward</span>
              <span className="text-content-muted font-mono text-xs">
                ≈ {formatTokenDisplay(dailyReward, 6)} XDNR/day
              </span>
            </div>
          </motion.div>
        )}

        {/* Step hint */}
        {showStepHint && (
          <p className="text-xs text-content-dim font-body text-center mb-3">
            Step 1 of 2:{' '}
            <span className={txStep === 'approving' ? 'text-gold' : 'text-content'}>Approve</span>
            {' → '}Step 2: Stake
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
