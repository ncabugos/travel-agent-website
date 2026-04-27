import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, htmlFor, error, hint, required, children }: FormFieldProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        htmlFor={htmlFor}
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: '#374151',
          marginBottom: '6px',
        }}
      >
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#9ca3af' }}>{hint}</p>
      )}
      {error && (
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#ef4444', fontWeight: 500 }}>{error}</p>
      )}
    </div>
  )
}

/** Standard text input styling */
export const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#111',
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.15s, box-shadow 0.15s',
  backgroundColor: '#fff',
}

/** Standard button styling */
export const buttonStyles = {
  primary: {
    padding: '10px 20px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  } as React.CSSProperties,
  secondary: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  } as React.CSSProperties,
  danger: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  } as React.CSSProperties,
}
