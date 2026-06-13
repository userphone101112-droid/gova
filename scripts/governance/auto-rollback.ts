// scripts/governance/auto-rollback.ts
// Auto-Rollback System - Automatically reverts unauthorized changes

import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface RollbackEvent {
  timestamp: string;
  filePath: string;
  reason: string;
  violationType: string;
  rollbackSuccessful: boolean;
  gateId?: string;
}

interface RollbackResult {
  events: RollbackEvent[];
  totalRollbacks: number;
  successful: number;
  failed: number;
}

function rollbackFile(filePath: string, reason: string, violationType: string): RollbackEvent {
  const event: RollbackEvent = {
    timestamp: new Date().toISOString(),
    filePath,
    reason,
    violationType,
    rollbackSuccessful: false,
  };

  try {
    execSync(`git checkout -- "${filePath}"`, { stdio: 'pipe' });
    event.rollbackSuccessful = true;
    console.log(`🔄 Rolled back: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to rollback: ${filePath}`);
  }

  return event;
}

function rollbackUnauthorizedPages(): RollbackEvent[] {
  const events: RollbackEvent[] = [];
  
  try {
    const pagesSSOT = join(process.cwd(), 'packages', 'pages-ssot');
    if (!existsSync(pagesSSOT)) {
      return events;
    }

    const output = execSync('find src app -name "page.tsx" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const pages = output.split('\n').filter(p => p.trim());

    for (const page of pages) {
      events.push(rollbackFile(page, 'Unauthorized page creation', 'UNAUTHORIZED_PAGE'));
    }
  } catch (error) {
    // Ignore errors
  }

  return events;
}

function rollbackUnauthorizedRoutes(): RollbackEvent[] {
  const events: RollbackEvent[] = [];
  
  try {
    const routesSSOT = join(process.cwd(), 'packages', 'routes-ssot');
    if (!existsSync(routesSSOT)) {
      return events;
    }

    const output = execSync('find src app -name "route.*.ts" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const routes = output.split('\n').filter(r => r.trim());

    for (const route of routes) {
      events.push(rollbackFile(route, 'Unauthorized route creation', 'UNAUTHORIZED_ROUTE'));
    }
  } catch (error) {
    // Ignore errors
  }

  return events;
}

function rollbackUnauthorizedSchemas(): RollbackEvent[] {
  const events: RollbackEvent[] = [];
  
  try {
    const schemasSSOT = join(process.cwd(), 'packages', 'schemas');
    if (!existsSync(schemasSSOT)) {
      return events;
    }

    const output = execSync('find src app -name "*schema*.ts" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const schemas = output.split('\n').filter(s => s.trim() && !s.includes('packages/schemas'));

    for (const schema of schemas) {
      events.push(rollbackFile(schema, 'Unauthorized schema creation', 'UNAUTHORIZED_SCHEMA'));
    }
  } catch (error) {
    // Ignore errors
  }

  return events;
}

function rollbackUnauthorizedTranslations(): RollbackEvent[] {
  const events: RollbackEvent[] = [];
  
  try {
    const translationsSSOT = join(process.cwd(), 'packages', 'translations');
    if (!existsSync(translationsSSOT)) {
      return events;
    }

    const output = execSync('find src app -name "*translation*" -o -name "*i18n*" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const translations = output.split('\n').filter(t => t.trim() && !t.includes('packages/translations'));

    for (const translation of translations) {
      events.push(rollbackFile(translation, 'Unauthorized translation creation', 'UNAUTHORIZED_TRANSLATION'));
    }
  } catch (error) {
    // Ignore errors
  }

  return events;
}

function rollbackUnauthorizedContracts(): RollbackEvent[] {
  const events: RollbackEvent[] = [];
  
  try {
    const contractsSSOT = join(process.cwd(), 'packages', 'contracts');
    if (!existsSync(contractsSSOT)) {
      return events;
    }

    const output = execSync('find src app -name "*dto*" -o -name "*contract*" 2>/dev/null || echo ""', { encoding: 'utf-8' });
    const contracts = output.split('\n').filter(c => c.trim() && !c.includes('packages/contracts'));

    for (const contract of contracts) {
      events.push(rollbackFile(contract, 'Unauthorized contract creation', 'UNAUTHORIZED_CONTRACT'));
    }
  } catch (error) {
    // Ignore errors
  }

  return events;
}

function rollbackAllChanges(): RollbackEvent {
  const event: RollbackEvent = {
    timestamp: new Date().toISOString(),
    filePath: 'all',
    reason: 'Manual rollback of all changes',
    violationType: 'MANUAL_ROLLBACK',
    rollbackSuccessful: false,
  };

  try {
    execSync('git checkout -- .', { stdio: 'pipe' });
    event.rollbackSuccessful = true;
    console.log('🔄 Rolled back all changes');
  } catch (error) {
    console.error('❌ Failed to rollback all changes');
  }

  return event;
}

function runRollback(forceAll: boolean = false): RollbackResult {
  console.log('🔄 Running Auto-Rollback System...\n');

  let events: RollbackEvent[] = [];

  if (forceAll) {
    console.log('⚠️  Force rollback of all changes\n');
    events.push(rollbackAllChanges());
  } else {
    console.log('🔍 Scanning for unauthorized changes...\n');
    events = [
      ...rollbackUnauthorizedPages(),
      ...rollbackUnauthorizedRoutes(),
      ...rollbackUnauthorizedSchemas(),
      ...rollbackUnauthorizedTranslations(),
      ...rollbackUnauthorizedContracts(),
    ];
  }

  const successful = events.filter(e => e.rollbackSuccessful).length;
  const failed = events.filter(e => !e.rollbackSuccessful).length;

  return {
    events,
    totalRollbacks: events.length,
    successful,
    failed,
  };
}

function saveRollbackEvents(events: RollbackEvent[]): void {
  const auditsDir = join(process.cwd(), 'docs', 'audits', 'governance-violations');
  if (!existsSync(auditsDir)) {
    mkdirSync(auditsDir, { recursive: true });
  }

  for (const event of events) {
    const timestamp = event.timestamp.replace(/[:.]/g, '-');
    const file = join(auditsDir, `rollback-${timestamp}.json`);
    writeFileSync(file, JSON.stringify(event, null, 2), 'utf-8');
  }
}

function generateReport(result: RollbackResult): string {
  const lines: string[] = [];

  lines.push('# Auto-Rollback Report');
  lines.push('');
  lines.push(`> **Source**: \`docs/audits/governance-violations/rollback-report.md\``);
  lines.push(`> **Status**: Active`);
  lines.push(`> **Last Updated**: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Executive Summary');
  lines.push('');

  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| **Total Rollbacks** | ${result.totalRollbacks} |`);
  lines.push(`| **Successful** | ${result.successful} ✅ |`);
  lines.push(`| **Failed** | ${result.failed} ❌ |`);
  lines.push('');

  if (result.totalRollbacks === 0) {
    lines.push('✅ No rollbacks performed. No unauthorized changes detected.');
    lines.push('');
  } else {
    lines.push('## Rollback Events');
    lines.push('');

    for (const event of result.events) {
      const status = event.rollbackSuccessful ? '✅' : '❌';
      lines.push(`${status} **${event.violationType}**`);
      lines.push(`   - File: ${event.filePath}`);
      lines.push(`   - Reason: ${event.reason}`);
      lines.push(`   - Timestamp: ${event.timestamp}`);
      lines.push('');
    }

    lines.push('## Summary');
    lines.push('');
    lines.push(`Successfully rolled back ${result.successful} unauthorized changes.`);
    if (result.failed > 0) {
      lines.push(`Failed to rollback ${result.failed} changes. Manual intervention required.`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('**Rollback Version**: 1.0.0');
  lines.push(`**Generated**: ${new Date().toISOString()}`);

  return lines.join('\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

const args = process.argv.slice(2);
const forceAll = args.includes('--force-all') || args.includes('-f');

console.log('🔄 Governance Auto-Rollback System\n');
console.log('====================================\n');

const result = runRollback(forceAll);

console.log('\n====================================');
console.log('📊 Rollback Summary\n');
console.log(`Total Rollbacks: ${result.totalRollbacks}`);
console.log(`  Successful: ${result.successful} ✅`);
console.log(`  Failed: ${result.failed} ❌\n`);

if (result.totalRollbacks > 0) {
  console.log('📝 Saving rollback events to docs/audits/governance-violations/\n');
  saveRollbackEvents(result.events);
}

const report = generateReport(result);

const auditsDir = join(process.cwd(), 'docs', 'audits', 'governance-violations');
if (!existsSync(auditsDir)) {
  mkdirSync(auditsDir, { recursive: true });
}

const reportPath = join(auditsDir, 'rollback-report.md');
writeFileSync(reportPath, report, 'utf-8');

console.log(`📄 Report saved to: ${reportPath}\n`);

if (result.failed > 0) {
  console.log('⚠️  Some rollbacks failed. Manual intervention required.\n');
  process.exit(1);
} else {
  console.log('✅ All rollbacks completed successfully!\n');
  process.exit(0);
}
