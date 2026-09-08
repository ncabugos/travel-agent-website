'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Palette, BookOpen, Share2, CheckCircle,
  ChevronRight, ChevronLeft, Loader2, ArrowRight,
  Globe, MapPin, Briefcase, Compass, Plane, Award
} from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

// ── Preset options ──────────────────────────────────────────────────────────
const TRAVEL_SPECIALTIES = [
  'Luxury', 'Honeymoons & Romance', 'Destination Weddings', 'Family', 'Multigenerational',
  'Adventure & Expedition', 'Safari & Wildlife', 'Wellness & Spa', 'Culinary & Wine',
  'Cultural & Heritage', 'Ski & Mountain', 'Golf', 'Solo Travel', 'LGBTQ+ Travel',
  'Group Travel', 'Corporate & Incentive', 'Faith-Based', 'Accessible Travel',
]

const DESTINATION_SPECIALTIES = [
  'Europe', 'Mediterranean', 'British Isles & Ireland', 'Scandinavia & Iceland', 'Caribbean',
  'Mexico', 'Central America', 'South America', 'Galapagos', 'USA', 'Canada', 'Alaska', 'Hawaii',
  'Japan', 'Southeast Asia', 'China & Hong Kong', 'India & Sri Lanka', 'Maldives & Indian Ocean',
  'Middle East', 'Africa', 'Egypt & Morocco', 'South Pacific & French Polynesia',
  'Australia & New Zealand', 'Antarctica', 'Arctic',
]

const TRAVEL_TYPES = [
  'Ocean Cruises', 'River Cruises', 'Expedition Cruises', 'Yacht Charters & Small Ships',
  'Private Jet Journeys', 'Safaris', 'Rail Journeys', 'Luxury Villas', 'All-Inclusive Resorts',
  'Bespoke Itineraries', 'Escorted Tours', 'Self-Drive Touring', 'Group Travel',
  'Wellness Retreats',
]

const NETWORK_AFFILIATIONS = [
  'Virtuoso', 'Signature Travel Network', 'Ensemble Travel Group', 'Travel Leaders Network',
  'Serandipians', 'XO Private', 'Internova Select', 'GlobalStar', 'Affluent Traveler Collection',
  'ASTA', 'Independent',
]

const CERTIFICATIONS = [
  'CTA', 'CTC', 'CTIE', 'CLIA ACC', 'CLIA MCC', 'CLIA ECC', 'ASTA Verified Travel Advisor',
  'Aussie Specialist', 'Tahiti Tiare Specialist', 'Japan Travel Specialist', 'Ireland Specialist',
]

/** Preferred-supplier chips come from the live catalog; page.tsx builds the groups. */
export interface SupplierGroup {
  label: string
  items: string[]
}

const STEPS = [
  { label: 'Your Info', icon: User },
  { label: 'Branding', icon: Palette },
  { label: 'About You', icon: BookOpen },
  { label: 'Social', icon: Share2 },
  { label: 'Review', icon: CheckCircle },
]

// ── Types ───────────────────────────────────────────────────────────────────
interface OnboardingData {
  full_name: string
  agency_name: string
  phone: string
  avatar_url: string
  tagline: string
  template: 'frontend' | 't2'
  bio: string
  travel_specialties: string[]
  destination_specialties: string[]
  preferred_suppliers: string[]
  travel_types: string[]
  instagram_url: string
  facebook_url: string
  youtube_url: string
  tiktok_url: string
  website_url: string
  logo_url: string
  host_agency: string
  network_affiliations: string[]
  certifications: string[]
  /** Free-text certifications, merged into `certifications` on submit. */
  certifications_other: string
  /** One URL per line, parsed into `inspiration_sites` on submit. */
  inspiration_text: string
}

