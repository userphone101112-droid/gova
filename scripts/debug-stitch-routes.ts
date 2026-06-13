import stitchRouteMap from '../features/stitch/routes/stitch-route-map'

function getSlug(route: string): string {
  return route.split('/').filter(Boolean).pop() || ''
}

console.log('=== STITCH ROUTE DEBUG REPORT ===\n')

console.log('Total screens:', Object.keys(stitchRouteMap).length)
console.log('\n--- First 10 Entries ---\n')

const entries = Object.values(stitchRouteMap)
entries.slice(0, 10).forEach((entry, index) => {
  console.log(`${index + 1}. ID: ${entry.id}`)
  console.log(`   Title: ${entry.title}`)
  console.log(`   Journey: ${entry.journey}`)
  console.log(`   Route: ${entry.route}`)
  console.log(`   Slug (getSlug): ${getSlug(entry.route)}`)
  console.log('')
})

console.log('\n--- All Screens by Journey ---\n')

const byJourney: Record<string, typeof entries> = {
  buyer: [],
  seller: [],
  admin: [],
  service: [],
  guest: [],
}

entries.forEach(entry => {
  if (byJourney[entry.journey]) {
    byJourney[entry.journey].push(entry)
  }
})

Object.entries(byJourney).forEach(([journey, screens]) => {
  console.log(`${journey}: ${screens.length} screens`)
  screens.slice(0, 3).forEach(screen => {
    console.log(`  - ${screen.route} -> slug: ${getSlug(screen.route)}`)
  })
  if (screens.length > 3) {
    console.log(`  ... and ${screens.length - 3} more`)
  }
  console.log('')
})

console.log('\n--- Testing Resolution ---\n')

// Test some example slugs
const testSlugs = [
  'admin-system-overview-dark',
  'buyer-marketplace-home-dark',
  'seller-dashboard-dark',
  'enhanced-business-profile-management',
  'onboarding-business-activity',
]

testSlugs.forEach(slug => {
  const resolved = entries.find(entry => getSlug(entry.route) === slug)
  console.log(`Testing slug: "${slug}"`)
  console.log(`  Found: ${resolved ? 'YES' : 'NO'}`)
  if (resolved) {
    console.log(`  Matched route: ${resolved.route}`)
    console.log(`  Title: ${resolved.title}`)
  } else {
    console.log(`  Closest matches:`)
    const closeMatches = entries
      .filter(entry => getSlug(entry.route).includes(slug.split('-')[0]))
      .slice(0, 3)
    closeMatches.forEach(m => {
      console.log(`    - ${getSlug(m.route)} (${m.route})`)
    })
  }
  console.log('')
})

console.log('\n--- Slug Collision Detection ---\n')

const slugMap: Record<string, typeof entries> = {}
entries.forEach(entry => {
  const slug = getSlug(entry.route)
  if (!slugMap[slug]) {
    slugMap[slug] = []
  }
  slugMap[slug].push(entry)
})

const collisions = Object.entries(slugMap).filter(([_, entries]) => entries.length > 1)
console.log(`Found ${collisions.length} slug collisions:`)
collisions.forEach(([slug, entries]) => {
  console.log(`  Slug: "${slug}" (${entries.length} entries)`)
  entries.forEach(e => {
    console.log(`    - ${e.route} (${e.journey})`)
  })
})

if (collisions.length === 0) {
  console.log('  No collisions found - all slugs are unique')
}

console.log('\n=== END OF DEBUG REPORT ===')
