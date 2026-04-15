'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar, SidebarItem } from '@/components/dashboard/Sidebar'
import { DashboardShell, DashboardContent } from '@/components/dashboard/DashboardShell'
import { createClient } from '@/lib/supabase/client'
import { Icons } from '@/components/dashboard/Icons'

const navItems: SidebarItem[] = [
  { href: '/agent-portal', label: 'Dashboard', icon: Icons.dashboard },
  { href: '/agent-portal/blog', label: 'My Journal', icon: Icons.edit },
  { href: '/agent-portal/blog-settings', label: 'Blog Settings', icon: Icons.folder },
  { href: '/agent-portal/requests', label: 'Edit Requests', icon: Icons.inbox },
  { href: '/agent-portal/profile', label: 'Profile', icon: Icons.user },
  { href: '/agent-portal/billing', label: 'Billing', icon: Icons.creditCard },
]

export default function AgentPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Don't wrap login or onboarding pages in the dashboard shell
  if (pathname === '/agent-portal/login' || pathname === '/agent-portal/onboarding') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/agent-portal/login')
  }

  return (
    <DashboardShell>
      <Sidebar
        brand="EliteAdvisorHub"
        brandSub="Advisor Portal"
        items={navItems}
        currentPath={pathname}
        onLogout={handleLogout}
      />
      <DashboardContent>
        {children}
      </DashboardContent>
    </DashboardShell>
  )
}
