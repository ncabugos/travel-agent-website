'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { EDEN } from '@/lib/media-library'

interface SiteNavProps {
  agentId: string
  agencyName: string
}

const DESKTOP_NAV = [
  { label: 'Home',      path: '' },
  { label: 'About',     path: '/about' },
  { label: 'Media',     path: '/media' },
  { label: 'Blog',      path: '/blog' },
  { label: 'Resources', path: '/resources' },
  { label: 'Contact',   path: '/contact' },
]

// Mobile omits Home (you're already there) 
const MOBILE_NAV = [
  { label: 'About',     path: '/about' },
  { label: 'Media',     path: '/media' },
  { label: 'Blog',      path: '/blog' },
  { label: 'Resources', path: '/resources' },
  { label: 'Contact',   path: '/contact' },
]

const WHITE_LOGO = '/assets/eden/logos/eden-new-white-header-350-reduced.png'

export function SiteNav({ agentId, agencyName }: SiteNavProps) {
  const [scrolled,   setScrolled]  = useState(false)
  const [hovered,    setHovered]   = useState(false)
  const [menuOpen,   setMenuOpen]  = useState(false)
  const base = `/frontend/${agentId}`

  // Scroll lock when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const solid = scrolled || hovered

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: '36px',
    left: 0,
    right: 0,
    zIndex: 40,
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease',
    background: solid ? 'rgba(250, 250, 245, 0.92)' : 'rgba(255,255,255,0.12)',
    backdropFilter: solid ? 'blur(16px)' : 'none',
    boxShadow: solid ? '0 1px 0 rgba(0,0,0,0.06)' : 'none',
  }

  const linkColor = solid ? 'var(--charcoal)' : '#FFFFFF'

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: '10px',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: linkColor,
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    padding: '4px 0',
  }

  const hamburgerColor = solid ? 'var(--charcoal)' : '#FFFFFF'

  return (
    <>
      {/* ── Top nav bar ───────────────────────────────────────────────────── */}
      <nav
        style={navStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Desktop layout: 3-column logo-center ───────────────── */}
        <div
          className="site-nav-desktop max-w-7xl mx-auto w-full px-8"
          style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}
        >
          {/* Left links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {DESKTOP_NAV.slice(0, 3).map(({ label, path }) => (
              <NavLink key={label} href={`${base}${path}`} style={linkStyle}>{label}</NavLink>
            ))}
          </div>

          {/* Center logo */}
          <Link href={base} style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
            <Image
              src={solid ? EDEN.logoGold : WHITE_LOGO}
              alt={agencyName}
              width={140}
              height={56}
              style={{ objectFit: 'contain', objectPosition: 'center', transition: 'opacity 0.35s ease' }}
              priority
            />
          </Link>

          {/* Right links */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '32px' }}>
            {DESKTOP_NAV.slice(3).map(({ label, path }) => (
              <NavLink key={label} href={`${base}${path}`} style={linkStyle}>{label}</NavLink>
            ))}
          </div>
        </div>

        {/* ── Mobile layout: logo-center + hamburger ──────────────── */}
        <div
          className="site-nav-mobile"
          style={{ display: 'none', width: '100%', padding: '0 20px', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Spacer left (keeps logo centered) */}
          <div style={{ width: '44px' }} />

          {/* Centered logo */}
          <Link href={base} onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src={solid ? EDEN.logoGold : WHITE_LOGO}
              alt={agencyName}
              width={110}
              height={44}
              style={{ objectFit: 'contain', transition: 'opacity 0.35s ease' }}
              priority
            />
          </Link>

          {/* Hamburger / Close */}
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: hamburgerColor,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: hamburgerColor,
                transition: 'opacity 0.2s ease',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: hamburgerColor,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen drawer ──────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={closeMenu}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 39,
          background: 'rgba(20,18,16,0.55)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(320px, 85vw)',
          zIndex: 50,
          background: 'var(--charcoal)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '108px', // below topbar + nav
          paddingBottom: '48px',
          paddingLeft: '40px',
          paddingRight: '40px',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          overflowY: 'auto',
        }}
      >
        {/* Logo in drawer */}
        <div style={{ marginBottom: '48px' }}>
          <Image
            src={WHITE_LOGO}
            alt={agencyName}
            width={120}
            height={48}
            style={{ objectFit: 'contain', objectPosition: 'left' }}
          />
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0' }}>
            {MOBILE_NAV.map(({ label, path }, i) => (
              <li key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <Link
                  href={`${base}${path}`}
                  onClick={closeMenu}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '28px',
                    fontWeight: 300,
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    padding: '20px 0',
                    letterSpacing: '0.02em',
                    transition: 'color 0.2s ease, padding-left 0.2s ease',
                    // Staggered fade-in handled by CSS
                    animationDelay: `${i * 60}ms`,
                  }}
                  className="drawer-nav-link"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom — Start Planning CTA */}
        <div style={{ marginTop: '40px' }}>
          <Link
            href={`${base}/contact`}
            onClick={closeMenu}
            style={{
              display: 'block',
              textAlign: 'center',
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--charcoal)',
              background: 'var(--gold)',
              padding: '16px 24px',
              textDecoration: 'none',
            }}
          >
            Start Planning
          </Link>

          {/* Social links */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '32px' }}>
            <a href="https://instagram.com/edenforyourworld" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s ease' }}
              className="drawer-social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://facebook.com/edenforyourworld" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s ease' }}
              className="drawer-social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Scoped styles ──────────────────────────────────────────────────── */}
      <style>{`
        /* Desktop shows 3-col nav, hides mobile bar */
        .site-nav-desktop { display: grid !important; }
        .site-nav-mobile  { display: none !important; }

        @media (max-width: 768px) {
          .site-nav-desktop { display: none !important; }
          .site-nav-mobile  { display: flex !important; }
        }

        .drawer-nav-link:hover {
          color: var(--gold) !important;
          padding-left: 8px !important;
        }
        .drawer-social-link:hover {
          color: var(--gold) !important;
        }
      `}</style>
    </>
  )
}

function NavLink({
  href,
  style,
  children,
}: {
  href: string
  style: React.CSSProperties
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      style={{ ...style, color: hovered ? 'var(--gold)' : style.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  )
}
