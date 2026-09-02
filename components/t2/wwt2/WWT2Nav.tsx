'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface NavLink {
  label: string
  href: string
}

interface WWT2NavProps {
  /** Base path for this tenant, e.g. /t2/<agentId> */
  base: string
  agencyName: string
}

/**
 * Four Seasons-style minimal header: solid paper from load on every page — no
 * imagery ever sits behind the chrome. A single "Enquire" link sits opposite
 * the wordmark; everything else lives behind a full-screen overlay menu.
 */
export function WWT2Nav({ base, agencyName }: WWT2NavProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links: NavLink[] = [
    { label: 'The Collection', href: `${base}/book-hotel` },
    { label: 'Yachts', href: `${base}/yachts` },
    { label: 'Wine River Cruises', href: `${base}/find-cruise` },
    { label: 'Private Jets', href: `${base}/private-jets` },
    { label: 'Safaris', href: `${base}/safaris` },
    { label: 'Wellness', href: `${base}/experiences` },
    { label: 'Villas', href: `${base}/book-villa` },
    { label: 'Journal', href: `${base}/journal` },
    { label: 'Enquire', href: `${base}/contact` },
  ]

  return (
    <>
      {/* Solid paper bar; transparent while the dark overlay menu is open. */}
      <header className="wwt2-nav" data-scrolled={open ? 'false' : 'true'} data-ondark={open ? 'true' : 'false'}>
        <div className="wwt2-nav-inner">
          <button
            className="wwt2-nav-trigger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            data-open={open ? 'true' : 'false'}
            onClick={() => setOpen((v) => !v)}
          >
            {/* One line at rest; the second bar rotates 90° to form a plus. */}
            <span className="wwt2-nav-trigger-glyph" aria-hidden="true">
              <span className="wwt2-nav-trigger-bar" />
              <span className="wwt2-nav-trigger-bar" />
            </span>
            <span className="wwt2-nav-trigger-label">{open ? 'Close' : 'Menu'}</span>
          </button>

          <Link href={base} className="wwt2-nav-brand" onClick={() => setOpen(false)}>
            {agencyName}
          </Link>

          <Link href={`${base}/contact`} className="wwt2-nav-enquire">
            Enquire
          </Link>
        </div>
      </header>

      <div className={`wwt2-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="wwt2-overlay-nav">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="wwt2-overlay-link"
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
            >
              <span className="wwt2-overlay-index">{String(i + 1).padStart(2, '0')}</span>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <style>{`
        .wwt2-nav {
          position: fixed; top: var(--eah-banner-h, 0px); left: 0; right: 0; z-index: 1700;
          transition: background 450ms var(--wwt-ease), box-shadow 450ms var(--wwt-ease);
          background: transparent;
        }
        .wwt2-nav[data-scrolled='true'] {
          background: var(--wwt-paper);
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
        }
        .wwt2-nav-inner {
          max-width: var(--wwt-max);
          margin: 0 auto;
          padding: 1.4rem var(--wwt-gutter);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1rem;
        }
        .wwt2-nav-brand {
          grid-column: 2;
          justify-self: center;
          font-family: var(--wwt-serif);
          font-weight: 400;
          font-size: clamp(1.05rem, 1.6vw, 1.35rem);
          letter-spacing: 0.02em;
          text-transform: none;
          text-decoration: none;
          color: var(--wwt-ink);
          white-space: nowrap;
          transition: color 450ms var(--wwt-ease);
        }
        .wwt2-nav-trigger {
          grid-column: 1; justify-self: start;
          display: inline-flex; align-items: center; gap: 0.7rem;
          background: none; border: 0; cursor: pointer; padding: 0;
          color: var(--wwt-ink);
        }
        .wwt2-nav-trigger-glyph {
          position: relative;
          display: block; width: 22px; height: 22px; flex-shrink: 0;
        }
        .wwt2-nav-trigger-bar {
          position: absolute; left: 0; right: 0; top: 50%;
          height: 1px; background: currentColor;
          transition: transform 500ms var(--wwt-ease);
        }
        .wwt2-nav-trigger:hover .wwt2-nav-trigger-bar:first-child { transform: scaleX(0.7); }
        .wwt2-nav-trigger[data-open='true'] .wwt2-nav-trigger-bar:first-child,
        .wwt2-nav-trigger[data-open='true']:hover .wwt2-nav-trigger-bar:first-child { transform: none; }
        .wwt2-nav-trigger[data-open='true'] .wwt2-nav-trigger-bar:last-child {
          transform: rotate(90deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .wwt2-nav-trigger-bar { transition: none; }
        }
        .wwt2-nav-trigger-label,
        .wwt2-nav-enquire {
          font-family: var(--wwt-sans);
          font-size: 0.75rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.22em;
          color: var(--wwt-ink); text-decoration: none;
        }
        .wwt2-nav-enquire {
          grid-column: 3; justify-self: end;
          padding-bottom: 4px; border-bottom: 1px solid var(--wwt-clay);
          transition: border-color 350ms var(--wwt-ease), color 450ms var(--wwt-ease);
        }
        .wwt2-nav-enquire:hover { border-color: var(--wwt-ink); }

        /* Over the hero: light chrome on dark imagery */
        .wwt2-nav[data-ondark='true'] .wwt2-nav-brand,
        .wwt2-nav[data-ondark='true'] .wwt2-nav-trigger,
        .wwt2-nav[data-ondark='true'] .wwt2-nav-trigger-label,
        .wwt2-nav[data-ondark='true'] .wwt2-nav-enquire { color: var(--wwt-on-night); }
        .wwt2-nav[data-ondark='true'] .wwt2-nav-enquire { border-color: rgba(255,255,255,0.45); }

        /* Full-screen overlay menu */
        .wwt2-overlay {
          position: fixed; inset: 0; z-index: 1550;
          background: var(--wwt-night);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; visibility: hidden;
          transition: opacity 600ms var(--wwt-ease), visibility 600ms var(--wwt-ease);
        }
        .wwt2-overlay.is-open { opacity: 1; visibility: visible; }
        .wwt2-overlay-nav { display: flex; flex-direction: column; gap: clamp(0.4rem, 1.5vw, 1rem); padding: 2rem; }
        .wwt2-overlay-link {
          font-family: var(--wwt-serif); font-weight: 300;
          font-size: clamp(2rem, 6vw, 3.75rem); line-height: 1.12;
          color: var(--wwt-on-night); text-decoration: none;
          display: flex; align-items: baseline; gap: 1.1rem;
          opacity: 0; transform: translateY(14px);
          transition: opacity 600ms var(--wwt-ease), transform 600ms var(--wwt-ease), color 300ms var(--wwt-ease);
        }
        .wwt2-overlay.is-open .wwt2-overlay-link { opacity: 1; transform: none; }
        .wwt2-overlay-link:hover { color: var(--wwt-clay); }
        .wwt2-overlay-index {
          font-family: var(--wwt-sans); font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.2em; color: var(--wwt-stone);
        }
        @media (prefers-reduced-motion: reduce) {
          .wwt2-overlay-link { transition: none; opacity: 1; transform: none; }
        }

        /* Mobile: hamburger only + smaller centered brand; Enquire lives in the
           overlay menu, so drop it from the bar to avoid crowding. */
        @media (max-width: 600px) {
          .wwt2-nav-inner { padding: 1rem var(--wwt-gutter); }
          .wwt2-nav-enquire { display: none; }
          .wwt2-nav-brand { font-size: 1rem; letter-spacing: 0.01em; }
        }
      `}</style>
    </>
  )
}
