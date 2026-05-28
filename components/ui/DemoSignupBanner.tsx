/**
 * DemoSignupBanner — a fixed top bar shown only on demo advisor sites
 * (gated by isDemoSlug in each template layout). It nudges prospects browsing
 * a demo back to the marketing site to sign up.
 *
 * Coordination with the templates' fixed navs: this banner publishes a global
 * CSS variable `--eah-banner-h`. Each fixed nav reads `top: var(--eah-banner-h, 0px)`
 * so it sits just below the banner. On non-demo sites the banner isn't rendered,
 * the variable is never set, and the navs fall back to `top: 0`.
 *
 * ADA: white text on #6d28d9 (violet-700) is a 7:1 contrast ratio — passes
 * WCAG AAA for normal text.
 */
export function DemoSignupBanner() {
  return (
    <>
      <style>{`:root{--eah-banner-h:40px;}`}</style>
      <a
        href="https://eliteadvisorhub.com"
        className="eah-demo-banner"
        aria-label="This is a demo site built on Elite Advisor Hub. Sign up now."
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1500,
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: '#6d28d9',
          color: '#ffffff',
          textDecoration: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: '13px',
          lineHeight: 1.2,
          padding: '0 16px',
          textAlign: 'center',
        }}
      >
        <span style={{ fontWeight: 500 }}>Built on Elite Advisor Hub</span>
        <span aria-hidden="true" style={{ opacity: 0.55 }}>—</span>
        <span style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          Sign&nbsp;up&nbsp;now&nbsp;→
        </span>
      </a>
      <style>{`
        .eah-demo-banner { transition: background 0.2s ease; }
        .eah-demo-banner:hover { background: #5b21b6 !important; }
        .eah-demo-banner:focus-visible { outline: 2px solid #ffffff; outline-offset: -4px; }
        @media (max-width: 480px) {
          .eah-demo-banner { font-size: 12px !important; gap: 6px !important; }
        }
      `}</style>
    </>
  )
}
