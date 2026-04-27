'use client'

import { useActionState, useState } from 'react'
import {
  submitConsultationRequest,
  type ConsultationFormState,
} from '@/lib/actions/consultation'

const serif = 'var(--font-serif)'
const sans = 'var(--font-sans)'

const TIERS = [
  { value: 'starter', label: 'Starter — $79/mo' },
  { value: 'growth', label: 'Growth — $149/mo' },
  { value: 'custom', label: 'Custom — $299/mo' },
  { value: 'agency', label: 'Agency — Contact for quote' },
] as const

type TierValue = (typeof TIERS)[number]['value']

const TIMELINES = [
  'Select a timeline…',
  'ASAP',
  '1–3 months',
  '3–6 months',
  'Just exploring',
]

const HEARD_FROM = [
  'Select one…',
  'Google search',
  'Referral from an advisor',
  'Industry event / conference',
  'Social media',
  'Other',
]

const HOST_AFFILIATIONS = [
  'Select one…',
  'Virtuoso',
  'Independent',
  'Other',
]

const SPECIALTIES = [
  'Luxury',
  'Honeymoons & Romance',
  'Cruise (Ocean)',
  'Cruise (River & Yacht)',
  'Safari & Wildlife',
  'Adventure & Expedition',
  'Ski & Mountain',
  'Family Travel',
  'Corporate Travel',
  'Group Travel',
  'Cultural & Heritage',
  'Wellness & Spa',
]

const initialState: ConsultationFormState = {}

export function ConsultationForm({
  initialTier = 'custom',
}: {
  initialTier?: TierValue
}) {
  const [state, formAction, isPending] = useActionState(
    submitConsultationRequest,
    initialState,
  )
  const [tier, setTier] = useState<TierValue>(initialTier)

  if (state.success) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 40px',
          border: '1px solid var(--divider)',
          background: '#fff',
        }}
      >
        <div
          style={{
            fontFamily: serif,
            fontSize: '40px',
            color: 'var(--gold)',
            marginBottom: '24px',
          }}
        >
          ◇
        </div>
        <h2
          style={{
            fontFamily: serif,
            fontSize: '28px',
            fontWeight: 300,
            color: 'var(--charcoal)',
            marginBottom: '16px',
          }}
        >
          Thank You
        </h2>
        <p
          style={{
            fontFamily: sans,
            fontSize: '15px',
            color: 'var(--warm-gray)',
            lineHeight: '1.8',
            maxWidth: '440px',
            margin: '0 auto',
          }}
        >
          We&apos;ve received your consultation request. A member of our team
          will be in touch within one business day to schedule a call.
        </p>
      </div>
    )
  }

  const showAgency = tier === 'agency'
  const showCustom = tier === 'custom'

  return (
    <form action={formAction} style={{ background: '#fff', padding: '40px', border: '1px solid var(--divider)' }}>
      {state.error && (
        <div
          style={{
            padding: '14px 20px',
            marginBottom: '24px',
            background: '#FEF3CD',
            border: '1px solid #F5C842',
          }}
        >
          <p style={{ fontFamily: sans, fontSize: '13px', color: '#7A5C00', margin: 0 }}>
            {state.error}
          </p>
        </div>
      )}

      {/* ── Tier selection ─────────────────────────────────────────── */}
      <SectionLabel>Plan of interest</SectionLabel>
      <div
        role="radiogroup"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '40px',
        }}
        className="ca-tier-grid"
      >
        {TIERS.map((t) => (
          <label
            key={t.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 16px',
              border: tier === t.value ? '1px solid var(--gold)' : '1px solid var(--divider)',
              background: tier === t.value ? 'rgba(180, 154, 90, 0.06)' : '#fff',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, background 0.2s ease',
              fontFamily: sans,
              fontSize: '14px',
              color: 'var(--charcoal)',
            }}
          >
            <input
              type="radio"
              name="tier"
              value={t.value}
              checked={tier === t.value}
              onChange={() => setTier(t.value)}
              style={{ accentColor: 'var(--gold)' }}
            />
            {t.label}
          </label>
        ))}
      </div>

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <SectionLabel>Your contact details</SectionLabel>
      <Grid>
        <Field label="First Name *" name="first_name" error={state.fieldErrors?.first_name} />
        <Field label="Last Name *" name="last_name" error={state.fieldErrors?.last_name} />
        <Field label="Email *" name="email" type="email" error={state.fieldErrors?.email} />
        <Field label="Phone" name="phone" type="tel" />
        <FullRow>
          <Field label="Role / Title" name="role_title" placeholder="e.g. Owner, Principal Advisor" />
        </FullRow>
      </Grid>

      {/* ── Agency block ────────────────────────────────────────────── */}
      {showAgency && (
        <>
          <SectionLabel style={{ marginTop: '40px' }}>About your agency</SectionLabel>
          <Grid>
            <FullRow>
              <Field
                label="Agency Name *"
                name="agency_name"
                error={state.fieldErrors?.agency_name}
              />
            </FullRow>
            <Field label="Agency Website" name="agency_website" placeholder="https://" />
            <Field
              label="Number of Advisors *"
              name="num_advisors"
              type="number"
              error={state.fieldErrors?.num_advisors}
              placeholder="e.g. 8"
            />
            <SelectField
              label="Host Agency / Consortium"
              name="host_affiliation"
              options={HOST_AFFILIATIONS}
            />
            <Field label="Years in Business" name="years_in_business" type="number" />
            <FullRow>
              <SectionSubLabel>Business Address</SectionSubLabel>
            </FullRow>
            <FullRow>
              <Field label="Street" name="agency_street" />
            </FullRow>
            <Field label="City" name="agency_city" />
            <Field label="State / Region" name="agency_region" />
            <Field label="Postal Code" name="agency_postal" />
            <Field label="Country" name="agency_country" />

            <FullRow>
              <SectionSubLabel>Specialties (select all that apply)</SectionSubLabel>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px 16px',
                }}
                className="ca-specialties-grid"
              >
                {SPECIALTIES.map((s) => (
                  <label
                    key={s}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: sans,
                      fontSize: '13px',
                      color: 'var(--charcoal)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      name="specialties"
                      value={s}
                      style={{ accentColor: 'var(--gold)' }}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </FullRow>

            <FullRow>
              <Field
                label="Existing Website URL (if migrating)"
                name="existing_website"
                placeholder="https://"
              />
            </FullRow>

            <YesNoField label="Need a custom domain?" name="wants_custom_domain" />
            <YesNoField label="Want individual advisor pages?" name="wants_advisor_pages" />
            <FullRow>
              <YesNoField
                label="Need onboarding & training for the advisor team?"
                name="wants_team_training"
              />
            </FullRow>
          </Grid>
        </>
      )}

      {/* ── Custom-tier block ────────────────────────────────────────── */}
      {showCustom && (
        <>
          <SectionLabel style={{ marginTop: '40px' }}>Your custom build</SectionLabel>
          <Grid>
            <FullRow>
              <Field
                label="Existing Website URL (if any)"
                name="existing_website"
                placeholder="https://"
              />
            </FullRow>
            <FullRow>
              <TextAreaField
                label="Design References / Inspiration"
                name="design_references"
                placeholder="Links to sites you love, or a description of the feel you're after."
              />
            </FullRow>
            <FullRow>
              <TextAreaField
                label="Additional Pages Desired"
                name="additional_pages"
                placeholder="e.g. Press, Team, Case Studies, Destination deep-dives"
              />
            </FullRow>
            <FullRow>
              <TextAreaField
                label="Integrations Needed"
                name="integrations_needed"
                placeholder="e.g. CRM, booking engine, Virtuoso, newsletter platform"
              />
            </FullRow>
          </Grid>
        </>
      )}

      {/* ── General ──────────────────────────────────────────────────── */}
      <SectionLabel style={{ marginTop: '40px' }}>A few more details</SectionLabel>
      <Grid>
        <SelectField label="Ideal Launch Timeline" name="timeline" options={TIMELINES} />
        <SelectField label="How did you hear about us?" name="heard_from" options={HEARD_FROM} />
        <FullRow>
          <TextAreaField
            label="Anything else we should know?"
            name="message"
            placeholder="Goals, constraints, questions — anything that helps us prepare."
          />
        </FullRow>
      </Grid>

      <div style={{ marginTop: '40px' }}>
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
            padding: '18px 48px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s ease',
          }}
        >
          {isPending ? 'Sending…' : 'Schedule a Consultation'}
        </button>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .ca-tier-grid { grid-template-columns: 1fr !important; }
          .ca-specialties-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .ca-specialties-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  )
}

