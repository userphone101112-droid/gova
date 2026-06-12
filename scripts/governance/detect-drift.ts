// scripts/governance/detect-drift.ts
// Architecture drift detection engine

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

interface DriftIssue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  location: string;
  description: string;
}

const driftIssues: DriftIssue[] = [];

// ============================================================================
// DUPLICATE DTO DETECTION
// ============================================================================

function detectDuplicateDTOs() {
  console.log('🔍 Detecting duplicate DTOs...\n');

  const contractsPath = join(process.cwd(), 'packages', 'contracts', 'index.ts');
  if (!existsSync(contractsPath)) {
    console.log('⚠️  Contracts package not found\n');
    return;
  }

  const contractsContent = readFileSync(contractsPath, 'utf-8');
  const dtoPattern = /export interface (\w+DTO)/g;
  const dtos: string[] = [];
  let match;

  while ((match = dtoPattern.exec(contractsContent)) !== null) {
    dtos.push(match[1]);
  }

  // Scan source files for local DTO definitions
  const srcDir = join(process.cwd(), 'src');
  if (existsSync(srcDir)) {
    scanDirectory(srcDir, (filePath, content) => {
      const localDtos = content.match(/export interface (\w+DTO)/g);
      if (localDtos) {
        localDtos.forEach((dto) => {
          const dtoName = dto.replace('export interface ', '');
          if (dtos.includes(dtoName)) {
            driftIssues.push({
              type: 'duplicate-dto',
              severity: 'error',
              location: filePath,
              description: `Duplicate DTO definition: ${dtoName} (should use @gv/contracts)`,
            });
          } else {
            driftIssues.push({
              type: 'unauthorized-dto',
              severity: 'error',
              location: filePath,
              description: `Unauthorized DTO definition: ${dtoName} (should use @gv/contracts)`,
            });
          }
        });
      }
    });
  }

  console.log(`✅ DTO scan complete\n`);
}

// ============================================================================
// DUPLICATE SCHEMA DETECTION
// ============================================================================

function detectDuplicateSchemas() {
  console.log('🔍 Detecting duplicate schemas...\n');

  const schemasPath = join(process.cwd(), 'packages', 'schemas', 'index.ts');
  if (!existsSync(schemasPath)) {
    console.log('⚠️  Schemas package not found\n');
    return;
  }

  const schemasContent = readFileSync(schemasPath, 'utf-8');
  const schemaPattern = /export const (\w+Schema)/g;
  const schemas: string[] = [];
  let match;

  while ((match = schemaPattern.exec(schemasContent)) !== null) {
    schemas.push(match[1]);
  }

  // Scan source files for local schema definitions
  const srcDir = join(process.cwd(), 'src');
  if (existsSync(srcDir)) {
    scanDirectory(srcDir, (filePath, content) => {
      const localSchemas = content.match(/export const (\w+Schema)/g);
      if (localSchemas) {
        localSchemas.forEach((schema) => {
          const schemaName = schema.replace('export const ', '');
          if (schemas.includes(schemaName)) {
            driftIssues.push({
              type: 'duplicate-schema',
              severity: 'error',
              location: filePath,
              description: `Duplicate schema definition: ${schemaName} (should use @gv/schemas)`,
            });
          } else {
            driftIssues.push({
              type: 'unauthorized-schema',
              severity: 'error',
              location: filePath,
              description: `Unauthorized schema definition: ${schemaName} (should use @gv/schemas)`,
            });
          }
        });
      }
    });
  }

  console.log(`✅ Schema scan complete\n`);
}

// ============================================================================
// DUPLICATE ROUTE DETECTION
// ============================================================================

