'use client'
import { useState, ReactNode } from 'react'

export interface SidebarItem {
  href: string
  label: string
  icon: ReactNode
  badge?: string | number
}

interface SidebarProps {
  brand: string
  brandSub?: string
  items: SidebarItem[]
  bottomItems?: SidebarItem[]
  currentPath?: string
  avatar?: { name: string; email?: string; src?: string }
  onLogout?: () => void
}

export function Sidebar({ brand, brandSub, items, bottomItems, currentPath, avatar, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside style={{
      width: collapsed ? '68px' : '260px',
      minHeight: '100vh',
      backgroundColor: '#fff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Brand */}
      <div style={{
        padding: collapsed ? '20px 12px' : '20px 20px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '64px',
      }}>
        {!collapsed && (
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
              {brand}
            </div>
            {brandSub && (
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{brandSub}</div>
            )}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
            color: '#9ca3af', fontSize: '16px', lineHeight: 1,
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '12px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item) => (
          <SidebarLink key={item.href} item={item} active={currentPath === item.href} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom items */}
      {(bottomItems || onLogout) && (
        <div style={{ padding: '12px 8px', borderTop: '1px solid #f3f4f6' }}>
          {bottomItems?.map((item) => (
            <SidebarLink key={item.href} item={item} active={currentPath === item.href} collapsed={collapsed} />
          ))}
          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: collapsed ? '10px 12px' : '10px 12px',
                borderRadius: '8px', fontSize: '13px', color: '#6b7280',
                cursor: 'pointer', border: 'none', background: 'none',
                width: '100%', textAlign: 'left', fontWeight: 500,
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f3f4f6' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <span style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#6b7280' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </span>
              {!collapsed && 'Sign out'}
            </button>
          )}
        </div>
      )}

      {/* Avatar */}
      {avatar && !collapsed && (
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: '#111', color: '#fff', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '13px',
            fontWeight: 600, flexShrink: 0,
            backgroundImage: avatar.src ? `url(${avatar.src})` : undefined,
            backgroundSize: 'cover',
          }}>
            {!avatar.src && avatar.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {avatar.name}
            </div>
            {avatar.email && (
              <div style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {avatar.email}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}

function SidebarLink({ item, active, collapsed }: { item: SidebarItem; active: boolean; collapsed: boolean }) {
  return (
    <a
      href={item.href}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: collapsed ? '10px 12px' : '10px 12px',
        borderRadius: '8px', fontSize: '13px',
        color: active ? '#111' : '#4b5563',
        backgroundColor: active ? '#f3f4f6' : 'transparent',
        textDecoration: 'none', fontWeight: active ? 600 : 500,
        transition: 'background-color 0.15s',
        position: 'relative',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#f9fafb' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
      title={collapsed ? item.label : undefined}
    >
      <span style={{ fontSize: '16px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && (
        <>
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge !== undefined && (
            <span style={{
              fontSize: '11px', fontWeight: 600, color: '#fff',
              backgroundColor: '#111', borderRadius: '10px',
              padding: '2px 8px', minWidth: '20px', textAlign: 'center',
            }}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </a>
  )
}
