// scripts/governance/self-heal.ts
// Self-healing governance system

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

interface FixResult {
  type: string;
  description: string;
  fixed: boolean;
  details: string;
}

const fixResults: FixResult[] = [];

function fixMissingDocumentationHeaders() {
  console.log('🔧 Fixing missing documentation headers...\n');

  const docsDir = join(process.cwd(), 'docs');
  if (!existsSync(docsDir)) {
    fixResults.push({
      type: 'documentation-headers',
      description: 'Fix missing documentation headers',
      fixed: false,
      details: 'docs/ directory not found',
    });
    return;
  }

  let fixedCount = 0;

  function scanDir(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          
          // Check if header exists
          if (!content.includes('> **Source**:') && !content.includes('<!-- Source:')) {
            const relativePath = fullPath.replace(process.cwd(), '');
            const header = `> **Source**: \`${relativePath}\`\n> **Status**: Active\n> **Last Updated**: ${new Date().toISOString().split('T')[0]}\n\n`;
            
            const newContent = header + content;
            writeFileSync(fullPath, newContent, 'utf-8');
            fixedCount++;
          }
        } catch (error) {
          // Skip files that can't be read/written
        }
      }
    }
  }

  scanDir(docsDir);

  fixResults.push({
    type: 'documentation-headers',
    description: 'Fix missing documentation headers',
    fixed: true,
    details: `Fixed ${fixedCount} files`,
  });

  console.log(`✅ Fixed ${fixedCount} documentation headers\n`);
}

function fixMissingRegistryEntries() {
  console.log('🔧 Checking for missing SSOT registry entries...\n');

  const governanceRegistryPath = join(process.cwd(), 'packages', 'governance-ssot', 'registry', 'index.ts');
  if (!existsSync(governanceRegistryPath)) {
    fixResults.push({
      type: 'registry-entries',
      description: 'Fix missing SSOT registry entries',
      fixed: false,
      details: 'Governance registry not found',
    });
    return;
  }

  const packagesDir = join(process.cwd(), 'packages');
  if (!existsSync(packagesDir)) {
    fixResults.push({
      type: 'registry-entries',
      description: 'Fix missing SSOT registry entries',
      fixed: false,
      details: 'packages/ directory not found',
    });
    return;
  }

  const packages = readdirSync(packagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const registryContent = readFileSync(governanceRegistryPath, 'utf-8');
  let missingCount = 0;

  for (const pkg of packages) {
    if (pkg === 'governance-ssot') continue; // Skip governance package itself
    
    const packageName = `@gv/${pkg}`;
    if (!registryContent.includes(packageName)) {
      missingCount++;
      console.log(`⚠️  Package ${packageName} not in registry - manual entry required`);
    }
  }

  fixResults.push({
    type: 'registry-entries',
    description: 'Fix missing SSOT registry entries',
    fixed: missingCount === 0,
    details: missingCount === 0 ? 'All packages registered' : `${missingCount} packages need manual registration`,
  });

  console.log(`✅ Registry check complete\n`);
}

function fixBrokenDocumentationLinks() {
  console.log('🔧 Checking for broken documentation links...\n');

  const docsDir = join(process.cwd(), 'docs');
  if (!existsSync(docsDir)) {
    fixResults.push({
      type: 'documentation-links',
      description: 'Fix broken documentation links',
      fixed: false,
      details: 'docs/ directory not found',
    });
    return;
  }

  let brokenLinks = 0;

  function scanDir(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          
          // Find markdown links
          const linkMatches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
          for (const match of linkMatches) {
            const linkTarget = match[2];
            
            // Check if it's a relative link
            if (linkTarget.startsWith('./') || linkTarget.startsWith('../') || linkTarget.startsWith('/docs/')) {
              const targetPath = linkTarget.startsWith('/docs/')
                ? join(process.cwd(), linkTarget)
                : join(dir, linkTarget);
              
              if (!existsSync(targetPath)) {
                brokenLinks++;
              }
            }
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }

  scanDir(docsDir);

  fixResults.push({
    type: 'documentation-links',
    description: 'Fix broken documentation links',
    fixed: brokenLinks === 0,
    details: brokenLinks === 0 ? 'No broken links found' : `${brokenLinks} broken links detected (manual fix required)`,
  });

  console.log(`✅ Link check complete\n`);
}

function fixMissingGovernanceMetadata() {
  console.log('🔧 Checking for missing governance metadata...\n');

  const governanceDir = join(process.cwd(), 'packages', 'governance-ssot');
  if (!existsSync(governanceDir)) {
    fixResults.push({
      type: 'governance-metadata',
      description: 'Fix missing governance metadata',
      fixed: false,
      details: 'Governance SSOT not found',
    });
    return;
  }

  let missingMetadata = 0;

  // Check for required subdirectories
  const requiredDirs = ['policies', 'workflows', 'validators', 'ownership', 'standards', 'templates', 'compliance', 'registry'];
  for (const dir of requiredDirs) {
    if (!existsSync(join(governanceDir, dir))) {
      missingMetadata++;
      console.log(`⚠️  Missing governance directory: ${dir}`);
    }
  }

  fixResults.push({
    type: 'governance-metadata',
    description: 'Fix missing governance metadata',
    fixed: missingMetadata === 0,
    details: missingMetadata === 0 ? 'All governance metadata present' : `${missingMetadata} directories missing (manual fix required)`,
  });

  console.log(`✅ Governance metadata check complete\n`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🏥 Self-Healing Governance System\n');
console.log('====================================\n');

fixMissingDocumentationHeaders();
fixMissingRegistryEntries();
fixBrokenDocumentationLinks();
fixMissingGovernanceMetadata();

// ============================================================================
// SUMMARY
// ============================================================================

console.log('====================================');
console.log('📊 Self-Healing Summary\n');

const totalFixes = fixResults.length;
const successfulFixes = fixResults.filter((f) => f.fixed).length;
const failedFixes = fixResults.filter((f) => !f.fixed).length;

console.log(`Total Checks: ${totalFixes}`);
console.log(`Successfully Fixed: ${successfulFixes}`);
console.log(`Requires Manual Fix: ${failedFixes}\n`);

fixResults.forEach((result) => {
  const status = result.fixed ? '✅' : '⚠️';
  console.log(`${status} ${result.description}`);
  console.log(`   ${result.details}\n`);
});

if (failedFixes > 0) {
  console.log('⚠️  Some issues require manual intervention\n');
  process.exit(1);
} else {
  console.log('✅ All self-healing checks passed!\n');
  process.exit(0);
}
