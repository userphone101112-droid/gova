// scripts/governance/validate-forms-governance.ts
// Governance validator to prevent unauthorized form usage

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { formRegistry, formExists } from '../../packages/forms-ssot';

const SRC_DIR = join(process.cwd(), 'src');

const FORM_PATTERNS = [
  /useForm\s*\(\s*\{[^}]*schema:\s*([a-zA-Z0-9_]+)/g, // useForm({ schema: schemaName })
  /<Form[^>]*schema=\{?([a-zA-Z0-9_]+)/g, // <Form schema={schemaName}>
  /z\.object\(/g, // z.object() - potential inline schema
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

function findFormSchemas(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf-8');
  const schemas: string[] = [];

  // Extract schema names from useForm calls
  const useFormMatches = content.matchAll(/useForm\s*\(\s*\{[^}]*schema:\s*([a-zA-Z0-9_]+)/g);
  for (const match of useFormMatches) {
    schemas.push(match[1]);
  }

  // Extract schema names from Form components
  const formMatches = content.matchAll(/<Form[^>]*schema=\{?([a-zA-Z0-9_]+)/g);
  for (const match of formMatches) {
    schemas.push(match[1]);
  }

  return [...new Set(schemas)]; // Remove duplicates
}

console.log('🔍 Validating Form Governance...\n');

const sourceFiles = scanDirectory(SRC_DIR, ['ts', 'tsx', 'js', 'jsx']);
console.log(`Scanning ${sourceFiles.length} source files for form usage\n`);

const violations: string[] = [];

for (const file of sourceFiles) {
  const schemas = findFormSchemas(file);
  
  for (const schemaName of schemas) {
    // Check if schema is registered in forms-ssot
    const formExistsInRegistry = Object.values(formRegistry).some(
      (f) => f.schema === schemaName
    );

    if (!formExistsInRegistry) {
      violations.push(
        `Form schema used without registration in ${file.replace(process.cwd(), '')}: "${schemaName}" - Not registered in forms-ssot`
      );
    }
  }
}

if (violations.length === 0) {
  console.log('✅ All form schemas are registered in forms-ssot!\n');
  process.exit(0);
} else {
  console.log(`❌ Found ${violations.length} form governance violations:\n`);
  violations.forEach((violation) => {
    console.log(`  - ${violation}`);
  });
  console.log('\n');
  console.log('To fix these violations:');
  console.log('1. Register the form in packages/forms-ssot/index.ts');
  console.log('2. Run validation: npm run validate:forms');
  console.log('3. Commit the changes\n');
  process.exit(1);
}
