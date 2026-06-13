import stitchRouteMap, { StitchRouteEntry } from '../routes/stitch-route-map'

function getSlug(route: string) {
  return route.split('/').filter(Boolean).pop()
}

export function resolveStitchScreen(slug: string): StitchRouteEntry | undefined {
  return Object.values(stitchRouteMap).find((entry) => {
    return getSlug(entry.route) === slug
  })
}

export function resolveStitchScreenByJourney(
  journey: string,
  slug: string,
): StitchRouteEntry | undefined {
  return Object.values(stitchRouteMap).find((entry) => {
    return entry.journey === journey && getSlug(entry.route) === slug
  })
}
