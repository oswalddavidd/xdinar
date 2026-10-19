import { parseUnits, formatUnits } from 'viem'

// Contract addresses and chain live in lib/chains.ts (selected by NEXT_PUBLIC_NETWORK).
// ABIs live in lib/abi/ (generated from the Hardhat artifacts by `npm run sync-abi`).

export const TOKEN_DECIMALS = 18
export const TOKEN_SYMBOL = 'XDNR'

const YEAR_SECONDS = 365n * 86400n
const BPS = 10_000n

export type Pool = {
  lockDuration: bigint
  aprBasisPoints: bigint
  maxCap: bigint
  totalStaked: bigint
  isActive: boolean
}

export function toTokenUnits(amount: string | number): bigint {
  try {
    return parseUnits(String(amount), TOKEN_DECIMALS)
  } catch {
    return 0n
  }
}

export function fromTokenUnits(amount: bigint): string {
  return formatUnits(amount, TOKEN_DECIMALS)
}

export function formatTokenDisplay(amount: bigint, decimals = 4): string {
  const num = parseFloat(formatUnits(amount, TOKEN_DECIMALS))
  if (num === 0) return '0'
  const min = 10 ** -decimals
  if (num < min) return `< ${min.toFixed(decimals)}`
  return num.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}

/** Same formula as xDinarStaking.calculateReward — keep in sync with the contract. */
export function calculateReward(amount: bigint, durationSeconds: bigint, aprBasisPoints: bigint): bigint {
  return (amount * aprBasisPoints * durationSeconds) / (YEAR_SECONDS * BPS)
}

/** Reward earned over one full lock, as a % of the staked amount (e.g. 150 for pool 2). */
export function lockReturnPercent(pool: Pick<Pool, 'lockDuration' | 'aprBasisPoints'>): number {
  return (Number(pool.aprBasisPoints) * Number(pool.lockDuration)) / (365 * 86400 * 100)
}

/** Human-readable % with enough precision for tiny minute-scale returns. */
export function formatPercent(pct: number): string {
  if (pct === 0) return '0%'
  if (pct >= 1) return `${pct.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`
  return `${pct.toPrecision(2)}%`
}

/** Total returned (principal + reward) as a multiple of the stake, e.g. "2.5×". */
export function formatPayoutMultiple(pct: number): string {
  const multiple = 1 + pct / 100
  return `${multiple.toLocaleString('en-US', { maximumFractionDigits: multiple < 1.01 ? 8 : 2 })}×`
}

export function formatApr(aprBasisPoints: bigint): string {
  const pct = Number(aprBasisPoints) / 100
  return `${pct.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`
}

/** Seconds → "30 sec", "1 min", "2 min 30 sec", "1 hr", "7 days". Minute-scale stays in minutes. */
export function formatDuration(seconds: bigint): string {
  const s = Number(seconds)
  if (s <= 0) return '—'
  const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 || unit === 'min' || unit === 'sec' ? '' : 's'}`
  if (s < 60) return plural(s, 'sec')
  if (s < 3600) {
    const m = Math.floor(s / 60)
    const rest = s % 60
    return rest ? `${plural(m, 'min')} ${plural(rest, 'sec')}` : plural(m, 'min')
  }
  if (s < 86400) {
    const h = Math.round((s / 3600) * 10) / 10
    return `${h} hr${h === 1 ? '' : 's'}`
  }
  const d = Math.round((s / 86400) * 10) / 10
  return plural(d, 'day')
}

/** Live countdown: "04:59", "1:02:03", or "2d 03:04:05". */
export function formatCountdown(secondsLeft: number): string {
  const s = Math.max(0, Math.floor(secondsLeft))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mmss = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  if (d > 0) return `${d}d ${String(h).padStart(2, '0')}:${mmss}`
  if (h > 0) return `${h}:${mmss}`
  return mmss
}

export function getProgressPercent(startTime: bigint, unlockTime: bigint, nowSeconds: number): number {
  const total = Number(unlockTime - startTime)
  if (total <= 0) return 100
  const elapsed = nowSeconds - Number(startTime)
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}
