'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { filterNavByTier, type Tier } from '@/lib/tier-features'

interface T3NavProps {
  agentId: string
  agencyName: string
  tagline?: string
  logoUrl?: string
  navLinks?: { label: string; href: string }[]
  /** Optional advisor contact — surfaced in the mobile menu's bottom dock. */
  phone?: string
  email?: string
  /** Subscription tier — filters default nav links to match what each tier
      actually surfaces. Explicit `navLinks` overrides bypass this. */
  tier?: Tier | null
}

const DEFAULT_LINKS = [
  { label: 'About',   href: '/about' },
  { label: 'Hotels',  href: '/book-hotel' },
  { label: 'Voyages', href: '/find-cruise' },
]

/**
 * Editorial mobile-menu cards. Each renders as a full-bleed photo card
 * with a number, a serif label, a one-line italic tagline, and an arrow.
 * Cards are tappable surfaces — replaces the legacy text-link list.
 *
 * The href is stored as a relative path; the component prepends `/t3/{agentId}`.
 */
interface MenuCard {
  num: string
  label: string
  tagline: string
  href: string
  image: string
  accent?: boolean
}

const MENU_CARDS: MenuCard[] = [
  {
    num: '01',
    label: 'Stays',
    tagline: 'Hand-picked hotels with quiet privileges arranged on every booking.',
    href: '/book-hotel',
    image: '/media/hotel-programs/four-seasons/fs-hero-2200.jpg',
  },
  {
    num: '02',
    label: 'Voyages',
    tagline: 'Ocean, river, and expedition cruises with advisor-only benefits.',
    href: '/find-cruise',
    image: '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
  },
  {
    num: '03',
    label: 'The Studio',
    tagline: 'Two decades, four advisors, one principle.',
    href: '/about',
    image: '/media/hotel-programs/aman/aman-hero-2000.jpg',
  },
  {
    num: '04',
    label: 'Plan a Trip',
    tagline: 'Begin with a 30-minute conversation. No forms.',
    href: '/plan-a-trip',
    image: '/media/hero images/four-seasons-sayan-hero.jpg',
    accent: true,
  },
]

