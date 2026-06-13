import stitchRouteMap, { StitchRouteEntry } from '../routes/stitch-route-map'

type ValidationResult = {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  summary: ValidationSummary
}

type ValidationError = {
  type: 'INVALID_ROUTE_PREFIX' | 'DUPLICATE_SLUG' | 'INVALID_JOURNEY' | 'MISSING_ROUTE'
  route?: string
  slug?: string
  journey?: string
  message: string
}

type ValidationWarning = {
  type: 'POTENTIAL_CONFLICT' | 'UNEXPECTED_PATTERN'
  route?: string
  slug?: string
  journey?: string
  message: string
}

type ValidationSummary = {
  totalRoutes: number
  validRoutes: number
  invalidRoutes: number
  duplicateSlugs: number
  journeys: Record<string, number>
}

const VALID_JOURNEYS = ['buyer', 'seller', 'admin', 'service', 'guest'] as const
const JOURNEY_PREFIXES: Record<string, string> = {
  buyer: '/buyer',
  seller: '/seller',
  admin: '/admin',
  service: '/service',
  guest: '/guest',
}

function getSlug(route: string): string {
  return route.split('/').filter(Boolean).pop() || ''
}

function validateRoutePrefix(entry: StitchRouteEntry): ValidationError | null {
  const expectedPrefix = JOURNEY_PREFIXES[entry.journey]
  
  if (!expectedPrefix) {
    return {
      type: 'INVALID_JOURNEY',
      journey: entry.journey,
      message: `Invalid journey "${entry.journey}". Expected one of: ${VALID_JOURNEYS.join(', ')}`
    }
  }

  if (!entry.route.startsWith(expectedPrefix)) {
    return {
      type: 'INVALID_ROUTE_PREFIX',
      route: entry.route,
      journey: entry.journey,
      message: `Route "${entry.route}" does not start with expected prefix "${expectedPrefix}" for journey "${entry.journey}"`
    }
  }

  return null
}

function validateSlugUniqueness(entries: StitchRouteEntry[]): ValidationError[] {
  const slugMap: Record<string, StitchRouteEntry[]> = {}
  const errors: ValidationError[] = []

  entries.forEach(entry => {
    const slug = getSlug(entry.route)
    if (!slugMap[slug]) {
      slugMap[slug] = []
    }
    slugMap[slug].push(entry)
  })

  Object.entries(slugMap).forEach(([slug, entries]) => {
    if (entries.length > 1) {
      errors.push({
        type: 'DUPLICATE_SLUG',
        slug,
        message: `Slug "${slug}" is used by ${entries.length} different routes: ${entries.map(e => e.route).join(', ')}`
      })
    }
  })

  return errors
}

export function validateRouteIntegrity(): ValidationResult {
  const entries = Object.values(stitchRouteMap)
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const journeyCounts: Record<string, number> = {}

  // Count journeys
  entries.forEach(entry => {
    journeyCounts[entry.journey] = (journeyCounts[entry.journey] || 0) + 1
  })

  // Validate each route
  entries.forEach(entry => {
    const prefixError = validateRoutePrefix(entry)
    if (prefixError) {
      errors.push(prefixError)
    }
  })

  // Check for duplicate slugs
  const duplicateErrors = validateSlugUniqueness(entries)
  errors.push(...duplicateErrors)

  // Build summary
  const summary: ValidationSummary = {
    totalRoutes: entries.length,
    validRoutes: entries.length - errors.length,
    invalidRoutes: errors.length,
    duplicateSlugs: duplicateErrors.length,
    journeys: journeyCounts
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary
  }
}

export function printValidationReport(result: ValidationResult): void {
  console.log('\n=== STITCH ROUTE INTEGRITY GUARD REPORT ===\n')
  
  console.log('SUMMARY:')
  console.log(`  Total Routes: ${result.summary.totalRoutes}`)
  console.log(`  Valid Routes: ${result.summary.validRoutes}`)
  console.log(`  Invalid Routes: ${result.summary.invalidRoutes}`)
  console.log(`  Duplicate Slugs: ${result.summary.duplicateSlugs}`)
  console.log('')
  
  console.log('ROUTES BY JOURNEY:')
  Object.entries(result.summary.journeys).forEach(([journey, count]) => {
    console.log(`  ${journey}: ${count} routes`)
  })
  console.log('')

  if (result.errors.length > 0) {
    console.log('ERRORS:')
    result.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. [${error.type}] ${error.message}`)
      if (error.route) console.log(`     Route: ${error.route}`)
      if (error.slug) console.log(`     Slug: ${error.slug}`)
      if (error.journey) console.log(`     Journey: ${error.journey}`)
    })
    console.log('')
  }

  if (result.warnings.length > 0) {
    console.log('WARNINGS:')
    result.warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. [${warning.type}] ${warning.message}`)
      if (warning.route) console.log(`     Route: ${warning.route}`)
    })
    console.log('')
  }

  if (result.valid) {
    console.log('✅ VALIDATION PASSED - All routes are valid')
  } else {
    console.log('❌ VALIDATION FAILED - Please fix the errors above')
  }
  
  console.log('\n=== END OF REPORT ===\n')
}

export function throwOnValidationError(result: ValidationResult): void {
  if (!result.valid) {
    printValidationReport(result)
    throw new Error(`Stitch Route Integrity Validation Failed: ${result.errors.length} error(s) found`)
  }
}
