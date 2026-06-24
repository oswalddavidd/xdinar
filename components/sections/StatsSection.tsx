'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'

function CountRow({
  end,
  label,
  delay,
  suffix = '',
}: {
  end: number
  label: string
  delay: number
  suffix?: string
}) {
  const { value, ref: countRef } = useCountUp({ end, duration: 2200 })
  const rowRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(rowRef, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={rowRef}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const }}
      className="py-8 flex items-baseline gap-5"
    >
      <span
        ref={countRef as React.RefObject<HTMLSpanElement>}
        className="stats-number text-content"
      >
        {Number(value).toLocaleString()}{suffix}
      </span>
      <span className="text-sm font-body text-content-muted tracking-wide">{label}</span>
    </motion.div>
  )
}

function TextRow({ label, value, delay }: { label: string; value: string; delay: number }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(rowRef, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={rowRef}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const }}
      className="py-8 flex items-baseline gap-5"
    >
      <span className="stats-number text-gold-gradient">{value}</span>
      <span className="text-sm font-body text-content-muted tracking-wide">{label}</span>
    </motion.div>
  )
}

export function StatsSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-100px' })

  return (
    <section className="section-padding bg-bg-base">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <motion.div
            ref={headingRef}
            animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:sticky lg:top-32"
          >
            <p className="font-display font-bold text-content leading-tight" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              xDINAR is building
            </p>
            <p className="font-display font-bold text-content-muted leading-tight mt-1" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              the future of Islamic DeFi.
            </p>
            <p className="text-content-dim font-body text-base mt-6 leading-relaxed max-w-sm">
              Built on BNB Smart Chain. Rooted in 14 centuries of Dinar heritage. Open to every wallet
              on earth.
            </p>
          </motion.div>

          <div className="flex flex-col divide-y divide-border">
            <CountRow end={500000} label="Max Supply" delay={0} suffix=" xDINAR" />
            <CountRow end={5} label="Core Products" delay={0.08} />
            <TextRow value="BEP-20" label="Token Standard" delay={0.16} />
          </div>
        </div>
      </div>
    </section>
  )
}
