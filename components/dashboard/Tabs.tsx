'use client'
import { useState, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)
  const current = tabs.find(t => t.id === active)

  return (
    <div>
      <div style={{
        display: 'flex', gap: '0', borderBottom: '1px solid #e5e7eb',
        marginBottom: '24px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: tab.id === active ? 600 : 500,
              color: tab.id === active ? '#111' : '#6b7280',
              background: 'none',
              border: 'none',
              borderBottom: tab.id === active ? '2px solid #111' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{current?.content}</div>
    </div>
  )
}
