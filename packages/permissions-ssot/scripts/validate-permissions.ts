// @gv/permissions-ssot/scripts/validate-permissions.ts
// Validation script for permission registry

import { validatePermissionRegistry } from '../index';

console.log('🔍 Validating Permission Registry...\n');

const result = validatePermissionRegistry();

if (result.valid) {
  console.log('✅ Permission registry is valid!\n');
  process.exit(0);
} else {
  console.log('❌ Permission registry validation failed!\n');
  console.log('Errors:\n');
  result.errors.forEach((error) => {
    console.log(`  - ${error}`);
  });
  console.log('\n');
  process.exit(1);
}