/* ─────────────────────── sub-components ─────────────────────── */

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px 24px',
      }}
    >
      {children}
    </div>
  )
}

function FullRow({ children }: { children: React.ReactNode }) {
  return <div style={{ gridColumn: '1 / -1' }}>{children}</div>
}

function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        fontFamily: sans,
        fontSize: '10px',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--divider)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function SectionSubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: sans,
        fontSize: '11px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--warm-gray)',
        marginBottom: '12px',
        marginTop: '8px',
      }}
    >
      {children}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: sans,
  fontSize: '9px',
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: 'var(--warm-gray)',
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  fontFamily: sans,
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
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--gold)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#C0392B' : 'var(--divider)'
        }}
      />
      {error && (
        <p
          style={{
            fontFamily: sans,
            fontSize: '11px',
            color: '#C0392B',
            marginTop: '4px',
          }}
        >
          {error}
        </p>
      )}
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
        style={{
          ...inputStyle,
          appearance: 'none',
          cursor: 'pointer',
          paddingRight: '20px',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--divider)')}
        defaultValue=""
      >
        {options.map((opt, i) => (
          <option key={opt} value={i === 0 ? '' : opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextAreaField({
  label,
  name,
  placeholder,
}: {
  label: string
  name: string
  placeholder?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={4}
        style={{ ...inputStyle, resize: 'vertical', minHeight: '96px' }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--divider)')}
      />
    </div>
  )
}

function YesNoField({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: '20px', paddingTop: '6px' }}>
        {['yes', 'no'].map((v) => (
          <label
            key={v}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: sans,
              fontSize: '13px',
              color: 'var(--charcoal)',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            <input
              type="radio"
              name={name}
              value={v}
              style={{ accentColor: 'var(--gold)' }}
            />
            {v}
          </label>
        ))}
      </div>
    </div>
  )
}
