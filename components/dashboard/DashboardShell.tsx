import { ReactNode } from 'react'

interface DashboardShellProps {
  children: ReactNode
}

/**
 * Wrapper that sets the base dashboard layout context:
 * font family, background, and flex row for sidebar + content.
 */
export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f9fafb',
      color: '#111',
    }}>
      {children}
    </div>
  )
}

/**
 * The main content area that sits beside the sidebar.
 */
export function DashboardContent({ children }: { children: ReactNode }) {
  return (
    <main style={{
      flex: 1,
      overflow: 'auto',
      minHeight: '100vh',
    }}>
      {children}
    </main>
  )
}

/**
 * Scrollable page content area with max-width constraint.
 */
export function PageContent({ children, maxWidth = '1200px' }: { children: ReactNode; maxWidth?: string }) {
  return (
    <div style={{
      padding: '32px',
      maxWidth,
      margin: '0 auto',
    }}>
      {children}
    </div>
  )
}
