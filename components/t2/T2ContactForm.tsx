'use client'

import { useActionState, useState } from 'react'
import { submitContactForm, type ContactFormState } from '@/lib/actions/contact'

interface T2ContactFormProps {
  agentId: string
  /** Pre-fills a hotel context chip + tags the advisor email. */
  hotel?: string
}

const initialState: ContactFormState = {}

/**
 * T2-styled contact form, wired to the shared submitContactForm server
 * action. Mirrors the editorial look of T2 (t2-input / t2-btn classes)
 * while routing submissions to the same Resend pipeline that powers
 * Eden + T4 + T3.
 *
 * Receives `hotel` when a visitor arrived from a hotel detail page via
 * `?hotel=<name>` — surfaces it as a visible chip and as a hidden
 * `hotel_name` form field that becomes the advisor email's subject tag.
 */
export function T2ContactForm({ agentId, hotel }: T2ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [renderedAt] = useState<number>(() => Date.now())

  if (state.success) {
    return (
      <div style={{ padding: '40px 32px', border: '1px solid var(--t2-border)', textAlign: 'center' }}>
        <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>Received</p>
        <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 12 }}>Thank you</h3>
        <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, color: 'var(--t2-text-muted)' }}>
          We&apos;ll respond personally within one business day.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="agent_id" value={agentId} />
      <input type="hidden" name="_rendered_at" value={String(renderedAt)} />
      {hotel && <input type="hidden" name="hotel_name" value={hotel} />}

      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {/* Visible hotel chip */}
      {hotel && (
        <div
          role="status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 18px',
            marginBottom: 24,
            background: 'var(--t2-bg-alt, #f8f5ef)',
            borderLeft: '3px solid var(--t2-accent)',
          }}
        >
          <span style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--t2-accent)',
            whiteSpace: 'nowrap',
          }}>
            Enquiring about
          </span>
          <span style={{
            fontFamily: 'var(--t2-font-serif)',
            fontSize: 15,
            color: 'var(--t2-text)',
            flex: 1,
          }}>
            {hotel}
          </span>
        </div>
      )}

      {state.error && (
        <div style={{ padding: '12px 18px', marginBottom: 20, background: '#FEF3CD', border: '1px solid #F5C842' }}>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 12, color: '#7A5C00' }}>{state.error}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <T2Input name="first_name" placeholder="First Name *" required error={state.fieldErrors?.first_name} />
        <T2Input name="last_name" placeholder="Last Name *" required error={state.fieldErrors?.last_name} />
      </div>
      <T2Input name="email" type="email" placeholder="Email Address *" required style={{ marginBottom: 16 }} error={state.fieldErrors?.email} />
      <T2Input name="phone" type="tel" placeholder="Phone Number" style={{ marginBottom: 16 }} />
      <T2Input name="destination" placeholder="Destination of Interest" style={{ marginBottom: 16 }} />
      <textarea
        name="message"
        placeholder={hotel
          ? `Anything else we should know about your stay at ${hotel}?`
          : 'Tell us about your travel goals…'}
        className="t2-input t2-textarea"
        style={{ marginBottom: 24 }}
        rows={4}
      />
      <button
        type="submit"
        disabled={isPending}
        className="t2-btn t2-btn-primary"
        style={{ width: '100%', textAlign: 'center', justifyContent: 'center', opacity: isPending ? 0.65 : 1 }}
      >
        {isPending ? 'Sending…' : 'Submit Request'}
      </button>
    </form>
  )
}

function T2Input({
  name,
  type = 'text',
  placeholder,
  required,
  style,
  error,
}: {
  name: string
  type?: string
  placeholder: string
  required?: boolean
  style?: React.CSSProperties
  error?: string
}) {
  return (
    <div style={style}>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="t2-input"
        style={error ? { borderColor: '#C0392B' } : undefined}
      />
      {error && (
        <p style={{ fontSize: 11, color: '#C0392B', marginTop: 4, fontFamily: 'var(--t2-font-sans)' }}>{error}</p>
      )}
    </div>
  )
}
