import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * PATCH /api/admin/agents/[agentId]
 * General-purpose agent field update for admin.
 * Accepts any subset of editable fields.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params
  const body = await request.json()

  // Scalar fields admin can update.
  const ALLOWED_FIELDS = [
    // identity / account
    'custom_domain', 'template', 'tier', 'role',
    'full_name', 'agency_name', 'email', 'phone',
    'subscription_status',
    // public profile
    'tagline', 'bio', 'avatar_url',
    // socials
    'instagram_url', 'facebook_url', 'youtube_url', 'tiktok_url', 'website_url',
  ]

  // TEXT[] array fields — always coerce empty strings to null and strip
  // empty array entries so stray blank inputs don't pollute the profile.
  const ALLOWED_ARRAY_FIELDS = [
    'travel_specialties', 'destination_specialties',
    'preferred_suppliers', 'travel_types',
  ]

  const updates: Record<string, unknown> = {}
  for (const key of ALLOWED_FIELDS) {
    if (key in body) {
      updates[key] = body[key] === '' ? null : body[key]
    }
  }
  for (const key of ALLOWED_ARRAY_FIELDS) {
    if (key in body) {
      const v = body[key]
      if (v == null) {
        updates[key] = null
      } else if (Array.isArray(v)) {
        updates[key] = v.map((s) => String(s).trim()).filter(Boolean)
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agents')
    .update(updates)
    .eq('id', agentId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
