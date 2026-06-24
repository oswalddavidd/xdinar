import { HeroSection } from '@/components/sections/HeroSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { BeliefSection } from '@/components/sections/BeliefSection'
import { RoadmapSection } from '@/components/sections/RoadmapSection'
import { EcosystemArcSection } from '@/components/sections/EcosystemArcSection'
import { TokenomicsSection } from '@/components/sections/TokenomicsSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { ConnectSection } from '@/components/sections/ConnectSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <div className="section-divider" />
      <AboutSection />
      <BeliefSection />
      <div className="section-divider" />
      <RoadmapSection />
      <EcosystemArcSection />
      <div className="section-divider" />
      <TokenomicsSection />
      <div className="section-divider" />
      <FeaturesSection />
      <ConnectSection />
    </main>
  )
}