const defaultData: OnboardingData = {
  full_name: '',
  agency_name: '',
  phone: '',
  avatar_url: '',
  tagline: '',
  template: 'frontend',
  bio: '',
  travel_specialties: [],
  destination_specialties: [],
  preferred_suppliers: [],
  travel_types: [],
  instagram_url: '',
  facebook_url: '',
  youtube_url: '',
  tiktok_url: '',
  website_url: '',
  logo_url: '',
  host_agency: '',
  network_affiliations: [],
  certifications: [],
  certifications_other: '',
  inspiration_text: '',
}

export function OnboardingWizard({ suppliers }: { suppliers: SupplierGroup[] }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Pre-fill from existing agent record
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/agent-portal/login'); return }

      const { data: agent } = await (supabase
        .from('agents') as any)
        .select('*')
        .eq('email', session.user.email ?? '')
        .single()

      if (agent) {
        // If already onboarded, redirect to dashboard
        if (agent.onboarding_completed_at) {
          router.push('/agent-portal')
          return
        }
        setData(d => ({
          ...d,
          full_name: agent.full_name ?? '',
          agency_name: agent.agency_name ?? '',
          phone: agent.phone ?? '',
          avatar_url: agent.avatar_url ?? '',
          tagline: agent.tagline ?? '',
          template: agent.template ?? 'frontend',
          bio: agent.bio ?? '',
          travel_specialties: agent.travel_specialties ?? [],
          destination_specialties: agent.destination_specialties ?? [],
          preferred_suppliers: agent.preferred_suppliers ?? [],
          travel_types: agent.travel_types ?? [],
          instagram_url: agent.instagram_url ?? '',
          facebook_url: agent.facebook_url ?? '',
          youtube_url: agent.youtube_url ?? '',
          tiktok_url: agent.tiktok_url ?? '',
          website_url: agent.website_url ?? '',
          logo_url: agent.logo_url ?? '',
          host_agency: agent.host_agency ?? '',
          network_affiliations: agent.network_affiliations ?? [],
          certifications: (agent.certifications ?? []).filter((c: string) => CERTIFICATIONS.includes(c)),
          certifications_other: (agent.certifications ?? []).filter((c: string) => !CERTIFICATIONS.includes(c)).join(', '),
          inspiration_text: (agent.inspiration_sites ?? []).join('\n'),
        }))
      }
      setLoading(false)
    }
    load()
  }, [router])

  const update = useCallback(<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData(d => ({ ...d, [key]: value }))
  }, [])

  const toggleArrayItem = useCallback((key: keyof OnboardingData, item: string) => {
    setData(d => {
      const arr = d[key] as string[]
      return {
        ...d,
        [key]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item],
      }
    })
  }, [])

  const canProceed = step === 0
    ? data.full_name.trim() !== '' && data.agency_name.trim() !== ''
    : true

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    const { certifications_other, inspiration_text, ...rest } = data
    const payload = {
      ...rest,
      certifications: [
        ...data.certifications,
        ...certifications_other.split(',').map(c => c.trim()).filter(Boolean),
      ],
      inspiration_sites: inspiration_text.split('\n').map(u => u.trim()).filter(Boolean).slice(0, 5),
    }
    const res = await fetch('/api/agent-portal/onboarding', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setSubmitted(true)
      setTimeout(() => router.push('/agent-portal'), 2500)
    } else {
      const err = await res.json()
      setError(err.error ?? 'Something went wrong.')
    }
    setSubmitting(false)
  }

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9ca3af' }}>
          <Loader2 size={20} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '14px' }}>Loading your profile…</span>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ── Success ─────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={styles.pageWrapper}>
        <div style={{
          ...styles.card,
          textAlign: 'center' as const,
          padding: '60px 48px',
          maxWidth: '480px',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle size={28} strokeWidth={1.5} style={{ color: '#16a34a' }} />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 700, color: '#111' }}>
            You're all set!
          </h2>
          <p style={{ margin: 0, fontSize: '15px', color: '#6b7280', lineHeight: 1.6 }}>
            Your profile has been submitted. We'll review your details, follow up with any questions,
            and have your site ready to launch soon.
          </p>
          <p style={{ margin: '16px 0 0', fontSize: '13px', color: '#9ca3af' }}>
            Redirecting to your dashboard…
          </p>
        </div>
      </div>
    )
  }

  // ── Wizard ──────────────────────────────────────────────────────────────
  return (
    <div style={styles.pageWrapper}>
      <div className="onb-card" style={{ ...styles.card, width: '100%', maxWidth: '680px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center' as const, marginBottom: '36px' }}>
          <Link href="/" style={{ display: 'inline-block', margin: '0 auto 16px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-black.png"
              alt="Elite Advisor Hub"
              style={{ height: '28px', width: 'auto', display: 'block' }}
            />
          </Link>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
            Welcome to Elite Advisor Hub
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            Let's set up your profile. It takes a few minutes.
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '36px' }}>
          {STEPS.map((s, i) => {
            const StepIcon = s.icon
            const isActive = i === step
            const isComplete = i < step
            return (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '20px',
                    backgroundColor: isActive ? '#111' : isComplete ? '#f0fdf4' : '#f9fafb',
                    color: isActive ? '#fff' : isComplete ? '#16a34a' : '#9ca3af',
                    fontSize: '12px', fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.25s',
                    border: isActive ? '1px solid #111' : isComplete ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
                  }}
                >
                  <StepIcon size={14} strokeWidth={1.5} />
                  <span style={{ display: isActive ? 'inline' : 'none' }}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: '20px', height: '1px',
                    backgroundColor: isComplete ? '#bbf7d0' : '#e5e7eb',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div style={{ minHeight: '320px' }}>
          {step === 0 && (
            <StepContainer title="Your Information" subtitle="The basics about you and your agency.">
              <Field label="Full Name" required>
                <input
                  id="onb-full-name"
                  value={data.full_name}
                  onChange={e => update('full_name', e.target.value)}
                  placeholder="Jane Smith"
                  style={styles.input}
                  autoFocus
                />
              </Field>
              <Field label="Agency Name" required>
                <input
                  id="onb-agency-name"
                  value={data.agency_name}
                  onChange={e => update('agency_name', e.target.value)}
                  placeholder="Wanderlust Travel"
                  style={styles.input}
                />
              </Field>
              <Field label="Phone Number">
                <input
                  id="onb-phone"
                  type="tel"
                  value={data.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  style={styles.input}
                />
              </Field>
              <Field label="Host Agency" hint="Leave blank if you are not with a host">
                <input
                  id="onb-host-agency"
                  value={data.host_agency}
                  onChange={e => update('host_agency', e.target.value)}
                  placeholder="Gifted Travel Network, Brownell, Fora"
                  style={styles.input}
                />
              </Field>
              <Field label="Network Affiliations" hint="Select all that apply">
                <ChipGrid
                  items={NETWORK_AFFILIATIONS}
                  selected={data.network_affiliations}
                  onToggle={item => toggleArrayItem('network_affiliations', item)}
                  icon={<Globe size={12} strokeWidth={1.5} />}
                />
              </Field>
              <Field label="Certifications" hint="Select all that apply and add any others, separated by commas">
                <ChipGrid
                  items={CERTIFICATIONS}
                  selected={data.certifications}
                  onToggle={item => toggleArrayItem('certifications', item)}
                  icon={<Award size={12} strokeWidth={1.5} />}
                />
                <input
                  id="onb-certifications-other"
                  value={data.certifications_other}
                  onChange={e => update('certifications_other', e.target.value)}
                  placeholder="Other certifications"
                  style={{ ...styles.input, marginTop: '10px' }}
                />
              </Field>
            </StepContainer>
          )}

          {step === 1 && (
            <StepContainer title="Branding & Template" subtitle="Choose your look and feel.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <Field label="Headshot" hint="A photo of you">
                  <ImageUpload
                    value={data.avatar_url}
                    onChange={url => update('avatar_url', url)}
                    uploadEndpoint="/api/agent-portal/upload?kind=headshot"
                    previewHeight={160}
                  />
                </Field>
                <Field label="Logo" hint="PNG with a transparent background works best">
                  <ImageUpload
                    value={data.logo_url}
                    onChange={url => update('logo_url', url)}
                    uploadEndpoint="/api/agent-portal/upload?kind=logo"
                    previewHeight={160}
                    objectFit="contain"
                  />
                </Field>
              </div>
              <Field label="Tagline" hint="A short phrase that appears on your website's hero section">
                <input
                  id="onb-tagline"
                  value={data.tagline}
                  onChange={e => update('tagline', e.target.value)}
                  placeholder="Your journey starts here"
                  style={styles.input}
                />
              </Field>
              <Field label="Website Template">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <TemplateCard
                    name="Eden"
                    value="frontend"
                    description="Editorial luxury with warm ivory tones"
                    selected={data.template === 'frontend'}
                    onSelect={() => update('template', 'frontend')}
                  />
                  <TemplateCard
                    name="Modern"
                    value="t2"
                    description="Cinematic widescreen with bold typography"
                    selected={data.template === 't2'}
                    onSelect={() => update('template', 't2')}
                    badge="Growth / Custom Tier"
                  />
                </div>
                <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                  The Modern template is included with Growth and Custom tiers. A discovery call may be needed for custom designs.
                </p>
              </Field>
              <Field label="Websites You Like" hint="Up to five sites whose style you want us to draw from, one per line">
                <textarea
                  id="onb-inspiration"
                  value={data.inspiration_text}
                  onChange={e => update('inspiration_text', e.target.value)}
                  rows={4}
                  placeholder={'https://example.com\nhttps://another-site.com'}
                  style={{ ...styles.input, resize: 'vertical' as const, fontFamily: 'inherit', lineHeight: '1.6' }}
                />
              </Field>
            </StepContainer>
          )}

          {step === 2 && (
            <StepContainer title="About You" subtitle="Help us understand your expertise.">
              <Field label="Bio" hint="Tell visitors about your travel experience and what sets you apart">
                <textarea
                  id="onb-bio"
                  value={data.bio}
                  onChange={e => update('bio', e.target.value)}
                  rows={4}
                  placeholder="Tell your story..."
                  style={{ ...styles.input, resize: 'vertical' as const, fontFamily: 'inherit', lineHeight: '1.6' }}
                />
              </Field>
              <Field label="Travel Specialties" hint="Select all that apply">
                <ChipGrid
                  items={TRAVEL_SPECIALTIES}
                  selected={data.travel_specialties}
                  onToggle={item => toggleArrayItem('travel_specialties', item)}
                  icon={<Briefcase size={12} strokeWidth={1.5} />}
                />
              </Field>
              <Field label="Destination Specialties">
                <ChipGrid
                  items={DESTINATION_SPECIALTIES}
                  selected={data.destination_specialties}
                  onToggle={item => toggleArrayItem('destination_specialties', item)}
                  icon={<MapPin size={12} strokeWidth={1.5} />}
                />
              </Field>
              <Field label="Preferred Suppliers" hint="The programs and partners you book most">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {suppliers.map(group => (
                    <div key={group.label}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
                        {group.label}
                      </div>
                      <ChipGrid
                        items={group.items}
                        selected={data.preferred_suppliers}
                        onToggle={item => toggleArrayItem('preferred_suppliers', item)}
                        icon={<Globe size={12} strokeWidth={1.5} />}
                      />
                    </div>
                  ))}
                </div>
              </Field>
              <Field label="Types of Travel">
                <ChipGrid
                  items={TRAVEL_TYPES}
                  selected={data.travel_types}
                  onToggle={item => toggleArrayItem('travel_types', item)}
                  icon={<Compass size={12} strokeWidth={1.5} />}
                />
              </Field>
            </StepContainer>
          )}

          {step === 3 && (
            <StepContainer title="Social Media" subtitle="Connect your channels. We display them on your site.">
              <Field label="Instagram">
                <input
                  id="onb-instagram"
                  type="url"
                  value={data.instagram_url}
                  onChange={e => update('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/youragency"
                  style={styles.input}
                />
              </Field>
              <Field label="Facebook">
                <input
                  id="onb-facebook"
                  type="url"
                  value={data.facebook_url}
                  onChange={e => update('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/youragency"
                  style={styles.input}
                />
              </Field>
              <Field label="YouTube">
                <input
                  id="onb-youtube"
                  type="url"
                  value={data.youtube_url}
                  onChange={e => update('youtube_url', e.target.value)}
                  placeholder="https://youtube.com/@youragency"
                  style={styles.input}
                />
              </Field>
              <Field label="TikTok">
                <input
                  id="onb-tiktok"
                  type="url"
                  value={data.tiktok_url}
                  onChange={e => update('tiktok_url', e.target.value)}
                  placeholder="https://tiktok.com/@youragency"
                  style={styles.input}
                />
              </Field>
              <Field label="Website">
                <input
                  id="onb-website"
                  type="url"
                  value={data.website_url}
                  onChange={e => update('website_url', e.target.value)}
                  placeholder="https://youragency.com"
                  style={styles.input}
                />
              </Field>
            </StepContainer>
          )}

          {step === 4 && (
            <StepContainer title="Review & Submit" subtitle="Confirm everything looks good, then we'll get started.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <ReviewSection title="Contact">
                  <ReviewRow label="Name" value={data.full_name} />
                  <ReviewRow label="Agency" value={data.agency_name} />
                  <ReviewRow label="Phone" value={data.phone || '—'} />
                  <ReviewRow label="Host agency" value={data.host_agency || '—'} />
                  <ReviewRow label="Affiliations" value={data.network_affiliations.join(', ') || '—'} />
                  <ReviewRow label="Certifications" value={[...data.certifications, ...data.certifications_other.split(',').map(c => c.trim()).filter(Boolean)].join(', ') || '—'} />
                </ReviewSection>
                <ReviewSection title="Branding">
                  <ReviewRow label="Template" value={data.template === 'frontend' ? 'Eden' : 'Modern'} />
                  <ReviewRow label="Tagline" value={data.tagline || '—'} />
                  <ReviewRow label="Headshot" value={data.avatar_url ? 'Uploaded' : 'Not set'} />
                  <ReviewRow label="Logo" value={data.logo_url ? 'Uploaded' : 'Not set'} />
                  <ReviewRow label="Websites you like" value={data.inspiration_text.split('\n').map(u => u.trim()).filter(Boolean).join(', ') || '—'} />
                </ReviewSection>
                <ReviewSection title="Expertise">
                  <ReviewRow label="Specialties" value={data.travel_specialties.join(', ') || '—'} />
                  <ReviewRow label="Destinations" value={data.destination_specialties.join(', ') || '—'} />
                  <ReviewRow label="Suppliers" value={data.preferred_suppliers.join(', ') || '—'} />
                  <ReviewRow label="Travel Types" value={data.travel_types.join(', ') || '—'} />
                </ReviewSection>
                <ReviewSection title="Social">
                  {data.instagram_url && <ReviewRow label="Instagram" value={data.instagram_url} />}
                  {data.facebook_url && <ReviewRow label="Facebook" value={data.facebook_url} />}
                  {data.youtube_url && <ReviewRow label="YouTube" value={data.youtube_url} />}
                  {data.tiktok_url && <ReviewRow label="TikTok" value={data.tiktok_url} />}
                  {data.website_url && <ReviewRow label="Website" value={data.website_url} />}
                  {!data.instagram_url && !data.facebook_url && !data.youtube_url && !data.tiktok_url && !data.website_url && (
                    <ReviewRow label="" value="No social links added" />
                  )}
                </ReviewSection>
              </div>

              <div style={{
                marginTop: '20px', padding: '14px 16px',
                backgroundColor: '#eff6ff', borderRadius: '10px',
                border: '1px solid #bfdbfe', fontSize: '13px',
                color: '#1e40af', lineHeight: 1.5,
                display: 'flex', alignItems: 'flex-start', gap: '8px',
              }}>
                <Plane size={16} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>
                  Once you submit, we'll review your information, follow up with any questions,
                  and build your site. You'll receive a notification when it's ready to launch.
                </span>
              </div>
            </StepContainer>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 14px', backgroundColor: '#fef2f2', color: '#991b1b',
            borderRadius: '8px', fontSize: '13px', border: '1px solid #fee2e2',
            marginTop: '16px',
          }}>
            {error}
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: step === 0 ? 'flex-end' : 'space-between',
          marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f3f4f6',
        }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={styles.btnSecondary}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
              Back
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed}
              style={{
                ...styles.btnPrimary,
                opacity: canProceed ? 1 : 0.5,
                cursor: canProceed ? 'pointer' : 'not-allowed',
              }}
            >
              Continue
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                ...styles.btnPrimary,
                backgroundImage: 'linear-gradient(135deg, #111 0%, #374151 100%)',
                padding: '12px 28px',
                fontSize: '14px',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
                  Submitting…
                </>
              ) : (
                <>
                  Submit for Review
                  <ArrowRight size={16} strokeWidth={1.5} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (max-width: 480px) { .onb-card { padding: 32px 20px !important; } }
      `}</style>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepContainer({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 600, color: '#111' }}>{title}</h2>
      <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#6b7280' }}>{subtitle}</p>
      {children}
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#9ca3af' }}>{hint}</p>}
    </div>
  )
}

function ChipGrid({ items, selected, onToggle, icon }: {
  items: string[]; selected: string[]; onToggle: (item: string) => void; icon?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {items.map(item => {
        const active = selected.includes(item)
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '6px 14px', borderRadius: '20px',
              fontSize: '12px', fontWeight: active ? 600 : 400,
              backgroundColor: active ? '#111' : '#fff',
              color: active ? '#fff' : '#374151',
              border: active ? '1px solid #111' : '1px solid #d1d5db',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {icon}
            {item}
          </button>
        )
      })}
    </div>
  )
}

function TemplateCard({ name, value, description, selected, onSelect, badge }: {
  name: string; value: string; description: string; selected: boolean; onSelect: () => void; badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        padding: '20px 16px', borderRadius: '12px', textAlign: 'left' as const,
        border: selected ? '2px solid #111' : '1px solid #e5e7eb',
        backgroundColor: selected ? '#fafafa' : '#fff',
        cursor: 'pointer', transition: 'all 0.15s',
        position: 'relative' as const,
      }}
    >
      {badge && (
        <div style={{
          position: 'absolute' as const, top: '8px', right: '8px',
          fontSize: '9px', fontWeight: 600, color: '#6b7280',
          backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '10px',
          textTransform: 'uppercase' as const, letterSpacing: '0.04em',
        }}>
          {badge}
        </div>
      )}
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%',
        border: selected ? '6px solid #111' : '2px solid #d1d5db',
        marginBottom: '12px', transition: 'all 0.15s',
        boxSizing: 'border-box' as const,
      }} />
      <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>{name}</div>
      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{description}</div>
    </button>
  )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '16px', backgroundColor: '#f9fafb', borderRadius: '10px',
      border: '1px solid #f3f4f6',
    }}>
      <h4 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
        {title}
      </h4>
      {children}
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
      {label && <span style={{ color: '#6b7280' }}>{label}</span>}
      <span style={{ color: '#111', fontWeight: 500, textAlign: 'right' as const, maxWidth: '60%', wordBreak: 'break-word' as const }}>{value}</span>
    </div>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '32px 24px',
  } as React.CSSProperties,

  card: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    padding: '48px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
  } as React.CSSProperties,

  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s, box-shadow 0.15s',
    backgroundColor: '#fff',
  } as React.CSSProperties,

  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 22px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  } as React.CSSProperties,

  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 18px',
    backgroundColor: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  } as React.CSSProperties,
}
