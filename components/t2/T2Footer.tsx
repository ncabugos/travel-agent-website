import Link from 'next/link'
import Image from 'next/image'

interface T2FooterProps {
  agentId: string
  agencyName: string
  phone?: string
  email?: string
  address?: string
  cstNumber?: string
  bio?: string
  logoUrl?: string
}

export function T2Footer({
  agentId,
  agencyName,
  phone = '+1 (800) 000-0000',
  email = 'hello@luxurytravelco.com',
  address,
  cstNumber,
  bio,
  logoUrl,
}: T2FooterProps) {
  const year = new Date().getFullYear()
  const base = `/t2/${agentId}`

  return (
    <footer
      style={{
        background: 'var(--t2-dark-bg, #0E0E0E)',
        color: 'var(--t2-dark-text, #F5F0E8)',
        borderTop: '1px solid var(--t2-accent, #9A8560)',
      }}
    >
      {/* Main grid */}
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '80px 48px 64px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '0 64px',
          alignItems: 'start',
        }}
        className="t2-footer-grid"
      >
        {/* Col 1 — Brand wordmark & bio */}
        <div>
          <Link
            href={base}
            style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={agencyName}
                width={200}
                height={60}
                style={{ objectFit: 'contain', maxHeight: 56, opacity: 0.9 }}
                unoptimized
              />
            ) : (
              <span style={{
                fontFamily: 'var(--t2-font-serif)',
                fontSize: 26, fontWeight: 300, letterSpacing: '0.04em',
                color: 'var(--t2-dark-text)',
              }}>
                {agencyName}
              </span>
            )}
          </Link>
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 13,
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'rgba(245,240,232,0.55)',
              maxWidth: 300,
              marginBottom: 32,
            }}
          >
            {bio ?? 'Your trusted luxury travel advisor — curating extraordinary journeys with exclusive Virtuoso perks and white-glove personalized service.'}
          </p>
          <Link
            href={`${base}/contact`}
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--t2-dark-text)',
              textDecoration: 'none',
              padding: '12px 28px',
              border: '1px solid rgba(245,240,232,0.25)',
              display: 'inline-block',
              transition: 'all 0.3s ease',
            }}
            className="t2-footer-cta"
          >
            Begin Planning
          </Link>
        </div>

        {/* Col 2 — Explore */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--t2-accent)',
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            Explore
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Plan a Trip', href: '/plan-a-trip' },
              { label: 'Book a Hotel', href: '/book-hotel' },
              { label: 'Private Villas', href: '/book-villa' },
              { label: 'Cruises', href: '/find-cruise' },
              { label: 'Experiences', href: '/experiences' },
              { label: 'About', href: '/about' },
            ].map(link => (
              <Link
                key={link.label}
                href={`${base}${link.href}`}
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'rgba(245,240,232,0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  letterSpacing: '0.02em',
                }}
                className="t2-footer-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3 — Network */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--t2-accent)',
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            Network
          </h4>
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 13,
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'rgba(245,240,232,0.55)',
            }}
          >
            Proud member of Virtuoso — the world&apos;s leading luxury travel consortium. Our
            memberships unlock privileges unavailable elsewhere.
          </p>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--t2-accent)',
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            Contact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {address && (
              <p style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(245,240,232,0.55)',
                lineHeight: 1.7,
                margin: 0,
              }}>
                {address}
              </p>
            )}
            <a
              href={`tel:${phone.replace(/\s|\(|\)|-/g, '')}`}
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(245,240,232,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              className="t2-footer-link"
            >
              {phone}
            </a>
            <a
              href={`mailto:${email}`}
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 13,
                fontWeight: 300,
                color: 'var(--t2-accent)',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
            >
              {email}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '20px 48px',
          borderTop: '1px solid rgba(245,240,232,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 11,
              fontWeight: 300,
              color: 'rgba(245,240,232,0.3)',
              margin: 0,
              letterSpacing: '0.04em',
            }}
          >
            © {year} {agencyName}. All rights reserved.
          </p>
          {cstNumber && (
            <p
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 11,
                fontWeight: 300,
                color: 'rgba(245,240,232,0.3)',
                margin: 0,
                letterSpacing: '0.04em',
              }}
            >
              CST #{cstNumber}
            </p>
          )}
        </div>

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#" aria-label="Instagram" className="t2-footer-social">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className="t2-footer-social">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a href="#" aria-label="X" className="t2-footer-social">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" aria-label="TikTok" className="t2-footer-social">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.26-1.17 4.49-3.08 5.76-1.93 1.28-4.47 1.56-6.6.76-2.16-.81-3.92-2.7-4.46-4.94-.52-2.14.07-4.44 1.55-6.07 1.48-1.62 3.65-2.31 5.81-2.09v4.06c-1.19-.06-2.45.62-3.03 1.69-.58 1.05-.5 2.51.24 3.48.74.96 1.95 1.29 3.0 1.22 1.05-.07 2.05-.66 2.65-1.52.56-.8.8-1.78.78-2.76.01-4.73.01-9.46 0-14.18H12.53z"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube" className="t2-footer-social">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0E0E0E"/>
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        .t2-footer-link:hover { color: rgba(245,240,232,0.9) !important; }
        .t2-footer-cta:hover {
          background: rgba(245,240,232,0.08) !important;
          border-color: rgba(245,240,232,0.5) !important;
        }
        .t2-footer-social {
          color: rgba(245,240,232,0.3);
          transition: color 0.2s ease;
          line-height: 0;
        }
        .t2-footer-social:hover {
          color: var(--t2-accent) !important;
        }
        @media (max-width: 900px) {
          .t2-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 48px !important;
          }
        }
        @media (max-width: 640px) {
          .t2-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
