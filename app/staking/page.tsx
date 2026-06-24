import type { Metadata } from 'next'
import { PoolStatusBanner } from '@/components/staking/PoolStatusBanner'
import { StakingCalculator } from '@/components/staking/StakingCalculator'
import { MyStakes } from '@/components/staking/MyStakes'
import { HowItWorks } from '@/components/staking/HowItWorks'

export const metadata: Metadata = {
  title: 'Stake $xDINAR — Earn Rewards',
  description:
    'Stake your $xDINAR tokens and earn competitive APR rewards. Fixed lock period, transparent on-chain staking on BNB Smart Chain.',
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
            Lock your tokens, earn competitive yield. Transparent, on-chain, and fully non-custodial.
          </p>
        </div>

        <div className="mb-24">
          <StakingCalculator />
        </div>

        <div className="mb-24">
          <MyStakes />
        </div>

        <div className="mb-24">
          <HowItWorks />
        </div>
      </div>
    </main>
  )
}
