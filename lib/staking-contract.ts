import { parseUnits, formatUnits } from 'viem'

export const STAKING_CONTRACT_ADDRESS = '0x8E22876abDCF31Ba3A95d0Ea53D0eD2816d5983B' as `0x${string}`
// NOTE: Update XDINAR_TOKEN_ADDRESS to the actual ERC20 token contract if different from the proxy
export const XDINAR_TOKEN_ADDRESS = '0x55e0f92b67dc64159c7f376dfaf5869ff92cd46b' as `0x${string}`

export const TOKEN_DECIMALS = 18

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
  if (num < 0.0001) return '< 0.0001'
  return num.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}

export function formatLockDuration(seconds: bigint): string {
  const s = Number(seconds)
  if (s === 0) return '—'
  if (s < 3600)  return `${Math.round(s / 60)}m`
  if (s < 86400) return `${Math.round(s / 3600)}h`
  return `${Math.round(s / 86400)}d`
}

export function secondsToDays(seconds: bigint): number {
  return Number(seconds) / 86400
}

export function bpsToPercent(bps: bigint): string {
  return (Number(bps) / 100).toFixed(2)
}

export function getUnlockDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getCountdown(unlockTimestamp: bigint): string {
  const now = Math.floor(Date.now() / 1000)
  const remaining = Number(unlockTimestamp) - now
  if (remaining <= 0) return 'Unlocked'
  const d = Math.floor(remaining / 86400)
  const h = Math.floor((remaining % 86400) / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  if (d === 0 && h === 0) return `${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
  if (d === 0) return `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
  return `${String(d).padStart(2,'0')}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`
}

export function getProgressPercent(startTime: bigint, unlockTime: bigint): number {
  const now = BigInt(Math.floor(Date.now() / 1000))
  const total = unlockTime - startTime
  if (total <= 0n) return 100
  const elapsed = now - startTime
  if (elapsed <= 0n) return 0
  if (elapsed >= total) return 100
  return Math.floor(Number((elapsed * 100n) / total))
}
