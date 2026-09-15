'use client'
import { useSyncExternalStore, ReactNode } from 'react'
import Link from 'next/link'

export interface SidebarItem {
  href: string
  label: string
  icon: ReactNode
  badge?: string | number
}

export interface SidebarSection {
  /** Optional small uppercase heading above the group. */
  label?: string
  items: SidebarItem[]
}

interface SidebarProps {
  brand: string
  brandSub?: string
  /** Optional logo image (wordmark). If set, replaces the plain text brand. */
  brandLogoSrc?: string
  /** Flat list of links (agent portal). Ignored when `sections` is given. */
  items?: SidebarItem[]
  /** Grouped links with section headings (admin console). */
  sections?: SidebarSection[]
  bottomItems?: SidebarItem[]
  currentPath?: string
  avatar?: { name: string; email?: string; src?: string }
  onLogout?: () => void
}

const COLLAPSED_KEY = 'eah-sidebar-collapsed'

// Collapsed state lives in localStorage so it survives navigation. Read through
// useSyncExternalStore: the server snapshot is always "expanded", so the first
// client render matches the HTML and the stored value applies right after.
const collapseListeners = new Set<() => void>()
function subscribeCollapsed(cb: () => void) {
  collapseListeners.add(cb)
  window.addEventListener('storage', cb)
  return () => { collapseListeners.delete(cb); window.removeEventListener('storage', cb) }
}
function readCollapsed() {
  try { return localStorage.getItem(COLLAPSED_KEY) === '1' } catch { return false }
}
function writeCollapsed(value: boolean) {
  try { localStorage.setItem(COLLAPSED_KEY, value ? '1' : '0') } catch {}
  collapseListeners.forEach(cb => cb())
}

/**
 * Active when the path matches exactly, or when it is a descendant of the
 * link (so /admin/agents/123 keeps "Agents" lit). Root links like /admin only
 * match exactly, otherwise they would always be active.
 */
function isActive(href: string, currentPath?: string) {
  if (!currentPath) return false
  if (currentPath === href) return true
  const isRoot = href.split('/').filter(Boolean).length <= 1
  return !isRoot && currentPath.startsWith(href + '/')
}

export function Sidebar({
  brand, brandSub, brandLogoSrc, items, sections, bottomItems, currentPath, avatar, onLogout,
}: SidebarProps) {
  const collapsed = useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false)
  const toggle = () => writeCollapsed(!collapsed)

  const groups: SidebarSection[] = sections ?? [{ items: items ?? [] }]

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
      position: 'sticky',
      top: 0,
      alignSelf: 'flex-start',
      height: '100vh',
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
            {brandLogoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandLogoSrc}
                alt={brand}
                style={{ height: '22px', width: 'auto', display: 'block' }}
              />
            ) : (
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
                {brand}
              </div>
            )}
            {brandSub && (
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>{brandSub}</div>
            )}
          </div>
        )}
        <button
          onClick={toggle}
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
      <nav style={{ padding: '12px 8px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {groups.map((group, gi) => (
          <div key={group.label ?? gi} style={{ marginTop: gi === 0 ? 0 : '14px' }}>
            {group.label && !collapsed && (
              <div style={{
                padding: '0 12px 6px', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af',
              }}>
                {group.label}
              </div>
            )}
            {group.label && collapsed && gi !== 0 && (
              <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '0 8px 8px' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {group.items.map((item) => (
                <SidebarLink key={item.href} item={item} active={isActive(item.href, currentPath)} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom items */}
      {(bottomItems || onLogout) && (
        <div style={{ padding: '12px 8px', borderTop: '1px solid #f3f4f6' }}>
          {bottomItems?.map((item) => (
            <SidebarLink key={item.href} item={item} active={isActive(item.href, currentPath)} collapsed={collapsed} />
          ))}
          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px', fontSize: '13px', color: '#6b7280',
                cursor: 'pointer', border: 'none', background: 'none',
                width: '100%', textAlign: 'left', fontWeight: 500,
                transition: 'background-color 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f3f4f6' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              title={collapsed ? 'Sign out' : undefined}
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
  const showBadge = item.badge !== undefined && item.badge !== 0 && item.badge !== '0'
  return (
    <Link
      href={item.href}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 12px',
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
      <span style={{ fontSize: '16px', width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && (
        <>
          <span style={{ flex: 1 }}>{item.label}</span>
          {showBadge && (
            <span style={{
              fontSize: '11px', fontWeight: 600, color: '#fff',
              backgroundColor: '#7c3aed', borderRadius: '10px',
              padding: '2px 8px', minWidth: '20px', textAlign: 'center',
            }}>
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && showBadge && (
        <span style={{
          position: 'absolute', top: '6px', right: '10px',
          width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#7c3aed',
        }} />
      )}
    </Link>
  )
}
