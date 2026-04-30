import { notFound } from 'next/navigation'
import { getAgentProfile } from '@/lib/suppliers'
import { buildMetadata } from '@/lib/seo'
import { TenantLegalDocPage } from '@/components/legal/TenantLegalDocPage'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return { title: 'Privacy Policy' }
  return buildMetadata({
    agent,
    title: 'Privacy Policy',
    description: `How ${agent.agency_name} collects, uses and protects information about clients and visitors of our website.`,
    path: 'privacy-policy',
  })
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) notFound()

  return (
    <TenantLegalDocPage
      agentId={agentId}
      file="privacy-policy.md"
      pageTitle="Privacy Policy"
    />
  )
}
