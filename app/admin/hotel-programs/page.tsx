import { getHotelPrograms } from '@/lib/hotel-programs'
import { HotelProgramEditor } from '@/components/admin/HotelProgramEditor'

export const dynamic = 'force-dynamic'

/**
 * Admin · Hotel Programs — manage the shared supplier catalog's logos and
 * client-facing copy. hotel_programs is the single source of truth, so edits
 * here propagate to every tenant site (demo + live).
 */
export default async function AdminHotelProgramsPage() {
  const programs = await getHotelPrograms()

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>Hotel Programs</h1>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0, maxWidth: 680 }}>
          The shared supplier catalog. Upload the black (light backgrounds) and white (dark
          backgrounds) logo variants and edit the client-facing copy. Changes save to the
          database and reflect across every advisor site.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {programs.map((program) => (
          <HotelProgramEditor key={program.id} program={program} />
        ))}
      </div>
    </div>
  )
}
