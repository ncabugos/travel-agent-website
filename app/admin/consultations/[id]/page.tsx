import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ConsultationDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('consultation_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()
  const r = data as Record<string, any>

  return (
    <div style={{ padding: '24px 32px', maxWidth: '960px' }}>
      <Link
        href="/admin/consultations"
        style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}
      >
        ← All consultation requests
      </Link>

      <div style={{ marginTop: '16px', marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>
          {r.first_name} {r.last_name}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
          Submitted {new Date(r.created_at).toLocaleString()} · Tier: <strong>{r.tier ?? '—'}</strong> · Status: <strong>{r.status}</strong>
        </p>
      </div>

      <Section title="Contact">
        <Row label="Email" value={r.email} />
        <Row label="Phone" value={r.phone} />
        <Row label="Role / Title" value={r.role_title} />
      </Section>

      <Section title="Inquiry">
        <Row label="Tier of interest" value={r.tier} />
        <Row label="Timeline" value={r.timeline} />
        <Row label="Heard from" value={r.heard_from} />
        <Row label="Message" value={r.message} multiline />
      </Section>

      {r.tier === 'agency' && (
        <Section title="Agency details">
          <Row label="Agency name" value={r.agency_name} />
          <Row label="Agency website" value={r.agency_website} />
          <Row
            label="Address"
            value={[r.agency_street, r.agency_city, r.agency_region, r.agency_postal, r.agency_country]
              .filter(Boolean)
              .join(', ') || null}
          />
          <Row label="Number of advisors" value={r.num_advisors?.toString()} />
          <Row label="Years in business" value={r.years_in_business?.toString()} />
          <Row label="Host affiliation" value={r.host_affiliation} />
          <Row
            label="Specialties"
            value={Array.isArray(r.specialties) ? r.specialties.join(', ') : null}
          />
          <Row label="Existing website" value={r.existing_website} />
          <Row label="Wants custom domain" value={formatBool(r.wants_custom_domain)} />
          <Row label="Wants individual advisor pages" value={formatBool(r.wants_advisor_pages)} />
          <Row label="Wants team training" value={formatBool(r.wants_team_training)} />
        </Section>
      )}

      {r.tier === 'custom' && (
        <Section title="Custom build details">
          <Row label="Design references" value={r.design_references} multiline />
          <Row label="Additional pages" value={r.additional_pages} multiline />
          <Row label="Integrations needed" value={r.integrations_needed} multiline />
        </Section>
      )}

      {r.notes && (
        <Section title="Internal notes">
          <Row label="Notes" value={r.notes} multiline />
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '20px 24px',
        marginBottom: '16px',
      }}
    >
      <h2
        style={{
          margin: '0 0 12px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </h2>
      <dl style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '10px 20px', margin: 0 }}>
        {children}
      </dl>
    </div>
  )
}

function Row({
  label,
  value,
  multiline,
}: {
  label: string
  value: string | null | undefined
  multiline?: boolean
}) {
  return (
    <>
      <dt style={{ fontSize: '13px', color: '#6b7280' }}>{label}</dt>
      <dd
        style={{
          margin: 0,
          fontSize: '14px',
          color: value ? '#1a1a1a' : '#9ca3af',
          whiteSpace: multiline ? 'pre-wrap' : 'normal',
        }}
      >
        {value || '—'}
      </dd>
    </>
  )
}

function formatBool(v: boolean | null | undefined): string | null {
  if (v === true) return 'Yes'
  if (v === false) return 'No'
  return null
}
