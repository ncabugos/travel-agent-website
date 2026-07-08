'use client'

import { useActionState, useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import {
  submitStudioInquiry,
  type StudioInquiryFormState,
} from '@/lib/actions/studio'

const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
// Purple = actions (submit, focus), per brand/EAH_Brand_Style_Guide.html.
const PURPLE = '#7C3AED'
const PURPLE_GRAD = 'linear-gradient(135deg, #7c3aed, #a78bfa)'

const PLAN_OPTIONS = [
  { value: 'essential', label: 'Essential — $950/mo' },
  { value: 'professional', label: 'Professional — $1,850/mo' },
  { value: 'full-service', label: 'Full Service — $3,500/mo' },
  { value: 'agency', label: 'Agency — custom' },
  { value: 'unsure', label: 'Not sure yet — help me choose' },
] as const

const PLAN_VALUES = PLAN_OPTIONS.map((p) => p.value) as readonly string[]

const initialState: StudioInquiryFormState = {}

export function StudioInquiryForm() {
  const [state, formAction, isPending] = useActionState(submitStudioInquiry, initialState)
  const [plan, setPlan] = useState<string>('unsure')

  // Plan pre-selection comes from two places: a deep link (/studio?plan=…) read
  // once on mount, and the in-page pricing CTAs, which fire a 'studio:select-plan'
  // event as they scroll the visitor down to this form.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search).get('plan')
    if (p && PLAN_VALUES.includes(p)) setPlan(p)

    const onSelect = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail
      if (slug && PLAN_VALUES.includes(slug)) setPlan(slug)
    }
    window.addEventListener('studio:select-plan', onSelect)
    return () => window.removeEventListener('studio:select-plan', onSelect)
  }, [])

  if (state.success) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '64px 32px',
          borderRadius: '16px',
          border: '1px solid #E8E4DC',
          background: '#fff',
          fontFamily: SANS,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: PURPLE }}>
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#1A1715', margin: '0 0 12px' }}>
          Thank you — we&apos;ll be in touch
        </h3>
        <p style={{ fontSize: '15px', color: '#57514A', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
          Your inquiry is in. We&apos;ll reply personally, usually within one business
          day, to talk through what Studio can take off your plate.
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
        border: '1px solid #E8E4DC',
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

      {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
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
          <Field
            label="Business / brand name"
            name="business_name"
            placeholder="The name your clients know you by"
            optional
          />
        </FullRow>
        <FullRow>
          <Field label="Current website" name="website_url" type="url" placeholder="https://" optional />
        </FullRow>
        <FullRow>
          <label
            htmlFor="plan"
            style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#57514A', marginBottom: '6px' }}
          >
            Which plan fits?
          </label>
          <select
            id="plan"
            name="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="sif-input"
            style={{
              display: 'block',
              width: '100%',
              fontSize: '14px',
              fontFamily: SANS,
              color: '#1A1715',
              background: '#fff',
              border: '1px solid #E8E4DC',
              borderRadius: '10px',
              padding: '11px 14px',
              outline: 'none',
              boxSizing: 'border-box',
              appearance: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            {PLAN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FullRow>
        <FullRow>
          <label
            htmlFor="message"
            style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#57514A', marginBottom: '6px' }}
          >
            What do you want help with?
            <span style={{ color: '#8A8279', fontWeight: 400 }}> (optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Social that's gone quiet, a journal you don't have time to write, a brand refresh — tell us where you're stretched."
            className="sif-input"
            style={{
              display: 'block',
              width: '100%',
              fontSize: '14px',
              fontFamily: SANS,
              color: '#1A1715',
              background: '#fff',
              border: '1px solid #E8E4DC',
              borderRadius: '10px',
              padding: '11px 14px',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical',
              lineHeight: 1.6,
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
          />
        </FullRow>
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: '100%',
          marginTop: '28px',
          padding: '14px 24px',
          background: PURPLE_GRAD,
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: 600,
          boxShadow: '0 1px 2px rgba(124,58,237,0.25)',
          fontFamily: SANS,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {isPending ? 'Sending…' : 'Request a conversation'}
      </button>

      <p style={{ fontSize: '12px', color: '#8A8279', lineHeight: 1.6, margin: '16px 0 0', textAlign: 'center' }}>
        No obligation. We&apos;ll reply personally, usually within one business day.
      </p>

      <style>{`
        @media (max-width: 560px) {
          .sif-grid { grid-template-columns: 1fr !important; }
        }
        .sif-input:focus {
          border-color: ${PURPLE} !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15) !important;
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
        style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#57514A', marginBottom: '6px' }}
      >
        {label}
        {optional && <span style={{ color: '#8A8279', fontWeight: 400 }}> (optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="sif-input"
        style={{
          display: 'block',
          width: '100%',
          fontSize: '14px',
          fontFamily: SANS,
          color: '#1A1715',
          background: '#fff',
          border: `1px solid ${error ? '#ef4444' : '#E8E4DC'}`,
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
