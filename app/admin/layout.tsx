import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Eden Admin' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f4f6f8' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside style={{ width: '220px', background: '#fff', borderRight: '1px solid #e5e7eb', padding: '0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            {/* Logo */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>EDEN Admin</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Blog Management</div>
            </div>
            {/* Nav */}
            <nav style={{ padding: '12px 8px', flex: 1 }}>
              <NavItem href="/admin/blog" label="Journal Posts" icon="📝" />
            </nav>
            {/* Footer */}
            <div style={{ padding: '12px 8px', borderTop: '1px solid #f3f4f6' }}>
              <LogoutButton />
            </div>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, overflow: 'auto' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 12px', borderRadius: '8px',
        fontSize: '13px', color: '#374151', textDecoration: 'none',
        fontWeight: 500,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f3f4f6' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <span>{icon}</span> {label}
    </a>
  )
}

function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch('/api/admin/login', { method: 'DELETE' })
        window.location.href = '/admin/login'
      }}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 12px', borderRadius: '8px',
        fontSize: '13px', color: '#6b7280', cursor: 'pointer',
        border: 'none', background: 'none', width: '100%', textAlign: 'left',
        fontWeight: 500,
      }}
    >
      <span>🚪</span> Sign out
    </button>
  )
}
