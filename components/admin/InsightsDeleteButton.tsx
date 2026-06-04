'use client'
import { useRouter } from 'next/navigation'

export function InsightsDeleteButton({ id }: { id: string }) {
  const router = useRouter()
  return (
    <button
      onClick={async () => {
        if (!confirm('Delete this Insights post?')) return
        await fetch(`/api/admin/marketing-posts/${id}`, { method: 'DELETE' })
        router.refresh()
      }}
      style={{ fontSize: 13, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      Delete
    </button>
  )
}
