'use client'

import { useActionState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import {
  submitBetaWaitlist,
  type BetaWaitlistFormState,
} from '@/lib/actions/beta-waitlist'

const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const PURPLE = '#8b5cf6'

const initialState: BetaWaitlistFormState = {}

export function BetaWaitlistForm() {
  const [state, formAction, isPending] = useActionState(
    submitBetaWaitlist,
    initialState,
  )

  if (state.success) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '64px 32px',
          borderRadius: '16px',
          border: '1px solid #f3f4f6',
          background: '#fff',
          fontFamily: SANS,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: PURPLE }}>
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#111', margin: '0 0 12px' }}>
          You&apos;re on the list
        </h3>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto' }}>
          Thank you. We&apos;ll be in touch as places open in the next Founding
          Advisor cohort.
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      style={{
        background: '#fff',
        padding: '36px',
        borderRadius: '16px',
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        fontFamily: SANS,
      }}
    >
      {state.error && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '24px',
            borderRadius: '10px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
          }}
        >
          <p style={{ fontSize: '13px', color: '#b91c1c', margin: 0 }}>{state.error}</p>
        </div>
      )}

      <div className="bw-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Field label="First name" name="first_name" error={state.fieldErrors?.first_name} />
        <Field label="Last name" name="last_name" error={state.fieldErrors?.last_name} />
        <FullRow>
          <Field label="Email" name="email" type="email" error={state.fieldErrors?.email} />
        </FullRow>
        <FullRow>
          <Field
            label="Business / brand name"
            name="business_name"
            placeholder="The name your clients know you by"
            error={state.fieldErrors?.business_name}
          />
        </FullRow>
        <FullRow>
          <Field label="Current website URL" name="website_url" type="url" placeholder="https://" optional />
        </FullRow>
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: '100%',
          marginTop: '28px',
          padding: '14px 24px',
          backgroundColor: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: 600,
          fontFamily: SANS,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {isPending ? 'Joining…' : 'Join the waitlist'}
      </button>

      <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.6, margin: '16px 0 0', textAlign: 'center' }}>
        By joining you&apos;ll only hear from us about the Founding Advisor beta.
      </p>

      <style>{`
        @media (max-width: 560px) {
          .bw-grid { grid-template-columns: 1fr !important; }
        }
        .bw-input:focus {
          border-color: ${PURPLE} !important;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15) !important;
        }
      `}</style>
    </form>
  )
}

/* ─────────────────────── sub-components ─────────────────────── */

function FullRow({ children }: { children: React.ReactNode }) {
  return <div style={{ gridColumn: '1 / -1' }}>{children}</div>
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  optional,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  error?: string
  optional?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={name}
        style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}
      >
        {label}
        {optional && <span style={{ color: '#9ca3af', fontWeight: 400 }}> (optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="bw-input"
        style={{
          display: 'block',
          width: '100%',
          fontSize: '14px',
          fontFamily: SANS,
          color: '#111',
          background: '#fff',
          border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
          borderRadius: '10px',
          padding: '11px 14px',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      />
      {error && <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0' }}>{error}</p>}
    </div>
  )
}
