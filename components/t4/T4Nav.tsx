'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface T4NavProps {
  agentId: string
  agencyName: string
  navLinks?: { label: string; href: string }[]
}

const DEFAULT_LINKS = [
  { label: 'Atelier', href: '/atelier' },
  { label: 'Hotels',  href: '/book-hotel' },
  { label: 'Voyages', href: '/find-cruise' },
  { label: 'Journal', href: '/journal' },
  { label: 'Press',   href: '/press' },
]

/**
 * T4 navigation — thin, centered, editorial. Transparent over hero with
 * white-on-dark copy; fades to solid warm-ivory with espresso copy on scroll.
 */
export function T4Nav({ agentId, agencyName, navLinks }: T4NavProps) {
  const base = `/t4/${agentId}`
  const links = (navLinks && navLinks.length > 0 ? navLinks : DEFAULT_LINKS).map((l) => ({
    label: l.label,
    href: l.href.startsWith('http') ? l.href : `${base}${l.href.replace(/^\//, '/')}`,
  }))

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const solid = scrolled || mobileOpen

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          background: solid ? 'rgba(251, 248, 241, 0.94)' : 'transparent',
          color: solid ? 'var(--t4-text)' : '#fff',
          borderBottom: solid ? '1px solid var(--t4-divider)' : '1px solid transparent',
          backdropFilter: solid ? 'blur(14px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: solid ? 'blur(14px) saturate(1.2)' : 'none',
          transition: 'background 0.45s var(--t4-ease), color 0.45s var(--t4-ease), border-color 0.45s var(--t4-ease)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--t4-content-wide)',
            margin: '0 auto',
            padding: '0 48px',
            height: 92,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 32,
          }}
        >
          {/* Top-left wordmark — tiny caps + ornament */}
          <Link
            href={base}
            style={{
              justifySelf: 'start',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--t4-font-display)',
                fontSize: 22,
                fontWeight: 400,
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              {agencyName}
            </span>
          </Link>

          {/* Center nav */}
          <nav
            className="t4-desktop-nav"
            style={{
              justifySelf: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 40,
            }}
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="t4-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right CTA + mobile toggle */}
          <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link
              href={`${base}/contact`}
              className="t4-desktop-nav"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 22px',
                border: `1px solid ${solid ? 'var(--t4-text)' : 'rgba(255,255,255,0.72)'}`,
                color: 'inherit',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.3s var(--t4-ease)',
              }}
            >
              Plan a Journey
            </Link>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="t4-mobile-toggle"
              style={{
                display: 'none',
                background: 'transparent',
                border: 0,
                color: 'inherit',
                cursor: 'pointer',
                padding: 8,
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'var(--t4-bg)',
            padding: '120px 28px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            animation: 't4FadeUp 0.35s var(--t4-ease) both',
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--t4-font-display)',
                fontSize: 34,
                fontWeight: 300,
                letterSpacing: '-0.01em',
                color: 'var(--t4-text)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'var(--t4-divider)', margin: '20px 0' }} />
          <Link
            href={`${base}/contact`}
            onClick={() => setMobileOpen(false)}
            className="t4-btn t4-btn-solid"
            style={{ alignSelf: 'flex-start' }}
          >
            Plan a Journey
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .t4-desktop-nav { display: none !important; }
          .t4-mobile-toggle { display: inline-flex !important; }
        }
      `}</style>
    </>
  )
}
