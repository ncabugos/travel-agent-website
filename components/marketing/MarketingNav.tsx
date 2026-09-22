'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CHARCOAL, PRIMARY_CTA_STYLE, PRIMARY_CTA_LABEL } from './tokens'

const NAV_LINKS = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Work',     href: '/#work' },
  { label: 'Pricing',  href: '/#pricing' },
  { label: 'Studio',   href: '/studio' },
  { label: 'Insights', href: '/insights' },
]

const LOGO_BLACK = '/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-black.png'
const LOGO_WHITE = '/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-white.png'

/**
 * Marketing nav. `overlay` starts it transparent over a dark hero and turns
 * it white once the page scrolls; other pages render the white bar from the
 * first paint. `minimal` hides the links (legal pages, consultation form).
 */
export function MarketingNav({ minimal = false, overlay = false }: { minimal?: boolean; overlay?: boolean } = {}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(!overlay)
  const sheetRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  // Focus management: move focus into the sheet on open, restore to the
  // hamburger on close; page content behind the sheet is made inert.
  useEffect(() => {
    const main = document.querySelector('main')
    if (open) {
      main?.setAttribute('inert', '')
      const first = sheetRef.current?.querySelector<HTMLElement>('a, button')
      first?.focus()
    } else {
      main?.removeAttribute('inert')
      if (document.activeElement && sheetRef.current?.contains(document.activeElement)) {
        hamburgerRef.current?.focus()
      }
    }
    return () => { main?.removeAttribute('inert') }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const light = !scrolled && !open
  const fg = light ? '#fff' : CHARCOAL
  const fgMuted = light ? 'rgba(255,255,255,0.8)' : '#5F5850'

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 'var(--eah-banner-h, 0px)', left: 0, right: 0, zIndex: 1000,
          backgroundColor: light ? 'transparent' : 'rgba(255,255,255,0.96)',
          backdropFilter: light ? 'none' : 'blur(12px)',
          borderBottom: light ? '1px solid transparent' : '1px solid #E8E4DC',
          transition: 'background-color 0.25s ease, border-color 0.25s ease',
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
        }}
      >
        <div
          className="eah-container marketing-nav-inner"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}
        >
          <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center' }} aria-label="Elite Advisor Hub home">
            <Image
              src={light ? LOGO_WHITE : LOGO_BLACK}
              alt="Elite Advisor Hub"
              width={800}
              height={134}
              style={{ objectFit: 'contain', height: '26px', width: 'auto' }}
              priority
            />
          </Link>

          {!minimal && (
            <div className="marketing-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} className="marketing-nav-link" style={{ fontSize: '14px', color: fgMuted, textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}>
                  {label}
                </Link>
              ))}
              <Link href="/agent-portal/login" className="marketing-nav-link" style={{ fontSize: '14px', color: fg, textDecoration: 'none', fontWeight: 500 }}>
                Advisor login
              </Link>
              <Link href="/schedule-consultation" className="eah-cta-primary" style={{ ...PRIMARY_CTA_STYLE, minHeight: '40px', padding: '0 18px', fontSize: '14px' }}>
                {PRIMARY_CTA_LABEL}
              </Link>
            </div>
          )}

          {!minimal && (
            <button
              ref={hamburgerRef}
              type="button"
              className="marketing-nav-hamburger"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="marketing-mobile-sheet"
              onClick={() => setOpen(o => !o)}
              style={{ display: 'none', width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <div style={{ position: 'relative', width: '22px', height: '12px' }}>
                <span style={{ position: 'absolute', left: 0, right: 0, height: '1.5px', background: fg, top: 0, transform: open ? 'translateY(5px) rotate(45deg)' : 'none', transition: 'transform 0.25s ease, background 0.25s ease' }} />
                <span style={{ position: 'absolute', left: 0, right: 0, height: '1.5px', background: fg, top: '10px', transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none', transition: 'transform 0.25s ease, background 0.25s ease' }} />
              </div>
            </button>
          )}
        </div>
      </nav>

      {!minimal && (
        <div
          onClick={close}
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(17,17,17,0.35)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.25s ease' }}
        />
      )}

      {!minimal && (
        <div
          ref={sheetRef}
          id="marketing-mobile-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="marketing-mobile-sheet"
          inert={!open}
          style={{
            position: 'fixed', top: 'calc(72px + var(--eah-banner-h, 0px))', left: 0, right: 0, zIndex: 999,
            background: '#fff', borderBottom: '1px solid #E8E4DC',
            transform: open ? 'translateY(0)' : 'translateY(-8px)',
            opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden', pointerEvents: open ? 'auto' : 'none',
            transition: 'opacity 0.22s ease, transform 0.22s ease, visibility 0s linear ' + (open ? '0s' : '0.22s'),
            maxHeight: 'calc(100dvh - 72px - var(--eah-banner-h, 0px))', overflowY: 'auto', overscrollBehavior: 'contain',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
          }}
        >
          <div style={{ padding: '8px 20px 24px' }}>
            <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[...NAV_LINKS, { label: 'Advisor login', href: '/agent-portal/login' }].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} onClick={close} style={{ display: 'block', padding: '16px 0', fontSize: '17px', color: CHARCOAL, textDecoration: 'none', borderBottom: '1px solid #E8E4DC' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/schedule-consultation" onClick={close} className="eah-cta-primary" style={{ ...PRIMARY_CTA_STYLE, width: '100%', marginTop: '20px' }}>
              {PRIMARY_CTA_LABEL}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .marketing-nav-desktop { display: none !important; }
          .marketing-nav-hamburger { display: inline-flex !important; }
        }
        .marketing-nav-link:hover { opacity: 0.7; }
        @media (prefers-reduced-motion: reduce) {
          .marketing-mobile-sheet, .marketing-nav-hamburger span { transition: none !important; }
        }
      `}</style>
    </>
  )
}
