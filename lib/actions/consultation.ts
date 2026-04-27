'use server'

/**
 * Server action for the "Schedule a Consultation" form on the marketing site.
 *
 * Two flows share one form:
 *   - Custom-tier inquiries (single advisor wanting a custom-designed site)
 *   - Agency-tier inquiries (multi-advisor agency wanting multi-seat pricing)
 *
 * The form always collects: name, email, tier of interest, timeline, message.
 * When tier='agency' it additionally collects agency address, seat count, host
 * affiliation, etc. When tier='custom' it collects design references and
 * additional-page requirements. All tier-specific fields are nullable in the
 * DB so the single endpoint can handle both.
 */

export type ConsultationFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Partial<Record<string, string>>
}

const ALLOWED_TIERS = ['starter', 'growth', 'custom', 'agency'] as const
type TierValue = (typeof ALLOWED_TIERS)[number]

function coerceTier(v: string | null): TierValue | null {
  if (!v) return null
  return (ALLOWED_TIERS as readonly string[]).includes(v) ? (v as TierValue) : null
}

function coerceInt(v: string): number | null {
  if (!v) return null
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n) ? n : null
}

function coerceBool(v: string): boolean | null {
  if (v === 'yes') return true
  if (v === 'no') return false
  return null
}

export async function submitConsultationRequest(
  _prev: ConsultationFormState,
  formData: FormData,
): Promise<ConsultationFormState> {
  const get = (key: string) => (formData.get(key) as string | null)?.trim() ?? ''
  const getAll = (key: string) => formData.getAll(key).map(v => String(v).trim()).filter(Boolean)

  const tier        = coerceTier(get('tier'))
  const firstName   = get('first_name')
  const lastName    = get('last_name')
  const email       = get('email')
  const phone       = get('phone')
  const roleTitle   = get('role_title')
  const heardFrom   = get('heard_from')
  const timeline    = get('timeline')
  const message     = get('message')

  // Agency fields
  const agencyName       = get('agency_name')
  const agencyWebsite    = get('agency_website')
  const agencyStreet     = get('agency_street')
  const agencyCity       = get('agency_city')
  const agencyRegion     = get('agency_region')
  const agencyPostal     = get('agency_postal')
  const agencyCountry    = get('agency_country')
  const numAdvisors      = coerceInt(get('num_advisors'))
  const hostAffiliation  = get('host_affiliation')
  const yearsInBusiness  = coerceInt(get('years_in_business'))
  const specialties      = getAll('specialties')
  const existingWebsite  = get('existing_website')
  const wantsCustomDom   = coerceBool(get('wants_custom_domain'))
  const wantsAdvisorPgs  = coerceBool(get('wants_advisor_pages'))
  const wantsTeamTrain   = coerceBool(get('wants_team_training'))

  // Custom-tier fields
  const designReferences  = get('design_references')
  const additionalPages   = get('additional_pages')
  const integrationsNeeded = get('integrations_needed')

  // Validate
  const fieldErrors: Partial<Record<string, string>> = {}
  if (!firstName) fieldErrors.first_name = 'First name is required.'
  if (!lastName) fieldErrors.last_name = 'Last name is required.'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'A valid email is required.'
  }
  if (tier === 'agency') {
    if (!agencyName) fieldErrors.agency_name = 'Agency name is required.'
    if (!numAdvisors || numAdvisors < 1) fieldErrors.num_advisors = 'Enter the number of advisors.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please correct the errors below.', fieldErrors }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Dev mode without Supabase — treat as success so the form UX is testable.
    return { success: true }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { error } = await supabase.from('consultation_requests').insert({
      tier,
      first_name:  firstName,
      last_name:   lastName,
      email,
      phone:       phone || null,
      role_title:  roleTitle || null,
      heard_from:  heardFrom || null,
      timeline:    timeline || null,
      message:     message || null,

      agency_name:         tier === 'agency' ? agencyName || null : null,
      agency_website:      tier === 'agency' ? agencyWebsite || null : null,
      agency_street:       tier === 'agency' ? agencyStreet || null : null,
      agency_city:         tier === 'agency' ? agencyCity || null : null,
      agency_region:       tier === 'agency' ? agencyRegion || null : null,
      agency_postal:       tier === 'agency' ? agencyPostal || null : null,
      agency_country:      tier === 'agency' ? agencyCountry || null : null,
      num_advisors:        tier === 'agency' ? numAdvisors : null,
      host_affiliation:    tier === 'agency' ? hostAffiliation || null : null,
      years_in_business:   tier === 'agency' ? yearsInBusiness : null,
      specialties:         tier === 'agency' && specialties.length > 0 ? specialties : null,
      existing_website:    tier === 'agency' ? existingWebsite || null : null,
      wants_custom_domain: tier === 'agency' ? wantsCustomDom : null,
      wants_advisor_pages: tier === 'agency' ? wantsAdvisorPgs : null,
      wants_team_training: tier === 'agency' ? wantsTeamTrain : null,

      design_references:   tier === 'custom' ? designReferences || null : null,
      additional_pages:    tier === 'custom' ? additionalPages || null : null,
      integrations_needed: tier === 'custom' ? integrationsNeeded || null : null,
    })

    if (error) {
      console.error('[consultation] insert failed', error)
      return {
        success: false,
        error: 'We could not save your request. Please try again in a moment or email us directly.',
      }
    }

    return { success: true }
  } catch (e) {
    console.error('[consultation] unexpected error', e)
    return {
      success: false,
      error: 'Something went wrong on our end. Please try again.',
    }
  }
}
