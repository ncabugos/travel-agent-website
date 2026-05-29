'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface LidoMobileNavProps {
  agentId: string
}

const LINKS = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Advisors',     href: '/advisors' },
  { label: 'Hotels',       href: '/book-hotel' },
  { label: 'Cruises',      href: '/find-cruise' },
  { label: 'Journal',      href: '/journal' },
  { label: 'Contact',      href: '/contact' },
]

/* ── Inline icons (no icon-font dependency) ──────────────────────────────── */
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="20" y2="16" />
  </svg>
)
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)
const IconBuilding = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="1" /><line x1="9" y1="7" x2="9" y2="7" /><line x1="15" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="9" y2="11" /><line x1="15" y1="11" x2="15" y2="11" /><line x1="10" y1="21" x2="14" y2="21" />
  </svg>
)
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </svg>
)

/**
 * "The Lido Bar" — a floating bottom-docked nav for mobile only.
 * Docked: a blurred navy pill with a menu trigger, two quick-access pills
 * (Hotels / Advisor), and a faded logo. Tapping the menu raises a full-screen
 * overlay above it with the primary nav links and conversion buttons. Never a
 * side drawer, never a top sheet. Visible only below 768px.
 */
export function LidoMobileNav({ agentId }: LidoMobileNavProps) {
  const [open, setOpen] = useState(false)
  const base = `/t2/${agentId}`

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const quickPill: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    background: 'rgba(237,234,228,0.09)',
    border: '1px solid rgba(237,234,228,0.15)',
    borderRadius: 10,
    padding: '7px 14px',
    fontSize: 11,
    letterSpacing: '0.1em',
    color: 'var(--lido-text)',
    textDecoration: 'none',
    fontFamily: 'var(--lido-font-body)',
    whiteSpace: 'nowrap',
  }

  return (
    <div className="lido-show-on-mobile">
      {/* ── Full-screen overlay ── */}
      <div
        aria-hidden={!open}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(6,16,30,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 28px 120px',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(16px)',
          pointerEvents: open ? 'all' : 'none',
          transition: open
            ? 'opacity 340ms cubic-bezier(0.32,0.72,0,1), transform 340ms cubic-bezier(0.32,0.72,0,1)'
            : 'opacity 240ms cubic-bezier(0.4,0,1,1), transform 240ms cubic-bezier(0.4,0,1,1)',
        }}
      >
        {/* Logo */}
        <Image
          src="/demos/the-lido-collective/lido-collective-logo-white.png"
          alt="The Lido Collective"
          width={140}
          height={70}
          style={{
            opacity: 0.9,
            objectFit: 'contain',
            width: 140,
            height: 'auto',
            margin: '0 auto 28px',
          }}
        />

        <hr className="lido-rule" style={{ border: 0, borderTop: '1px solid rgba(237,234,228,0.14)', width: '100%' }} />

        {/* Nav links */}
        <ul style={{ listStyle: 'none', margin: '8px 0', padding: '12px 0', display: 'flex', flexDirection: 'column' }}>
          {LINKS.map((link, i) => (
            <li key={link.label}>
              <Link
                href={`${base}${link.href}`}
                onClick={() => setTimeout(() => setOpen(false), 100)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--lido-font-display)',
                  fontSize: 'clamp(34px, 8vw, 50px)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: 'var(--lido-text)',
                  textDecoration: 'none',
                  padding: '6px 0',
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 0.4s ease ${open ? i * 45 + 120 : 0}ms, transform 0.4s ease ${open ? i * 45 + 120 : 0}ms`,
                }}
              >
                {link.label}
                <span style={{ fontFamily: 'var(--lido-font-body)', fontSize: 18, opacity: 0.5 }}>→</span>
              </Link>
            </li>
          ))}
        </ul>

        <hr className="lido-rule" style={{ border: 0, borderTop: '1px solid rgba(237,234,228,0.14)', width: '100%' }} />

        {/* Conversion buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <Link
            href={`${base}/book-hotel`}
            onClick={() => setTimeout(() => setOpen(false), 100)}
            style={{
              flex: 1, height: 52, borderRadius: 14, border: '1px solid rgba(237,234,228,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: 'var(--lido-text)', textDecoration: 'none', fontFamily: 'var(--lido-font-body)',
              fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            }}
          >
            <IconBuilding /> Book a Hotel
          </Link>
          <Link
            href={`${base}/advisors`}
            onClick={() => setTimeout(() => setOpen(false), 100)}
            style={{
              flex: 1, height: 52, borderRadius: 14, border: '1px solid rgba(237,234,228,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: 'var(--lido-text)', textDecoration: 'none', fontFamily: 'var(--lido-font-body)',
              fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center',
            }}
          >
            <IconUser /> An Advisor
          </Link>
        </div>
      </div>

      {/* ── Docked bar ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: 16,
          right: 16,
          zIndex: 9999,
          height: 58,
          paddingBottom: 'env(safe-area-inset-bottom)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '0 14px',
          background: 'rgba(13,26,46,0.88)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          border: '1px solid rgba(237,234,228,0.14)',
          borderRadius: 20,
          boxShadow: '0 8px 40px rgba(6,16,30,0.7)',
        }}
      >
        {/* Left — menu / close trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lido-text)',
            opacity: open ? 1 : 0.75, padding: 8, lineHeight: 0, transition: 'opacity 0.18s ease',
          }}
        >
          {open ? <IconX /> : <IconMenu />}
        </button>

        {/* Center — quick-access pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`${base}/book-hotel`} onClick={() => setOpen(false)} style={quickPill}>
            <IconBuilding /> HOTELS
          </Link>
          <Link href={`${base}/advisors`} onClick={() => setOpen(false)} style={quickPill}>
            <IconUser /> ADVISOR
          </Link>
        </div>

        {/* Right — logo (docked) / close (expanded) */}
        {open ? (
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lido-text)', padding: 8, lineHeight: 0 }}
          >
            <IconX />
          </button>
        ) : (
          <Image
            src="/demos/the-lido-collective/lido-collective-logo-white.png"
            alt="The Lido Collective"
            width={54}
            height={27}
            style={{ opacity: 0.5, objectFit: 'contain', width: 54, height: 'auto', marginRight: 6 }}
          />
        )}
      </div>
    </div>
  )
}
