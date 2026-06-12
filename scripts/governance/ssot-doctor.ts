// scripts/governance/ssot-doctor.ts
// SSOT Doctor - Health check for all SSOT packages

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

interface SSOTHealth {
  id: string;
  name: string;
  packageName: string;
  status: 'healthy' | 'warning' | 'critical';
  checks: {
    packageExists: boolean;
    hasIndex: boolean;
    hasValidation: boolean;
    hasDocumentation: boolean;
    hasOwner: boolean;
    isUsed: boolean;
    isComplete: boolean;
  };
  issues: string[];
}

const ssotHealthReports: SSOTHealth[] = [];

// SSOT packages to check
const ssotPackages = [
  { id: 'theme', name: 'Theme SSOT', packageName: '@gv/theme' },
  { id: 'translation', name: 'Translation SSOT', packageName: '@gv/translations' },
  { id: 'contract', name: 'Contracts SSOT', packageName: '@gv/contracts' },
  { id: 'schema', name: 'Schemas SSOT', packageName: '@gv/schemas' },
  { id: 'page', name: 'Pages SSOT', packageName: '@gv/pages-ssot' },
  { id: 'route', name: 'Routes SSOT', packageName: '@gv/routes-ssot' },
  { id: 'navigation', name: 'Navigation SSOT', packageName: '@gv/navigation-ssot' },
  { id: 'form', name: 'Forms SSOT', packageName: '@gv/forms-ssot' },
  { id: 'feature', name: 'Features SSOT', packageName: '@gv/features-ssot' },
  { id: 'auth', name: 'Auth SSOT', packageName: '@gv/auth' },
  { id: 'permission', name: 'Permissions SSOT', packageName: '@gv/permissions-ssot' },
  { id: 'analytics', name: 'Analytics SSOT', packageName: '@gv/analytics-ssot' },
  { id: 'business-rule', name: 'Business Rules SSOT', packageName: '@gv/business-rules' },
  { id: 'storage', name: 'Storage SSOT', packageName: '@gv/storage' },
  { id: 'database', name: 'Database SSOT', packageName: '@gv/domain' },
  { id: 'documentation', name: 'Documentation SSOT', packageName: 'docs/' },
  { id: 'ai-context', name: 'AI Context SSOT', packageName: 'docs/ai-context/' },
  { id: 'governance', name: 'Governance SSOT', packageName: '@gv/governance-ssot' },
];

