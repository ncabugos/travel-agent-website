import { ReactNode } from 'react'

interface TopBarProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header style={{
      padding: '24px 32px',
      borderBottom: '1px solid #f3f4f6',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '72px',
    }}>
      <div>
        <h1 style={{
          margin: 0, fontSize: '20px', fontWeight: 700,
          color: '#111', letterSpacing: '-0.02em',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {actions}
        </div>
      )}
    </header>
  )
}
