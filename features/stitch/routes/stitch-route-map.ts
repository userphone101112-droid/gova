import stitchScreens, { StitchScreen } from '../screens/stitch-screen-registry'

export type StitchRouteEntry = {
  id: string
  title: string
  journey: string
  domain: string
  deviceType: string
  route: string
}

const journeyPrefix: Record<string, string> = {
  buyer: '/buyer',
  seller: '/seller',
  admin: '/admin',
  service: '/service',
  guest: '/auth',
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}

function computeRoute(screen: StitchScreen): string {
  let prefix = journeyPrefix[screen.journey] ?? '/'

  if (screen.journey === 'guest') {
    const t = (screen.title || '').toLowerCase()
    if (t.includes('onboarding')) prefix = '/onboarding'
    else if (t.includes('role')) prefix = '/onboarding'
    else prefix = '/auth'
  }

  const slug = slugify(screen.title || screen.name || screen.id)
  return `${prefix}/${slug}`
}

export const stitchRouteMap: Record<string, StitchRouteEntry> = stitchScreens.reduce(
  (acc, s) => {
    acc[s.id] = {
      id: s.id,
      title: s.title,
      journey: s.journey,
      domain: s.domain,
      deviceType: s.deviceType,
      route: computeRoute(s),
    }

    return acc
  },
  {} as Record<string, StitchRouteEntry>
)

export default stitchRouteMap
