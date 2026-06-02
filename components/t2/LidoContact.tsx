'use client'

import { useState } from 'react'

export type LidoLocation = { city: string; detail: string }

interface LidoContactProps {
  email: string
  phone?: string
  locations: LidoLocation[]
  instagramUrl?: string
}

/**
 * The Lido Collective contact surface — a light, agency-style "let's talk"
 * layout. Left rail carries the real contact channels (email, telephone,
 * studios by appointment, hours, social); right rail is the enquiry form.
 * Light scheme on white, matching the rest of the Lido page.
 */
export function LidoContact({ email, phone, locations, instagramUrl }: LidoContactProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="lido-contact">
      <div className="lido-contact-inner">
        {/* ── Left: details ───────────────────────────────────────────── */}
        <div className="lido-contact-aside" data-reveal>
          <h2 className="lido-display lido-contact-h">Get in Touch</h2>
          <p className="lido-body" style={{ fontSize: 16, maxWidth: 440, marginBottom: 48 }}>
            Tell us who&apos;s travelling and what you have in mind. We&apos;ll match you with the
            right specialist in the Collective and reply personally — always within 24 hours.
          </p>

          <dl className="lido-contact-rows">
            <div className="lido-contact-row">
              <dt className="lido-eyebrow">Email</dt>
              <dd>
                <a href={`mailto:${email}`} className="lido-contact-link">{email}</a>
              </dd>
            </div>
            {phone && (
              <div className="lido-contact-row">
                <dt className="lido-eyebrow">Telephone</dt>
                <dd>
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="lido-contact-link">{phone}</a>
                </dd>
              </div>
            )}
            <div className="lido-contact-row">
              <dt className="lido-eyebrow">Studios</dt>
              <dd>
                {locations.map((l) => (
                  <p key={l.city} className="lido-contact-loc">
                    <span className="lido-contact-city">{l.city}</span>
                    <span className="lido-contact-detail">{l.detail}</span>
                  </p>
                ))}
              </dd>
            </div>
            <div className="lido-contact-row">
              <dt className="lido-eyebrow">Hours</dt>
              <dd><span className="lido-contact-detail">Monday–Friday · By appointment</span></dd>
            </div>
            {instagramUrl && (
              <div className="lido-contact-row">
                <dt className="lido-eyebrow">Follow</dt>
                <dd>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="lido-contact-link">
                    Instagram <span aria-hidden>↗</span>
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* ── Right: form ─────────────────────────────────────────────── */}
        <div className="lido-contact-card" data-reveal style={{ ['--reveal-delay' as string]: '120ms' }}>
          {submitted ? (
            <div className="lido-contact-success">
              <p className="lido-display" style={{ fontSize: 30, marginBottom: 12 }}>Thank you.</p>
              <p className="lido-body" style={{ fontSize: 15 }}>
                Your note is with us. A specialist from the Collective will be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="lido-contact-form">
              <div className="lido-contact-grid2">
                <input type="text" placeholder="First Name *" required className="lido-contact-input" />
                <input type="text" placeholder="Last Name *" required className="lido-contact-input" />
              </div>
              <input type="email" placeholder="Email Address *" required className="lido-contact-input" />
              <input type="tel" placeholder="Phone Number" className="lido-contact-input" />
              <div className="lido-contact-grid2">
                <input type="text" placeholder="Destination(s)" className="lido-contact-input" />
                <input type="text" placeholder="Approximate Dates" className="lido-contact-input" />
              </div>
              <textarea placeholder="Tell us about the journey you have in mind…" className="lido-contact-input lido-contact-textarea" />
              <button type="submit" className="lido-btn-fill lido-contact-submit">Send Enquiry <span aria-hidden>→</span></button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .lido-contact { background: var(--lido-bg); padding: clamp(72px, 10vw, 130px) 48px; }
        .lido-contact-inner {
          max-width: var(--t2-content-max, 1280px); margin: 0 auto;
          display: grid; grid-template-columns: 0.85fr 1fr;
          gap: clamp(48px, 7vw, 110px); align-items: start;
        }
        .lido-contact-h { font-size: clamp(34px, 4.6vw, 56px); margin-bottom: 26px; }

        .lido-contact-rows { margin: 0; }
        .lido-contact-row {
          display: grid; grid-template-columns: 120px 1fr; gap: 20px;
          padding: 22px 0; border-top: 1px solid var(--lido-line); align-items: start;
        }
        .lido-contact-row:last-child { border-bottom: 1px solid var(--lido-line); }
        .lido-contact-row dt { padding-top: 4px; }
        .lido-contact-row dd { margin: 0; }
        .lido-contact-link {
          font-family: var(--lido-font-body); font-size: 16px; color: var(--lido-text);
          text-decoration: none; border-bottom: 1px solid var(--lido-line-strong);
          padding-bottom: 2px; transition: border-color 0.3s var(--t2-ease), opacity 0.3s var(--t2-ease);
          display: inline-flex; gap: 6px;
        }
        .lido-contact-link:hover { border-color: var(--lido-text); }
        .lido-contact-loc { margin: 0 0 12px; }
        .lido-contact-loc:last-child { margin-bottom: 0; }
        .lido-contact-city {
          display: block; font-family: var(--lido-font-display); font-size: 18px; color: var(--lido-text);
        }
        .lido-contact-detail {
          font-family: var(--lido-font-body); font-size: 13px; line-height: 1.6; color: var(--lido-text-muted);
        }

        /* Form card */
        .lido-contact-card {
          background: var(--lido-bg-grey);
          padding: clamp(32px, 4vw, 52px);
          border-radius: 0 0 0 40px;
        }
        .lido-contact-form { display: flex; flex-direction: column; gap: 14px; }
        .lido-contact-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 520px) { .lido-contact-grid2 { grid-template-columns: 1fr; } }

        .lido-contact-input {
          width: 100%; padding: 16px 18px;
          font-family: var(--lido-font-body); font-size: 15px; color: var(--lido-text);
          background: var(--lido-bg); border: 1px solid var(--lido-line-strong);
          border-radius: 4px; outline: none;
          transition: border-color 0.25s var(--t2-ease), box-shadow 0.25s var(--t2-ease);
        }
        .lido-contact-input::placeholder { color: var(--lido-text-muted); }
        .lido-contact-input:hover { border-color: var(--lido-text); }
        .lido-contact-input:focus {
          border-color: var(--lido-text);
          box-shadow: 0 0 0 3px rgba(20,32,47,0.08);
        }
        .lido-contact-textarea { resize: vertical; min-height: 130px; line-height: 1.6; }
        .lido-contact-submit { width: 100%; justify-content: center; margin-top: 6px; }

        .lido-contact-success {
          background: var(--lido-bg); border: 1px solid var(--lido-line);
          border-top: 2px solid var(--lido-bg-dark); padding: 48px 36px; text-align: center;
        }

        @media (max-width: 860px) {
          .lido-contact-inner { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 560px) {
          .lido-contact { padding-left: 22px; padding-right: 22px; }
          .lido-contact-row { grid-template-columns: 1fr; gap: 8px; }
          .lido-contact-row dt { padding-top: 0; }
          .lido-contact-link { font-size: 14px; overflow-wrap: anywhere; }
        }
      `}</style>
    </section>
  )
}
