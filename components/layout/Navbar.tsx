'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace('#', ''))

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2 group">
      <div className={cn('relative rounded-full flex-shrink-0', small ? 'w-6 h-6' : 'w-7 h-7')}>
        <div className="absolute inset-0 rounded-full bg-gold/20 group-hover:bg-gold/30 transition-colors duration-200" />
        <div className="absolute inset-[3px] rounded-full border border-gold/60 flex items-center justify-center">
          <span className={cn('text-gold font-display font-bold leading-none', small ? 'text-[9px]' : 'text-[10px]')}>x</span>
        </div>
      </div>
      <span className={cn('font-display font-bold text-gold-gradient', small ? 'text-xs' : 'text-sm hidden sm:block')}>
        xDINAR
      </span>
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeId = useScrollSpy(SECTION_IDS, 80)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    setMobileOpen(false)
    const el = document.getElementById(href.replace('#', ''))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* ── Full-width navbar (top of page) ── */}
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{ opacity: scrolled ? 0 : 1, pointerEvents: scrolled ? 'none' : 'auto' }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center relative">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} aria-label="xDINAR home">
            <Logo />
          </a>

          <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace('#', '')
              const isActive = activeId === id
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      'relative block px-3 py-2 text-sm font-body transition-colors duration-200 rounded hover:text-gold',
                      isActive ? 'text-gold' : 'text-content-muted'
                    )}
                  >
                    {link.label}
                    {isActive && <span className="absolute bottom-0 left-3 right-3 h-px bg-gold-gradient" />}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="ml-auto flex items-center gap-3">
            <a href="#" className="hidden sm:inline-flex btn-primary py-2 text-xs">
              Buy $xDINAR <span aria-hidden>→</span>
            </a>
            <button
              className="md:hidden p-2 text-content-muted hover:text-gold transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Pill navbar (after scroll) ── */}
      <div
        className="fixed top-4 left-1/2 z-50 transition-all duration-500"
        style={{
          transform: scrolled ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)',
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'auto' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <nav className="flex items-center gap-4 px-5 h-14 rounded-full bg-bg-base/85 backdrop-blur-2xl border border-gold/20 shadow-xl shadow-black/40 whitespace-nowrap">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} aria-label="xDINAR home">
            <Logo small />
          </a>

          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.href.replace('#', '')
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      'block px-2.5 py-1.5 text-xs font-body transition-colors duration-200 rounded-full',
                      'hover:text-gold hover:bg-gold/5',
                      isActive ? 'text-gold' : 'text-content-muted'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <a
            href="#"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold bg-gold text-bg-base hover:bg-gold-light transition-colors duration-200 flex-shrink-0"
          >
            Buy $xDINAR
          </a>

          <button
            className="md:hidden p-1.5 text-content-muted hover:text-gold transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>
      </div>

      {/* ── Mobile slide-down menu ── */}
      <div
        className={cn(
          'fixed inset-x-4 z-40 md:hidden transition-all duration-300 overflow-hidden',
          scrolled ? 'top-[76px]' : 'top-20',
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <div className="bg-bg-base/95 backdrop-blur-xl border border-border rounded-2xl px-4 py-4 shadow-xl shadow-black/40">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.href.replace('#', '')
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      'block w-full px-4 py-3 rounded-lg text-sm font-body transition-colors duration-200',
                      isActive
                        ? 'text-gold bg-gold/5 border border-gold/20'
                        : 'text-content-muted hover:text-gold hover:bg-bg-raised'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
            <li className="pt-2">
              <a href="#" className="btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>
                Buy $xDINAR →
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
