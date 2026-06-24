'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const BELIEFS = [
  {
    index: '01',
    heading: 'Sound Money',
    body: 'Backed by the principle of intrinsic value, rooted in 14 centuries of Dinar heritage. Every $xDINAR is designed to hold meaning, not just market cap.',
  },
  {
    index: '02',
    heading: 'Open Finance',
    body: 'No banks. No borders. Every wallet has equal access to yield, credit, and payments — whether you are in Jakarta, Lagos, or London.',
  },
  {
    index: '03',
    heading: 'Community Governance',
    body: 'Every $xDINAR holder has a voice. The protocol evolves by the will of its community through transparent, on-chain governance.',
  },
]

function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 280, H = 280
    canvas.width = W
    canvas.height = H
    const cx = W / 2, cy = H / 2
    const R = 108

    const dots: Array<{ lat: number; lon: number; phase: number }> = []
    for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += Math.PI / 9) {
      const numDots = Math.max(1, Math.round(Math.abs(Math.cos(lat)) * 18))
      for (let i = 0; i < numDots; i++) {
        dots.push({ lat, lon: (i / numDots) * 2 * Math.PI, phase: Math.random() * Math.PI * 2 })
      }
    }

    let rotation = 0
    let raf: number

    function draw(time: number) {
      ctx!.clearRect(0, 0, W, H)
      rotation += 0.004
      const t = time / 1000

      const projected = dots.map((d) => {
        const cosLat = Math.cos(d.lat)
        const lonR = d.lon + rotation
        const x3 = R * cosLat * Math.cos(lonR)
        const y3 = R * Math.sin(d.lat)
        const z3 = R * cosLat * Math.sin(lonR)
        const depth = (z3 + R) / (2 * R)
        const pulse = (Math.sin(t * 1.2 + d.phase) + 1) / 2
        return { px: cx + x3, py: cy - y3, depth, pulse }
      })

      projected.sort((a, b) => a.depth - b.depth)

      for (const d of projected) {
        const brightness = 0.25 + d.depth * 0.55 + d.pulse * 0.2
        const alpha = 0.15 + d.depth * 0.75
        const size = 0.5 + d.depth * 2
        ctx!.beginPath()
        ctx!.arc(d.px, d.py, size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${Math.floor(201 * brightness)},${Math.floor(168 * brightness)},${Math.floor(76 * brightness)},${alpha})`
        ctx!.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} style={{ width: 280, height: 280 }} />
}

export function BeliefSection() {
  const [active, setActive] = useState(0)

  const leftRef = useRef<HTMLDivElement>(null)
  const leftInView = useInView(leftRef, { once: true, margin: '-100px' })

  const globeRef = useRef<HTMLDivElement>(null)
  const globeInView = useInView(globeRef, { once: true, margin: '-100px' })

  const rightRef = useRef<HTMLDivElement>(null)
  const rightInView = useInView(rightRef, { once: true, margin: '-100px' })

  const bodyRef = useRef<HTMLDivElement>(null)
  const bodyInView = useInView(bodyRef, { once: true, margin: '-100px' })

  return (
    <section className="section-padding bg-bg-surface overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 items-center mb-16">
          {/* Left */}
          <motion.div
            ref={leftRef}
            animate={leftInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-right hidden lg:block"
          >
            <p className="belief-h1 font-display font-bold text-content-muted leading-none">We</p>
            <p className="belief-h1 font-display font-bold text-content leading-none">Believe</p>
            <p className="belief-h1 font-display font-bold text-content leading-none">In</p>
          </motion.div>

          {/* Mobile heading — uses globeInView since leftRef is hidden on mobile */}
          <motion.div
            animate={globeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-center lg:hidden"
          >
            <p className="eyebrow mb-3">Our Values</p>
            <h2 className="font-display font-bold text-3xl text-content">We Believe In</h2>
          </motion.div>

          {/* Globe center */}
          <motion.div
            ref={globeRef}
            animate={globeInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex justify-center"
          >
            <div className="relative">
              <Globe />
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)' }}
              />
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            ref={rightRef}
            animate={rightInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="hidden lg:block"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                className="belief-h1 font-display font-bold text-gold-gradient leading-none"
              >
                {BELIEFS[active].heading}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Body text + nav dots */}
        <motion.div
          ref={bodyRef}
          animate={bodyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-2xl mx-auto text-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
              className="text-content-muted font-body text-lg leading-relaxed mb-8"
            >
              {BELIEFS[active].body}
            </motion.p>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-8">
            {BELIEFS.map((b, i) => (
              <button
                key={b.index}
                onClick={() => setActive(i)}
                className="flex items-center gap-2 group transition-all duration-200"
              >
                <span className={`font-mono text-sm transition-colors duration-200 ${i === active ? 'text-gold' : 'text-content-dim group-hover:text-content-muted'}`}>
                  {b.index}
                </span>
                <span className={`block h-px transition-all duration-300 ${i === active ? 'w-8 bg-gold' : 'w-4 bg-border group-hover:bg-content-dim'}`} />
              </button>
            ))}
          </div>

          <div className="mt-6 lg:hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-display font-bold text-2xl text-gold-gradient"
              >
                {BELIEFS[active].heading}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
