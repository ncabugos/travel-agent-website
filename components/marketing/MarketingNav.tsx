'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing'  },
  { label: 'Demos',    href: '#demos'    },
]

export function MarketingNav() {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div
          className="marketing-nav-inner"
          style={{
            maxWidth: '1200px', margin: '0 auto',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            height: '64px',
            padding: '0 20px',
          }}
        >
          {/* Brand */}
          <Link href="/" onClick={close} style={{ textDecoration: 'none', color: 'inherit' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em' }}>EliteAdvisorHub</span>
          </Link>

          {/* Desktop links */}
          <div className="marketing-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
                {label}
              </a>
            ))}
            <Link
              href="/agent-portal/login"
              style={{
                padding: '8px 20px', backgroundColor: '#111', color: '#fff',
                borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Agent Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="marketing-nav-hamburger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="marketing-mobile-sheet"
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'none',
              width: '40px', height: '40px',
              alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 0,
              borderRadius: '8px',
              transition: 'background 0.2s ease',
            }}
          >
            <div style={{
              position: 'relative', width: '20px', height: '14px',
            }}>
              <span
                style={{
                  position: 'absolute', left: 0, right: 0,
                  height: '2px', borderRadius: '2px',
                  background: '#111',
                  top: open ? '6px' : '0',
                  transform: open ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.25s ease, top 0.25s ease, opacity 0.2s ease',
                }}
              />
              <span
                style={{
                  position: 'absolute', left: 0, right: 0, top: '6px',
                  height: '2px', borderRadius: '2px',
                  background: '#111',
                  opacity: open ? 0 : 1,
                  transition: 'opacity 0.15s ease',
                }}
              />
              <span
                style={{
                  position: 'absolute', left: 0, right: 0,
                  height: '2px', borderRadius: '2px',
                  background: '#111',
                  top: open ? '6px' : '12px',
                  transform: open ? 'rotate(-45deg)' : 'none',
                  transition: 'transform 0.25s ease, top 0.25s ease',
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile sheet backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(17,17,17,0.35)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Mobile sheet */}
      <div
        id="marketing-mobile-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="marketing-mobile-sheet"
        style={{
          position: 'fixed',
          top: '64px', left: 0, right: 0,
          zIndex: 999,
          background: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 12px 24px -12px rgba(0,0,0,0.15)',
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '12px 20px 24px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={close}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 4px',
                    fontSize: '17px', fontWeight: 600,
                    color: '#111', textDecoration: 'none',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <span>{label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            <Link
              href="/agent-portal/login"
              onClick={close}
              style={{
                display: 'block', textAlign: 'center',
                padding: '14px 20px',
                backgroundColor: '#111', color: '#fff',
                borderRadius: '10px',
                fontSize: '15px', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Agent Login
            </Link>
            <Link
              href="/schedule-consultation"
              onClick={close}
              style={{
                display: 'block', textAlign: 'center',
                padding: '14px 20px',
                backgroundColor: '#fff', color: '#111',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '10px',
                fontSize: '15px', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Schedule a consultation
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .marketing-nav-desktop { display: none !important; }
          .marketing-nav-hamburger { display: inline-flex !important; }
        }
        .marketing-nav-hamburger:hover { background: rgba(0,0,0,0.04); }
      `}</style>
    </>
  )
}
