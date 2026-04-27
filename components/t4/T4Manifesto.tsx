import Image from 'next/image'
import Link from 'next/link'

interface T4ManifestoProps {
  agentId: string
  eyebrow?: string
  headline: string
  body: string
  signature?: string     // e.g. "— Eleanor Price, Founder"
  ctaLabel?: string
  ctaHref?: string
  image: string
  imageCaption?: string
}

/**
 * T4 manifesto / philosophy section — a large editorial spread with a
 * big italic pull-headline on the left, body copy on the right, and a
 * full-height image. This is the "quiet luxury statement" of the page.
 */
export function T4Manifesto({
  agentId,
  eyebrow = 'Our Philosophy',
  headline,
  body,
  signature,
  ctaLabel,
  ctaHref,
  image,
  imageCaption,
}: T4ManifestoProps) {
  const base = `/t4/${agentId}`
  const resolve = (href: string) =>
    href.startsWith('http') || href.startsWith('#') ? href : `${base}${href}`

  return (
    <section style={{ background: 'var(--t4-bg)', padding: 'var(--t4-section-pad) 0' }}>
      <div
        style={{
          maxWidth: 'var(--t4-content-wide)',
          margin: '0 auto',
          padding: '0 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
        className="t4-manifesto-grid"
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            background: 'var(--t4-bg-alt)',
          }}
        >
          <Image
            src={image}
            alt={imageCaption ?? 'Manifesto image'}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            unoptimized
          />
          {imageCaption && (
            <div
              style={{
                position: 'absolute',
                left: 20,
                bottom: 20,
                background: 'rgba(251, 248, 241, 0.88)',
                padding: '8px 14px',
                fontFamily: 'var(--t4-font-body)',
                fontSize: 10,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--t4-text)',
                fontWeight: 500,
                backdropFilter: 'blur(6px)',
              }}
            >
              {imageCaption}
            </div>
          )}
        </div>

        {/* Copy */}
        <div>
          <span className="t4-eyebrow" style={{ marginBottom: 28 }}>{eyebrow}</span>
          <h2
            className="t4-headline-xl"
            style={{ marginTop: 28, marginBottom: 32, whiteSpace: 'pre-line' }}
          >
            {headline}
          </h2>
          <p
            className="t4-body t4-body-lg"
            style={{ marginBottom: signature || (ctaLabel && ctaHref) ? 32 : 0 }}
          >
            {body}
          </p>
          {signature && (
            <p
              style={{
                fontFamily: 'var(--t4-font-display)',
                fontStyle: 'italic',
                fontSize: 18,
                color: 'var(--t4-accent)',
                margin: (ctaLabel && ctaHref) ? '0 0 32px' : '0',
              }}
            >
              {signature}
            </p>
          )}
          {ctaLabel && ctaHref && (
            <Link href={resolve(ctaHref)} className="t4-link">
              {ctaLabel}
              <span className="t4-arrow">→</span>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t4-manifesto-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  )
}
