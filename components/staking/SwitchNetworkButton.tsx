'use client'

import { useSwitchChain } from 'wagmi'
import { Loader2 } from 'lucide-react'
import { net } from '@/lib/chains'
import { cn } from '@/lib/utils'

export function SwitchNetworkButton({ compact = false }: { compact?: boolean }) {
  const { switchChain, isPending, error } = useSwitchChain()

  return (
    <div>
      <button
        onClick={() => switchChain({ chainId: net.chain.id })}
        disabled={isPending}
        className={cn(
          'btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed',
          !compact && 'text-base py-4'
        )}
      >
        {isPending ? (
          <><Loader2 size={compact ? 14 : 18} className="animate-spin" /> Switching...</>
        ) : (
          'Switch to BNB Chain'
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs font-body mt-2 text-center">
          Couldn&apos;t switch automatically. Select {net.chain.name} in your wallet.
        </p>
      )}
    </div>
  )
}
