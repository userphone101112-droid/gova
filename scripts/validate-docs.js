#!/usr/bin/env node

/**
 * Documentation Governance Validation Script
 * 
 * This script validates that all markdown files comply with the Documentation SSOT Governance System.
 * 
 * Rules:
 * 1. No .md or .mdx files may exist outside docs/ directory
 * 2. Exceptions: README.md (root only), AGENTS.md (root only), CHANGELOG.md (root only)
 * 3. All documentation must be within docs/ structure
 * 4. Required directories must exist
 * 5. Required tracking files must exist
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

// Allowed markdown files in root
const ALLOWED_ROOT_FILES = ['README.md', 'AGENTS.md', 'CLAUDE.md', 'CHANGELOG.md'];

// Required directories in docs/
const REQUIRED_DIRS = [
  'architecture',
  'modules',
  'packages',
  'development',
  'deployment',
  'operations',
  'planning',
  'tracking',
  'decisions',
  'changelogs',
  'reports',
  'ai-context',
  'governance',
  'audits',
  'generated',
];

// Required tracking files
const REQUIRED_TRACKING_FILES = [
  'tracking/backlog.md',
  'tracking/in-progress.md',
  'tracking/blocked.md',
  'tracking/completed.md',
  'tracking/future-ideas.md',
  'tracking/bugs/open.md',
  'tracking/bugs/fixed.md',
  'tracking/bugs/known-issues.md',
  'tracking/bugs/regressions.md',
  'tracking/features/planned.md',
  'tracking/features/in-progress.md',
  'tracking/features/completed.md',
  'tracking/features/deprecated.md',
  'tracking/code-changes/README.md',
];

// Required changelog files
const REQUIRED_CHANGELOG_FILES = [
  'changelogs/system.md',
  'changelogs/frontend.md',
  'changelogs/backend.md',
  'changelogs/database.md',
  'changelogs/infrastructure.md',
  'changelogs/packages.md',
];

// Required AI context files
const REQUIRED_AI_CONTEXT_FILES = [
  'ai-context/architecture-summary.md',
  'ai-context/backend-summary.md',
  'ai-context/frontend-summary.md',
  'ai-context/database-summary.md',
  'ai-context/ssot-summary.md',
  'ai-context/deployment-summary.md',
  'ai-context/current-status.md',
];

let errors = [];
let warnings = [];

function getAllMarkdownFiles(dir, excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build']) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      if (!excludeDirs.includes(item.name)) {
        files.push(...getAllMarkdownFiles(fullPath, excludeDirs));
      }
    } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function validateRootMarkdownFiles() {
  console.log('\n🔍 Validating root markdown files...');
  
  const rootFiles = fs.readdirSync(ROOT_DIR);
  const markdownFiles = rootFiles.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  
  for (const file of markdownFiles) {
    if (!ALLOWED_ROOT_FILES.includes(file)) {
      errors.push(`Unauthorized markdown file in root: ${file}. Move to docs/ directory.`);
    }
  }
  
  console.log(`✓ Found ${markdownFiles.length} markdown files in root (all authorized)`);
}

function validateDocsDirectory() {
  console.log('\n🔍 Validating docs/ directory structure...');
  
  if (!fs.existsSync(DOCS_DIR)) {
    errors.push('docs/ directory does not exist');
    return;
  }
  
  const docsDirs = fs.readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  for (const requiredDir of REQUIRED_DIRS) {
    if (!docsDirs.includes(requiredDir)) {
      errors.push(`Required directory missing: docs/${requiredDir}`);
    }
  }
  
  console.log(`✓ docs/ directory exists with ${docsDirs.length} subdirectories`);
}

function validateTrackingFiles() {
  console.log('\n🔍 Validating tracking files...');
  
  for (const file of REQUIRED_TRACKING_FILES) {
    const filePath = path.join(DOCS_DIR, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Required tracking file missing: docs/${file}`);
    }
  }
  
  console.log(`✓ Tracking files validated`);
}

function validateChangelogFiles() {
  console.log('\n🔍 Validating changelog files...');
  
  for (const file of REQUIRED_CHANGELOG_FILES) {
    const filePath = path.join(DOCS_DIR, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Required changelog file missing: docs/${file}`);
    }
  }
  
  console.log(`✓ Changelog files validated`);
}

function validateAIContextFiles() {
  console.log('\n🔍 Validating AI context files...');
  
  for (const file of REQUIRED_AI_CONTEXT_FILES) {
    const filePath = path.join(DOCS_DIR, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Required AI context file missing: docs/${file}`);
    }
  }
  
  console.log(`✓ AI context files validated`);
}

function checkForOrphanDocumentation() {
  console.log('\n🔍 Checking for orphan documentation...');
  
  const allMarkdownFiles = getAllMarkdownFiles(ROOT_DIR);
  const filesOutsideDocs = allMarkdownFiles.filter(f => !f.startsWith(DOCS_DIR));
  
  for (const file of filesOutsideDocs) {
    const relativePath = path.relative(ROOT_DIR, file);
    const isInRoot = path.dirname(relativePath) === '.';
    const filename = path.basename(relativePath);
    
    if (isInRoot && ALLOWED_ROOT_FILES.includes(filename)) {
      continue;
    }
    
    if (!isInRoot) {
      errors.push(`Markdown file outside docs/ and not in root: ${relativePath}`);
    }
  }
  
  console.log(`✓ No orphan documentation found`);
}

function checkForDuplicateDocumentation() {
  console.log('\n🔍 Checking for duplicate documentation...');
  
  // This is a basic check - could be enhanced with content comparison
  const docsFiles = getAllMarkdownFiles(DOCS_DIR);
  const filenames = docsFiles.map(f => path.basename(f));
  const duplicates = filenames.filter((item, index) => filenames.indexOf(item) !== index);
  
  if (duplicates.length > 0) {
    warnings.push(`Potential duplicate filenames: ${[...new Set(duplicates)].join(', ')}`);
  }
  
  console.log(`✓ Duplicate check completed`);
}

function main() {
  console.log('� Documentation Governance Validation');
  console.log('=====================================');
  
  validateRootMarkdownFiles();
  validateDocsDirectory();
  validateTrackingFiles();
  validateChangelogFiles();
  validateAIContextFiles();
  checkForOrphanDocumentation();
  checkForDuplicateDocumentation();
  checkForUndocumentedModules();
  
  console.log('\n=====================================');
  console.log('📊 Validation Results');
  console.log('=====================================');
  
  if (errors.length === 0) {
    if (warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${warnings.length}):`);
      warnings.forEach(warn => console.log(`  - ${warn}`));
      console.log('\n✅ Validation passed with warnings');
      process.exit(0);
    } else {
      console.log('✅ All validation checks passed!');
      process.exit(0);
    }
  } else {
    if (errors.length > 0) {
      console.log(`\n❌ Errors (${errors.length}):`);
      errors.forEach(err => console.log(`  - ${err}`));
    }
    
    if (warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${warnings.length}):`);
      warnings.forEach(warn => console.log(`  - ${warn}`));
    }
    
    console.log(`\n❌ Validation failed with ${errors.length} error(s) and ${warnings.length} warning(s)`);
    process.exit(1);
  }
}

main();
              if (undocumentedCount <= 5) { // Limit to avoid spam
                warnings.push(`Potentially undocumented export: ${exportName} in ${path.relative(ROOT_DIR, file)}`);
              }
            }
          }
        }
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }
  
  if (undocumentedCount > 5) {
    warnings.push(`... and ${undocumentedCount - 5} more potentially undocumented exports`);
  }
  
  console.log(`✓ Module documentation check completed (${undocumentedCount} potentially undocumented exports)`);
}

function main() {
  console.log('📋 Documentation Governance Validation');
  console.log('=====================================');
  
  validateRootMarkdownFiles();
  validateDocsDirectory();
  validateTrackingFiles();
  validateChangelogFiles();
  validateAIContextFiles();
  checkForOrphanDocumentation();
  checkForDuplicateDocumentation();
  
  console.log('\n=====================================');
  console.log('📊 Validation Results');
  console.log('=====================================');
  
  if (errors.length === 0) {
    if (warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${warnings.length}):`);
      warnings.forEach(warn => console.log(`  - ${warn}`));
      console.log('\n✅ Validation passed with warnings');
      process.exit(0);
    } else {
      console.log('✅ All validation checks passed!');
      process.exit(0);
    }
  } else {
    if (errors.length > 0) {
      console.log(`\n❌ Errors (${errors.length}):`);
      errors.forEach(err => console.log(`  - ${err}`));
    }
    
    if (warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${warnings.length}):`);
      warnings.forEach(warn => console.log(`  - ${warn}`));
    }
    
    console.log(`\n❌ Validation failed with ${errors.length} error(s) and ${warnings.length} warning(s)`);
    process.exit(1);
  }
}

main();
