'use server'

/**
 * Server action for the public Founding Advisor beta waitlist form at /beta.
 *
 * Writes to the shared consultation_requests table with source='beta-waitlist'
 * so the admin inbox (/admin/consultations) can tell waitlist signups apart
 * from Custom/Agency sales leads. Mirrors the insert pattern in
 * lib/actions/consultation.ts (anon-key server client, RLS "public insert").
 *
 * The advisor's business name maps to agency_name and their current site to
 * existing_website — both already exist on the table and are surfaced in the
 * admin list view.
 */

export type BetaWaitlistFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Partial<Record<string, string>>
}

export async function submitBetaWaitlist(
  _prev: BetaWaitlistFormState,
  formData: FormData,
): Promise<BetaWaitlistFormState> {
  const get = (key: string) => (formData.get(key) as string | null)?.trim() ?? ''

  const firstName    = get('first_name')
  const lastName     = get('last_name')
  const email        = get('email')
  const businessName = get('business_name')
  const websiteUrl   = get('website_url')

  // Validate
  const fieldErrors: Partial<Record<string, string>> = {}
  if (!firstName) fieldErrors.first_name = 'First name is required.'
  if (!lastName) fieldErrors.last_name = 'Last name is required.'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'A valid email is required.'
  }
  if (!businessName) fieldErrors.business_name = 'Your business name is required.'

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
      source:           'beta-waitlist',
      first_name:       firstName,
      last_name:        lastName,
      email,
      agency_name:      businessName,
      existing_website: websiteUrl || null,
    })

    if (error) {
      console.error('[beta-waitlist] insert failed', error)
      return {
        success: false,
        error: 'We could not add you to the waitlist. Please try again in a moment, or email us directly.',
      }
    }

    return { success: true }
  } catch (e) {
    console.error('[beta-waitlist] unexpected error', e)
    return {
      success: false,
      error: 'Something went wrong on our end. Please try again.',
    }
  }
}
