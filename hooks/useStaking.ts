'use client'

import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useReadContract, useReadContracts, useWatchContractEvent } from 'wagmi'
import { STAKING_ABI } from '@/lib/abi/xDinarStaking'
import { net, contractsDeployed } from '@/lib/chains'

const staking = { address: net.stakingAddress, abi: STAKING_ABI, chainId: net.chain.id } as const

/** All pools, fetched dynamically. A pool's id is its index in this array. */
export function usePools() {
  const { data, isLoading, isError } = useReadContract({
    ...staking,
    functionName: 'getAllPools',
    query: { enabled: contractsDeployed, refetchInterval: 15_000 },
  })
  return { pools: data, isLoading, isError }
}

/** Contract-wide state that gates staking: shared reward treasury and pause flag. */
export function useStakingGlobals() {
  const { data } = useReadContracts({
    contracts: [
      { ...staking, functionName: 'rewardTreasury' },
      { ...staking, functionName: 'paused' },
    ],
    query: { enabled: contractsDeployed, refetchInterval: 15_000 },
  })
  return {
    rewardTreasury: data?.[0]?.result as bigint | undefined,
    paused: (data?.[1]?.result as boolean | undefined) ?? false,
  }
}

/** Refetch every contract read (pools, balances, stakes, unlock flags). */
export function useRefreshStakingData() {
  const queryClient = useQueryClient()
  return useCallback(
    () =>
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === 'readContract' || q.queryKey[0] === 'readContracts',
      }),
    [queryClient]
  )
}

/**
 * Refresh UI state whenever the connected wallet's Staked/Unstaked events land on-chain —
 * including transactions sent from another tab or device.
 */
export function useStakingEventRefresh() {
  const { address } = useAccount()
  const refresh = useRefreshStakingData()
  const enabled = contractsDeployed && !!address

  useWatchContractEvent({
    ...staking,
    eventName: 'Staked',
    args: { user: address },
    enabled,
    onLogs: refresh,
  })

  useWatchContractEvent({
    ...staking,
    eventName: 'Unstaked',
    args: { user: address },
    enabled,
    onLogs: refresh,
  })
}
