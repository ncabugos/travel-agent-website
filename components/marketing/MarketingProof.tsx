import Image from 'next/image'
import Link from 'next/link'
import { CHARCOAL, CREAM, DIVIDER, GOLD, INK, WARM_GRAY_DARK } from './tokens'

/**
 * Homepage §3 — Proof.
 *
 * Specific beats generic: one named client in production, the founder proof
 * point, and four verifiable numbers. No aggregate "trusted by N advisors"
 * line — the research is clear that unspecific social proof reads as none,
 * and we don't yet have the count to back one.
 *
 * TODO(proof): when John Oberacker's testimonial is captured, add it as a
 * named, photographed quote directly under the Eden card (named photo
 * testimonials convert ~3x anonymous ones). Do not fabricate one.
 */
const NUMBERS = [
  { value: '1,795+', label: 'luxury hotel programs, maintained for you' },
  { value: '30+', label: 'cruise lines with live partner pages' },
  { value: 'Days', label: 'from card on file to a live, branded site' },
  { value: '24 hrs', label: 'turnaround on portal edit requests' },
]

export function MarketingProof() {
  return (
    <section
      id="proof"
      className="eah-section"
      style={{ padding: '100px 24px', backgroundColor: CREAM, color: INK }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="eah-proof-grid" style={{ display: 'grid', gridTemplateColumns: '6fr 5fr', gap: '56px', alignItems: 'center' }}>
          {/* Real client, in production */}
          <Link
            href="https://www.edenforyourworld.com"
            target="_blank"
            rel="noopener"
            className="eah-proof-shot eah-focus-ring-dark"
            style={{
              display: 'block',
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              border: `1px solid ${DIVIDER}`,
              boxShadow: '0 24px 60px rgba(26,23,21,0.12)',
              background: '#fff',
              aspectRatio: '16 / 10',
            }}
            aria-label="Eden For Your World — live advisor site built on Elite Advisor Hub (opens in a new tab)"
          >
            <Image
              src="/demos/eden.png"
              alt="Eden For Your World homepage, built and maintained on Elite Advisor Hub"
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
            <div style={{
              position: 'absolute', left: '16px', bottom: '16px',
              padding: '8px 12px', borderRadius: '8px',
              background: 'rgba(26,23,21,0.86)', color: '#fff',
              fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em',
              backdropFilter: 'blur(6px)',
            }}>
              In production · edenforyourworld.com
            </div>
          </Link>

          <div>
            <div style={{
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: GOLD, marginBottom: '18px',
            }}>
              In production
            </div>
            <h2 style={{
              fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 700,
              letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 20px',
            }}>
              Trusted by edenforyourworld.com.
            </h2>
            <p style={{ fontSize: '17px', lineHeight: 1.65, color: WARM_GRAY_DARK, margin: '0 0 28px', maxWidth: '48ch' }}>
              A boutique luxury practice, custom-branded and live on its own domain since April
              2026 — hotel programs, curated journal, and lead inbox included, none of it
              maintained by the advisor.
            </p>

            <div style={{
              margin: '0 0 28px', padding: '20px 24px',
              borderLeft: `3px solid ${GOLD}`, background: '#fff',
              borderRadius: '0 10px 10px 0',
            }}>
              <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GOLD }}>
                Why Elite Advisor Hub exists
              </p>
              <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: CHARCOAL }}>
                Built by an active Virtuoso advisor tired of explaining to web developers why a
                $25,000 booking does not look like a $250 booking on the same template.
              </p>
            </div>

            <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px', margin: 0 }}>
              {NUMBERS.map((n) => (
                <div key={n.value} style={{ borderTop: `1px solid ${DIVIDER}`, paddingTop: '14px', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-end' }}>
                  {/* dt/dd in spec order (label → value); column-reverse shows the number on top. */}
                  <dt style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: 1.45, color: WARM_GRAY_DARK }}>
                    {n.label}
                  </dt>
                  <dd style={{ margin: 0, fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: CHARCOAL, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {n.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <style>{`
        .eah-proof-shot { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .eah-proof-shot:hover { transform: translateY(-3px); box-shadow: 0 30px 70px rgba(26,23,21,0.16); }
        @media (prefers-reduced-motion: reduce) { .eah-proof-shot { transition: none; } .eah-proof-shot:hover { transform: none; } }
        @media (max-width: 900px) {
          .eah-proof-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
