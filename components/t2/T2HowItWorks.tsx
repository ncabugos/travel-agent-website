import Link from 'next/link'

interface Props {
  steps: { title: string; body: string }[]
  heading?: string
  label?: string
  ctaHref: string
  ctaLabel?: string
}

/**
 * Three numbered steps between the proof and the closing CTA.
 *
 * This exists to remove the "what happens after I click" hesitation, which is
 * the most common reason a qualified visitor on a high-value page doesn't
 * enquire. Step one is deliberately the smallest possible commitment — no
 * price, no dates, no obligation — because the first step's perceived cost is
 * what the visitor is actually deciding on.
 */
export function T2HowItWorks({
  steps,
  heading = 'How it works',
  label = 'The Process',
  ctaHref,
  ctaLabel = 'Start planning',
}: Props) {
  return (
    <section className="t2-how">
      <div className="t2-how-inner">
        <div className="t2-how-head">
          {label && <p className="t2-label" style={{ marginBottom: 14 }}>{label}</p>}
          <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>{heading}</h2>
        </div>

        <ol className="t2-how-steps">
          {steps.map((s, i) => (
            <li key={s.title} className="t2-how-step">
              <span className="t2-how-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t2-how-title">{s.title}</h3>
              <p className="t2-how-body">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="t2-how-cta">
          <Link href={ctaHref} className="t2-btn t2-btn-accent">{ctaLabel}</Link>
        </div>
      </div>

      <style>{`
        .t2-how { background: var(--t2-bg-alt); padding: clamp(76px, 9vw, 120px) 24px; }
        .t2-how-inner { max-width: 1040px; margin: 0 auto; }
        .t2-how-head { text-align: center; margin-bottom: clamp(44px, 5vw, 68px); }
        .t2-how-steps {
          list-style: none; margin: 0; padding: 0;
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: clamp(28px, 4vw, 56px);
        }
        @media (max-width: 780px) { .t2-how-steps { grid-template-columns: 1fr; } }
        .t2-how-step { border-top: 1px solid var(--t2-divider); padding-top: 22px; }
        .t2-how-num {
          display: block; font-family: var(--t2-font-sans); font-size: 10px;
          font-weight: 500; letter-spacing: 0.22em; color: var(--t2-accent);
          margin-bottom: 16px;
        }
        .t2-how-title {
          font-family: var(--t2-font-serif); font-weight: 400; font-size: 21px;
          line-height: 1.3; color: var(--t2-text); margin: 0 0 10px;
        }
        .t2-how-body {
          font-family: var(--t2-font-sans); font-size: 14px; font-weight: 300;
          line-height: 1.8; color: var(--t2-text-muted); margin: 0; max-width: 44ch;
        }
        .t2-how-cta { text-align: center; margin-top: clamp(44px, 5vw, 64px); }
      `}</style>
    </section>
  )
}
