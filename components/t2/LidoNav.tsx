'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface LidoNavProps {
  agentId: string
}

const LINKS = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Advisors',     href: '/advisors' },
  { label: 'Hotels',       href: '/book-hotel' },
  { label: 'Cruises',      href: '/find-cruise' },
  { label: 'Journal',      href: '/journal' },
]

/**
 * The Lido Collective desktop nav — left logo, inline tracked-caps links, a
 * filled navy CTA. Sits transparent over the white hero, gaining a frosted
 * white backdrop + hairline on scroll. The logo is the original dark mark —
 * its white background is invisible against the white page. Hidden below
 * 768px (the LidoMobileNav bottom bar takes over).
 */
export function LidoNav({ agentId }: LidoNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const base = `/t2/${agentId}`
  const pathname = usePathname()

  // Pages whose top section is light (white) → dark nav content even when
  // unscrolled. Everything else opens on a full-bleed image hero, so the nav
  // content goes white for legibility until the user scrolls past it.
  const lightTopRoutes = [base, `${base}/destinations`, `${base}/advisors`]
  const lightTop = lightTopRoutes.includes(pathname)
  const onDark = !scrolled && !lightTop

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className="lido-hide-on-mobile"
      style={{
        position: 'fixed',
        top: 'var(--eah-banner-h, 0px)',
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
        background: scrolled ? 'rgba(255, 255, 255, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px) saturate(1.2)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(1.2)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(20,32,47,0.12)' : 'transparent'}`,
      }}
    >
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          height: 84,
        }}
      >
        {/* Left — transparent logo; white over image heroes, dark otherwise */}
        <Link href={base} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image
            src={onDark ? '/demos/the-lido-collective/2x/lido-white@2x.png' : '/demos/the-lido-collective/2x/lido black@2x.png'}
            alt="The Lido Collective"
            width={1873}
            height={1241}
            priority
            unoptimized
            style={{ objectFit: 'contain', height: 58, width: 'auto' }}
          />
        </Link>

        {/* Center — links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: 38, listStyle: 'none', margin: 0, padding: 0 }}>
          {LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={`${base}${link.href}`}
                className="lido-nav-link"
                style={{
                  fontFamily: 'var(--lido-font-body)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: onDark ? '#FFFFFF' : 'var(--lido-text)',
                  textDecoration: 'none',
                  opacity: onDark ? 0.92 : 0.78,
                  transition: 'opacity 0.25s ease, color 0.3s ease',
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — filled CTA (navy on light, white outline over image heroes) */}
        <Link
          href={`${base}/contact`}
          className={onDark ? 'lido-nav-cta-light' : 'lido-btn-fill'}
          style={
            onDark
              ? {
                  padding: '12px 26px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.6)',
                  color: '#FFFFFF',
                  background: 'transparent',
                  fontFamily: 'var(--lido-font-body)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                }
              : { padding: '12px 26px' }
          }
        >
          Plan a Journey
        </Link>
      </div>

      <style>{`
        .lido-nav-link:hover { opacity: 1 !important; }
        .lido-nav-cta-light:hover { background: rgba(255,255,255,0.14) !important; border-color: rgba(255,255,255,0.9) !important; }
      `}</style>
    </nav>
  )
}
