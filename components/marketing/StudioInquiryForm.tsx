'use client'

import { useActionState, useEffect, useState } from 'react'
import {
  submitStudioInquiry,
  type StudioInquiryFormState,
} from '@/lib/actions/studio'
import { BODY_FONT, CHARCOAL, DIVIDER, GOLD, PRIMARY_CTA_STYLE, WARM_GRAY, WARM_GRAY_DARK } from './tokens'

const PLAN_OPTIONS = [
  { value: 'essential', label: 'Essential' },
  { value: 'professional', label: 'Professional' },
  { value: 'full-service', label: 'Full Service' },
  { value: 'agency', label: 'Agency' },
  { value: 'unsure', label: 'Not sure yet, help me choose' },
] as const

const PLAN_VALUES = PLAN_OPTIONS.map((p) => p.value) as readonly string[]

const initialState: StudioInquiryFormState = {}

export function StudioInquiryForm() {
  const [state, formAction, isPending] = useActionState(submitStudioInquiry, initialState)
  const [plan, setPlan] = useState<string>('unsure')

  // Plan pre-selection comes from a deep link (/studio?plan=…) read once on
  // mount, and from the in-page plan links, which fire 'studio:select-plan'.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('plan')
    const onSelect = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail
      if (slug && PLAN_VALUES.includes(slug)) setPlan(slug)
    }
    if (p && PLAN_VALUES.includes(p)) queueMicrotask(() => setPlan(p))
    window.addEventListener('studio:select-plan', onSelect)
    return () => window.removeEventListener('studio:select-plan', onSelect)
  }, [])

  if (state.success) {
    return (
      <div style={{ padding: '8px 0', fontFamily: BODY_FONT }}>
        <div aria-hidden style={{ width: '40px', height: '1px', background: GOLD, marginBottom: '24px' }} />
        <h3 style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: CHARCOAL, margin: '0 0 12px' }}>
          Thank you. We will be in touch.
        </h3>
        <p style={{ fontSize: '16px', color: WARM_GRAY_DARK, lineHeight: 1.6, maxWidth: '48ch', margin: 0 }}>
          Your inquiry is in. We reply personally, usually within one business day, to talk through what Studio can take off your plate.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} style={{ fontFamily: BODY_FONT }}>
      {state.error && (
        <p style={{ fontSize: '14px', color: '#991b1b', margin: '0 0 24px', paddingBottom: '16px', borderBottom: `1px solid ${DIVIDER}` }}>{state.error}</p>
      )}

      {/* Honeypot: visually hidden, ignored by humans, filled by bots. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sif-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Field label="First name" name="first_name" error={state.fieldErrors?.first_name} />
        <Field label="Last name" name="last_name" error={state.fieldErrors?.last_name} />
        <Field label="Email" name="email" type="email" error={state.fieldErrors?.email} />
        <Field label="Phone" name="phone" type="tel" optional />
        <FullRow>
          <Field label="Business or brand name" name="business_name" placeholder="The name your clients know you by" optional />
        </FullRow>
        <FullRow>
          <Field label="Current website" name="website_url" type="url" placeholder="https://" optional />
        </FullRow>
        <FullRow>
          <label htmlFor="plan" style={labelStyle}>Which plan fits</label>
          <select id="plan" name="plan" value={plan} onChange={(e) => setPlan(e.target.value)} className="sif-input" style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
            {PLAN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </FullRow>
        <FullRow>
          <label htmlFor="message" style={labelStyle}>
            What do you want help with <span style={{ color: WARM_GRAY }}>(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Social that has gone quiet, a journal you do not have time to write, a brand refresh. Tell us where you are stretched."
            className="sif-input"
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          />
        </FullRow>
      </div>

      <button type="submit" disabled={isPending} className="eah-cta-primary" style={{ ...PRIMARY_CTA_STYLE, width: '100%', marginTop: '28px', opacity: isPending ? 0.6 : 1 }}>
        {isPending ? 'Sending' : 'Request a conversation'}
      </button>

      <p style={{ fontSize: '13px', color: WARM_GRAY, lineHeight: 1.6, margin: '16px 0 0' }}>
        No obligation. We reply personally, usually within one business day.
      </p>

      <style>{`
        @media (max-width: 560px) { .sif-grid { grid-template-columns: 1fr !important; } }
        .sif-input:focus { border-color: ${CHARCOAL} !important; }
      `}</style>
    </form>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 500, color: CHARCOAL, marginBottom: '8px' }
const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', fontSize: '15px', fontFamily: BODY_FONT, color: CHARCOAL,
  background: '#fff', border: `1px solid ${DIVIDER}`, borderRadius: '2px', padding: '12px 14px',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s ease',
}

function FullRow({ children }: { children: React.ReactNode }) {
  return <div style={{ gridColumn: '1 / -1' }}>{children}</div>
}

function Field({ label, name, type = 'text', placeholder, error, optional }: {
  label: string
  name: string
  type?: string
  placeholder?: string
  error?: string
  optional?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} style={labelStyle}>
        {label}
        {optional && <span style={{ color: WARM_GRAY, fontWeight: 400 }}> (optional)</span>}
      </label>
      <input id={name} name={name} type={type} placeholder={placeholder} className="sif-input" style={{ ...inputStyle, borderColor: error ? '#991b1b' : DIVIDER }} />
      {error && <p style={{ fontSize: '13px', color: '#991b1b', margin: '6px 0 0' }}>{error}</p>}
    </div>
  )
}
