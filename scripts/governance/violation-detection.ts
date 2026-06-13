// scripts/governance/violation-detection.ts
// Violation Detection Engine - Detects and reports governance violations

import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface Violation {
  id: string;
  type: string;
  ssotBreached: string;
  filePath: string;
  severity: 'error' | 'warning' | 'critical';
  suggestedFix: string;
  gateId?: string;
  timestamp: string;
}

interface DetectionResult {
  violations: Violation[];
  totalViolations: number;
  bySeverity: {
    error: number;
    warning: number;
    critical: number;
  };
  byType: Record<string, number>;
}

function detectUnauthorizedPages(): Violation[] {
  const violations: Violation[] = [];
  
  try {
    const pagesSSOT = join(process.cwd(), 'packages', 'pages-ssot');
    if (!existsSync(pagesSSOT)) {
      return violations;
    }

    // Find all page.tsx files
    const output = execSync('find src app -name "page.tsx" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const pages = output.split('\n').filter(p => p.trim());

    for (const page of pages) {
      violations.push({
        id: `VIOLATION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'UNAUTHORIZED_PAGE',
        ssotBreached: '@gv/pages-ssot',
        filePath: page,
        severity: 'error',
        suggestedFix: 'Register page in @gv/pages-ssot before creating the file',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // Ignore errors
  }

  return violations;
}

function detectUnauthorizedRoutes(): Violation[] {
  const violations: Violation[] = [];
  
  try {
    const routesSSOT = join(process.cwd(), 'packages', 'routes-ssot');
    if (!existsSync(routesSSOT)) {
      return violations;
    }

    // Find all route files
    const output = execSync('find src app -name "route.*.ts" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const routes = output.split('\n').filter(r => r.trim());

    for (const route of routes) {
      violations.push({
        id: `VIOLATION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'UNAUTHORIZED_ROUTE',
        ssotBreached: '@gv/routes-ssot',
        filePath: route,
        severity: 'error',
        suggestedFix: 'Register route in @gv/routes-ssot before creating the file',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // Ignore errors
  }

  return violations;
}

function detectUnauthorizedSchemas(): Violation[] {
  const violations: Violation[] = [];
  
  try {
    const schemasSSOT = join(process.cwd(), 'packages', 'schemas');
    if (!existsSync(schemasSSOT)) {
      return violations;
    }

    // Find schema files outside packages/schemas
    const output = execSync('find src app -name "*schema*.ts" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const schemas = output.split('\n').filter(s => s.trim() && !s.includes('packages/schemas'));

    for (const schema of schemas) {
      violations.push({
        id: `VIOLATION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'UNAUTHORIZED_SCHEMA',
        ssotBreached: '@gv/schemas',
        filePath: schema,
        severity: 'error',
        suggestedFix: 'Create schema in packages/schemas/ directory',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // Ignore errors
  }

  return violations;
}

function detectUnauthorizedTranslations(): Violation[] {
  const violations: Violation[] = [];
  
  try {
    const translationsSSOT = join(process.cwd(), 'packages', 'translations');
    if (!existsSync(translationsSSOT)) {
      return violations;
    }

    // Find translation files outside packages/translations
    const output = execSync('find src app -name "*translation*" -o -name "*i18n*" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const translations = output.split('\n').filter(t => t.trim() && !t.includes('packages/translations'));

    for (const translation of translations) {
      violations.push({
        id: `VIOLATION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'UNAUTHORIZED_TRANSLATION',
        ssotBreached: '@gv/translations',
        filePath: translation,
        severity: 'error',
        suggestedFix: 'Register translation in @gv/translations before creating the file',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // Ignore errors
  }

  return violations;
}

function detectUnauthorizedContracts(): Violation[] {
  const violations: Violation[] = [];
  
  try {
    const contractsSSOT = join(process.cwd(), 'packages', 'contracts');
    if (!existsSync(contractsSSOT)) {
      return violations;
    }

    // Find DTO files outside packages/contracts
    const output = execSync('find src app -name "*dto*" -o -name "*contract*" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const contracts = output.split('\n').filter(c => c.trim() && !c.includes('packages/contracts'));

    for (const contract of contracts) {
      violations.push({
        id: `VIOLATION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'UNAUTHORIZED_CONTRACT',
        ssotBreached: '@gv/contracts',
        filePath: contract,
        severity: 'error',
        suggestedFix: 'Create DTO in packages/contracts/ directory',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // Ignore errors
  }

  return violations;
}

function detectMissingGateIds(): Violation[] {
  const violations: Violation[] = [];
  
  try {
    // Check recent commits for missing gate IDs
    const output = execSync('git log --oneline -20', { encoding: 'utf-8' });
    const commits = output.split('\n').filter(c => c.trim());

    for (const commit of commits) {
      if (!commit.includes('GATE-')) {
        violations.push({
          id: `VIOLATION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'MISSING_GATE_ID',
          ssotBreached: 'Governance Gate',
          filePath: 'git',
          severity: 'warning',
          suggestedFix: 'Include Gate ID in commit message',
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    // Ignore errors
  }

  return violations;
}

function runDetection(): DetectionResult {
  console.log('🔍 Running Violation Detection...\n');

  const allViolations: Violation[] = [
    ...detectUnauthorizedPages(),
    ...detectUnauthorizedRoutes(),
    ...detectUnauthorizedSchemas(),
    ...detectUnauthorizedTranslations(),
    ...detectUnauthorizedContracts(),
    ...detectMissingGateIds(),
  ];

  const bySeverity = {
    error: allViolations.filter(v => v.severity === 'error').length,
    warning: allViolations.filter(v => v.severity === 'warning').length,
    critical: allViolations.filter(v => v.severity === 'critical').length,
  };

  const byType: Record<string, number> = {};
  for (const violation of allViolations) {
    byType[violation.type] = (byType[violation.type] || 0) + 1;
  }

  return {
    violations: allViolations,
    totalViolations: allViolations.length,
    bySeverity,
    byType,
  };
}

function generateReport(result: DetectionResult): string {
  const lines: string[] = [];

  lines.push('# Governance Violation Detection Report');
  lines.push('');
  lines.push(`> **Source**: \`docs/audits/governance-violations/detection-report.md\``);
  lines.push(`> **Status**: Active`);
  lines.push(`> **Last Updated**: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Executive Summary');
  lines.push('');

  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| **Total Violations** | ${result.totalViolations} |`);
  lines.push(`| **Error** | ${result.bySeverity.error} ❌ |`);
  lines.push(`| **Warning** | ${result.bySeverity.warning} ⚠️ |`);
  lines.push(`| **Critical** | ${result.bySeverity.critical} 🔴 |`);
  lines.push('');

  if (result.totalViolations === 0) {
    lines.push('✅ No violations detected. Governance is healthy.');
    lines.push('');
  } else {
    lines.push('## Violations by Type');
    lines.push('');

    for (const [type, count] of Object.entries(result.byType)) {
      lines.push(`- **${type}**: ${count}`);
    }
    lines.push('');

    lines.push('## Detailed Violations');
    lines.push('');

    for (const violation of result.violations) {
      const severity = violation.severity === 'error' ? '❌' : violation.severity === 'warning' ? '⚠️' : '🔴';
      lines.push(`${severity} **${violation.type}**`);
      lines.push(`   - ID: ${violation.id}`);
      lines.push(`   - SSOT Breached: ${violation.ssotBreached}`);
      lines.push(`   - File: ${violation.filePath}`);
      lines.push(`   - Severity: ${violation.severity}`);
      lines.push(`   - Suggested Fix: ${violation.suggestedFix}`);
      lines.push(`   - Timestamp: ${violation.timestamp}`);
      lines.push('');
    }

    lines.push('## Recommendations');
    lines.push('');
    lines.push('### Immediate Actions');
    lines.push('');
    lines.push('- Address all error-level violations');
    lines.push('- Review warning-level violations');
    lines.push('- Ensure all changes have Gate IDs');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('**Detection Version**: 1.0.0');
  lines.push(`**Generated**: ${new Date().toISOString()}`);

  return lines.join('\n');
}

function saveViolations(violations: Violation[]): void {
  const auditsDir = join(process.cwd(), 'docs', 'audits', 'governance-violations');
  if (!existsSync(auditsDir)) {
    mkdirSync(auditsDir, { recursive: true });
  }

  for (const violation of violations) {
    const timestamp = violation.timestamp.replace(/[:.]/g, '-');
    const file = join(auditsDir, `violation-${timestamp}.json`);
    writeFileSync(file, JSON.stringify(violation, null, 2), 'utf-8');
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🔍 Governance Violation Detection Engine\n');
console.log('====================================\n');

const result = runDetection();

console.log(`Total Violations: ${result.totalViolations}`);
console.log(`  Error: ${result.bySeverity.error}`);
console.log(`  Warning: ${result.bySeverity.warning}`);
console.log(`  Critical: ${result.bySeverity.critical}\n`);

if (result.totalViolations > 0) {
  console.log('📝 Saving violations to docs/audits/governance-violations/\n');
  saveViolations(result.violations);
}

const report = generateReport(result);

const auditsDir = join(process.cwd(), 'docs', 'audits', 'governance-violations');
if (!existsSync(auditsDir)) {
  mkdirSync(auditsDir, { recursive: true });
}

const reportPath = join(auditsDir, 'detection-report.md');
writeFileSync(reportPath, report, 'utf-8');

console.log(`📄 Report saved to: ${reportPath}\n`);

if (result.totalViolations > 0) {
  console.log('⚠️  Violations detected. Review the report for details.\n');
  process.exit(1);
} else {
  console.log('✅ No violations detected!\n');
  process.exit(0);
}
