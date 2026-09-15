import { AdminShell, type AdminNavCounts } from '@/components/admin/AdminShell'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

/**
 * Server half of the admin layout. Resolves the signed-in operator and the
 * badge counts once per navigation, then hands them to the client shell.
 * On the public auth pages there is no session, so this is a single cheap
 * check and the shell renders the page bare.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminUser = await getCurrentSuperAdmin()

  let admin: { name: string; email: string } | null = null
  let counts: AdminNavCounts = { pendingRequests: 0, newConsultations: 0, unreadNotifications: 0 }

  if (adminUser) {
    const supabase = createServiceClient()
    const [profile, requests, consultations, notifications] = await Promise.all([
      supabase.from('agents').select('full_name').eq('id', adminUser.id).maybeSingle(),
      supabase.from('edit_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('consultation_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('admin_notifications').select('*', { count: 'exact', head: true }).eq('is_read', false),
    ])
    admin = { name: profile.data?.full_name || 'Admin', email: adminUser.email }
    counts = {
      pendingRequests: requests.count ?? 0,
      newConsultations: consultations.count ?? 0,
      unreadNotifications: notifications.count ?? 0,
    }
  }

  return (
    <AdminShell admin={admin} counts={counts}>
      {children}
    </AdminShell>
  )
}
