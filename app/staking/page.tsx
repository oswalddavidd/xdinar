import type { Metadata } from 'next'
import { PoolStatusBanner } from '@/components/staking/PoolStatusBanner'
import { StakingDashboard } from '@/components/staking/StakingDashboard'
import { HowItWorks } from '@/components/staking/HowItWorks'

export const metadata: Metadata = {
  title: 'Stake $xDINAR — Earn Rewards',
  description:
    'Lock your $xDINAR and earn staking rewards. Choose a pool, watch your lock count down, and unstake on-chain on BNB Smart Chain.',
}

export default function StakingPage() {
  return (
    <main className="min-h-screen bg-bg-base pt-20">
      <PoolStatusBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero heading */}
        <div className="pt-24 pb-12 text-center">
          <p className="eyebrow mb-4">Staking</p>
          <h1
            className="font-display font-bold text-content leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Earn Rewards with{' '}
            <span className="text-gold-gradient">$xDINAR</span>
          </h1>
          <p className="text-content-muted font-body text-lg max-w-xl mx-auto">
            Lock your $xDINAR and earn staking rewards. Transparent and on-chain.
          </p>
        </div>

        <StakingDashboard />

        <div className="mb-24">
          <HowItWorks />
        </div>
      </div>
    </main>
  )
}
