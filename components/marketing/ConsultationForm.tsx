'use client'

import { useActionState, useState } from 'react'
import {
  submitConsultationRequest,
  type ConsultationFormState,
} from '@/lib/actions/consultation'

const serif = 'var(--font-inter-tight), var(--font-inter), system-ui, sans-serif'
const sans = 'var(--font-inter), system-ui, -apple-system, sans-serif'
const CHARCOAL = '#1A1715'
const DIVIDER = '#E8E4DC'
const WARM_GRAY = '#8A8279'
const WARM_GRAY_DARK = '#5F5850'

type TierValue = 'starter' | 'growth' | 'custom' | 'agency'
type BillingCycle = 'monthly' | 'annual'

interface TierOption {
  value: TierValue
  label: string
}

// Business model v2 (docs/business-model-v2.md): one public site plan plus
// portal expansion. The legacy tier values are kept as the form's submit
// values so the consultation action and admin views stay unchanged.
const TIERS: TierOption[] = [
  { value: 'starter', label: 'The Site, a custom-branded advisor website' },
  { value: 'growth',  label: 'The Site with modules: editorial, directories, feeds' },
  { value: 'custom',  label: 'Bespoke design and premium work' },
  { value: 'agency',  label: 'Agency, multi-advisor' },
]

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
  'Signature Travel Network',
  'Ensemble Travel Group',
  'Travel Leaders',
  'Serandipians',
  'XO Private',
  'Internova Select',
  'GlobalStar',
  'Affluent Traveler Collection',
  'Other consortium',
  'Independent',
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
  initialBilling = 'monthly',
}: {
  initialTier?: TierValue
  initialBilling?: BillingCycle
}) {
  const [state, formAction, isPending] = useActionState(
    submitConsultationRequest,
    initialState,
  )
  const [tier, setTier] = useState<TierValue>(initialTier)
  // Monthly-only under business model v2 — kept as submit metadata.
  const billing: BillingCycle = initialBilling

  if (state.success) {
    return (
      <div style={{ padding: '8px 0' }}>
        <div aria-hidden style={{ width: '40px', height: '1px', background: '#B49A5A', marginBottom: '24px' }} />
        <h2 style={{ fontFamily: serif, fontSize: '32px', fontWeight: 400, letterSpacing: '-0.025em', color: CHARCOAL, margin: '0 0 12px' }}>
          Thank you.
        </h2>
        <p style={{ fontFamily: sans, fontSize: '16px', color: WARM_GRAY_DARK, lineHeight: 1.6, maxWidth: '48ch', margin: 0 }}>
          We have your consultation request. A member of our team will be in touch within one business day to schedule a call.
        </p>
      </div>
    )
  }

  const showAgency = tier === 'agency'
  const showCustom = tier === 'custom'

  return (
    <form action={formAction} style={{ fontFamily: sans }}>
      {state.error && (
        <p style={{ fontFamily: sans, fontSize: '14px', color: '#991b1b', margin: '0 0 24px', paddingBottom: '16px', borderBottom: `1px solid ${DIVIDER}` }}>
          {state.error}
        </p>
      )}

      {/* ── Tier selection ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <SectionLabel>Plan of interest</SectionLabel>
      </div>
      {/* Billing cycle is monthly-only under business model v2; the field is
          kept so the consultation action and admin views stay unchanged. */}
      <input type="hidden" name="billing" value={billing} />
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
              border: tier === t.value ? `1px solid ${CHARCOAL}` : `1px solid ${DIVIDER}`,
              background: tier === t.value ? '#FAFAF5' : '#fff',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, background 0.2s ease',
              fontFamily: sans,
              fontSize: '14px',
              color: CHARCOAL,
            }}
          >
            <input
              type="radio"
              name="tier"
              value={t.value}
              checked={tier === t.value}
              onChange={() => setTier(t.value)}
              style={{ accentColor: CHARCOAL }}
            />
            {t.label}
          </label>
        ))}
      </div>

      {/* ── Contact ─────────────────────────────────────────────────── */}
      <SectionLabel>Your contact details</SectionLabel>
      <Grid>
        <Field label="First name *" name="first_name" error={state.fieldErrors?.first_name} />
        <Field label="Last name *" name="last_name" error={state.fieldErrors?.last_name} />
        <Field label="Email *" name="email" type="email" error={state.fieldErrors?.email} />
        <Field label="Phone" name="phone" type="tel" />
        <FullRow>
          <Field label="Role or title" name="role_title" placeholder="e.g. Owner, Principal Advisor" />
        </FullRow>
      </Grid>

      {/* ── Agency block ────────────────────────────────────────────── */}
      {showAgency && (
        <>
          <SectionLabel style={{ marginTop: '40px' }}>About your agency</SectionLabel>
          <Grid>
            <FullRow>
              <Field
                label="Agency name *"
                name="agency_name"
                error={state.fieldErrors?.agency_name}
              />
            </FullRow>
            <Field label="Agency website" name="agency_website" placeholder="https://" />
            <Field
              label="Number of advisors *"
              name="num_advisors"
              type="number"
              error={state.fieldErrors?.num_advisors}
              placeholder="e.g. 8"
            />
            <SelectField
              label="Host agency or consortium"
              name="host_affiliation"
              options={HOST_AFFILIATIONS}
            />
            <Field label="Years in business" name="years_in_business" type="number" />
            <FullRow>
              <SectionSubLabel>Business address</SectionSubLabel>
            </FullRow>
            <FullRow>
              <Field label="Street" name="agency_street" />
            </FullRow>
            <Field label="City" name="agency_city" />
            <Field label="State or region" name="agency_region" />
            <Field label="Postal code" name="agency_postal" />
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
                      fontSize: '14px',
                      color: CHARCOAL,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      name="specialties"
                      value={s}
                      style={{ accentColor: CHARCOAL }}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </FullRow>

            <FullRow>
              <Field
                label="Existing website (if migrating)"
                name="existing_website"
                placeholder="https://"
              />
            </FullRow>

            <YesNoField label="Need a custom domain?" name="wants_custom_domain" />
            <YesNoField label="Want individual advisor pages?" name="wants_advisor_pages" />
            <FullRow>
              <YesNoField
                label="Need onboarding and training for the advisor team?"
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
                label="Existing website (if any)"
                name="existing_website"
                placeholder="https://"
              />
            </FullRow>
            <FullRow>
              <TextAreaField
                label="Design references"
                name="design_references"
                placeholder="Links to sites you love, or a description of the feel you're after."
              />
            </FullRow>
            <FullRow>
              <TextAreaField
                label="Additional pages"
                name="additional_pages"
                placeholder="e.g. Press, Team, Case Studies, Destination deep-dives"
              />
            </FullRow>
            <FullRow>
              <TextAreaField
                label="Integrations needed"
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
        <SelectField label="Ideal launch timeline" name="timeline" options={TIMELINES} />
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
            fontSize: '15px',
            fontWeight: 500,
            color: '#fff',
            background: '#7C3AED',
            border: '1px solid transparent',
            borderRadius: '2px',
            minHeight: '52px',
            padding: '0 28px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1,
            transition: 'background-color 0.2s ease',
          }}
          className="eah-cta-primary"
        >
          {isPending ? 'Sending' : 'Schedule a consultation'}
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
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: WARM_GRAY,
        marginBottom: '24px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${DIVIDER}`,
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
        fontSize: '13px',
        fontWeight: 500,
        color: CHARCOAL,
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
  fontSize: '13px',
  fontWeight: 500,
  color: CHARCOAL,
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  fontFamily: sans,
  fontSize: '15px',
  color: CHARCOAL,
  background: '#fff',
  border: `1px solid ${DIVIDER}`,
  borderRadius: '2px',
  padding: '12px 14px',
  outline: 'none',
  boxSizing: 'border-box',
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
        style={{ ...inputStyle, borderColor: error ? '#991b1b' : DIVIDER }}
        onFocus={(e) => {
          e.target.style.borderColor = CHARCOAL
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#991b1b' : DIVIDER
        }}
      />
      {error && (
        <p
          style={{
            fontFamily: sans,
            fontSize: '11px',
            color: '#991b1b',
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
        onFocus={(e) => (e.target.style.borderColor = CHARCOAL)}
        onBlur={(e) => (e.target.style.borderColor = DIVIDER)}
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
        onFocus={(e) => (e.target.style.borderColor = CHARCOAL)}
        onBlur={(e) => (e.target.style.borderColor = DIVIDER)}
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
              fontSize: '14px',
              color: CHARCOAL,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            <input
              type="radio"
              name={name}
              value={v}
              style={{ accentColor: CHARCOAL }}
            />
            {v}
          </label>
        ))}
      </div>
    </div>
  )
}
