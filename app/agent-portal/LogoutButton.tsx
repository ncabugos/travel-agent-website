'use client'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  return (
    <button
      onClick={async () => {
        const supabase = createBrowserClient()
        await supabase.auth.signOut()
        router.push('/agent-portal/login')
      }}
      style={{
        display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none',
        textAlign: 'left', cursor: 'pointer', color: '#6b7280', fontSize: '13px', fontWeight: 500
      }}
    >
      Sign out
    </button>
  )
}
