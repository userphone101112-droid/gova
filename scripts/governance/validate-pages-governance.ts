// scripts/governance/validate-pages-governance.ts
// Governance validator to prevent unauthorized page files

import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { pageRegistry, pageExists } from '../../packages/pages-ssot';

const APP_DIR = join(process.cwd(), 'src', 'app');

interface PageFile {
  path: string;
  type: 'page' | 'layout' | 'loading' | 'error' | 'not-found';
  route: string;
}

function scanAppDirectory(dir: string, baseRoute: string = ''): PageFile[] {
  const pages: PageFile[] = [];
  
  if (!existsSync(dir)) {
    return pages;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = fullPath.replace(APP_DIR, '').replace(/\\/g, '/');

    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      const subPages = scanAppDirectory(fullPath, join(baseRoute, entry.name));
      pages.push(...subPages);
    } else if (entry.isFile()) {
      // Check for Next.js special files
      if (entry.name === 'page.tsx') {
        pages.push({
          path: fullPath,
          type: 'page',
          route: baseRoute || '/',
        });
      } else if (entry.name === 'layout.tsx') {
        pages.push({
          path: fullPath,
          type: 'layout',
          route: baseRoute || '/',
        });
      } else if (entry.name === 'loading.tsx') {
        pages.push({
          path: fullPath,
          type: 'loading',
          route: baseRoute || '/',
        });
      } else if (entry.name === 'error.tsx') {
        pages.push({
          path: fullPath,
          type: 'error',
          route: baseRoute || '/',
        });
      } else if (entry.name === 'not-found.tsx') {
        pages.push({
          path: fullPath,
          type: 'not-found',
          route: baseRoute || '/',
        });
      }
    }
  }

  return pages;
}

function getPageIdFromRoute(route: string, type: string): string {
  // Convert route to page ID format
  // e.g., '/products/[id]' -> 'product-details'
  // e.g., '/products/new' -> 'product-create'
  // e.g., '/' -> 'home'
  
  if (route === '/' && type === 'page') return 'home';
  if (route === '/' && type === 'layout') return 'root-layout';
  
  // Remove leading slash and convert to kebab-case
  const cleanRoute = route.replace(/^\//, '').replace(/\[.*?\]/g, 'id');
  
  // Common route to page ID mappings
  const mappings: Record<string, string> = {
    'login': 'login',
    'register': 'register',
    'profile': 'profile',
    'settings': 'settings',
    'products': 'products-list',
    'products/id': 'product-details',
    'products/new': 'product-create',
    'cart': 'cart',
    'checkout': 'checkout',
    'orders': 'orders-list',
    'orders/id': 'order-details',
    'merchants/id': 'merchant-profile',
    'merchants/dashboard': 'merchant-dashboard',
    'admin': 'admin-dashboard',
  };

  return mappings[cleanRoute] || cleanRoute.replace(/\//g, '-');
}

console.log('🔍 Validating Page Governance...\n');

const pageFiles = scanAppDirectory(APP_DIR);
console.log(`Found ${pageFiles.length} page files in src/app/\n`);

const violations: string[] = [];

for (const pageFile of pageFiles) {
  const pageId = getPageIdFromRoute(pageFile.route, pageFile.type);
  
  if (!pageExists(pageId)) {
    violations.push(
      `Unauthorized ${pageFile.type} file: ${pageFile.path} (route: ${pageFile.route}) - Not registered in pages-ssot (expected ID: ${pageId})`
    );
  }
}

if (violations.length === 0) {
  console.log('✅ All page files are registered in pages-ssot!\n');
  process.exit(0);
} else {
  console.log(`❌ Found ${violations.length} page governance violations:\n`);
  violations.forEach((violation) => {
    console.log(`  - ${violation}`);
  });
  console.log('\n');
  console.log('To fix these violations:');
  console.log('1. Register the page in packages/pages-ssot/index.ts');
  console.log('2. Run validation: npm run validate:pages');
  console.log('3. Commit the changes\n');
  process.exit(1);
}
