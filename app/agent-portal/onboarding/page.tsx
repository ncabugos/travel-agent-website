import { createClient } from '@/lib/supabase/server'
import { OnboardingWizard, type SupplierGroup } from './OnboardingWizard'

export const dynamic = 'force-dynamic'

/**
 * Loads the live supplier catalog so the wizard's Preferred Suppliers chips
 * always match what the platform actually offers. The wizard itself is a
 * client component; the agent prefill still happens there.
 */
export default async function OnboardingPage() {
  const supabase = await createClient()
  const [hotels, cruises, journeys] = await Promise.all([
    supabase.from('hotel_programs').select('name').eq('is_active', true).order('name'),
    supabase.from('cruise_lines').select('name').eq('is_active', true).order('name'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from('private_journeys') as any).select('name').eq('is_active', true).order('name'),
  ])

  const names = (rows: { name: string }[] | null) => (rows ?? []).map(r => r.name)
  const suppliers: SupplierGroup[] = [
    { label: 'Hotel programs', items: names(hotels.data) },
    { label: 'Cruise lines', items: names(cruises.data) },
    { label: 'Tour operators', items: names(journeys.data) },
  ]

  return <OnboardingWizard suppliers={suppliers} />
}
