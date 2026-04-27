import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendAdminOnboardingNotification, sendAgentWelcomeEmail } from '@/lib/email'

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Look up agent by email
    const { data: agent } = await (supabase
      .from('agents') as any)
      .select('id, email, agency_name, full_name')
      .eq('email', session.user.email ?? '')
      .single()

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Update agent row with all onboarding data
    const { error: updateError } = await (supabase
      .from('agents') as any)
      .update({
        full_name: body.full_name,
        agency_name: body.agency_name,
        phone: body.phone || null,
        avatar_url: body.avatar_url || null,
        tagline: body.tagline || null,
        template: body.template || 'frontend',
        bio: body.bio || null,
        travel_specialties: body.travel_specialties || [],
        destination_specialties: body.destination_specialties || [],
        preferred_suppliers: body.preferred_suppliers || [],
        travel_types: body.travel_types || [],
        instagram_url: body.instagram_url || null,
        facebook_url: body.facebook_url || null,
        youtube_url: body.youtube_url || null,
        tiktok_url: body.tiktok_url || null,
        website_url: body.website_url || null,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq('id', agent.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Create admin notification so Nick can follow up
    await (supabase
      .from('admin_notifications') as any)
      .insert({
        type: 'onboarding_complete',
        title: `New agent onboarding: ${body.agency_name || agent.agency_name}`,
        body: `${body.full_name || agent.full_name} (${agent.email}) has completed onboarding.\nTemplate: ${body.template || 'frontend'}\nReady for follow-up, review, and site provisioning.`,
        metadata: {
          agent_id: agent.id,
          email: agent.email,
          agency_name: body.agency_name || agent.agency_name,
          full_name: body.full_name || agent.full_name,
          template: body.template || 'frontend',
          tier: body.tier || 'starter',
        },
      })

    // Send onboarding emails (non-blocking — don't fail the request)
    const emailAgent = {
      full_name: body.full_name || agent.full_name,
      agency_name: body.agency_name || agent.agency_name,
      email: agent.email,
      template: body.template || 'frontend',
      tier: body.tier || 'starter',
      phone: body.phone || null,
    }

    Promise.allSettled([
      sendAdminOnboardingNotification(emailAgent),
      sendAgentWelcomeEmail(emailAgent),
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`[onboarding] Email ${i} failed:`, r.reason)
        }
      })
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 })
  }
}
