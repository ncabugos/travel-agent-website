'use client'

import { createContext, useContext, type ReactNode } from 'react'

/**
 * Per-tenant presentation flags decided once in app/t2/[agentId]/layout.tsx
 * and read by client components that would otherwise have to sniff the URL.
 * On a custom domain the pathname is `/contact`, not `/t2/<id>/contact`, so
 * pathname checks silently fail for real tenants — this is the fix.
 */
interface T2Persona {
  /** Render the light lead-form variant site-wide (Wine & Wellness, Coast & Compass). */
  lightLeadForm: boolean
}

const T2PersonaContext = createContext<T2Persona>({ lightLeadForm: false })

export function T2PersonaProvider({ value, children }: { value: T2Persona; children: ReactNode }) {
  return <T2PersonaContext.Provider value={value}>{children}</T2PersonaContext.Provider>
}

export const useT2Persona = () => useContext(T2PersonaContext)
