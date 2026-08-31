'use client'

/**
 * T2BenefitsGrid
 * Renders a benefit list with contextual SVG icons matched by keyword.
 *
 * Layout: a self-contained white band. Each benefit is centred under its own
 * icon with no card, border, or fill — the composition is held together by
 * whitespace and the centred rule under the heading. Items are laid out with
 * flex-wrap rather than a fixed grid so an incomplete final row stays centred
 * instead of hanging left (programmes carry anywhere from 4 to 8 benefits).
 */

interface Benefit {
  title: string
  description: string
  icon?: string   // optional override: pass an icon key
}

interface T2BenefitsGridProps {
  benefits: Benefit[]
  heading?: string
  label?: string
}

// ── SVG Icon Library ──────────────────────────────────────────────────────────
// All icons are 28×28 px thin-stroke SVGs in the T2 aesthetic

const ICONS: Record<string, React.ReactNode> = {
  // Room / Upgrade
  upgrade: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="22" height="13" rx="1.5"/>
      <path d="M9 12V9a5 5 0 0 1 10 0v3"/>
      <path d="M14 16v5M11 19l3-3 3 3"/>
    </svg>
  ),
  // Breakfast / Dining
  breakfast: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 22h18M8 22V14a6 6 0 0 1 12 0v8"/>
      <path d="M5 14h18"/>
      <circle cx="14" cy="10" r="2.5"/>
    </svg>
  ),
  // Wi-Fi / Internet
  wifi: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11.5a14 14 0 0 1 20 0"/>
      <path d="M7.5 15.5a9 9 0 0 1 13 0"/>
      <path d="M11 19.5a4.5 4.5 0 0 1 6 0"/>
      <circle cx="14" cy="23" r="1"/>
    </svg>
  ),
  // Credit / Money
  credit: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="22" height="14" rx="2"/>
      <path d="M3 11h22"/>
      <path d="M7 16h4M17 16h4"/>
    </svg>
  ),
  // Gift / Voucher / Amenity
  gift: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="22" height="14" rx="1.5"/>
      <path d="M3 11h22v4H3z"/>
      <path d="M14 11V25"/>
      <path d="M14 11c0 0-3-6 0-6s0 6 0 6"/>
      <path d="M14 11c0 0 3-6 0-6s0 6 0 6"/>
    </svg>
  ),
  // VIP / Recognition / Welcome
  vip: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L14 17l-5.6 3.2 1.1-6.2L5 9.6l6.2-.9L14 3z"/>
    </svg>
  ),
  // Priority / Waitlist / List
  priority: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h18M5 14h18M5 20h10"/>
      <path d="M21 17l3 3-3 3"/>
    </svg>
  ),
  // Spa / Wellness
  spa: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 5c-5 4-7 9-4 14"/>
      <path d="M14 5c5 4 7 9 4 14"/>
      <path d="M14 5v14"/>
      <path d="M7 22h14"/>
    </svg>
  ),
  // Transfer / Transport
  transfer: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="10" width="24" height="12" rx="2"/>
      <path d="M6 10V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/>
      <circle cx="8" cy="22" r="2"/>
      <circle cx="20" cy="22" r="2"/>
    </svg>
  ),
  // Dining / Restaurant
  dining: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v8a4 4 0 0 0 4 4v10"/>
      <path d="M19 3v22"/>
      <path d="M15 3v8"/>
    </svg>
  ),
  // Drink / Welcome drink
  drink: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h16l-4 10H10L6 4z"/>
      <path d="M10 14v9"/>
      <path d="M18 14v9"/>
      <path d="M7 23h14"/>
    </svg>
  ),
  // Late checkout / Clock
  checkout: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="14" r="10"/>
      <path d="M14 8v6l4 2"/>
    </svg>
  ),
  // Luggage / Porterage
  luggage: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="9" width="16" height="14" rx="1.5"/>
      <path d="M10 9V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <path d="M11 23v2M17 23v2"/>
    </svg>
  ),
  // Shore excursion / Compass
  excursion: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="14" r="11"/>
      <path d="M18.5 9.5l-3.5 7-7 3.5 3.5-7 7-3.5z"/>
    </svg>
  ),
  // Onboard credit / Ship
  onboard: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l2-8h16l2 8H4z"/>
      <path d="M10 12V8l4-4 4 4v4"/>
      <path d="M4 20c0 2 20 2 20 0"/>
    </svg>
  ),
  // Default / generic benefit
  default: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="14" r="10"/>
      <path d="M14 10v4l2.5 2.5"/>
    </svg>
  ),
}

