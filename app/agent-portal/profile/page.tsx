'use client'
import { useState, useEffect, useRef, useMemo, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/dashboard/TopBar'
import { Card } from '@/components/dashboard/Card'
import { FormField, inputStyles, buttonStyles } from '@/components/dashboard/FormField'
import { PageContent } from '@/components/dashboard/DashboardShell'

interface AgentProfile {
  id: string
  full_name: string
  first_name: string
  agency_name: string
  email: string
  phone: string | null
  tagline: string | null
  bio: string | null
  avatar_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  youtube_url: string | null
  tiktok_url: string | null
  website_url: string | null
}

const NULLABLE_KEYS: readonly (keyof AgentProfile)[] = [
  'phone', 'tagline', 'bio', 'avatar_url', 'instagram_url',
  'facebook_url', 'youtube_url', 'tiktok_url', 'website_url',
]

// Normalize null↔'' so an empty optional field doesn't read as dirty after
// React converts undefined/null inputs to empty strings.
function snapshot(p: AgentProfile): string {
  const norm: Record<string, unknown> = { ...p }
  for (const k of NULLABLE_KEYS) norm[k] = (p[k] as string | null) ?? ''
  return JSON.stringify(norm)
}

export default function AgentProfilePage() {
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const initialProfileRef = useRef<AgentProfile | null>(null)
  const [initial, setInitial] = useState<string>('')

  const isDirty = useMemo(
    () => !!profile && !!initial && snapshot(profile) !== initial,
    [profile, initial]
  )

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('agents')
        .select('*')
        .eq('email', session.user.email ?? '')
        .single()

      if (data) {
        const p = data as unknown as AgentProfile
        setProfile(p)
        initialProfileRef.current = p
        setInitial(snapshot(p))
      }
      setLoading(false)
    }
    load()
  }, [])

  // Warn before tab close / navigation while there are unsaved changes.
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const handleSave = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!profile || !isDirty) return

    setSaving(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()
    const { error: updateError } = await (supabase
      .from('agents') as any)
      .update({
        full_name: profile.full_name,
        first_name: profile.first_name?.trim() ?? '',
        agency_name: profile.agency_name,
        phone: profile.phone,
        tagline: profile.tagline,
        bio: profile.bio,
        instagram_url: profile.instagram_url,
        facebook_url: profile.facebook_url,
        youtube_url: profile.youtube_url,
        tiktok_url: profile.tiktok_url,
        website_url: profile.website_url,
      })
      .eq('id', profile.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      initialProfileRef.current = profile
      setInitial(snapshot(profile))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  const handleDiscard = () => {
    if (!initialProfileRef.current) return
    setProfile(initialProfileRef.current)
    setError('')
    setSuccess(false)
  }

  const update = (field: keyof AgentProfile, value: string) => {
    if (!profile) return
    // first_name is a NOT NULL column with empty-string default — never write null.
    const next = field === 'first_name' ? value : (value || null)
    setProfile({ ...profile, [field]: next })
    if (error) setError('')
  }

  if (loading) {
    return (
      <>
        <TopBar title="Profile" subtitle="Manage your account" />
        <PageContent>
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
        </PageContent>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <TopBar title="Profile" subtitle="Account not found" />
        <PageContent>
          <Card><p style={{ color: '#6b7280' }}>No agent profile found.</p></Card>
        </PageContent>
      </>
    )
  }

  const showBar = isDirty || success || !!error
  const saveDisabled = !isDirty || saving

  return (
    <>
      <TopBar
        title="Profile & Branding"
        subtitle="Manage your contact information and social media"
        actions={
          <button
            onClick={() => handleSave()}
            disabled={saveDisabled}
            title={!isDirty ? 'No changes to save' : undefined}
            style={{
              ...buttonStyles.primary,
              backgroundColor: saveDisabled ? '#e5e7eb' : '#111',
              color: saveDisabled ? '#9ca3af' : '#fff',
              cursor: saving ? 'wait' : !isDirty ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        }
      />
      <PageContent>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Contact Info */}
            <Card title="Contact Information">
              <FormField label="Full Name" htmlFor="full_name" required>
                <input
                  id="full_name"
                  type="text"
                  value={profile.full_name}
                  onChange={e => update('full_name', e.target.value)}
                  style={inputStyles}
                  required
                />
              </FormField>

              <FormField
                label="First name (used in journal articles)"
                htmlFor="first_name"
                hint="This appears in calls-to-action on your published articles, e.g. “Reach out to [First name]”. Use the name your clients call you."
              >
                <input
                  id="first_name"
                  type="text"
                  value={profile.first_name ?? ''}
                  onChange={e => update('first_name', e.target.value)}
                  placeholder="e.g. Eleanor"
                  style={inputStyles}
                />
              </FormField>

              <FormField label="Agency Name" htmlFor="agency_name" required>
                <input
                  id="agency_name"
                  type="text"
                  value={profile.agency_name}
                  onChange={e => update('agency_name', e.target.value)}
                  style={inputStyles}
                  required
                />
              </FormField>

              <FormField label="Email" htmlFor="email" hint="Contact your administrator to change your email">
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  style={{ ...inputStyles, backgroundColor: '#f9fafb', color: '#6b7280' }}
                  disabled
                />
              </FormField>

              <FormField label="Phone Number" htmlFor="phone">
                <input
                  id="phone"
                  type="tel"
                  value={profile.phone ?? ''}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  style={inputStyles}
                />
              </FormField>
            </Card>

            {/* Social Media */}
            <Card title="Social Media">
              <FormField label="Instagram" htmlFor="instagram_url">
                <input
                  id="instagram_url"
                  type="url"
                  value={profile.instagram_url ?? ''}
                  onChange={e => update('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/youragency"
                  style={inputStyles}
                />
              </FormField>

              <FormField label="Facebook" htmlFor="facebook_url">
                <input
                  id="facebook_url"
                  type="url"
                  value={profile.facebook_url ?? ''}
                  onChange={e => update('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/youragency"
                  style={inputStyles}
                />
              </FormField>

              <FormField label="YouTube" htmlFor="youtube_url">
                <input
                  id="youtube_url"
                  type="url"
                  value={profile.youtube_url ?? ''}
                  onChange={e => update('youtube_url', e.target.value)}
                  placeholder="https://youtube.com/@youragency"
                  style={inputStyles}
                />
              </FormField>

              <FormField label="TikTok" htmlFor="tiktok_url">
                <input
                  id="tiktok_url"
                  type="url"
                  value={profile.tiktok_url ?? ''}
                  onChange={e => update('tiktok_url', e.target.value)}
                  placeholder="https://tiktok.com/@youragency"
                  style={inputStyles}
                />
              </FormField>

              <FormField label="Website" htmlFor="website_url">
                <input
                  id="website_url"
                  type="url"
                  value={profile.website_url ?? ''}
                  onChange={e => update('website_url', e.target.value)}
                  placeholder="https://youragency.com"
                  style={inputStyles}
                />
              </FormField>
            </Card>
          </div>

          {/* Bio & Tagline — full width */}
          <div style={{ marginTop: '24px' }}>
            <Card title="Bio & Tagline">
              <FormField label="Tagline" htmlFor="tagline" hint="A short phrase that appears on your website">
                <input
                  id="tagline"
                  type="text"
                  value={profile.tagline ?? ''}
                  onChange={e => update('tagline', e.target.value)}
                  placeholder="Your journey starts here"
                  style={inputStyles}
                />
              </FormField>

              <FormField label="About / Bio" htmlFor="bio" hint="Tell visitors about your agency">
                <textarea
                  id="bio"
                  value={profile.bio ?? ''}
                  onChange={e => update('bio', e.target.value)}
                  rows={6}
                  placeholder="Tell your story..."
                  style={{
                    ...inputStyles,
                    resize: 'vertical' as const,
                    fontFamily: 'inherit',
                  }}
                />
              </FormField>
            </Card>
          </div>

          {/* Padding so the sticky bar never covers the last field */}
          {showBar && <div style={{ height: 80 }} aria-hidden />}
        </form>

        {showBar && (
          <div
            role="region"
            aria-label="Unsaved changes"
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(6px)',
              borderTop: '1px solid #e5e7eb',
              padding: '14px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              zIndex: 50,
              boxShadow: '0 -4px 12px rgba(0,0,0,0.04)',
              animation: 'profileBarSlideUp 180ms ease-out',
            }}
          >
            <style>{`@keyframes profileBarSlideUp{from{opacity:0}to{opacity:1}}`}</style>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              {isDirty && (
                <>
                  <span
                    aria-hidden
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: '#f59e0b',
                      boxShadow: '0 0 0 3px rgba(245,158,11,0.18)',
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                    You have unsaved changes
                  </span>
                </>
              )}
              {!isDirty && success && (
                <span style={{ fontSize: 13, fontWeight: 500, color: '#16a34a' }}>
                  ✓ Profile saved
                </span>
              )}
              {!isDirty && error && (
                <span style={{ fontSize: 13, fontWeight: 500, color: '#dc2626' }}>
                  {error}
                </span>
              )}
              {isDirty && error && (
                <span style={{ fontSize: 13, fontWeight: 500, color: '#dc2626', marginLeft: 8 }}>
                  {error}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleDiscard}
              disabled={!isDirty || saving}
              style={{
                ...buttonStyles.secondary,
                color: isDirty ? '#374151' : '#9ca3af',
                cursor: !isDirty || saving ? 'not-allowed' : 'pointer',
              }}
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saveDisabled}
              title={!isDirty ? 'No changes to save' : undefined}
              style={{
                ...buttonStyles.primary,
                backgroundColor: saveDisabled ? '#e5e7eb' : '#111',
                color: saveDisabled ? '#9ca3af' : '#fff',
                cursor: saving ? 'wait' : !isDirty ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        )}
      </PageContent>
    </>
  )
}
