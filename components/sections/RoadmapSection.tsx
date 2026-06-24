'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ROADMAP } from '@/lib/constants'
import { cn } from '@/lib/utils'

type Status = 'completed' | 'active' | 'upcoming'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
}

function StatusBadge({ status }: { status: Status }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-body">
        <Check size={10} /> Completed
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/40 text-gold text-xs font-body">
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border text-content-dim text-xs font-body">
      Upcoming
    </span>
  )
}

export function RoadmapSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' })

  const cardsRef = useRef<HTMLDivElement>(null)
  const cardsInView = useInView(cardsRef, { once: true, margin: '-100px' })

  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 65%',
              end: 'bottom 65%',
              scrub: 1,
            },
          }
        )
      }
    }, timelineRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="roadmap" className="section-padding bg-bg-base">
      <div className="section-container">
        <motion.div
          ref={headerRef}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-4">Our Journey</p>
          <h2 className="font-display font-bold text-content leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Roadmap to <span className="text-gold-gradient">Ecosystem Maturity</span>
          </h2>
        </motion.div>

        <div ref={timelineRef} className="relative">
          {/* Animated center line */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px overflow-hidden">
            <div
              ref={timelineLineRef}
              className="absolute inset-0 bg-gradient-to-b from-gold/60 via-gold/30 to-transparent"
              style={{ transformOrigin: 'top center' }}
            />
          </div>

          <motion.div
            ref={cardsRef}
            variants={containerVariants}
            animate={cardsInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-10 lg:gap-0"
          >
            {ROADMAP.map((phase, i) => {
              const isLeft = i % 2 === 0
              const isCompleted = phase.status === 'completed'
              const isActive = phase.status === 'active'

              return (
                <motion.div
                  key={phase.phase}
                  variants={cardVariants}
                  className="relative lg:grid lg:grid-cols-2 lg:gap-8 lg:mb-10"
                >
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-6 z-10">
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                        isCompleted ? 'border-gold bg-gold' : isActive ? 'border-gold bg-bg-base animate-pulse' : 'border-border bg-bg-base'
                      )}
                    >
                      {isCompleted && <Check size={8} className="text-bg-base" strokeWidth={3} />}
                    </div>
                  </div>

                  <div className={cn(isLeft ? 'lg:col-start-1 lg:pr-12' : 'lg:col-start-2 lg:pl-12', 'w-full')}>
                    <div
                      className={cn(
                        'glass-card p-6 transition-all duration-300',
                        isActive && 'border-gold/40 glow-gold-sm',
                        isCompleted && 'border-gold/25',
                        !isActive && !isCompleted && 'opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-content-dim">{phase.phase}</span>
                            <span className="text-border">·</span>
                            <span className="font-mono text-xs text-content-dim">{phase.period}</span>
                          </div>
                          <h3 className={cn('font-display font-semibold text-xl', isCompleted || isActive ? 'text-content' : 'text-content-dim')}>
                            {phase.title}
                          </h3>
                        </div>
                        <StatusBadge status={phase.status} />
                      </div>

                      <ul className="flex flex-col gap-2">
                        {phase.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className={cn('flex-shrink-0 w-1 h-1 rounded-full mt-2', isCompleted ? 'bg-gold' : isActive ? 'bg-gold/60' : 'bg-border')} />
                            <span className={cn('text-sm font-body leading-snug', isCompleted || isActive ? 'text-content-muted' : 'text-content-dim')}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {isLeft && <div className="hidden lg:block lg:col-start-2" />}
                  {!isLeft && <div className="hidden lg:block lg:col-start-1 lg:row-start-1" />}
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
