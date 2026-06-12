// scripts/governance/validate-routes-governance.ts
// Governance validator to prevent hardcoded route strings

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { routeRegistry, routeExists } from '../../packages/routes-ssot';

const SRC_DIR = join(process.cwd(), 'src');

const ROUTE_PATTERNS = [
  /['"`](\/[^'"`]+)['"`]/g, // '/path' or "/path" or `/path`
  /href\s*=\s*['"`](\/[^'"`]+)['"`]/gi, // href="/path"
  /to\s*=\s*['"`](\/[^'"`]+)['"`]/gi, // to="/path"
  /push\s*\(\s*['"`](\/[^'"`]+)['"`]\s*\)/gi, // router.push('/path')
  /replace\s*\(\s*['"`](\/[^'"`]+)['"`]\s*\)/gi, // router.replace('/path')
];

function scanDirectory(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  if (!existsSync(dir)) {
    return files;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and .next directories
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        files.push(...scanDirectory(fullPath, extensions));
      }
    } else if (entry.isFile()) {
      const ext = entry.name.split('.').pop();
      if (extensions.includes(ext || '')) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function findHardcodedRoutes(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf-8');
  const hardcodedRoutes: string[] = [];

  for (const pattern of ROUTE_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const route = match[1];
      // Filter out common non-route patterns
      if (
        !route.startsWith('//') && // Not a comment
        !route.startsWith('/api') && // API routes are allowed
        !route.startsWith('/_next') && // Next.js internal routes
        !route.includes('http') && // Not a URL
        !route.includes('localhost') && // Not localhost
        route.length > 1 // Not just '/'
      ) {
        hardcodedRoutes.push(route);
      }
    }
  }

  return [...new Set(hardcodedRoutes)]; // Remove duplicates
}

console.log('🔍 Validating Route Governance...\n');

const sourceFiles = scanDirectory(SRC_DIR, ['ts', 'tsx', 'js', 'jsx']);
console.log(`Scanning ${sourceFiles.length} source files for hardcoded routes\n`);

const violations: string[] = [];

for (const file of sourceFiles) {
  const hardcodedRoutes = findHardcodedRoutes(file);
  
  for (const route of hardcodedRoutes) {
    // Check if route exists in routes-ssot
    const routeExistsInRegistry = Object.values(routeRegistry).some(
      (r) => r.path === route || route.startsWith(r.path.replace(/\[.*?\]/g, ''))
    );

    if (!routeExistsInRegistry) {
      violations.push(
        `Hardcoded route found in ${file.replace(process.cwd(), '')}: "${route}" - Not registered in routes-ssot`
      );
    }
  }
}

if (violations.length === 0) {
  console.log('✅ No hardcoded routes found outside routes-ssot!\n');
  process.exit(0);
} else {
  console.log(`❌ Found ${violations.length} route governance violations:\n`);
  violations.forEach((violation) => {
    console.log(`  - ${violation}`);
  });
  console.log('\n');
  console.log('To fix these violations:');
  console.log('1. Use the routes helper from @gv/routes-ssot');
  console.log('2. Example: import { routes } from "@gv/routes-ssot";');
  console.log('3. Replace hardcoded strings with routes.home(), routes.productsList(), etc.\n');
  process.exit(1);
}
