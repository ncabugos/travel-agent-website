interface BadgeProps {
  label: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

const variantStyles: Record<string, { bg: string; color: string }> = {
  default: { bg: '#f3f4f6', color: '#374151' },
  success: { bg: '#dcfce7', color: '#166534' },
  warning: { bg: '#fef3c7', color: '#92400e' },
  danger:  { bg: '#fee2e2', color: '#991b1b' },
  info:    { bg: '#dbeafe', color: '#1e40af' },
}

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  const style = variantStyles[variant]
  const fontSize = size === 'sm' ? '11px' : '12px'
  const padding = size === 'sm' ? '2px 8px' : '4px 10px'

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: style.bg,
      color: style.color,
      fontSize,
      fontWeight: 600,
      padding,
      borderRadius: '9999px',
      whiteSpace: 'nowrap',
      lineHeight: 1.4,
    }}>
      {label}
    </span>
  )
}
