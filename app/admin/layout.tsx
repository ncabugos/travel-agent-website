'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar, SidebarItem } from '@/components/dashboard/Sidebar'
import { DashboardShell, DashboardContent } from '@/components/dashboard/DashboardShell'
import { createClient } from '@/lib/supabase/client'
import { Icons } from '@/components/dashboard/Icons'

const navItems: SidebarItem[] = [
  { href: '/admin', label: 'Dashboard', icon: Icons.dashboard },
  { href: '/admin/agents', label: 'Agents', icon: Icons.users },
  { href: '/admin/consultations', label: 'Consultations', icon: Icons.inbox },
  { href: '/admin/blog', label: 'Journal Posts', icon: Icons.edit },
  { href: '/admin/categories', label: 'Categories', icon: Icons.tag },
  { href: '/admin/requests', label: 'Edit Requests', icon: Icons.inbox },
]

const bottomItems: SidebarItem[] = [
  { href: '/admin/settings', label: 'Settings', icon: Icons.settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Don't wrap login page in the dashboard shell
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <DashboardShell>
      <Sidebar
        brand="EliteAdvisorHub"
        brandSub="Admin Console"
        items={navItems}
        bottomItems={bottomItems}
        currentPath={pathname}
        avatar={{ name: 'Admin', email: 'cabugosb3@gmail.com' }}
        onLogout={handleLogout}
      />
      <DashboardContent>
        {children}
      </DashboardContent>
    </DashboardShell>
  )
}
