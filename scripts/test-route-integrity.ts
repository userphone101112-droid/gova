import { validateRouteIntegrity, printValidationReport, throwOnValidationError } from '../features/stitch/guards/route-integrity-guard'

try {
  const result = validateRouteIntegrity()
  printValidationReport(result)
  throwOnValidationError(result)
} catch (error) {
  console.error('Route integrity validation failed:', error)
  process.exit(1)
}
