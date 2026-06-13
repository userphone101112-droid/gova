// scripts/governance/firewall-watch.ts
// File System Watcher Daemon - Monitors for unauthorized changes

import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface WatchConfig {
  directories: string[];
  patterns: string[];
  blockUnauthorized: boolean;
  autoRollback: boolean;
}

const WATCH_CONFIG: WatchConfig = {
  directories: [
    'src/',
    'app/',
    'packages/features/',
    'packages/schemas/',
    'packages/translations/',
    'packages/routes/',
  ],
  patterns: [
    '*.tsx',
    '*.ts',
    '*.jsx',
    '*.js',
  ],
  blockUnauthorized: true,
  autoRollback: true,
};

interface ViolationEvent {
  timestamp: string;
  filePath: string;
  eventType: string;
  violation: {
    type: string;
    message: string;
    severity: 'error' | 'warning' | 'critical';
    suggestedFix: string;
  };
  rollbackPerformed: boolean;
}

function checkUnauthorizedChange(filePath: string): {
  type: string;
  message: string;
  severity: 'error' | 'warning' | 'critical';
  suggestedFix: string;
} | null {
  // Check for unauthorized page creation
  if (filePath.includes('page.tsx')) {
    const pagesSSOT = join(process.cwd(), 'packages', 'pages-ssot');
    if (!existsSync(pagesSSOT)) {
      return {
        type: 'UNAUTHORIZED_PAGE',
        message: 'Cannot create page.tsx without Pages SSOT registration',
        severity: 'error',
        suggestedFix: 'Register page in @gv/pages-ssot before creating the file',
      };
    }
  }

  // Check for unauthorized route creation
  if (filePath.includes('route.') && filePath.endsWith('.ts')) {
    const routesSSOT = join(process.cwd(), 'packages', 'routes-ssot');
    if (!existsSync(routesSSOT)) {
      return {
        type: 'UNAUTHORIZED_ROUTE',
        message: 'Cannot create route without Routes SSOT registration',
        severity: 'error',
        suggestedFix: 'Register route in @gv/routes-ssot before creating the file',
      };
    }
  }

  // Check for unauthorized schema creation
  if (filePath.includes('schema') && filePath.endsWith('.ts')) {
    const schemasSSOT = join(process.cwd(), 'packages', 'schemas');
    const inSSOT = filePath.includes('packages/schemas');
    if (!inSSOT) {
      return {
        type: 'UNAUTHORIZED_SCHEMA',
        message: 'Cannot create schema outside @gv/schemas',
        severity: 'error',
        suggestedFix: 'Create schema in packages/schemas/ directory',
      };
    }
  }

  // Check for unauthorized translation creation
  if (filePath.includes('translation') || filePath.includes('i18n')) {
    const translationsSSOT = join(process.cwd(), 'packages', 'translations');
    if (!existsSync(translationsSSOT)) {
      return {
        type: 'UNAUTHORIZED_TRANSLATION',
        message: 'Cannot create translation without Translations SSOT',
        severity: 'error',
        suggestedFix: 'Register translation in @gv/translations before creating the file',
      };
    }
  }

  // Check for unauthorized DTO creation
  if (filePath.includes('dto') || filePath.includes('contract')) {
    const contractsSSOT = join(process.cwd(), 'packages', 'contracts');
    const inContracts = filePath.includes('packages/contracts');
    if (!inContracts) {
      return {
        type: 'UNAUTHORIZED_CONTRACT',
        message: 'Cannot create DTO outside @gv/contracts',
        severity: 'error',
        suggestedFix: 'Create DTO in packages/contracts/ directory',
      };
    }
  }

  return null;
}

function rollbackFile(filePath: string): boolean {
  try {
    execSync(`git checkout -- "${filePath}"`, { stdio: 'pipe' });
    console.log(`🔄 Rolled back: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to rollback: ${filePath}`);
    return false;
  }
}

function logViolation(event: ViolationEvent): void {
  const auditsDir = join(process.cwd(), 'docs', 'audits', 'governance-violations');
  if (!existsSync(auditsDir)) {
    mkdirSync(auditsDir, { recursive: true });
  }

  const timestamp = event.timestamp.replace(/[:.]/g, '-');
  const logFile = join(auditsDir, `violation-${timestamp}.json`);
  
  writeFileSync(logFile, JSON.stringify(event, null, 2), 'utf-8');
  
  console.error('🚨 FIREWALL VIOLATION DETECTED');
  console.error(`   File: ${event.filePath}`);
  console.error(`   Event: ${event.eventType}`);
  console.error(`   Type: ${event.violation.type}`);
  console.error(`   Message: ${event.violation.message}`);
  console.error(`   Severity: ${event.violation.severity}`);
  console.error(`   Suggested Fix: ${event.violation.suggestedFix}`);
  if (event.rollbackPerformed) {
    console.error('   Auto-rollback performed');
  }
  console.error(`   Logged to: ${logFile}`);
}

function simulateWatch(): void {
  console.log('🔍 Governance Firewall Watcher');
  console.log('====================================\n');
  console.log('⚠️  File system watcher requires chokidar library');
  console.log('⚠️  Install: npm install chokidar --save-dev\n');
  console.log('Monitoring directories:');
  WATCH_CONFIG.directories.forEach(dir => {
    console.log(`  - ${dir}`);
  });
  console.log('\nMonitoring patterns:');
  WATCH_CONFIG.patterns.forEach(pattern => {
    console.log(`  - ${pattern}`);
  });
  console.log('\nBlock unauthorized:', WATCH_CONFIG.blockUnauthorized);
  console.log('Auto-rollback:', WATCH_CONFIG.autoRollback);
  console.log('\n====================================\n');
  console.log('📝 To enable real file watching, install chokidar and update this script.\n');
  console.log('Example implementation:');
  console.log(`
import chokidar from 'chokidar';

const watcher = chokidar.watch(WATCH_CONFIG.directories, {
  ignored: /node_modules/,
  persistent: true,
});

watcher.on('change', (path) => {
  const violation = checkUnauthorizedChange(path);
  if (violation && WATCH_CONFIG.blockUnauthorized) {
    const event: ViolationEvent = {
      timestamp: new Date().toISOString(),
      filePath: path,
      eventType: 'change',
      violation,
      rollbackPerformed: WATCH_CONFIG.autoRollback ? rollbackFile(path) : false,
    };
    logViolation(event);
  }
});
  `);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🔍 Starting Governance Firewall Watcher...\n');

simulateWatch();

console.log('⚠️  Watcher running in simulation mode');
console.log('⚠️  Install chokidar to enable real file watching\n');

process.exit(0);
