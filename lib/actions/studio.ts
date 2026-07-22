'use server'

/**
 * Server action for the public Studio services form at /studio.
 *
 * Writes to the shared consultation_requests table with source='studio' so the
 * admin inbox (/admin/consultations) can tell Studio leads apart from
 * Custom/Agency sales leads. Uses the anon-key server client (RLS
 * "public insert").
 *
 * Field mapping onto the existing table:
 *   business_name → agency_name        current site → existing_website
 *   plan          → plan_interest (052) message      → message
 *
 * Requires migration 052 (source='studio' + plan_interest column).
 */

const PLAN_SLUGS = ['essential', 'professional', 'full-service', 'agency', 'unsure'] as const
type PlanSlug = (typeof PLAN_SLUGS)[number]

export type StudioInquiryFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Partial<Record<string, string>>
}

export async function submitStudioInquiry(
  _prev: StudioInquiryFormState,
  formData: FormData,
): Promise<StudioInquiryFormState> {
  const get = (key: string) => (formData.get(key) as string | null)?.trim() ?? ''

  // Honeypot — bots fill every field; real users never see this one.
  if (get('company_website')) return { success: true }

  const firstName    = get('first_name')
  const lastName     = get('last_name')
  const email        = get('email')
  const phone        = get('phone')
  const businessName = get('business_name')
  const websiteUrl   = get('website_url')
  const message      = get('message')
  const rawPlan      = get('plan')
  const plan: PlanSlug = (PLAN_SLUGS as readonly string[]).includes(rawPlan)
    ? (rawPlan as PlanSlug)
    : 'unsure'

  // Validate
  const fieldErrors: Partial<Record<string, string>> = {}
  if (!firstName) fieldErrors.first_name = 'First name is required.'
  if (!lastName) fieldErrors.last_name = 'Last name is required.'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'A valid email is required.'
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
      source:           'studio',
      first_name:       firstName,
      last_name:        lastName,
      email,
      phone:            phone || null,
      agency_name:      businessName || null,
      existing_website: websiteUrl || null,
      plan_interest:    plan,
      message:          message || null,
    })

    if (error) {
      console.error('[studio] insert failed', error)
      return {
        success: false,
        error: 'We could not send your inquiry. Please try again in a moment, or email us directly.',
      }
    }

    // Notify the operator. The DB insert already succeeded, so an email failure
    // should not surface as a form error — we log it and return success. The row
    // is still visible in /admin/consultations regardless.
    try {
      const { sendStudioInquiryNotification } = await import('@/lib/email')
      await sendStudioInquiryNotification({
        firstName,
        lastName,
        email,
        phone:        phone || null,
        businessName: businessName || null,
        websiteUrl:   websiteUrl || null,
        plan,
        message:      message || null,
      })
    } catch (emailErr) {
      console.error('[studio] admin notification email failed', emailErr)
    }

    return { success: true }
  } catch (e) {
    console.error('[studio] unexpected error', e)
    return {
      success: false,
      error: 'Something went wrong on our end. Please try again.',
    }
  }
}
