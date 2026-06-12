// scripts/governance/validate-features-governance.ts
// Governance validator to prevent unauthorized feature folders

import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { featureRegistry, featureExists } from '../../packages/features-ssot';

const FEATURES_DIR = join(process.cwd(), 'src', 'features');

console.log('🔍 Validating Feature Governance...\n');

if (!existsSync(FEATURES_DIR)) {
  console.log('✅ No features directory found - no violations\n');
  process.exit(0);
}

const featureFolders = readdirSync(FEATURES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

console.log(`Found ${featureFolders.length} feature folders in src/features/\n`);

const violations: string[] = [];

for (const folderName of featureFolders) {
  // Convert folder name to feature ID format
  const featureId = folderName.toLowerCase().replace(/_/g, '-');
  
  if (!featureExists(featureId)) {
    violations.push(
      `Unauthorized feature folder: src/features/${folderName} - Not registered in features-ssot (expected ID: ${featureId})`
    );
  }
}

if (violations.length === 0) {
  console.log('✅ All feature folders are registered in features-ssot!\n');
  process.exit(0);
} else {
  console.log(`❌ Found ${violations.length} feature governance violations:\n`);
  violations.forEach((violation) => {
    console.log(`  - ${violation}`);
  });
  console.log('\n');
  console.log('To fix these violations:');
  console.log('1. Register the feature in packages/features-ssot/index.ts');
  console.log('2. Run validation: npm run validate:features');
  console.log('3. Commit the changes\n');
  process.exit(1);
}
