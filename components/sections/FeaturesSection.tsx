'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FEATURES } from '@/lib/constants'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
}

const TECH_SPECS = ['~3s Block Time', '<$0.01 per Tx', '300 TPS', 'EVM Compatible', 'PoSA Consensus', 'BEP-20 Standard']

export function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' })

  const cardsRef = useRef<HTMLDivElement>(null)
  const cardsInView = useInView(cardsRef, { once: true, margin: '-100px' })

  const specRef = useRef<HTMLDivElement>(null)
  const specInView = useInView(specRef, { once: true, margin: '-100px' })

  return (
    <section id="features" className="section-padding bg-bg-base">
      <div className="section-container">
        <motion.div
          ref={headerRef}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-4">Protocol Features</p>
          <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Everything You Need in <span className="text-gold-gradient">One Protocol</span>
          </h2>
          <p className="text-content-muted font-body text-lg mt-4 max-w-2xl mx-auto">
            A complete DeFi suite — from trading and staking to lending and payments — all built on
            transparent, audited smart contracts.
          </p>
        </motion.div>

        <motion.div
          ref={cardsRef}
          variants={containerVariants}
          animate={cardsInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="glass-card p-6 group hover:border-gold/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-12 h-12 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center mb-5 text-2xl transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-content text-lg mb-2 group-hover:text-gold transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-content-muted text-sm font-body leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          ref={specRef}
          animate={specInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="border-y border-border bg-bg-surface -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {TECH_SPECS.map((spec, i) => (
              <span key={spec} className="flex items-center gap-4">
                <span className="text-content-muted text-sm font-mono">{spec}</span>
                {i < TECH_SPECS.length - 1 && <span className="text-border hidden sm:inline">·</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
