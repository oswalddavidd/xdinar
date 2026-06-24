'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    index: '01',
    icon: '🔓',
    title: 'Approve',
    lines: ['Allow contract', 'to use tokens.', 'One-time step.'],
  },
  {
    index: '02',
    icon: '🔒',
    title: 'Stake',
    lines: ['Enter amount,', 'confirm tx.', 'Tokens locked.'],
  },
  {
    index: '03',
    icon: '💰',
    title: 'Claim',
    lines: ['After lock ends,', 'claim principal', '+ all rewards.'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div>
      <p className="eyebrow text-center mb-4">How It Works</p>
      <h2 className="font-display font-bold text-content text-center mb-10" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
        Three Steps to Earning
      </h2>

      <motion.div
        ref={ref}
        variants={containerVariants}
        animate={inView ? 'visible' : 'hidden'}
        className="relative grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div
          className="hidden md:block absolute top-10 inset-x-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.25) 25%, rgba(201,168,76,0.45) 50%, rgba(201,168,76,0.25) 75%, transparent)' }}
        />

        {STEPS.map((step) => (
          <motion.div
            key={step.index}
            variants={cardVariants}
            className="glass-card p-6 flex flex-col items-center text-center"
          >
            <span className="font-mono text-xs text-gold/60 mb-3">{step.index}</span>
            <span className="text-4xl mb-4">{step.icon}</span>
            <h3 className="font-display font-semibold text-content text-lg mb-3">{step.title}</h3>
            <div className="space-y-0.5">
              {step.lines.map((line, i) => (
                <p key={i} className="text-content-muted text-sm font-body">{line}</p>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
