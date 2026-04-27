'use client'
import { useState, useEffect, FormEvent } from 'react'
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

export default function AgentProfilePage() {
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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

      if (data) setProfile(data as unknown as AgentProfile)
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!profile) return

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
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  const update = (field: keyof AgentProfile, value: string) => {
    if (!profile) return
    // first_name is a NOT NULL column with empty-string default — never write null.
    const next = field === 'first_name' ? value : (value || null)
    setProfile({ ...profile, [field]: next })
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

  return (
    <>
      <TopBar
        title="Profile & Branding"
        subtitle="Manage your contact information and social media"
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...buttonStyles.primary,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        }
      />
      <PageContent>
        {success && (
          <div style={{
            padding: '12px 16px', backgroundColor: '#f0fdf4', color: '#166534',
            borderRadius: '8px', fontSize: '13px', fontWeight: 500,
            border: '1px solid #bbf7d0', marginBottom: '24px',
          }}>
            ✓ Profile updated successfully.
          </div>
        )}
        {error && (
          <div style={{
            padding: '12px 16px', backgroundColor: '#fef2f2', color: '#991b1b',
            borderRadius: '8px', fontSize: '13px', fontWeight: 500,
            border: '1px solid #fee2e2', marginBottom: '24px',
          }}>
            {error}
          </div>
        )}

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
        </form>
      </PageContent>
    </>
  )
}
