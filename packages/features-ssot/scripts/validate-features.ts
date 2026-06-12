// @gv/features-ssot/scripts/validate-features.ts
// Validation script for feature registry

import { validateFeatureRegistry } from '../index';

console.log('🔍 Validating Feature Registry...\n');

const result = validateFeatureRegistry();

if (result.valid) {
  console.log('✅ Feature registry is valid!\n');
  process.exit(0);
} else {
  console.log('❌ Feature registry validation failed!\n');
  console.log('Errors:\n');
  result.errors.forEach((error) => {
    console.log(`  - ${error}`);
  });
  console.log('\n');
  process.exit(1);
}
