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

import { checkForBot } from '@/lib/spam'

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

  const bot = await checkForBot(formData, 'consultation')
  if (bot === 'drop') return { success: true }
  if (bot === 'challenge_failed') {
    return { success: false, error: 'We could not verify this submission. Please refresh the page and try again.' }
  }

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

  // Validate. Every field the form shows for the chosen tier is required,
  // except "existing website", which not every lead has.
  const fieldErrors: Partial<Record<string, string>> = {}
  const requireText = (key: string, value: string, label: string) => {
    if (!value) fieldErrors[key] = `${label} is required.`
  }
  if (!tier) fieldErrors.tier = 'Choose a plan.'
  requireText('first_name', firstName, 'First name')
  requireText('last_name', lastName, 'Last name')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'A valid email is required.'
  }
  requireText('phone', phone, 'Phone')
  requireText('role_title', roleTitle, 'Role or title')
  requireText('timeline', timeline, 'Timeline')
  requireText('heard_from', heardFrom, 'This')
  requireText('message', message, 'This')
  if (tier === 'agency') {
    requireText('agency_name', agencyName, 'Agency name')
    requireText('agency_website', agencyWebsite, 'Agency website')
    if (!numAdvisors || numAdvisors < 1) fieldErrors.num_advisors = 'Enter the number of advisors.'
    requireText('host_affiliation', hostAffiliation, 'Host agency or consortium')
    if (yearsInBusiness == null || yearsInBusiness < 0) fieldErrors.years_in_business = 'Years in business is required.'
    requireText('agency_street', agencyStreet, 'Street')
    requireText('agency_city', agencyCity, 'City')
    requireText('agency_region', agencyRegion, 'State or region')
    requireText('agency_postal', agencyPostal, 'Postal code')
    requireText('agency_country', agencyCountry, 'Country')
    if (specialties.length === 0) fieldErrors.specialties = 'Select at least one specialty.'
    if (wantsCustomDom == null) fieldErrors.wants_custom_domain = 'Choose yes or no.'
    if (wantsAdvisorPgs == null) fieldErrors.wants_advisor_pages = 'Choose yes or no.'
    if (wantsTeamTrain == null) fieldErrors.wants_team_training = 'Choose yes or no.'
  }
  if (tier === 'custom') {
    requireText('design_references', designReferences, 'Design references')
    requireText('additional_pages', additionalPages, 'Additional pages')
    requireText('integrations_needed', integrationsNeeded, 'Integrations needed')
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
      existing_website:    tier === 'agency' || tier === 'custom' ? existingWebsite || null : null,
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

    // Notify the operator. The DB insert already succeeded, so an email failure
    // must not surface as a form error. Log it and return success. The row is
    // visible in /admin/consultations regardless.
    try {
      const { sendConsultationNotification } = await import('@/lib/email')
      const sent = await sendConsultationNotification({
        firstName,
        lastName,
        email,
        phone:           phone || null,
        tier,
        timeline:        timeline || null,
        roleTitle:       roleTitle || null,
        heardFrom:       heardFrom || null,
        message:         message || null,
        existingWebsite: tier === 'agency' || tier === 'custom' ? existingWebsite || null : null,
        agency: tier === 'agency'
          ? {
              name:            agencyName,
              website:         agencyWebsite,
              numAdvisors,
              hostAffiliation,
              yearsInBusiness,
              address:         [agencyStreet, agencyCity, agencyRegion, agencyPostal, agencyCountry].filter(Boolean).join(', '),
              specialties,
              wantsCustomDomain: wantsCustomDom,
              wantsAdvisorPages: wantsAdvisorPgs,
              wantsTeamTraining: wantsTeamTrain,
            }
          : null,
        custom: tier === 'custom'
          ? { designReferences, additionalPages, integrationsNeeded }
          : null,
      })
      console.info('[consultation] admin notification sent', sent?.id)
    } catch (emailErr) {
      console.error('[consultation] admin notification email failed', emailErr)
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
