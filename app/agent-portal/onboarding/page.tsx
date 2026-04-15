'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  User, Palette, BookOpen, Share2, CheckCircle,
  ChevronRight, ChevronLeft, Loader2, ArrowRight,
  Globe, MapPin, Briefcase, Compass, Plane
} from 'lucide-react'

// ── Preset options ──────────────────────────────────────────────────────────
const TRAVEL_SPECIALTIES = [
  'Luxury', 'Adventure', 'Honeymoons & Romance', 'Family',
  'Wellness & Spa', 'Culinary & Wine', 'Safari & Wildlife',
  'Cultural & Heritage', 'Solo Travel', 'Destination Weddings',
]

const DESTINATION_SPECIALTIES = [
  'Europe', 'Caribbean', 'Mexico', 'Central America',
  'South America', 'Asia-Pacific', 'Africa', 'Middle East',
  'South Pacific', 'Antarctica', 'Hawaii', 'Mediterranean',
]

const PREFERRED_SUPPLIERS_LIST = [
  'Virtuoso', 'Aman', 'Four Seasons', 'Ritz-Carlton',
  'Belmond', 'Rosewood', 'Regent Seven Seas', 'Silversea',
  'Oceania Cruises', 'Celebrity Cruises', 'Viking',
  'Abercrombie & Kent', 'Tauck', 'Lindblad Expeditions',
]

const TRAVEL_TYPES = [
  'Cruises', 'All-Inclusive Resorts', 'Bespoke Itineraries',
  'Group Travel', 'River Cruises', 'Expedition Cruises',
  'Luxury Villas', 'Escorted Tours', 'Self-Drive Touring',
  'Rail Journeys',
]

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
}

export default function OnboardingPage() {
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

    const res = await fetch('/api/agent-portal/onboarding', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
      <div style={{ ...styles.card, width: '100%', maxWidth: '680px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center' as const, marginBottom: '36px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            backgroundColor: '#111', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>L</span>
          </div>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
            Welcome to EliteAdvisorHub
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            Let's set up your profile — it only takes a few minutes.
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '36px' }}>
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
            </StepContainer>
          )}

          {step === 1 && (
            <StepContainer title="Branding & Template" subtitle="Choose your look and feel.">
              <Field label="Headshot / Logo URL" hint="Paste a link to your headshot or agency logo">
                <input
                  id="onb-avatar"
                  type="url"
                  value={data.avatar_url}
                  onChange={e => update('avatar_url', e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  style={styles.input}
                />
              </Field>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
              <Field label="Preferred Suppliers">
                <ChipGrid
                  items={PREFERRED_SUPPLIERS_LIST}
                  selected={data.preferred_suppliers}
                  onToggle={item => toggleArrayItem('preferred_suppliers', item)}
                  icon={<Globe size={12} strokeWidth={1.5} />}
                />
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
            <StepContainer title="Social Media" subtitle="Connect your channels — we'll display them on your site.">
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
                </ReviewSection>
                <ReviewSection title="Branding">
                  <ReviewRow label="Template" value={data.template === 'frontend' ? 'Eden' : 'Modern'} />
                  <ReviewRow label="Tagline" value={data.tagline || '—'} />
                  <ReviewRow label="Avatar" value={data.avatar_url ? 'Provided' : 'Not set'} />
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
                background: 'linear-gradient(135deg, #111 0%, #374151 100%)',
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
