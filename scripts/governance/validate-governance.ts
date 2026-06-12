// scripts/governance/validate-governance.ts
// Comprehensive governance compliance engine

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  name: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function runCommand(command: string, description: string): ValidationResult {
  console.log(`\n🔍 ${description}...`);
  try {
    execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    console.log(`✅ ${description} passed`);
    return { name: description, valid: true, errors: [], warnings: [] };
  } catch (error: any) {
    console.log(`❌ ${description} failed`);
    const errors = error.stdout || error.message || 'Unknown error';
    return { name: description, valid: false, errors: [errors], warnings: [] };
  }
}

function checkFileExists(path: string, description: string): ValidationResult {
  console.log(`\n🔍 Checking ${description}...`);
  if (existsSync(join(process.cwd(), path))) {
    console.log(`✅ ${description} exists`);
    return { name: description, valid: true, errors: [], warnings: [] };
  } else {
    console.log(`❌ ${description} missing`);
    return { name: description, valid: false, errors: [`${description} not found at ${path}`], warnings: [] };
  }
}

console.log('🏛️  Governance Compliance Engine\n');
console.log('====================================\n');

const results: ValidationResult[] = [];

// ============================================================================
// SSOT COMPLIANCE
// ============================================================================

console.log('\n📦 SSOT Compliance\n');

results.push(runCommand('npm run validate:governance-ssot', 'Governance SSOT Validation'));
results.push(runCommand('npm run validate:features', 'Features SSOT Validation'));
results.push(runCommand('npm run validate:pages', 'Pages SSOT Validation'));
results.push(runCommand('npm run validate:routes', 'Routes SSOT Validation'));
results.push(runCommand('npm run validate:navigation', 'Navigation SSOT Validation'));
results.push(runCommand('npm run validate:forms', 'Forms SSOT Validation'));
results.push(runCommand('npm run validate:permissions', 'Permissions SSOT Validation'));
results.push(runCommand('npm run validate:analytics', 'Analytics SSOT Validation'));
results.push(runCommand('npm run validate:ssot', 'Shared SSOT Validation'));

// ============================================================================
// DOCUMENTATION COMPLIANCE
// ============================================================================

console.log('\n📚 Documentation Compliance\n');

results.push(runCommand('npm run validate:docs', 'Documentation Validation'));
results.push(runCommand('npm run validate:links', 'Documentation Links Validation'));

// ============================================================================
// TRACEABILITY COMPLIANCE
// ============================================================================

console.log('\n🔗 Traceability Compliance\n');

results.push(runCommand('tsx scripts/governance/validate-traceability.ts', 'Traceability Validation'));

// ============================================================================
// WORKFLOW COMPLIANCE
// ============================================================================

console.log('\n⚙️  Workflow Compliance\n');

results.push(runCommand('npm run validate:governance:pages', 'Page Governance Validation'));
results.push(runCommand('npm run validate:governance:routes', 'Route Governance Validation'));
results.push(runCommand('npm run validate:governance:features', 'Feature Governance Validation'));
results.push(runCommand('npm run validate:governance:forms', 'Form Governance Validation'));

// ============================================================================
// ARCHITECTURE COMPLIANCE
// ============================================================================

console.log('\n🏗️  Architecture Compliance\n');

results.push(runCommand('npm run typecheck', 'TypeScript Type Check'));
results.push(runCommand('npm run lint', 'ESLint Validation'));

// Check for governance SSOT package
results.push(checkFileExists('packages/governance-ssot', 'Governance SSOT Package'));

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n====================================');
console.log('📊 Governance Compliance Summary\n');

const totalChecks = results.length;
const passedChecks = results.filter((r) => r.valid).length;
const failedChecks = results.filter((r) => !r.valid).length;

console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${failedChecks}`);
console.log(`Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%\n`);

if (failedChecks > 0) {
  console.log('❌ Failed Checks:\n');
  results.filter((r) => !r.valid).forEach((result) => {
    console.log(`  - ${result.name}`);
    result.errors.forEach((error) => {
      console.log(`    ${error}`);
    });
  });
  console.log('\n');
  process.exit(1);
} else {
  console.log('✅ All governance compliance checks passed!\n');
  process.exit(0);
}
