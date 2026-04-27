import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: ReactNode
}

export function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardProps) {
  const changeColor = changeType === 'positive' ? '#16a34a'
    : changeType === 'negative' ? '#dc2626'
    : '#6b7280'

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#6b7280' }}>
          {title}
        </span>
        {icon && (
          <span style={{ fontSize: '18px', color: '#9ca3af' }}>{icon}</span>
        )}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {change && (
        <div style={{ fontSize: '12px', color: changeColor, fontWeight: 500 }}>
          {change}
        </div>
      )}
    </div>
  )
}