function checkSSOTHealth(ssot: typeof ssotPackages[0]): SSOTHealth {
  const health: SSOTHealth = {
    id: ssot.id,
    name: ssot.name,
    packageName: ssot.packageName,
    status: 'healthy',
    checks: {
      packageExists: false,
      hasIndex: false,
      hasValidation: false,
      hasDocumentation: false,
      hasOwner: false,
      isUsed: false,
      isComplete: false,
    },
    issues: [],
  };

  // Determine package path
  let packagePath: string;
  if (ssot.packageName.startsWith('docs/')) {
    packagePath = join(process.cwd(), ssot.packageName);
  } else {
    const packageDir = ssot.packageName.replace('@gv/', '');
    packagePath = join(process.cwd(), 'packages', packageDir);
  }

  // Check package exists
  health.checks.packageExists = existsSync(packagePath);
  if (!health.checks.packageExists) {
    health.issues.push(`Package directory not found: ${packagePath}`);
    health.status = 'critical';
    return health;
  }

  // Check has index file
  const indexPath = join(packagePath, 'index.ts');
  health.checks.hasIndex = existsSync(indexPath);
  if (!health.checks.hasIndex) {
    health.issues.push('Missing index.ts file');
    health.status = 'warning';
  }

  // Check has validation script
  const scriptsPath = join(packagePath, 'scripts');
  const scriptsDir = existsSync(scriptsPath) ? readdirSync(scriptsPath) : [];
  health.checks.hasValidation = scriptsDir.some((file) => file.startsWith('validate-'));
  if (!health.checks.hasValidation && !ssot.packageName.startsWith('docs/')) {
    health.issues.push('Missing validation script');
    health.status = 'warning';
  }

  // Check has documentation
  const readmePath = join(packagePath, 'README.md');
  health.checks.hasDocumentation = existsSync(readmePath);
  if (!health.checks.hasDocumentation && !ssot.packageName.startsWith('docs/')) {
    health.issues.push('Missing README.md documentation');
    health.status = 'warning';
  }

  // Check has owner (from governance SSOT)
  const governancePath = join(process.cwd(), 'packages', 'governance-ssot', 'registry', 'index.ts');
  if (existsSync(governancePath)) {
    const governanceContent = readFileSync(governancePath, 'utf-8');
    health.checks.hasOwner = governanceContent.includes(`id: '${ssot.id}'`);
    if (!health.checks.hasOwner) {
      health.issues.push('Not registered in governance SSOT registry');
      health.status = 'warning';
    }
  }

  // Check is used (scan source files for imports)
  const srcDir = join(process.cwd(), 'src');
  if (existsSync(srcDir) && !ssot.packageName.startsWith('docs/')) {
    const importPattern = new RegExp(`from ['"]${ssot.packageName}['"]`, 'g');
    let usageCount = 0;

    function scanDirectory(dir: string) {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          try {
            const content = readFileSync(fullPath, 'utf-8');
            const matches = content.match(importPattern);
            if (matches) {
              usageCount += matches.length;
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    }

    scanDirectory(srcDir);
    health.checks.isUsed = usageCount > 0;
    if (!health.checks.isUsed) {
      health.issues.push('Package not used in source code');
      health.status = 'warning';
    }
  } else {
    health.checks.isUsed = true; // Docs packages don't need to be imported
  }

  // Check is complete (has all required fields)
  if (health.checks.hasIndex) {
    try {
      const indexContent = readFileSync(indexPath, 'utf-8');
      health.checks.isComplete = indexContent.includes('export') && indexContent.length > 100;
      if (!health.checks.isComplete) {
        health.issues.push('Index file appears incomplete');
        health.status = 'warning';
      }
    } catch (error) {
      health.issues.push('Could not read index file');
      health.status = 'warning';
    }
  }

  // Determine overall status
  if (health.issues.length === 0) {
    health.status = 'healthy';
  } else if (health.issues.some((issue) => issue.includes('not found'))) {
    health.status = 'critical';
  }

  return health;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🩺 SSOT Doctor\n');
console.log('====================================\n');

for (const ssot of ssotPackages) {
  console.log(`Checking ${ssot.name}...`);
  const health = checkSSOTHealth(ssot);
  ssotHealthReports.push(health);
  console.log(`  Status: ${health.status === 'healthy' ? '✅' : health.status === 'warning' ? '⚠️' : '❌'} ${health.status.toUpperCase()}\n`);
}

// ============================================================================
// SUMMARY
// ============================================================================

console.log('====================================');
console.log('📊 SSOT Health Summary\n');

const totalSSOTs = ssotHealthReports.length;
const healthySSOTs = ssotHealthReports.filter((h) => h.status === 'healthy').length;
const warningSSOTs = ssotHealthReports.filter((h) => h.status === 'warning').length;
const criticalSSOTs = ssotHealthReports.filter((h) => h.status === 'critical').length;

console.log(`Total SSOTs: ${totalSSOTs}`);
console.log(`Healthy: ${healthySSOTs}`);
console.log(`Warnings: ${warningSSOTs}`);
console.log(`Critical: ${criticalSSOTs}`);
console.log(`Health Score: ${((healthySSOTs / totalSSOTs) * 100).toFixed(1)}%\n`);

if (warningSSOTs > 0 || criticalSSOTs > 0) {
  console.log('⚠️  SSOTs with Issues:\n');

  ssotHealthReports
    .filter((h) => h.status !== 'healthy')
    .forEach((health) => {
      console.log(`${health.name} (${health.packageName})`);
      console.log(`  Status: ${health.status.toUpperCase()}`);
      console.log('  Issues:');
      health.issues.forEach((issue) => {
        console.log(`    - ${issue}`);
      });
      console.log();
    });

  console.log('\n');
  process.exit(1);
} else {
  console.log('✅ All SSOTs are healthy!\n');
  process.exit(0);
}
