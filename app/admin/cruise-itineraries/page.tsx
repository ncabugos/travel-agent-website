import { getAdminCruiseCatalog } from '@/lib/cruise-itineraries'
import { CruiseItineraryManager } from '@/components/admin/CruiseItineraryManager'
import { TopBar } from '@/components/dashboard/TopBar'
import { PageContent } from '@/components/dashboard/DashboardShell'

export const dynamic = 'force-dynamic'

/**
 * Admin · Cruise Itineraries — the shared itinerary catalog and its
 * collections. Edits here reach every advisor site with cruise pages, except
 * itineraries a site has opted out of.
 */
export default async function AdminCruiseItinerariesPage() {
  const { lines, collections, itineraries } = await getAdminCruiseCatalog()

  return (
    <>
      <TopBar
        title="Cruise Itineraries"
        subtitle={`${itineraries.length} itineraries across ${lines.length} cruise lines. Changes appear on every advisor site with cruise pages.`}
      />
      <PageContent>
        <CruiseItineraryManager lines={lines} collections={collections} itineraries={itineraries} />
      </PageContent>
    </>
  )
}
