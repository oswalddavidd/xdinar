'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function EcosystemArcSection() {
  const dotRef = useRef<SVGCircleElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)

  const textRef = useRef<HTMLDivElement>(null)
  const textInView = useInView(textRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const cx = 400, cy = 450, r = 350
    let angle = Math.PI
    let raf: number

    function animate() {
      angle -= 0.005
      if (angle <= 0) angle = Math.PI

      const x = (cx + r * Math.cos(angle)).toFixed(2)
      const y = (cy - r * Math.sin(angle)).toFixed(2)

      dotRef.current?.setAttribute('cx', x)
      dotRef.current?.setAttribute('cy', y)
      glowRef.current?.setAttribute('cx', x)
      glowRef.current?.setAttribute('cy', y)

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="bg-bg-base overflow-hidden pt-0 pb-20">
      <div className="relative">
        <div
          className="absolute bottom-0 inset-x-0 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(201,168,76,0.1) 0%, transparent 70%)' }}
        />

        <svg viewBox="0 0 800 460" className="w-full overflow-visible" style={{ display: 'block' }} aria-hidden>
          <defs>
            <filter id="arcDotGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(201,168,76,0)" />
              <stop offset="30%" stopColor="rgba(201,168,76,0.25)" />
              <stop offset="70%" stopColor="rgba(201,168,76,0.25)" />
              <stop offset="100%" stopColor="rgba(201,168,76,0)" />
            </linearGradient>
          </defs>

          <path d="M 50,450 A 350,350 0 0,1 750,450" fill="none" stroke="url(#arcGrad)" strokeWidth="28" strokeLinecap="round" />
          <path d="M 50,450 A 350,350 0 0,1 750,450" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1.5" />

          <circle ref={glowRef} cx="50" cy="450" r="18" fill="rgba(201,168,76,0.25)" filter="url(#arcDotGlow)" />
          <circle ref={dotRef} cx="50" cy="450" r="6" fill="#E8C97A" />
        </svg>

        {/* Text overlay — centered inside the arc interior */}
        <div
          className="absolute inset-x-0 flex justify-center"
          style={{ top: '62%', transform: 'translateY(-50%)' }}
        >
          <motion.div
            ref={textRef}
            animate={textInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-center max-w-2xl px-6"
          >
            <p className="eyebrow mb-4">xDINAR Ecosystem</p>
            <h2 className="font-display font-bold text-content leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Building the Bridge<br />
              <span className="text-gold-gradient">Between Dinar & DeFi</span>
            </h2>
            <p className="text-content-muted font-body text-lg mb-8 leading-relaxed">
              We&apos;re building the infrastructure for a new era of Islamic-inspired decentralized
              finance — open, transparent, and culturally rooted.
            </p>
            <a href="#features" className="btn-secondary">
              Explore Features →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
