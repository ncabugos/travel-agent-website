'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface T2NavProps {
  agentId: string
  agencyName: string
  logoUrl?: string
}

const NAV_LINKS = [
  { label: 'Plan a Trip',    href: '/plan-a-trip' },
  { label: 'Book a Hotel',   href: '/book-hotel' },
  { label: 'Private Villas', href: '/book-villa' },
  { label: 'Cruises',        href: '/find-cruise' },
  { label: 'Experiences',    href: '/experiences' },
  { label: 'About',          href: '/about' },
]

export function T2Nav({ agentId, agencyName, logoUrl }: T2NavProps) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [mounted, setMounted]     = useState(false)
  const base = `/t2/${agentId}`

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const logoColor   = scrolled ? 'var(--t2-text)' : '#FFFFFF'
  const iconColor   = menuOpen ? '#FFFFFF' : (scrolled ? '#1C1917' : '#FFFFFF')
  const ctaColor    = scrolled ? 'var(--t2-text)' : '#FFFFFF'
  const ctaBorder   = scrolled ? 'rgba(28,25,23,0.25)' : 'rgba(255,255,255,0.45)'

  return (
    <>
      {/* ── Nav bar ── */}
      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease',
          background: menuOpen
            ? 'transparent'
            : scrolled
              ? 'rgba(250,249,247,0.92)'
              : 'transparent',
          backdropFilter: (!menuOpen && scrolled) ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: (!menuOpen && scrolled) ? 'blur(16px)' : 'none',
          boxShadow: (!menuOpen && scrolled) ? '0 1px 0 rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--t2-content-max, 1280px)',
            margin: '0 auto',
            padding: '0 32px',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            height: 76,
          }}
        >
          {/* Left — hamburger */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 8px 8px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                lineHeight: 0,
              }}
            >
              {/* Animated hamburger → X */}
              <span
                className={`t2-bar t2-bar-top${menuOpen ? ' t2-bar-open-top' : ''}`}
                style={{
                  display: 'block',
                  width: 22,
                  height: 1.5,
                  background: iconColor,
                  transition: 'transform 0.35s ease, opacity 0.25s ease, background 0.3s ease',
                  transformOrigin: 'center',
                  transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: 22,
                  height: 1.5,
                  background: iconColor,
                  transition: 'opacity 0.25s ease, background 0.3s ease',
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: 22,
                  height: 1.5,
                  background: iconColor,
                  transition: 'transform 0.35s ease, background 0.3s ease',
                  transformOrigin: 'center',
                  transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </div>

          {/* Centre — logo */}
          <Link
            href={base}
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={agencyName}
                width={160}
                height={44}
                style={{
                  objectFit: 'contain',
                  maxHeight: 40,
                  filter: (menuOpen || !scrolled) ? 'brightness(0) invert(1)' : 'none',
                  transition: 'filter 0.3s ease',
                }}
                unoptimized
              />
            ) : (
              <span
                style={{
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 20,
                  fontWeight: 300,
                  letterSpacing: '0.06em',
                  color: menuOpen ? '#FFFFFF' : logoColor,
                  transition: 'color 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {agencyName}
              </span>
            )}
          </Link>

          {/* Right — Begin Planning CTA */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Link
              href={`${base}/contact`}
              className="t2-nav-cta"
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '9px 22px',
                border: `1px solid ${menuOpen ? 'rgba(255,255,255,0.45)' : ctaBorder}`,
                color: menuOpen ? '#FFFFFF' : ctaColor,
                background: 'transparent',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              Begin Planning
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Full-screen overlay menu ── */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(28, 25, 23, 0.97)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: menuOpen ? 'all' : 'none',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <nav aria-label="Full-screen menu">
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <li key={link.label}>
                <Link
                  href={`${base}${link.href}`}
                  onClick={() => setMenuOpen(false)}
                  className="t2-overlay-link"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--t2-font-serif)',
                    fontSize: 'clamp(32px, 5vw, 56px)',
                    fontWeight: 300,
                    letterSpacing: '0.02em',
                    color: 'rgba(255,255,255,0.88)',
                    textDecoration: 'none',
                    padding: '14px 0',
                    transition: `color 0.2s ease, opacity 0.3s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider + secondary links */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 32,
              borderTop: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              gap: 28,
              justifyContent: 'center',
              flexWrap: 'wrap',
              transition: `opacity 0.4s ease ${NAV_LINKS.length * 60 + 60}ms`,
              opacity: menuOpen ? 1 : 0,
            }}
          >
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="t2-social-icon" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s ease', lineHeight: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="t2-social-icon" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s ease', lineHeight: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube" className="t2-social-icon" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s ease', lineHeight: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1c1917"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#" aria-label="X" className="t2-social-icon" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s ease', lineHeight: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </nav>
      </div>

      <style>{`
        .t2-social-icon:hover {
          color: var(--t2-accent) !important;
        }
        .t2-nav-cta:hover {
          background: var(--t2-text) !important;
          border-color: var(--t2-text) !important;
          color: var(--t2-bg) !important;
        }
        .t2-overlay-link:hover {
          color: var(--t2-accent) !important;
        }
        @media (max-width: 600px) {
          .t2-nav-cta {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
