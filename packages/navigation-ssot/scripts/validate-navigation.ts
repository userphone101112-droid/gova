// @gv/navigation-ssot/scripts/validate-navigation.ts
// Validation script for navigation registry

import { validateNavigationRegistry } from '../index';

console.log('🔍 Validating Navigation Registry...\n');

const result = validateNavigationRegistry();

if (result.valid) {
  console.log('✅ Navigation registry is valid!\n');
  process.exit(0);
} else {
  console.log('❌ Navigation registry validation failed!\n');
  console.log('Errors:\n');
  result.errors.forEach((error) => {
    console.log(`  - ${error}`);
  });
  console.log('\n');
  process.exit(1);
}
