'use client'

import { useRef, useState, type FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, BookOpen, Send, MessageCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { SOCIALS } from '@/lib/constants'
import { cn } from '@/lib/utils'

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const ICON_MAP: Record<string, React.ReactNode> = {
  telegram: <Send size={18} />,
  twitter: <XIcon size={18} />,
  discord: <MessageCircle size={18} />,
  'book-open': <BookOpen size={18} />,
  github: <GithubIcon size={18} />,
  mail: <Mail size={18} />,
}

const FOOTER_COLS = [
  {
    heading: 'Invest',
    links: [
      { label: '$xDINAR', href: '#' },
      { label: 'Staking', href: '#' },
      { label: 'Lending', href: '#' },
      { label: 'Pay', href: '#' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Telegram', href: '#' },
      { label: 'Discord', href: '#' },
      { label: 'Twitter / X', href: '#' },
      { label: 'Medium', href: '#' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Whitepaper', href: '#' },
      { label: 'Audit Report', href: '#' },
      { label: 'Smart Contracts', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Team', href: '#' },
      { label: 'Contact', href: 'mailto:contact@xdinar.io' },
    ],
  },
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function ConnectSection() {
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')

  const socialsRef = useRef<HTMLDivElement>(null)
  const socialsInView = useInView(socialsRef, { once: true, margin: '-100px' })

  const cardRef = useRef<HTMLDivElement>(null)
  const cardInView = useInView(cardRef, { once: true, margin: '-100px' })

  const footerRef = useRef<HTMLDivElement>(null)
  const footerInView = useInView(footerRef, { once: true, margin: '-100px' })

  function validateEmail(val: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.')
      setFormState('error')
      return
    }
    setFormState('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setFormState('success')
        setMessage(data.message ?? "You're in!")
        setEmail('')
      } else {
        setFormState('error')
        setMessage(data.message ?? 'Something went wrong.')
      }
    } catch {
      setFormState('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <section id="connect" className="section-padding bg-bg-base">
      <div className="section-container">
        {/* Social icons row */}
        <motion.div
          ref={socialsRef}
          animate={socialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex items-center justify-center gap-6 mb-8"
        >
          {SOCIALS.map((social) => (
            <a
              key={social.platform}
              href={social.href}
              target={social.href.startsWith('mailto') ? undefined : '_blank'}
              rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              aria-label={social.platform}
              className="text-content-dim hover:text-gold transition-colors duration-200"
            >
              {ICON_MAP[social.icon]}
            </a>
          ))}
        </motion.div>

        {/* Main card */}
        <motion.div
          ref={cardRef}
          animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="rounded-2xl overflow-hidden mb-20 relative"
          style={{ background: 'linear-gradient(135deg, #1A1208 0%, #0F0C06 40%, #0A0A0F 70%, #111118 100%)' }}
        >
          <div className="absolute inset-0 bg-tessellation" style={{ opacity: 0.05 }} />
          <div className="absolute inset-0 rounded-2xl border border-gold/15 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center max-w-2xl mx-auto">
            <p className="eyebrow mb-4">Stay Connected</p>
            <h2 className="font-display font-bold text-content mb-3 leading-tight" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
              The Future of Islamic Finance
            </h2>
            <p className="text-content-muted font-body text-base mb-8 leading-relaxed">
              Subscribe for launch alerts, governance proposals, and protocol updates straight to your
              inbox.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 max-w-md mx-auto mb-8">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (formState === 'error') setFormState('idle')
                  }}
                  placeholder="Enter your email address"
                  disabled={formState === 'loading' || formState === 'success'}
                  className={cn(
                    'flex-1 px-4 py-3 rounded-lg bg-bg-raised/80 border text-content text-sm font-body',
                    'placeholder:text-content-dim focus:outline-none focus:ring-1 focus:ring-gold',
                    'disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200',
                    formState === 'error' ? 'border-red-500/50' : 'border-border hover:border-gold/30'
                  )}
                />
                <button
                  type="submit"
                  disabled={formState === 'loading' || formState === 'success'}
                  className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formState === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Sign Up'}
                </button>
              </div>

              {formState === 'success' && (
                <div className="flex items-center gap-2 text-green-400 text-sm font-body">
                  <CheckCircle2 size={16} />
                  <span>{message}</span>
                </div>
              )}
              {formState === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm font-body">
                  <AlertCircle size={16} />
                  <span>{message}</span>
                </div>
              )}
            </form>

            <div className="flex items-center justify-center gap-5">
              {[
                { icon: <XIcon size={16} />, label: 'Twitter/X' },
                { icon: <GithubIcon size={16} />, label: 'GitHub' },
                { icon: <Send size={16} />, label: 'Telegram' },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="text-content-dim hover:text-gold transition-colors duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 4-column footer grid */}
        <motion.div
          ref={footerRef}
          animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border/50"
        >
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-content text-sm font-body font-semibold mb-4">{col.heading}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-content-muted text-sm font-body hover:text-gold transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
