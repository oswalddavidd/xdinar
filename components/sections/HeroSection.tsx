'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_STATS } from '@/lib/constants'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
})

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const heroPanelRef = useRef<HTMLDivElement>(null)
  const h1LeftRef = useRef<HTMLSpanElement>(null)
  const h1RightRef = useRef<HTMLSpanElement>(null)
  const glowRevealRef = useRef<HTMLDivElement>(null)
  const subContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop: full split-apart morph
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=320',
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
          },
        })
        tl.to(heroPanelRef.current, { borderRadius: '24px', scale: 0.86, ease: 'none' }, 0)
          .to(h1LeftRef.current, { x: '-10vw', ease: 'none' }, 0)
          .to(h1RightRef.current, { x: '10vw', ease: 'none' }, 0)
          .to(glowRevealRef.current, { opacity: 1, scale: 1, ease: 'none' }, 0)
          .to(subContentRef.current, { opacity: 0, y: -16, ease: 'none' }, 0)
      })

      // Mobile: subtle scale only, no text split
      mm.add('(max-width: 1023px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=200',
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
          },
        })
        tl.to(heroPanelRef.current, { borderRadius: '16px', scale: 0.94, ease: 'none' }, 0)
          .to(subContentRef.current, { opacity: 0, y: -12, ease: 'none' }, 0)
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="home" ref={sectionRef} className="relative" style={{ height: '100vh' }}>
      <div
        ref={heroPanelRef}
        className="absolute inset-0 overflow-hidden bg-bg-base"
        style={{ transformOrigin: 'center top' }}
      >
        {/* Tessellation background */}
        <div className="absolute inset-0 bg-tessellation" />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none animate-breathe-gradient"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.04) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none animate-breathe-gradient-slow"
          style={{
            background:
              'radial-gradient(ellipse 35% 35% at 50% 52%, rgba(201,168,76,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <motion.p {...fadeUp(0.1)} className="eyebrow mb-6 tracking-[0.2em]">
            Decentralized Finance · BNB Smart Chain
          </motion.p>

          {/* Split H1 */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 mb-6">
            <span ref={h1LeftRef} className="inline-block hero-h1 font-display font-bold text-content">
              Evolusi Keuangan
            </span>

            {/* Gold reveal between the two words */}
            <div
              ref={glowRevealRef}
              className="hidden lg:flex items-center justify-center w-40 h-20 xl:w-52 xl:h-24 rounded-2xl border border-gold/20 overflow-hidden flex-shrink-0"
              style={{
                opacity: 0,
                background: 'linear-gradient(135deg, rgba(26,18,8,0.9) 0%, rgba(10,10,15,0.95) 100%)',
                boxShadow: 'inset 0 0 40px rgba(201,168,76,0.1)',
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-display font-bold text-2xl text-gold-gradient leading-none">x</span>
                <span className="font-display text-[9px] text-gold/60 tracking-[0.3em] uppercase">DINAR</span>
              </div>
            </div>

            <span ref={h1RightRef} className="inline-block hero-h1 font-display font-bold text-gold-gradient">
              Terdesentralisasi
            </span>
          </div>

          {/* Subtitle + CTA + Stats */}
          <div ref={subContentRef}>
            <motion.p
              {...fadeUp(0.25)}
              className="text-content-muted font-body text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              xDINAR merupakan protokol DeFi yang menggabungkan warisan nilai Dinar Islam dengan
              keuangan terdesentralisasi modern — terbuka, transparan, dan berbasis komunitas.
            </motion.p>

            <motion.div {...fadeUp(0.35)} className="flex flex-wrap items-center justify-center gap-4 mb-14">
              <a href="#about" className="btn-primary">
                Explore Protocol →
              </a>
              <a href="#" className="btn-secondary">
                Read Whitepaper
              </a>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
            >
              {HERO_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 + i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className={`text-content font-semibold text-base ${stat.mono ? 'font-mono' : 'font-body'}`}>
                    {stat.value}{stat.suffix}
                  </span>
                  <span className="text-content-dim text-xs font-body">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg-base/60 to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
