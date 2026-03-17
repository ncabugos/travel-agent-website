'use server'

export type ContactFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Partial<Record<string, string>>
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const get = (key: string) => (formData.get(key) as string | null)?.trim() ?? ''

  const agentId    = get('agent_id')
  const firstName  = get('first_name')
  const lastName   = get('last_name')
  const email      = get('email')
  const phone      = get('phone')
  const destination= get('destination')
  const vacType    = get('vacation_type')
  const numTrav    = get('num_travelers')
  const advisorPref= get('advisor_pref')
  const message    = get('message')

  // Simple validation
  const fieldErrors: Partial<Record<string, string>> = {}
  if (!firstName) fieldErrors.first_name = 'First name is required.'
  if (!lastName)  fieldErrors.last_name  = 'Last name is required.'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'A valid email is required.'

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please correct the errors below.', fieldErrors }
  }

  // Write to Supabase if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()

      const fullMessage = [
        vacType    ? `Vacation type: ${vacType}`     : null,
        numTrav    ? `Travelers: ${numTrav}`          : null,
        advisorPref? `Advisor preference: ${advisorPref}` : null,
        message    ? message                          : null,
      ].filter(Boolean).join('\n') || null

      const payload = {
        agent_id:    agentId || null,
        name:        `${firstName} ${lastName}`,
        email,
        phone:       phone || null,
        destination: destination || null,
        message:     fullMessage,
        status:      'new',
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase.from('inquiries') as any).insert(payload)

      if (dbError) {
        console.error('Inquiry DB error:', dbError)
        return { success: false, error: 'Something went wrong. Please try again.' }
      }
    } catch (e) {
      console.error('Supabase unavailable:', e)
      // Fail gracefully — treat as success
    }
  }

  return { success: true }
}