export function T3Nav({ agentId, agencyName, logoUrl, navLinks, phone, email, tier }: T3NavProps) {
  const base = `/t3/${agentId}`
  // Explicit override wins. Otherwise filter defaults by tier.
  const baseLinks = navLinks && navLinks.length > 0
    ? navLinks
    : filterNavByTier(DEFAULT_LINKS, tier)
  const links = baseLinks.map(l => ({
    label: l.label,
    href: l.href.startsWith('http') ? l.href : `${base}${l.href.replace(/^\//, '/')}`,
  }))

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Body-scroll lock + ESC close + focus management while mobile menu is open
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
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
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="t3-mobile-toggle"
              style={{
                display: 'none',
                background: 'transparent',
                border: 0,
                color: 'inherit',
                cursor: 'pointer',
                padding: 12,
                minWidth: 44,
                minHeight: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu: "The Itinerary" — editorial card stack ───────────── */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="t3-itinerary"
        >
          {/* Backdrop (tap to close) */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="t3-itinerary-backdrop"
          />

          {/* Sheet */}
          <div className="t3-itinerary-sheet" role="document">
            {/* Top bar */}
            <div className="t3-itinerary-top">
              <Link
                href={base}
                onClick={() => setMobileOpen(false)}
                className="t3-itinerary-brand"
              >
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt={agencyName} style={{ height: 24, width: 'auto' }} />
                ) : (
                  agencyName
                )}
              </Link>
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="t3-itinerary-close"
              >
                <X size={22} />
              </button>
            </div>

            {/* Eyebrow */}
            <span className="t3-itinerary-eyebrow">The Itinerary</span>

            {/* Card stack */}
            <div className="t3-itinerary-cards">
              {MENU_CARDS.map((card, i) => (
                <Link
                  key={card.href}
                  href={`${base}${card.href}`}
                  onClick={() => setMobileOpen(false)}
                  className={`t3-itinerary-card${card.accent ? ' t3-itinerary-card-accent' : ''}`}
                  style={{ animationDelay: `${120 + i * 80}ms` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt=""
                    aria-hidden
                    className="t3-itinerary-img"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="t3-itinerary-overlay" />
                  <div className="t3-itinerary-content">
                    <span className="t3-itinerary-num">{card.num}</span>
                    <div className="t3-itinerary-text">
                      <h2 className="t3-itinerary-label">{card.label}</h2>
                      <p className="t3-itinerary-tag">{card.tagline}</p>
                    </div>
                  </div>
                  <span className="t3-itinerary-arrow" aria-hidden>→</span>
                </Link>
              ))}
            </div>

            {/* Bottom advisor dock */}
            {(phone || email) && (
              <div className="t3-itinerary-dock">
                {phone && (
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="t3-itinerary-dock-link">
                    <Phone size={16} aria-hidden />
                    <span>{phone}</span>
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="t3-itinerary-dock-link">
                    <Mail size={16} aria-hidden />
                    <span>{email}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .t3-desktop-nav { display: none !important; }
          .t3-mobile-toggle { display: inline-flex !important; }
        }

        /* ── The Itinerary mobile menu ─────────────────────────────────── */
        .t3-itinerary {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: stretch;
        }
        .t3-itinerary-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(20, 17, 15, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 0;
          padding: 0;
          margin: 0;
          cursor: pointer;
          animation: t3ItinFade 0.32s var(--t3-ease) both;
        }
        .t3-itinerary-sheet {
          position: relative;
          margin-left: auto;
          width: 100%;
          max-width: 560px;
          height: 100vh;
          height: 100dvh;
          background: var(--t3-bg);
          color: var(--t3-text);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          animation: t3ItinSlide 0.42s var(--t3-ease-out) both;
          box-shadow: -24px 0 60px rgba(20, 17, 15, 0.22);
        }
        .t3-itinerary-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 24px 18px;
          border-bottom: 1px solid var(--t3-divider);
        }
        .t3-itinerary-brand {
          font-family: var(--t3-font-display);
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .t3-itinerary-close {
          background: transparent;
          border: 0;
          color: inherit;
          cursor: pointer;
          padding: 10px;
          min-width: 44px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s var(--t3-ease);
        }
        .t3-itinerary-close:hover,
        .t3-itinerary-close:focus-visible {
          background: var(--t3-bg-alt);
          outline: none;
        }
        .t3-itinerary-eyebrow {
          display: block;
          margin: 24px 24px 14px;
          font-family: var(--t3-font-sans);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--t3-accent);
        }
        .t3-itinerary-cards {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 0 24px 24px;
        }
        .t3-itinerary-card {
          position: relative;
          display: block;
          flex: 1 1 0;
          min-height: 124px;
          overflow: hidden;
          border-radius: 4px;
          color: #fff;
          text-decoration: none;
          background: var(--t3-dark-bg);
          opacity: 0;
          transform: translateY(18px);
          animation: t3ItinCardIn 0.6s var(--t3-ease-out) both;
          transition: transform 0.35s var(--t3-ease), box-shadow 0.35s var(--t3-ease);
        }
        .t3-itinerary-card:hover,
        .t3-itinerary-card:focus-visible {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(20, 17, 15, 0.3);
          outline: none;
        }
        .t3-itinerary-card:focus-visible::after {
          content: '';
          position: absolute;
          inset: 4px;
          border: 2px solid var(--t3-accent);
          pointer-events: none;
          border-radius: 2px;
        }
        .t3-itinerary-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s var(--t3-ease-out);
        }
        .t3-itinerary-card:hover .t3-itinerary-img {
          transform: scale(1.05);
        }
        .t3-itinerary-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            rgba(20, 17, 15, 0.78) 0%,
            rgba(20, 17, 15, 0.42) 55%,
            rgba(20, 17, 15, 0.22) 100%
          );
        }
        .t3-itinerary-card-accent .t3-itinerary-overlay {
          background: linear-gradient(
            115deg,
            rgba(166, 124, 79, 0.86) 0%,
            rgba(139, 104, 64, 0.62) 100%
          );
        }
        .t3-itinerary-content {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: end;
          gap: 18px;
          padding: 20px 24px;
        }
        .t3-itinerary-num {
          font-family: var(--t3-font-display);
          font-size: clamp(28px, 6vw, 36px);
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.03em;
          color: rgba(255, 255, 255, 0.78);
          align-self: start;
          margin-top: 4px;
        }
        .t3-itinerary-text {
          align-self: end;
          padding-right: 32px;
        }
        .t3-itinerary-label {
          font-family: var(--t3-font-display);
          font-size: clamp(26px, 7vw, 36px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0 0 6px;
        }
        .t3-itinerary-tag {
          font-family: var(--t3-font-display);
          font-style: italic;
          font-size: clamp(12px, 3.4vw, 14px);
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.82);
          margin: 0;
          max-width: 32ch;
        }
        .t3-itinerary-arrow {
          position: absolute;
          right: 20px;
          bottom: 22px;
          font-family: var(--t3-font-sans);
          font-size: 22px;
          line-height: 1;
          color: rgba(255, 255, 255, 0.88);
          transition: transform 0.3s var(--t3-ease);
        }
        .t3-itinerary-card:hover .t3-itinerary-arrow {
          transform: translateX(4px);
        }
        .t3-itinerary-dock {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--t3-divider);
          border-top: 1px solid var(--t3-divider);
        }
        .t3-itinerary-dock-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 12px;
          background: var(--t3-bg);
          font-family: var(--t3-font-sans);
          font-size: 12.5px;
          color: var(--t3-text);
          text-decoration: none;
          min-height: 52px;
          transition: background 0.2s var(--t3-ease), color 0.2s var(--t3-ease);
        }
        .t3-itinerary-dock-link:hover,
        .t3-itinerary-dock-link:focus-visible {
          background: var(--t3-text);
          color: var(--t3-bg);
          outline: none;
        }
        .t3-itinerary-dock-link svg {
          flex-shrink: 0;
        }

        @keyframes t3ItinFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes t3ItinSlide {
          from { transform: translateX(28px); opacity: 0.4; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes t3ItinCardIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Reduced motion: skip the stagger + slide, keep a quick fade */
        @media (prefers-reduced-motion: reduce) {
          .t3-itinerary-backdrop,
          .t3-itinerary-sheet,
          .t3-itinerary-card {
            animation-duration: 0.15s !important;
            animation-delay: 0s !important;
          }
          .t3-itinerary-img,
          .t3-itinerary-card,
          .t3-itinerary-arrow {
            transition-duration: 0s !important;
          }
        }
      `}</style>
    </>
  )
}
