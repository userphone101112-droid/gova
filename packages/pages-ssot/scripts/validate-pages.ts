// @gv/pages-ssot/scripts/validate-pages.ts
// Validation script for page registry

import { validatePageRegistry } from '../index';

console.log('🔍 Validating Page Registry...\n');

const result = validatePageRegistry();

if (result.valid) {
  console.log('✅ Page registry is valid!\n');
  process.exit(0);
} else {
  console.log('❌ Page registry validation failed!\n');
  console.log('Errors:\n');
  result.errors.forEach((error) => {
    console.log(`  - ${error}`);
  });
  console.log('\n');
  process.exit(1);
}
