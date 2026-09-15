'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar, type SidebarSection } from '@/components/dashboard/Sidebar'
import { DashboardShell, DashboardContent } from '@/components/dashboard/DashboardShell'
import { createClient } from '@/lib/supabase/client'
import { Icons } from '@/components/dashboard/Icons'

export interface AdminNavCounts {
  pendingRequests: number
  newConsultations: number
  unreadNotifications: number
}

interface AdminShellProps {
  admin: { name: string; email: string } | null
  counts: AdminNavCounts
  children: React.ReactNode
}

const PUBLIC_PATHS = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']

/**
 * Client half of the admin layout: owns the pathname, the sign-out action, and
 * the grouped navigation. Counts and identity come from the server layout.
 */
export function AdminShell({ admin, counts, children }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>
  }

  const sections: SidebarSection[] = [
    {
      items: [
        { href: '/admin', label: 'Dashboard', icon: Icons.dashboard, badge: counts.unreadNotifications },
      ],
    },
    {
      label: 'Advisors',
      items: [
        { href: '/admin/agents', label: 'Agents', icon: Icons.users },
        { href: '/admin/requests', label: 'Edit Requests', icon: Icons.inbox, badge: counts.pendingRequests },
        { href: '/admin/consultations', label: 'Consultations', icon: Icons.calendar, badge: counts.newConsultations },
      ],
    },
    {
      label: 'Content',
      items: [
        { href: '/admin/blog', label: 'Journal Posts', icon: Icons.edit },
        { href: '/admin/categories', label: 'Categories', icon: Icons.folder },
        { href: '/admin/insights', label: 'Insights', icon: Icons.newspaper },
      ],
    },
    {
      label: 'Catalog',
      items: [
        { href: '/admin/hotel-programs', label: 'Hotel Programs', icon: Icons.building },
        { href: '/admin/cruise-lines', label: 'Cruise Lines', icon: Icons.ship },
        { href: '/admin/promos', label: 'Promo Banners', icon: Icons.megaphone },
      ],
    },
  ]

  const handleLogout = async () => {
    await createClient().auth.signOut()
    router.push('/admin/login')
  }

  return (
    <DashboardShell>
      <Sidebar
        brand="Elite Advisor Hub"
        brandSub="Admin Console"
        brandLogoSrc="/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-black.png"
        sections={sections}
        bottomItems={[{ href: '/admin/settings', label: 'Settings', icon: Icons.settings }]}
        currentPath={pathname}
        avatar={admin ? { name: admin.name, email: admin.email } : undefined}
        onLogout={handleLogout}
      />
      <DashboardContent>
        {children}
      </DashboardContent>
    </DashboardShell>
  )
}
