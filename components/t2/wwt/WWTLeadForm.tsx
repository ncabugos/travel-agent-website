'use client'

import { useState, type FormEvent } from 'react'
import { RevealOnScroll, HeadlineReveal } from './RevealOnScroll'

interface WWTLeadFormProps {
  eyebrow?: string
  heading?: string
  body?: string
  /** Where "Or email directly" link points. */
  contactEmail?: string
  /** Optional phone for the "Or call" link. */
  contactPhone?: string
  /** POST target. Leave as default for demo mode (resolves client-side). */
  action?: string
}

/**
 * Aethos-inspired lead form for Wine & Wellness Travel.
 * Light cream section, linear underlined inputs (no boxes), serif headline
 * reveal on scroll, solid black primary CTA, and an "or contact directly"
 * rail below. Designed for strong contrast on the WWT cream palette.
 */
export function WWTLeadForm({
  eyebrow = 'Begin a Journey',
  heading = 'Tell us how you want to feel.',
  body = 'The best trips start with a sentence — not a destination. Send us a note, a mood, a place you saw in a film. We will do the rest.',
  contactEmail = 'hello@wineandwellnesstravel.com',
  contactPhone,
  action,
}: WWTLeadFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (action) {
        const form = new FormData(e.currentTarget)
        const res = await fetch(action, { method: 'POST', body: form })
        if (!res.ok) throw new Error('Submission failed')
      } else {
        // Demo mode — no backend wiring. Simulate success.
        await new Promise((r) => setTimeout(r, 450))
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      style={{
        padding: 'var(--t2-section-pad) 0',
        background: 'var(--t2-bg)',
        borderTop: '1px solid var(--t2-divider)',
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: '0 auto',
          padding: '0 clamp(24px, 6vw, 72px)',
          display: 'grid',
          gridTemplateColumns: '0.85fr 1.15fr',
          gap: 'clamp(48px, 7vw, 120px)',
          alignItems: 'start',
        }}
        className="wwt-lead-grid"
      >
        {/* ── Left rail — copy + direct contact ── */}
        <div style={{ paddingTop: 8 }}>
          <RevealOnScroll variant="fade-up" duration={900}>
            <p className="t2-label" style={{ marginBottom: 32 }}>{eyebrow}</p>
          </RevealOnScroll>
          <h2
            className="t2-heading"
            style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: 'clamp(2rem, 3.6vw, 3.4rem)',
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: 'var(--t2-text)',
              marginBottom: 32,
              maxWidth: '16ch',
            }}
          >
            <HeadlineReveal text={heading} stagger={55} />
          </h2>
          <RevealOnScroll variant="fade-up" delay={220} duration={900}>
            <p
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 16,
                lineHeight: 1.85,
                color: 'var(--t2-text-muted)',
                fontWeight: 300,
                maxWidth: '48ch',
                marginBottom: 40,
              }}
            >
              {body}
            </p>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-up" delay={360} duration={900}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                paddingTop: 28,
                borderTop: '1px solid var(--t2-divider)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 11,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--t2-text-muted)',
                  fontWeight: 500,
                }}
              >
                Or reach us directly
              </p>
              <a
                href={`mailto:${contactEmail}`}
                style={{
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 20,
                  color: 'var(--t2-text)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--t2-text)',
                  paddingBottom: 2,
                  alignSelf: 'flex-start',
                }}
                className="wwt-direct-link"
              >
                {contactEmail}
              </a>
              {contactPhone && (
                <a
                  href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}
                  style={{
                    fontFamily: 'var(--t2-font-serif)',
                    fontSize: 20,
                    color: 'var(--t2-text)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--t2-text)',
                    paddingBottom: 2,
                    alignSelf: 'flex-start',
                  }}
                  className="wwt-direct-link"
                >
                  {contactPhone}
                </a>
              )}
            </div>
          </RevealOnScroll>
        </div>

        {/* ── Right rail — form ── */}
        <div>
          {submitted ? (
            <RevealOnScroll variant="fade" duration={700}>
              <div
                style={{
                  padding: '56px 48px',
                  border: '1px solid var(--t2-divider)',
                  background: 'var(--t2-bg-alt)',
                }}
              >
                <p className="t2-label" style={{ marginBottom: 24 }}>Received</p>
                <h3
                  style={{
                    fontFamily: 'var(--t2-font-serif)',
                    fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
                    fontWeight: 300,
                    lineHeight: 1.15,
                    color: 'var(--t2-text)',
                    letterSpacing: '-0.015em',
                    marginBottom: 16,
                    maxWidth: '20ch',
                  }}
                >
                  Your note is with us.
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--t2-font-sans)',
                    fontSize: 15,
                    lineHeight: 1.85,
                    color: 'var(--t2-text-muted)',
                    fontWeight: 300,
                    maxWidth: '52ch',
                  }}
                >
                  A reply, by hand, within a working day — often sooner. Should a conversation suit you better, our line is on the left.
                </p>
              </div>
            </RevealOnScroll>
          ) : (
            <RevealOnScroll variant="fade-up" delay={120} duration={900}>
              <form onSubmit={onSubmit} noValidate>
                <div className="wwt-form-row">
                  <FieldLine label="First name" name="first_name" required />
                  <FieldLine label="Last name" name="last_name" required />
                </div>
                <div className="wwt-form-row">
                  <FieldLine label="Email" name="email" type="email" required />
                  <FieldLine label="Phone" name="phone" type="tel" />
                </div>
                <div className="wwt-form-row">
                  <FieldLine label="Region or place" name="destination" placeholder="Tuscany, Bordeaux, Kyoto, the Langhe…" />
                  <FieldLine label="A window in the year" name="travel_dates" placeholder="Harvest in September, perhaps" />
                </div>

                <FieldTextarea
                  label="Your note"
                  name="message"
                  placeholder="A sentence, a mood, a table you sat at once…"
                  rows={5}
                />

                {error && (
                  <p
                    style={{
                      color: '#b91c1c',
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 13,
                      marginTop: 16,
                      marginBottom: 0,
                    }}
                  >
                    {error}
                  </p>
                )}

                <div
                  style={{
                    marginTop: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    flexWrap: 'wrap',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: 'var(--t2-text-muted)',
                      fontWeight: 400,
                      maxWidth: '44ch',
                      margin: 0,
                    }}
                  >
                    One reply, from us, to you. No mailing lists. No onward sharing.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="wwt-submit-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '20px 44px',
                      background: 'var(--t2-text)',
                      color: 'var(--t2-bg)',
                      border: '1px solid var(--t2-text)',
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 12,
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      cursor: submitting ? 'wait' : 'pointer',
                      transition:
                        'background 260ms var(--t2-ease), color 260ms var(--t2-ease), padding 260ms var(--t2-ease)',
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? 'Sending…' : 'Send Enquiry'}
                    <svg
                      width="18"
                      height="12"
                      viewBox="0 0 18 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <line x1="0" y1="6" x2="16" y2="6" />
                      <polyline points="11 1 17 6 11 11" />
                    </svg>
                  </button>
                </div>
              </form>
            </RevealOnScroll>
          )}
        </div>
      </div>

      <style>{`
        .wwt-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 32px;
        }
        .wwt-field-line {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .wwt-field-line label {
          font-family: var(--t2-font-sans);
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--t2-text-muted);
          font-weight: 500;
        }
        .wwt-field-line input,
        .wwt-field-line textarea {
          font-family: var(--t2-font-serif);
          font-size: 18px;
          color: var(--t2-text);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--t2-divider);
          border-radius: 0;
          padding: 10px 0 14px;
          outline: none;
          transition: border-color 260ms var(--t2-ease);
          width: 100%;
          letter-spacing: -0.005em;
        }
        .wwt-field-line textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
          font-size: 17px;
        }
        .wwt-field-line input::placeholder,
        .wwt-field-line textarea::placeholder {
          color: var(--t2-text-muted);
          opacity: 0.55;
          font-style: italic;
        }
        .wwt-field-line input:focus,
        .wwt-field-line textarea:focus,
        .wwt-field-line input:not(:placeholder-shown),
        .wwt-field-line textarea:not(:placeholder-shown) {
          border-bottom-color: var(--t2-text);
        }
        .wwt-submit-btn:hover:not(:disabled) {
          background: var(--t2-bg);
          color: var(--t2-text);
          padding-left: 52px;
          padding-right: 36px;
        }
        .wwt-direct-link:hover {
          opacity: 0.55;
        }
        @media (max-width: 900px) {
          .wwt-lead-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
          .wwt-form-row {
            grid-template-columns: 1fr !important;
            gap: 28px;
            margin-bottom: 28px;
          }
        }
      `}</style>
    </section>
  )
}

// ── Field primitives ──────────────────────────────────────────────────────────

function FieldLine({
  label,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="wwt-field-line">
      <label htmlFor={name}>
        {label}
        {required && ' *'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder ?? ' '}
        autoComplete="off"
      />
    </div>
  )
}

function FieldTextarea({
  label,
  name,
  rows = 4,
  placeholder,
}: {
  label: string
  name: string
  rows?: number
  placeholder?: string
}) {
  return (
    <div className="wwt-field-line">
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  )
}