// ── Keyword → icon key mapping ────────────────────────────────────────────────
function getIconKey(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('upgrade') || t.includes('room')) return 'upgrade'
  if (t.includes('breakfast') || t.includes('meal') || t.includes('dining') || t.includes('restaurant')) return 'breakfast'
  if (t.includes('internet') || t.includes('wi-fi') || t.includes('wifi')) return 'wifi'
  if (t.includes('credit') || t.includes('voucher') || t.includes('$')) return 'credit'
  if (t.includes('gift') || t.includes('amenity') || t.includes('welcome') && !t.includes('drink')) return 'gift'
  if (t.includes('vip') || t.includes('recognition') || t.includes('personal')) return 'vip'
  if (t.includes('priority') || t.includes('waitlist') || t.includes('early access')) return 'priority'
  if (t.includes('spa') || t.includes('wellness') || t.includes('treatment')) return 'spa'
  if (t.includes('transfer') || t.includes('transport') || t.includes('car')) return 'transfer'
  if (t.includes('late') || t.includes('checkout') || t.includes('flexible')) return 'checkout'
  if (t.includes('luggage') || t.includes('port') || t.includes('bag')) return 'luggage'
  if (t.includes('excursion') || t.includes('tour') || t.includes('shore')) return 'excursion'
  if (t.includes('onboard') || t.includes('ship') || t.includes('cruise')) return 'onboard'
  if (t.includes('drink') || t.includes('cocktail') || t.includes('champagne')) return 'drink'
  if (t.includes('dine') || t.includes('dinner')) return 'dining'
  return 'default'
}

// ── Component ─────────────────────────────────────────────────────────────────

export function T2BenefitsGrid({ benefits, heading = 'Your Exclusive Benefits', label }: T2BenefitsGridProps) {
  if (!benefits.length) return null

  return (
    <section className="t2-benefits">
      <style>{`
        .t2-benefits {
          background: #FFFFFF;
          padding: clamp(88px, 11vw, 136px) 24px;
        }
        .t2-benefits-head {
          text-align: center;
          max-width: 660px;
          margin: 0 auto clamp(56px, 6vw, 84px);
        }
        .t2-benefits-rule {
          width: 44px;
          height: 1px;
          background: var(--t2-accent, #9A8560);
          margin: 26px auto 0;
        }
        .t2-benefits-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: clamp(48px, 6vw, 72px) clamp(32px, 4vw, 56px);
          max-width: 1100px;
          margin: 0 auto;
        }
        .t2-benefit {
          flex: 0 1 300px;
          max-width: 330px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .t2-benefit-icon {
          color: var(--t2-accent, #9A8560);
          margin-bottom: 24px;
          transition: transform 0.5s var(--t2-ease, ease);
        }
        /* The shared icon library ships at 28px; scale up for this airier layout. */
        .t2-benefit-icon svg { width: 32px; height: 32px; }
        .t2-benefit:hover .t2-benefit-icon {
          transform: translateY(-3px);
        }
        .t2-benefit-title {
          font-family: var(--t2-font-serif);
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 0.01em;
          color: var(--t2-text);
          margin: 0 0 10px;
          line-height: 1.35;
          /* Titles carry hyphenated terms ("Wi-Fi", "Check-In"). Keep the
             column wide enough that they never split, and never auto-hyphenate. */
          hyphens: none;
          text-wrap: balance;
        }
        .t2-benefit-desc {
          font-family: var(--t2-font-sans);
          font-size: 13.5px;
          line-height: 1.8;
          color: var(--t2-text-muted);
          margin: 0;
          max-width: 32ch;
        }
        @media (prefers-reduced-motion: reduce) {
          .t2-benefit-icon { transition: none; }
          .t2-benefit:hover .t2-benefit-icon { transform: none; }
        }
      `}</style>

      <div className="t2-benefits-head">
        {label && <p className="t2-label" style={{ marginBottom: 14 }}>{label}</p>}
        <h3 className="t2-heading t2-heading-md" style={{ margin: 0 }}>{heading}</h3>
        <div className="t2-benefits-rule" aria-hidden="true" />
      </div>

      <div className="t2-benefits-list">
        {benefits.map((benefit, i) => {
          const iconKey = benefit.icon ?? getIconKey(benefit.title)
          return (
            <div key={i} className="t2-benefit">
              <span className="t2-benefit-icon" aria-hidden="true">
                {ICONS[iconKey] ?? ICONS.default}
              </span>
              <p className="t2-benefit-title">{benefit.title}</p>
              <p className="t2-benefit-desc">{benefit.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
