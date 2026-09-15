import { getHotelPrograms } from '@/lib/hotel-programs'
import { HotelProgramEditor } from '@/components/admin/HotelProgramEditor'
import { TopBar } from '@/components/dashboard/TopBar'
import { PageContent } from '@/components/dashboard/DashboardShell'

export const dynamic = 'force-dynamic'

/**
 * Admin · Hotel Programs — manage the shared supplier catalog's logos and
 * client-facing copy. hotel_programs is the single source of truth, so edits
 * here propagate to every tenant site (demo + live).
 */
export default async function AdminHotelProgramsPage() {
  const programs = await getHotelPrograms()

  return (
    <>
      <TopBar
        title="Hotel Programs"
        subtitle={`${programs.length} programs in the shared catalog. Logos and copy here appear on every advisor site.`}
      />
      <PageContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {programs.map((program) => (
            <HotelProgramEditor key={program.id} program={program} />
          ))}
        </div>
      </PageContent>
    </>
  )
}
