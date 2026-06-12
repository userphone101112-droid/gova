// @gv/forms-ssot/scripts/validate-forms.ts
// Validation script for form registry

import { validateFormRegistry } from '../index';

console.log('🔍 Validating Form Registry...\n');

const result = validateFormRegistry();

if (result.valid) {
  console.log('✅ Form registry is valid!\n');
  process.exit(0);
} else {
  console.log('❌ Form registry validation failed!\n');
  console.log('Errors:\n');
  result.errors.forEach((error) => {
    console.log(`  - ${error}`);
  });
  console.log('\n');
  process.exit(1);
}
