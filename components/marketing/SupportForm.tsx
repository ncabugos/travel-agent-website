'use client'

import { useActionState } from 'react'
import { submitSupportRequest, type SupportFormState } from '@/lib/actions/support'

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
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 12,
        padding: '32px 28px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111', margin: '0 0 8px' }}>
          Message received
        </h2>
        <p style={{ fontSize: 14, color: '#374151', margin: '0 0 4px' }}>
          We've sent a copy to your inbox. Our team will get back to you within one business day.
        </p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '12px 0 0' }}>
          Need to send another? <a href="/support" style={{ color: '#b45309', textDecoration: 'underline' }}>Open a new request</a>.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {state.error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '12px 14px',
          borderRadius: 8,
          fontSize: 13,
        }}>
          {state.error}
        </div>
      )}

      <Field label="Your name" htmlFor="name" required error={state.fieldErrors?.name}>
        <input id="name" name="name" type="text" required style={inputStyle} placeholder="Jane Advisor" />
      </Field>

      <Field label="Email address" htmlFor="email" required error={state.fieldErrors?.email}>
        <input id="email" name="email" type="email" required style={inputStyle} placeholder="you@example.com" />
      </Field>

      <Field label="Agency name" htmlFor="agency" hint="Optional — helps us pull up your account.">
        <input id="agency" name="agency" type="text" style={inputStyle} placeholder="e.g. Eden For Your World" />
      </Field>

      <Field label="What can we help with?" htmlFor="category">
        <select id="category" name="category" defaultValue="technical" style={{ ...inputStyle, cursor: 'pointer' }}>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Subject" htmlFor="subject" required error={state.fieldErrors?.subject}>
        <input id="subject" name="subject" type="text" required maxLength={120} style={inputStyle} placeholder="One-line summary" />
      </Field>

      <Field label="Tell us more" htmlFor="message" required error={state.fieldErrors?.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
          placeholder="Steps to reproduce, screenshots if helpful, what you expected, what happened…"
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: 8,
          padding: '14px 24px',
          background: pending ? '#6b7280' : '#111',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '0.02em',
          cursor: pending ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {pending ? 'Sending…' : 'Send message'}
      </button>

      <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0', textAlign: 'center' }}>
        Or email us directly at <a href="mailto:support@eliteadvisorhub.com" style={{ color: '#b45309' }}>support@eliteadvisorhub.com</a>
      </p>
    </form>
  )
}

function Field({
  label, htmlFor, required, hint, error, children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 500,
        color: '#374151',
        marginBottom: 6,
      }}>
        {label}{required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{hint}</div>
      )}
      {error && (
        <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{error}</div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  fontSize: 14,
  border: '1px solid #d1d5db',
  borderRadius: 8,
  outline: 'none',
  background: '#fff',
  color: '#111',
  boxSizing: 'border-box',
}
