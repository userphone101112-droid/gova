// @gv/routes-ssot/scripts/validate-routes.ts
// Validation script for route registry

import { validateRouteRegistry } from '../index';

console.log('🔍 Validating Route Registry...\n');

const result = validateRouteRegistry();

if (result.valid) {
  console.log('✅ Route registry is valid!\n');
  process.exit(0);
} else {
  console.log('❌ Route registry validation failed!\n');
  console.log('Errors:\n');
  result.errors.forEach((error) => {
    console.log(`  - ${error}`);
  });
  console.log('\n');
  process.exit(1);
}
