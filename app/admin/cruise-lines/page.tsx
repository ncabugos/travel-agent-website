import { getCruiseLines } from '@/lib/cruise-lines'
import { CruiseLineEditor } from '@/components/admin/CruiseLineEditor'
import { TopBar } from '@/components/dashboard/TopBar'
import { PageContent } from '@/components/dashboard/DashboardShell'

export const dynamic = 'force-dynamic'

/**
 * Admin · Cruise Lines — manage the shared cruise catalog's logos and
 * client-facing copy. cruise_lines is the single source of truth, so edits
 * here propagate to every tenant site (demo + live).
 */
export default async function AdminCruiseLinesPage() {
  const lines = await getCruiseLines()

  return (
    <>
      <TopBar
        title="Cruise Lines"
        subtitle={`${lines.length} cruise lines in the shared catalog. Logos and copy here appear on every advisor site.`}
      />
      <PageContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {lines.map((line) => (
            <CruiseLineEditor key={line.id} line={line} />
          ))}
        </div>
      </PageContent>
    </>
  )
}
