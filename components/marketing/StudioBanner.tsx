'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Slim promotional strip pinned above the marketing nav on the homepage,
 * linking to the new /studio services page.
 *
 * The bar is fixed at the very top; the nav reads `--eah-banner-h` for its top
 * offset so the two never overlap. We set that variable via an inline <style>
 * that ships in the server HTML, so the nav is already offset on first paint
 * (no layout jump). When the visitor dismisses the bar, the component renders
 * null — the <style> tag disappears and the nav falls back to `top: 0px`.
 *
 * Dismissal is remembered in localStorage so it does not nag on every visit.
 */

const BANNER_HEIGHT = 40
const STORAGE_KEY = 'eah-studio-banner-dismissed'
const GOLD = '#B49A5A'
const CHARCOAL = '#1A1715'

export function StudioBanner() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') setDismissed(true)
    } catch {
      /* localStorage unavailable — keep showing the banner */
    }
  }, [])

  if (dismissed) return null

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      {/* Offsets the fixed nav so it sits below this bar. Shipped in SSR HTML. */}
      <style>{`:root{--eah-banner-h:${BANNER_HEIGHT}px}`}</style>

      <div
        role="region"
        aria-label="Announcement"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `${BANNER_HEIGHT}px`,
          zIndex: 1001,
          // Charcoal ground so the white copy clears WCAG AA (white on the gold
          // itself is ~2.7:1 and can never pass). Gold survives as the accent.
          background: CHARCOAL,
          borderBottom: `1px solid ${GOLD}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 44px',
        }}
      >
        <Link
          href="/studio"
          className="studio-banner-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '13.5px',
            fontWeight: 500,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          <span style={{ fontWeight: 700, color: '#D8C28A' }}>New — Studio</span>
          <span className="studio-banner-text" style={{ opacity: 0.85 }}>
            done-for-you social, content &amp; design for advisors
          </span>
          <span style={{ fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
            Explore&nbsp;→
          </span>
        </Link>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '24px',
            height: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            opacity: 0.7,
            padding: 0,
            lineHeight: 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>{`
        .studio-banner-link:hover .studio-banner-text { opacity: 1; }
        @media (max-width: 600px) {
          .studio-banner-text { display: none !important; }
        }
      `}</style>
    </>
  )
}
