// @gv/analytics-ssot/scripts/validate-analytics.ts
// Validation script for analytics event registry

import { validateAnalyticsEventRegistry } from '../index';

console.log('🔍 Validating Analytics Event Registry...\n');

const result = validateAnalyticsEventRegistry();

if (result.valid) {
  console.log('✅ Analytics event registry is valid!\n');
  process.exit(0);
} else {
  console.log('❌ Analytics event registry validation failed!\n');
  console.log('Errors:\n');
  result.errors.forEach((error) => {
    console.log(`  - ${error}`);
  });
  console.log('\n');
  process.exit(1);
}
