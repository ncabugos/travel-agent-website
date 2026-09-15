'use client'

import { useActionState } from 'react'
import { submitSupportRequest, type SupportFormState } from '@/lib/actions/support'
import { BODY_FONT, CHARCOAL, DIVIDER, GOLD, PRIMARY_CTA_STYLE, WARM_GRAY, WARM_GRAY_DARK } from './tokens'

const CATEGORIES = [
  { value: 'technical', label: 'Technical issue' },
  { value: 'billing',   label: 'Billing or subscription' },
  { value: 'account',   label: 'Account or login' },
  { value: 'feature',   label: 'Feature request' },
  { value: 'other',     label: 'Something else' },
] as const

const initialState: SupportFormState = {}

export function SupportForm() {
  const [state, formAction, pending] = useActionState(submitSupportRequest, initialState)

  if (state.success) {
    return (
      <div style={{ padding: '8px 0', fontFamily: BODY_FONT }}>
        <div aria-hidden style={{ width: '40px', height: '1px', background: GOLD, marginBottom: '24px' }} />
        <h2 style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: CHARCOAL, margin: '0 0 12px' }}>Message received.</h2>
        <p style={{ fontSize: '16px', color: WARM_GRAY_DARK, lineHeight: 1.6, maxWidth: '48ch', margin: '0 0 16px' }}>
          We have sent a copy to your inbox. Our team will get back to you within one business day.
        </p>
        <p style={{ fontSize: '14px', color: WARM_GRAY, margin: 0 }}>
          Need to send another? <a href="/support" className="eah-link" style={{ color: CHARCOAL }}>Open a new request</a>.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: BODY_FONT }}>
      {state.error && (
        <p style={{ fontSize: '14px', color: '#991b1b', margin: 0, paddingBottom: '16px', borderBottom: `1px solid ${DIVIDER}` }}>{state.error}</p>
      )}

      <Field label="Your name" htmlFor="name" required error={state.fieldErrors?.name}>
        <input id="name" name="name" type="text" required className="eah-input" style={inputStyle} />
      </Field>

      <Field label="Email" htmlFor="email" required error={state.fieldErrors?.email}>
        <input id="email" name="email" type="email" required className="eah-input" style={inputStyle} />
      </Field>

      <Field label="Agency name" htmlFor="agency" hint="Optional. Helps us find your account.">
        <input id="agency" name="agency" type="text" className="eah-input" style={inputStyle} />
      </Field>

      <Field label="What can we help with" htmlFor="category">
        <select id="category" name="category" defaultValue="technical" className="eah-input" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Subject" htmlFor="subject" required error={state.fieldErrors?.subject}>
        <input id="subject" name="subject" type="text" required maxLength={120} className="eah-input" style={inputStyle} />
      </Field>

      <Field label="Tell us more" htmlFor="message" required error={state.fieldErrors?.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          className="eah-input"
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          placeholder="Steps to reproduce, what you expected, and what happened."
        />
      </Field>

      <button type="submit" disabled={pending} className="eah-cta-primary" style={{ ...PRIMARY_CTA_STYLE, alignSelf: 'flex-start', marginTop: '8px', opacity: pending ? 0.6 : 1 }}>
        {pending ? 'Sending' : 'Send message'}
      </button>

      <style>{`.eah-input:focus { border-color: ${CHARCOAL} !important; }`}</style>
    </form>
  )
}

function Field({ label, htmlFor, required, hint, error, children }: {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: CHARCOAL, marginBottom: '8px' }}>
        {label}{required && <span style={{ color: WARM_GRAY, marginLeft: '4px' }}>*</span>}
      </label>
      {children}
      {hint && !error && <div style={{ fontSize: '13px', color: WARM_GRAY, marginTop: '6px' }}>{hint}</div>}
      {error && <div style={{ fontSize: '13px', color: '#991b1b', marginTop: '6px' }}>{error}</div>}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  fontSize: '15px',
  fontFamily: BODY_FONT,
  border: `1px solid ${DIVIDER}`,
  borderRadius: '2px',
  outline: 'none',
  background: '#fff',
  color: CHARCOAL,
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
}
