'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface T3NavProps {
  agentId: string
  agencyName: string
  tagline?: string
  logoUrl?: string
  navLinks?: { label: string; href: string }[]
}

const DEFAULT_LINKS = [
  { label: 'About',       href: '/about' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Hotels',      href: '/book-hotel' },
  { label: 'Villas',      href: '/book-villa' },
  { label: 'Voyages',     href: '/find-cruise' },
]

export function T3Nav({ agentId, agencyName, logoUrl, navLinks }: T3NavProps) {
  const base = `/t3/${agentId}`
  const links = (navLinks && navLinks.length > 0 ? navLinks : DEFAULT_LINKS).map(l => ({
    label: l.label,
    href: l.href.startsWith('http') ? l.href : `${base}${l.href.replace(/^\//, '/')}`,
  }))

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const solidNav = scrolled || mobileOpen

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: solidNav ? 'rgba(247, 245, 240, 0.96)' : 'transparent',
          color: solidNav ? 'var(--t3-text)' : '#ffffff',
          borderBottom: solidNav ? '1px solid var(--t3-divider)' : '1px solid transparent',
          backdropFilter: solidNav ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: solidNav ? 'blur(14px)' : 'none',
          transition: 'background 0.35s var(--t3-ease), color 0.35s var(--t3-ease), border-color 0.35s var(--t3-ease)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--t3-content-wide)',
            margin: '0 auto',
            padding: '0 48px',
            height: 80,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 32,
          }}
        >
          {/* Logo / agency name */}
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
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={agencyName} style={{ height: 28, width: 'auto' }} />
            ) : (
              <span
                style={{
                  fontFamily: 'var(--t3-font-display)',
                  fontSize: 18,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                }}
              >
                {agencyName}
              </span>
            )}
          </Link>

          {/* Center nav */}
          <nav
            className="t3-desktop-nav"
            style={{
              justifySelf: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 36,
            }}
          >
            {links.map(link => (
              <Link key={link.href} href={link.href} className="t3-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right CTA */}
          <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link
              href={`${base}/plan-a-trip`}
              className="t3-desktop-nav"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                border: `1px solid ${solidNav ? 'var(--t3-text)' : 'rgba(255,255,255,0.65)'}`,
                color: 'inherit',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.25s var(--t3-ease)',
              }}
            >
              Plan a Trip
            </Link>

            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              className="t3-mobile-toggle"
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

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'var(--t3-bg)',
            paddingTop: 100,
            padding: '100px 32px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            animation: 't3FadeUp 0.35s var(--t3-ease) both',
          }}
        >
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--t3-font-display)',
                fontSize: 32,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: 'var(--t3-text)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'var(--t3-divider)', margin: '16px 0' }} />
          <Link
            href={`${base}/plan-a-trip`}
            onClick={() => setMobileOpen(false)}
            className="t3-btn t3-btn-solid"
            style={{ width: '100%' }}
          >
            Plan a Trip
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .t3-desktop-nav { display: none !important; }
          .t3-mobile-toggle { display: inline-flex !important; }
        }
      `}</style>
    </>
  )
}
