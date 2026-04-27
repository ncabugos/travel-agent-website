import { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  padding?: string
  style?: React.CSSProperties
}

export function Card({ title, subtitle, actions, children, padding = '24px', style }: CardProps) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden',
      ...style,
    }}>
      {(title || actions) && (
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            {title && (
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>{subtitle}</p>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>
          )}
        </div>
      )}
      <div style={{ padding }}>
        {children}
      </div>
    </div>
  )
}
