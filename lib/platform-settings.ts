import { createServiceClient } from '@/lib/supabase/service'

/**
 * Operator-level key/value settings (public.platform_settings).
 * Server-only: uses the service-role client.
 */
export async function getPlatformSetting(key: string): Promise<string | null> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('platform_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  return data?.value ?? null
}

/** Inbox for signup, onboarding, and inquiry alerts. */
export async function getAdminNotificationEmail(): Promise<string> {
  return (await getPlatformSetting('notification_email')) || 'cabugosb3@gmail.com'
}
