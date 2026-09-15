import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { getAdminNotificationEmail } from '@/lib/platform-settings'

async function loadSettings(adminId: string) {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('agents')
    .select('full_name, email')
    .eq('id', adminId)
    .single()
  if (error) return { error: error.message }

  return {
    full_name: data.full_name ?? '',
    email: data.email ?? '',
    notification_email: await getAdminNotificationEmail(),
  }
}

export async function GET() {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await loadSettings(adminUser.id)
  if ('error' in settings) return NextResponse.json(settings, { status: 500 })
  return NextResponse.json(settings)
}

export async function PATCH(request: Request) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const fullName = body?.full_name === undefined ? undefined : String(body.full_name).trim()
  const notificationEmail = body?.notification_email === undefined
    ? undefined
    : String(body.notification_email).trim().toLowerCase()

  if (fullName !== undefined && !fullName) {
    return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
  }
  if (notificationEmail !== undefined && !notificationEmail.includes('@')) {
    return NextResponse.json({ error: 'A valid alert email is required.' }, { status: 400 })
  }
  if (fullName === undefined && notificationEmail === undefined) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (fullName !== undefined) {
    const { error } = await supabase
      .from('agents')
      .update({ full_name: fullName })
      .eq('id', adminUser.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (notificationEmail !== undefined) {
    const { error } = await supabase
      .from('platform_settings')
      .upsert(
        { key: 'notification_email', value: notificationEmail, updated_at: new Date().toISOString() },
        { onConflict: 'key' },
      )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const settings = await loadSettings(adminUser.id)
  if ('error' in settings) return NextResponse.json(settings, { status: 500 })
  return NextResponse.json(settings)
}
