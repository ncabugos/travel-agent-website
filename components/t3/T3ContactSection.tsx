'use client'
import { useActionState, useState } from 'react'
import { submitContactForm, type ContactFormState } from '@/lib/actions/contact'

interface T3ContactSectionProps {
  /** Required for the server action — without it the email can't be routed
   * to the right advisor inbox. Falls back to platform admin if omitted. */
  agentId?: string
  eyebrow?: string
  headline: string
  body?: string
  phone?: string
  email?: string
  address?: string
  /** Pre-fills a hotel context chip + tags the advisor email. Set via
   * `?hotel=<name>` on the URL when a visitor arrives from a hotel detail
   * page's Enquire button. */
  hotel?: string
}

const initialState: ContactFormState = {}

export function T3ContactSection({
  agentId,
  eyebrow = 'Begin the Conversation',
  headline,
  body,
  phone,
  email,
  address,
  hotel,
}: T3ContactSectionProps) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  // Sub-2-second submission protection (matches Eden + T4 forms).
  const [renderedAt] = useState<number>(() => Date.now())

  return (
    <section id="contact" className="t3-section t3-section-alt" style={{ maxWidth: '100%' }}>
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: '0 48px',
        }}
        className="t3-contact-wrap"
      >
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span className="t3-eyebrow t3-eyebrow-plain">{eyebrow}</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            {headline}
          </h2>
          {body && (
            <p
              className="t3-body t3-body-lg"
              style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto' }}
            >
              {body}
            </p>
          )}
        </div>

        {state.success ? (
          <div
            style={{
              padding: '48px 32px',
              border: '1px solid var(--t3-divider)',
              textAlign: 'center',
              background: 'var(--t3-bg)',
            }}
          >
            <h3 className="t3-headline-lg" style={{ marginBottom: 16 }}>
              Thank you
            </h3>
            <p className="t3-body" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              Your inquiry has been received. We&apos;ll respond personally within one business day.
            </p>
          </div>
        ) : (
          <form
            action={formAction}
            style={{ background: 'var(--t3-bg)', padding: '64px 64px' }}
            className="t3-contact-form"
          >
            <input type="hidden" name="agent_id" value={agentId ?? ''} />
            <input type="hidden" name="_rendered_at" value={String(renderedAt)} />
            {hotel && <input type="hidden" name="hotel_name" value={hotel} />}

            {/* Honeypot — invisible to humans, blindly filled by spam bots. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
              <input type="text" name="website_url" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            {/* Visible chip showing which hotel triggered this enquiry. */}
            {hotel && (
              <div
                role="status"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 22px',
                  marginBottom: 36,
                  background: 'var(--t3-bg-alt)',
                  borderLeft: '3px solid var(--t3-accent)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--t3-font-sans)',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'var(--t3-accent)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Enquiring about
                </span>
                <span
                  style={{
                    fontFamily: 'var(--t3-font-display)',
                    fontSize: 18,
                    color: 'var(--t3-text)',
                    flex: 1,
                  }}
                >
                  {hotel}
                </span>
              </div>
            )}

            {state.error && (
              <div style={{ padding: '14px 20px', marginBottom: 24, background: '#FEF3CD', border: '1px solid #F5C842' }}>
                <p style={{ fontFamily: 'var(--t3-font-sans)', fontSize: 13, color: '#7A5C00' }}>{state.error}</p>
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px 48px',
                marginBottom: 40,
              }}
              className="t3-form-grid"
            >
              <Field label="First Name" name="first_name" required error={state.fieldErrors?.first_name} />
              <Field label="Last Name" name="last_name" required error={state.fieldErrors?.last_name} />
              <Field label="Email Address" name="email" type="email" required error={state.fieldErrors?.email} />
              <Field label="Phone Number" name="phone" type="tel" />
              <Field label="Destination of Interest" name="destination" full />
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="t3-label-field">Tell us about your journey</label>
                <textarea
                  name="message"
                  className="t3-input t3-textarea"
                  placeholder={hotel
                    ? `Anything else we should know about your stay at ${hotel}? Dates, occasion, preferences…`
                    : 'Preferred dates, number of travelers, style of travel, any must-haves...'}
                  rows={4}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 32,
                borderTop: '1px solid var(--t3-divider)',
                flexWrap: 'wrap',
                gap: 20,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: 'var(--t3-text-muted)',
                  maxWidth: 420,
                  lineHeight: 1.6,
                }}
              >
                By submitting this inquiry you consent to being contacted about travel planning. We never share your information.
              </p>
              <button type="submit" className="t3-btn t3-btn-solid" disabled={isPending}>
                {isPending ? 'Sending…' : 'Send Inquiry'}
              </button>
            </div>
          </form>
        )}

        {/* Contact details strip */}
        {(phone || email || address) && (
          <div
            style={{
              marginTop: 72,
              paddingTop: 48,
              borderTop: '1px solid var(--t3-divider)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              textAlign: 'center',
            }}
            className="t3-contact-meta"
          >
            {phone && <ContactItem label="By Phone" value={phone} />}
            {email && <ContactItem label="By Email" value={email} />}
            {address && <ContactItem label="Office" value={address} />}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 800px) {
          .t3-contact-wrap { padding: 0 24px !important; }
          .t3-contact-form { padding: 40px 32px !important; }
          .t3-form-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .t3-contact-meta { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  full,
  error,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  full?: boolean
  error?: string
}) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
      <label className="t3-label-field" htmlFor={`t3-${name}`}>
        {label}
        {required && <span style={{ color: 'var(--t3-accent)', marginLeft: 4 }}>*</span>}
      </label>
      <input
        id={`t3-${name}`}
        name={name}
        type={type}
        required={required}
        className="t3-input"
        style={error ? { borderBottomColor: '#C0392B' } : undefined}
        placeholder=""
      />
      {error && (
        <p style={{ fontSize: 11, color: '#C0392B', marginTop: 6 }}>{error}</p>
      )}
    </div>
  )
}

function ContactItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--t3-accent)',
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--t3-font-display)',
          fontSize: 18,
          fontWeight: 400,
          color: 'var(--t3-text)',
          lineHeight: 1.4,
        }}
      >
        {value}
      </div>
    </div>
  )
}
