// @gv/governance-ssot/scripts/validate-governance-ssot.ts
// Validation script for governance SSOT

import { validateGovernanceSSOT } from '../index';

console.log('🔍 Validating Governance SSOT...\n');

const result = validateGovernanceSSOT();

if (result.valid) {
  console.log('✅ Governance SSOT is valid!\n');
  process.exit(0);
} else {
  console.log('❌ Governance SSOT validation failed!\n');
  console.log('Errors:\n');
  result.errors.forEach((error) => {
    console.log(`  - ${error}`);
  });
  console.log('\n');
  process.exit(1);
}
