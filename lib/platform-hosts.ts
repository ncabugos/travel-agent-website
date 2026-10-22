/**
 * Hostnames that serve the Elite Advisor Hub platform itself. Any other host is
 * an advisor's custom domain. Shared by middleware (domain routing) and
 * AnalyticsScripts (the platform GA property loads on platform hosts only).
 */
const PLATFORM_HOSTS = new Set([
  'localhost',
  'eliteadvisorhub.com',
  'www.eliteadvisorhub.com',
])

export const isPlatformHost = (host: string) =>
  PLATFORM_HOSTS.has(host) || host.endsWith('.vercel.app') || host.includes('localhost')
