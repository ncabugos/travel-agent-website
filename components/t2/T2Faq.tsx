import Link from 'next/link'

export interface Faq {
  q: string
  a: string
}

interface Props {
  faqs: Faq[]
  heading?: string
  label?: string
  /** Contact path for the closing "still deciding" line. */
  contactHref?: string
}

/**
 * FAQ block, written for answer engines as much as for readers.
 *
 * Each question is a real <h3> and each answer opens with the direct answer in
 * its first sentence, because that opening sentence is what Google's AI
 * Overviews and the LLM assistants tend to lift. The matching FAQPage JSON-LD
 * is emitted by the page via `faqSchema()` — kept there rather than here so a
 * page can compose it into one @graph with its Service and ItemList nodes.
 *
 * Plain <details> rather than JS state: it works before hydration, is keyboard
 * accessible for free, and the answer text is in the DOM for crawlers whether
 * or not the item is open.
 */
export function T2Faq({ faqs, heading = 'Common questions', label = 'FAQ', contactHref }: Props) {
  if (!faqs.length) return null

  return (
    <section className="t2-faq">
      <div className="t2-faq-inner">
        <div className="t2-faq-head">
          {label && <p className="t2-label" style={{ marginBottom: 14 }}>{label}</p>}
          <h2 className="t2-heading t2-heading-lg" style={{ margin: 0 }}>{heading}</h2>
        </div>

        <div className="t2-faq-list">
          {faqs.map((f) => (
            <details key={f.q} className="t2-faq-item">
              <summary className="t2-faq-q">
                <h3>{f.q}</h3>
                <span className="t2-faq-mark" aria-hidden="true" />
              </summary>
              <p className="t2-faq-a">{f.a}</p>
            </details>
          ))}
        </div>

        {contactHref && (
          <p className="t2-faq-foot">
            Still deciding?{' '}
            <Link href={contactHref} className="t2-faq-link">Send us the dates</Link>{' '}
            and we&rsquo;ll come back with options and real pricing.
          </p>
        )}
      </div>

      <style>{`
        .t2-faq { background: var(--t2-bg); padding: clamp(72px, 9vw, 112px) 24px; }
        .t2-faq-inner { max-width: 820px; margin: 0 auto; }
        .t2-faq-head { text-align: center; margin-bottom: clamp(40px, 5vw, 60px); }
        .t2-faq-list { border-top: 1px solid var(--t2-divider); }
        .t2-faq-item { border-bottom: 1px solid var(--t2-divider); }
        .t2-faq-q {
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
          padding: 22px 0; cursor: pointer; list-style: none;
        }
        .t2-faq-q::-webkit-details-marker { display: none; }
        .t2-faq-q h3 {
          font-family: var(--t2-font-serif); font-weight: 400; font-size: 19px;
          line-height: 1.4; color: var(--t2-text); margin: 0;
        }
        /* Plus that becomes a minus when open — no icon dependency. */
        .t2-faq-mark {
          position: relative; flex-shrink: 0; width: 14px; height: 14px;
        }
        .t2-faq-mark::before, .t2-faq-mark::after {
          content: ''; position: absolute; background: var(--t2-accent);
          transition: transform 260ms var(--t2-ease, ease);
        }
        .t2-faq-mark::before { top: 6px; left: 0; width: 14px; height: 1px; }
        .t2-faq-mark::after { left: 6px; top: 0; width: 1px; height: 14px; }
        .t2-faq-item[open] .t2-faq-mark::after { transform: rotate(90deg); }
        .t2-faq-a {
          font-family: var(--t2-font-sans); font-size: 14.5px; font-weight: 300;
          line-height: 1.85; color: var(--t2-text-muted);
          margin: 0 0 26px; max-width: 68ch;
        }
        .t2-faq-foot {
          margin: clamp(36px, 4vw, 52px) 0 0; text-align: center;
          font-family: var(--t2-font-sans); font-size: 14px; font-weight: 300;
          line-height: 1.8; color: var(--t2-text-muted);
        }
        .t2-faq-link { color: var(--t2-accent); text-decoration: underline; text-underline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .t2-faq-mark::before, .t2-faq-mark::after { transition: none; }
        }
      `}</style>
    </section>
  )
}