function detectDuplicateRoutes() {
  console.log('🔍 Detecting duplicate routes...\n');

  const srcDir = join(process.cwd(), 'src', 'app');
  if (!existsSync(srcDir)) {
    console.log('⚠️  src/app directory not found\n');
    return;
  }

  const routeStrings: string[] = [];

  scanDirectory(srcDir, (filePath, content) => {
    // Find hardcoded route strings
    const routeMatches = content.match(/['"`](\/[^'"`]+)['"`]/g);
    if (routeMatches) {
      routeMatches.forEach((route) => {
        const cleanRoute = route.replace(/['"`]/g, '');
        if (
          !cleanRoute.startsWith('//') &&
          !cleanRoute.startsWith('/api') &&
          !cleanRoute.startsWith('/_next') &&
          !cleanRoute.includes('http') &&
          !cleanRoute.includes('localhost') &&
          cleanRoute.length > 1
        ) {
          if (routeStrings.includes(cleanRoute)) {
            driftIssues.push({
              type: 'duplicate-route',
              severity: 'warning',
              location: filePath,
              description: `Duplicate hardcoded route: ${cleanRoute} (should use @gv/routes-ssot)`,
            });
          } else {
            routeStrings.push(cleanRoute);
            driftIssues.push({
              type: 'hardcoded-route',
              severity: 'error',
              location: filePath,
              description: `Hardcoded route string: ${cleanRoute} (should use @gv/routes-ssot)`,
            });
          }
        }
      });
    }
  });

  console.log(`✅ Route scan complete\n`);
}

// ============================================================================
// DUPLICATE PERMISSION DETECTION
// ============================================================================

function detectDuplicatePermissions() {
  console.log('🔍 Detecting duplicate permissions...\n');

  const permissionsPath = join(process.cwd(), 'packages', 'permissions-ssot', 'index.ts');
  if (!existsSync(permissionsPath)) {
    console.log('⚠️  Permissions SSOT not found\n');
    return;
  }

  const permissionsContent = readFileSync(permissionsPath, 'utf-8');
  const permissionPattern = /id:\s*['"`]([^'"`]+)['"`]/g;
  const permissions: string[] = [];
  let match;

  while ((match = permissionPattern.exec(permissionsContent)) !== null) {
    permissions.push(match[1]);
  }

  // Scan source files for local permission definitions
  const srcDir = join(process.cwd(), 'src');
  if (existsSync(srcDir)) {
    scanDirectory(srcDir, (filePath, content) => {
      const permissionMatches = content.match(/['"`]([a-z]+:[a-z]+)['"`]/g);
      if (permissionMatches) {
        permissionMatches.forEach((perm) => {
          const cleanPerm = perm.replace(/['"`]/g, '');
          if (permissions.includes(cleanPerm)) {
            driftIssues.push({
              type: 'duplicate-permission',
              severity: 'error',
              location: filePath,
              description: `Duplicate permission: ${cleanPerm} (should use @gv/permissions-ssot)`,
            });
          } else {
            driftIssues.push({
              type: 'unauthorized-permission',
              severity: 'error',
              location: filePath,
              description: `Unauthorized permission: ${cleanPerm} (should use @gv/permissions-ssot)`,
            });
          }
        });
      }
    });
  }

  console.log(`✅ Permission scan complete\n`);
}

// ============================================================================
// DUPLICATE TRANSLATION DETECTION
// ============================================================================

