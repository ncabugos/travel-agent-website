import { redirect } from 'next/navigation'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'
import { getAdminNotificationEmail } from '@/lib/platform-settings'
import { TopBar } from '@/components/dashboard/TopBar'
import { PageContent } from '@/components/dashboard/DashboardShell'
import { SettingsForm } from '@/components/admin/SettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const admin = await getCurrentSuperAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createServiceClient()
  const [{ data: agent }, notificationEmail] = await Promise.all([
    supabase.from('agents').select('full_name').eq('id', admin.id).maybeSingle(),
    getAdminNotificationEmail(),
  ])

  return (
    <>
      <TopBar title="Settings" subtitle="Account, security, and notifications" />
      <PageContent maxWidth="760px">
        <SettingsForm
          initial={{
            full_name: agent?.full_name ?? '',
            email: admin.email,
            notification_email: notificationEmail,
          }}
        />
      </PageContent>
    </>
  )
}
