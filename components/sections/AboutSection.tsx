'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { gsap } from 'gsap'
import { MISSION_ITEMS } from '@/lib/constants'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
}

const PROBLEMS = [
  { icon: '🔥', problem: 'Extreme Volatility', solution: 'Automated Burning reduces supply pressure on every transaction' },
  { icon: '🌍', problem: 'No Cultural Relevance', solution: 'Rooted in Dinar — resonating with 1.8B Muslim market globally' },
  { icon: '🔧', problem: 'High Barriers to Entry', solution: 'Simple UX + community education programs lower the threshold' },
]

const ORBIT_ITEMS = [
  { emoji: '🔄', label: 'Swap' },
  { emoji: '🔒', label: 'Stake' },
  { emoji: '💸', label: 'Lend' },
  { emoji: '💳', label: 'Pay' },
]

function OrbitalVisual() {
  const outerRef = useRef<SVGGElement>(null)
  const middleRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(outerRef.current, { rotation: -360, duration: 24, ease: 'none', repeat: -1, transformOrigin: '140px 140px' })
      gsap.to(middleRef.current, { rotation: 360, duration: 14, ease: 'none', repeat: -1, transformOrigin: '140px 140px' })
    })
    return () => ctx.revert()
  }, [])

  const r1 = 55, r2 = 105, cx = 140, cy = 140

  return (
    <div className="flex items-center justify-center lg:w-96 lg:h-96" style={{ overflow: 'visible' }}>
      <svg width="280" height="280" viewBox="0 0 280 280" aria-hidden overflow="visible">
        <g ref={outerRef}>
          <circle cx={cx} cy={cy} r={r2} fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" strokeDasharray="4 6" />
        </g>
        <circle cx={cx} cy={cy} r={r1} fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="1" />
        <g ref={middleRef}>
          {ORBIT_ITEMS.map((item, i) => {
            const angle = (i / ORBIT_ITEMS.length) * 2 * Math.PI - Math.PI / 2
            const x = cx + r2 * Math.cos(angle)
            const y = cy + r2 * Math.sin(angle)
            return (
              <g key={item.label} transform={`translate(${x - 20}, ${y - 16})`}>
                <rect width="40" height="32" rx="8" fill="rgba(26,26,38,0.85)" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
                <text x="20" y="13" textAnchor="middle" fontSize="11" fill="white">{item.emoji}</text>
                <text x="20" y="26" textAnchor="middle" fontSize="7" fill="rgba(138,128,112,1)" fontFamily="Inter, sans-serif">{item.label}</text>
              </g>
            )
          })}
        </g>
        <circle cx={cx} cy={cy} r="40" fill="rgba(26,26,38,0.9)" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="Cinzel, serif" fill="#C9A84C">x</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" letterSpacing="4" fontFamily="Cinzel, serif" fill="rgba(201,168,76,0.6)">DINAR</text>
      </svg>
    </div>
  )
}

export function AboutSection() {
  const introRef = useRef<HTMLDivElement>(null)
  const introInView = useInView(introRef, { once: true, margin: '-100px' })

  const problemsRef = useRef<HTMLDivElement>(null)
  const problemsInView = useInView(problemsRef, { once: true, margin: '-100px' })

  const orbitalRef = useRef<HTMLDivElement>(null)
  const orbitalInView = useInView(orbitalRef, { once: true, margin: '-100px' })

  const missionLabelRef = useRef<HTMLDivElement>(null)
  const missionLabelInView = useInView(missionLabelRef, { once: true, margin: '-100px' })

  const missionGridRef = useRef<HTMLDivElement>(null)
  const missionGridInView = useInView(missionGridRef, { once: true, margin: '-100px' })

  return (
    <section id="about" className="section-padding bg-bg-base">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            ref={introRef}
            animate={introInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <p className="eyebrow mb-4">Who We Are</p>
            <h2 className="font-display font-bold text-content mb-6 leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Built on Dinar Values.<br />
              <span className="text-gold-gradient">Powered by DeFi.</span>
            </h2>
            <p className="text-content-muted font-body text-lg leading-relaxed mb-10">
              xDINAR is a decentralized finance protocol that draws its identity from the Islamic gold
              Dinar — a symbol of sound money for over a millennium. We combine that cultural heritage
              with the transparency, composability, and permissionlessness of modern DeFi on BNB Smart
              Chain.
            </p>

            <motion.div
              ref={problemsRef}
              variants={containerVariants}
              animate={problemsInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {PROBLEMS.map((item) => (
                <motion.div key={item.problem} variants={itemVariants} className="glass-card p-4 flex flex-col gap-3">
                  <span className="text-2xl leading-none">{item.icon}</span>
                  <p className="text-content-dim text-xs font-body font-medium">{item.problem}</p>
                  <span className="text-gold/60 text-xs">↓</span>
                  <p className="text-gold text-xs font-body font-medium leading-snug">{item.solution}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            ref={orbitalRef}
            animate={orbitalInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ overflow: 'visible' }}
          >
            <OrbitalVisual />
          </motion.div>
        </div>

        <motion.div
          ref={missionLabelRef}
          animate={missionLabelInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <p className="eyebrow text-center mb-8">Our Mission</p>
        </motion.div>

        <motion.div
          ref={missionGridRef}
          variants={containerVariants}
          animate={missionGridInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {MISSION_ITEMS.map((item) => (
            <motion.div
              key={item}
              variants={itemVariants}
              className="glass-card px-4 py-4 flex items-start gap-3 hover:border-gold/30 transition-colors duration-200"
            >
              <CheckCircle2 size={16} className="text-gold flex-shrink-0 mt-0.5" />
              <span className="text-content-muted text-sm font-body leading-snug">{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