function detectDuplicateTranslations() {
  console.log('🔍 Detecting duplicate translations...\n');

  const translationsPath = join(process.cwd(), 'packages', 'translations', 'index.ts');
  if (!existsSync(translationsPath)) {
    console.log('⚠️  Translations package not found\n');
    return;
  }

  const translationsContent = readFileSync(translationsPath, 'utf-8');
  const translationPattern = /['"`]([a-z.]+)['"`]:/g;
  const translations: string[] = [];
  let match;

  while ((match = translationPattern.exec(translationsContent)) !== null) {
    translations.push(match[1]);
  }

  // Scan source files for hardcoded strings
  const srcDir = join(process.cwd(), 'src');
  if (existsSync(srcDir)) {
    scanDirectory(srcDir, (filePath, content) => {
      // Find hardcoded user-facing strings (simple heuristic)
      const stringMatches = content.match(/['"`]([A-Z][a-z]+(?: [a-z]+)+)['"`]/g);
      if (stringMatches) {
        stringMatches.forEach((str) => {
          driftIssues.push({
            type: 'hardcoded-string',
            severity: 'warning',
            location: filePath,
            description: `Hardcoded user-facing string: ${str} (should use @gv/translations)`,
          });
        });
      }
    });
  }

  console.log(`✅ Translation scan complete\n`);
}

// ============================================================================
// DUPLICATE BUSINESS RULE DETECTION
// ============================================================================

function detectDuplicateBusinessRules() {
  console.log('🔍 Detecting duplicate business rules...\n');

  const businessRulesPath = join(process.cwd(), 'packages', 'business-rules', 'index.ts');
  if (!existsSync(businessRulesPath)) {
    console.log('⚠️  Business rules package not found\n');
    return;
  }

  const businessRulesContent = readFileSync(businessRulesPath, 'utf-8');
  const rulePattern = /export const ([A-Z_]+)\s*=/g;
  const rules: string[] = [];
  let match;

  while ((match = rulePattern.exec(businessRulesContent)) !== null) {
    rules.push(match[1]);
  }

  // Scan source files for magic numbers
  const srcDir = join(process.cwd(), 'src');
  if (existsSync(srcDir)) {
    scanDirectory(srcDir, (filePath, content) => {
      // Find magic numbers (numbers that look like business limits)
      const numberMatches = content.match(/\b\d{2,}\b/g);
      if (numberMatches) {
        numberMatches.forEach((num) => {
          driftIssues.push({
            type: 'magic-number',
            severity: 'warning',
            location: filePath,
            description: `Potential magic number: ${num} (should use @gv/business-rules)`,
          });
        });
      }
    });
  }

  console.log(`✅ Business rule scan complete\n`);
}

// ============================================================================
// UNAUTHORIZED FOLDER DETECTION
// ============================================================================

function detectUnauthorizedFolders() {
  console.log('🔍 Detecting unauthorized folders...\n');

  const srcDir = join(process.cwd(), 'src');
  if (!existsSync(srcDir)) {
    console.log('⚠️  src directory not found\n');
    return;
  }

  const allowedFolders = ['app', 'components', 'lib', 'hooks', 'store', 'types', 'utils', 'features'];

  scanDirectory(srcDir, (filePath) => {
    const relativePath = filePath.replace(srcDir, '').replace(/\\/g, '/');
    const pathParts = relativePath.split('/').filter(Boolean);

    if (pathParts.length > 0) {
      const folder = pathParts[0];
      if (!allowedFolders.includes(folder)) {
        driftIssues.push({
          type: 'unauthorized-folder',
          severity: 'warning',
          location: folder,
          description: `Unauthorized folder: ${folder} (not in allowed list)`,
        });
      }
    }
  }, true);

  console.log(`✅ Folder scan complete\n`);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function scanDirectory(dir: string, callback: (filePath: string, content: string) => void, foldersOnly = false) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (foldersOnly) {
        callback(fullPath, '');
      } else {
        scanDirectory(fullPath, callback, foldersOnly);
      }
    } else if (entry.isFile() && !foldersOnly) {
      if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          callback(fullPath, content);
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🏗️  Architecture Drift Detection Engine\n');
console.log('=====================================\n');

detectDuplicateDTOs();
detectDuplicateSchemas();
detectDuplicateRoutes();
detectDuplicatePermissions();
detectDuplicateTranslations();
detectDuplicateBusinessRules();
detectUnauthorizedFolders();

// ============================================================================
// SUMMARY
// ============================================================================

console.log('=====================================');
console.log('📊 Drift Detection Summary\n');

const totalIssues = driftIssues.length;
const errorIssues = driftIssues.filter((i) => i.severity === 'error').length;
const warningIssues = driftIssues.filter((i) => i.severity === 'warning').length;
const infoIssues = driftIssues.filter((i) => i.severity === 'info').length;

console.log(`Total Issues: ${totalIssues}`);
console.log(`Errors: ${errorIssues}`);
console.log(`Warnings: ${warningIssues}`);
console.log(`Info: ${infoIssues}\n`);

if (totalIssues > 0) {
  console.log('❌ Drift Issues Found:\n');

  const groupedByType = driftIssues.reduce((acc, issue) => {
    if (!acc[issue.type]) {
      acc[issue.type] = [];
    }
    acc[issue.type].push(issue);
    return acc;
  }, {} as Record<string, DriftIssue[]>);

  Object.entries(groupedByType).forEach(([type, issues]) => {
    console.log(`${type.toUpperCase()}:\n`);
    issues.forEach((issue) => {
      console.log(`  [${issue.severity.toUpperCase()}] ${issue.location}`);
      console.log(`    ${issue.description}\n`);
    });
  });

  console.log('\n');
  process.exit(1);
} else {
  console.log('✅ No architecture drift detected!\n');
  process.exit(0);
}
