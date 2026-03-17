'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { EDEN } from '@/lib/media-library'

interface SiteNavProps {
  agentId: string
  agencyName: string
}

const NAV_LINKS = [
  { label: 'Home',      path: '' },
  { label: 'About',     path: '/about' },
  { label: 'Media',     path: '/media' },
  { label: 'Blog',      path: '/blog' },
  { label: 'Resources', path: '/resources' },
  { label: 'Contact',   path: '/contact' },
]

const WHITE_LOGO = '/assets/eden/logos/eden-new-white-header-350-reduced.png'

export function SiteNav({ agentId, agencyName }: SiteNavProps) {
  const [scrolled,  setScrolled]  = useState(false)
  const [hovered,   setHovered]   = useState(false)
  const base = `/frontend/${agentId}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // "solid" = scrolled OR hovering while at top
  const solid = scrolled || hovered

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: '36px',
    left: 0,
    right: 0,
    zIndex: 40,
    height: '72px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease',
    background: solid ? 'rgba(250, 250, 245, 0.85)' : 'rgba(255, 255, 255, 0.20)',
    backdropFilter: solid ? 'blur(16px)' : 'none',
    boxShadow: solid ? '0 1px 0 rgba(0,0,0,0.06)' : 'none',
  }

  const linkColor = solid ? 'var(--charcoal)' : '#FFFFFF'

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontSize: '10px',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: linkColor,
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    padding: '4px 0',
  }

  return (
    <nav
      style={navStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="max-w-7xl mx-auto w-full px-8"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        {/* Left nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {NAV_LINKS.slice(0, 3).map(({ label, path }) => (
            <NavLink key={label} href={`${base}${path}`} style={linkStyle}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Center logo — white when transparent, gold when solid */}
        <Link href={base} style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
          <Image
            src={solid ? EDEN.logoGold : WHITE_LOGO}
            alt={agencyName}
            width={140}
            height={56}
            style={{ objectFit: 'contain', objectPosition: 'center', transition: 'opacity 0.35s ease' }}
            priority
          />
        </Link>

        {/* Right nav links */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '32px' }}>
          {NAV_LINKS.slice(3).map(({ label, path }) => (
            <NavLink key={label} href={`${base}${path}`} style={linkStyle}>
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

function NavLink({
  href,
  style,
  children,
}: {
  href: string
  style: React.CSSProperties
  children: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      style={{
        ...style,
        color: hovered ? 'var(--gold)' : style.color,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  )
}
