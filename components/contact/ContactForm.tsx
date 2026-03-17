'use client'

import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from '@/lib/actions/contact'

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

const VACATION_TYPES = [
  'Select a type...',
  'Beach & Island',
  'Safari & Wildlife',
  'Cultural & City',
  'Adventure & Hiking',
  'River or Ocean Cruise',
  'Ski & Mountain',
  'Honeymoon / Romance',
  'Family Vacation',
  'Multi-Destination',
  'Other',
]

const ADVISOR_PREFS = [
  'No preference',
  'John Oberacker',
  'Sophie Laurent',
  'Marcus Chen',
]

const initialState: ContactFormState = {}

export function ContactForm({ agentId }: { agentId: string }) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

  if (state.success) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 40px', border: '1px solid var(--divider)' }}>
        <div style={{ fontFamily: serif, fontSize: '40px', color: 'var(--gold)', marginBottom: '24px' }}>◇</div>
        <h2 style={{ fontFamily: serif, fontSize: '28px', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '16px' }}>
          Thank You
        </h2>
        <p style={{ fontFamily: sans, fontSize: '15px', color: 'var(--warm-gray)', lineHeight: '1.8' }}>
          We&apos;ve received your enquiry and will be in touch within one business day.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="agent_id" value={agentId} />

      {state.error && (
        <div style={{ padding: '14px 20px', marginBottom: '24px', background: '#FEF3CD', border: '1px solid #F5C842' }}>
          <p style={{ fontFamily: sans, fontSize: '13px', color: '#7A5C00' }}>{state.error}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
        <Field label="First Name *" name="first_name" error={state.fieldErrors?.first_name} />
        <Field label="Last Name *" name="last_name" error={state.fieldErrors?.last_name} />
        <Field label="Email *" name="email" type="email" error={state.fieldErrors?.email} />
        <Field label="Phone" name="phone" type="tel" />

        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Dream Destination" name="destination" placeholder="e.g. Amalfi Coast, Bali, Kenya..." />
        </div>

        <SelectField
          label="Type of Holiday"
          name="vacation_type"
          options={VACATION_TYPES}
        />

        <Field label="Number of Travellers" name="num_travelers" type="number" placeholder="e.g. 2" />

        <div style={{ gridColumn: '1 / -1' }}>
          <SelectField
            label="Preferred Advisor"
            name="advisor_pref"
            options={ADVISOR_PREFS}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Message</label>
          <textarea
            name="message"
            rows={5}
            placeholder="Tell us more about your ideal journey..."
            style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
          />
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            fontFamily: sans,
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: isPending ? 'var(--warm-gray)' : 'var(--charcoal)',
            background: isPending ? 'var(--divider)' : 'var(--gold)',
            border: 'none',
            padding: '16px 44px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s ease',
          }}
        >
          {isPending ? 'Sending...' : 'Send Enquiry'}
        </button>
      </div>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: '9px',
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: 'var(--warm-gray)',
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: '14px',
  color: 'var(--charcoal)',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--divider)',
  padding: '10px 0',
  outline: 'none',
  transition: 'border-color 0.2s ease',
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  error,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  error?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        style={{ ...inputStyle, borderColor: error ? '#C0392B' : 'var(--divider)' }}
        onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
        onBlur={e => (e.target.style.borderColor = error ? '#C0392B' : 'var(--divider)')}
      />
      {error && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#C0392B', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: string[]
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        name={name}
        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '20px' }}
        onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
        onBlur={e => (e.target.style.borderColor = 'var(--divider)')}
      >
        {options.map(opt => (
          <option key={opt} value={opt === options[0] ? '' : opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
