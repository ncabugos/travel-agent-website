import { getCruiseLines } from '@/lib/cruise-lines'
import { CruiseLineEditor } from '@/components/admin/CruiseLineEditor'

export const dynamic = 'force-dynamic'

/**
 * Admin · Cruise Lines — manage the shared cruise catalog's logos and
 * client-facing copy. cruise_lines is the single source of truth, so edits
 * here propagate to every tenant site (demo + live).
 */
export default async function AdminCruiseLinesPage() {
  const lines = await getCruiseLines()

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>Cruise Lines</h1>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0, maxWidth: 680 }}>
          The shared cruise catalog. Upload the black (light backgrounds) and white (dark
          backgrounds) logo variants and edit the client-facing copy. Changes save to the
          database and reflect across every advisor site.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {lines.map((line) => (
          <CruiseLineEditor key={line.id} line={line} />
        ))}
      </div>
    </div>
  )
}
