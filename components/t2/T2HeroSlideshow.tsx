import Link from 'next/link'

interface CTA {
  label: string
  href: string
}

interface Props {
  agentId: string
  /** 5 image URLs that cross-fade as a slideshow background. */
  images: string[]
  eyebrow?: string
  h1: string
  h2: string
  cta1: CTA
  cta2: CTA
}

// Coast & Compass hero. Full-bleed slideshow that cross-fades 5 images via
// pure CSS keyframes (no JS, no nav controls). Content sits centered, both
// horizontally and as text alignment. Companion to T2HeroStatic which keeps
// the left-aligned single-image format for other personas.
export function T2HeroSlideshow({ agentId, images, eyebrow, h1, h2, cta1, cta2 }: Props) {
  const base = `/t2/${agentId}`
  const count = images.length

  // CSS animation timing
  //   Each image is visible for ~5s at peak with a 1s crossfade. Successive
  //   images use an animation-delay of `slotSec`, NOT `slotSec + crossfade`,
  //   so image N's fade-out overlaps image N+1's fade-in. That overlap is
  //   what produces a true crossfade rather than a 1s black gap.
  const slotSec = 5
  const crossfadeSec = 1
  const cycleSec = count * slotSec
  const peakStart = Math.round((crossfadeSec / cycleSec) * 100)         // fade-in done
  const peakEnd   = Math.round((slotSec / cycleSec) * 100)              // start fade-out
  const visibleEnd = Math.round(((slotSec + crossfadeSec) / cycleSec) * 100) // fully invisible

  return (
    <section className="t2-hero-slideshow">
      {/* Background slides */}
      <div className="t2-hero-slides" aria-hidden>
        {images.map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={i}
            src={src}
            alt=""
            className="t2-hero-slide"
            style={{ animationDelay: `${i * slotSec}s` }}
          />
        ))}
        <div className="t2-hero-veil" />
      </div>

      {/* Centered content */}
      <div className="t2-hero-content">
        {eyebrow && <p className="t2-hero-eyebrow">{eyebrow}</p>}
        <h1 className="t2-heading t2-heading-xl t2-hero-h1">{h1}</h1>
        <p className="t2-hero-h2">{h2}</p>
        <div className="t2-hero-ctas">
          <Link href={`${base}${cta1.href}`} className="t2-btn t2-btn-accent t2-hero-cta-primary">
            {cta1.label}
          </Link>
          <Link href={`${base}${cta2.href}`} className="t2-hero-cta-secondary">
            {cta2.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 12h14M15 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        .t2-hero-slideshow {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
        }
        .t2-hero-slides {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .t2-hero-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          animation: t2-hero-fade ${cycleSec}s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes t2-hero-fade {
          0% { opacity: 0; }
          ${peakStart}% { opacity: 1; }
          ${peakEnd}% { opacity: 1; }
          ${visibleEnd}% { opacity: 0; }
          100% { opacity: 0; }
        }
        .t2-hero-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.32) 60%, rgba(0,0,0,0.42) 100%);
          z-index: 1;
        }
        .t2-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 880px;
          padding: 0 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .t2-hero-eyebrow {
          font-family: var(--t2-font-sans);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          margin-bottom: 28px;
        }
        .t2-hero-h1 {
          color: #FFFFFF;
          margin: 0 0 28px 0;
          text-shadow: 0 2px 24px rgba(0,0,0,0.25);
        }
        .t2-hero-h2 {
          font-family: var(--t2-font-sans);
          font-size: 17px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255,255,255,0.88);
          max-width: 560px;
          margin: 0 0 44px 0;
        }
        .t2-hero-ctas {
          display: flex;
          gap: 28px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }
        .t2-hero-cta-primary {
          /* Gold primary button — inherits from t2-btn-primary. */
          padding: 18px 38px !important;
        }
        .t2-hero-cta-secondary {
          font-family: var(--t2-font-sans);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.92);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 4px;
          transition: color 0.3s ease, gap 0.3s ease;
        }
        .t2-hero-cta-secondary:hover { color: #fff; gap: 14px; }

        @media (max-width: 720px) {
          .t2-hero-h2 { font-size: 15px; }
          .t2-hero-ctas { gap: 16px; flex-direction: column; }
          .t2-hero-cta-primary { padding: 16px 30px !important; width: 100%; }
        }
      `}</style>
    </section>
  )
}
