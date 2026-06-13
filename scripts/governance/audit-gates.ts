// scripts/governance/audit-gates.ts
// Governance Gate Audit - Verify gate compliance

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface AuditResult {
  category: string;
  check: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
}

const auditResults: AuditResult[] = [];

function addResult(category: string, check: string, status: 'pass' | 'fail' | 'warning', details: string) {
  auditResults.push({ category, check, status, details });
}

function auditGateIdInCommits() {
  console.log('🔍 Auditing Gate IDs in commits...\n');
  
  try {
    const recentCommits = execSync('git log --oneline -20', { encoding: 'utf-8' });
    const commits = recentCommits.split('\n').filter(c => c.trim());
    
    let gatesFound = 0;
    let commitsWithoutGate = 0;
    
    for (const commit of commits) {
      if (commit.includes('GATE-')) {
        gatesFound++;
      } else {
        commitsWithoutGate++;
      }
    }
    
    if (commitsWithoutGate === 0) {
      addResult('Traceability', 'Gate IDs in commits', 'pass', `All ${commits.length} recent commits have Gate IDs`);
    } else {
      addResult('Traceability', 'Gate IDs in commits', 'warning', `${commitsWithoutGate} commits without Gate IDs out of ${commits.length}`);
    }
  } catch (error) {
    addResult('Traceability', 'Gate IDs in commits', 'fail', 'Failed to audit commits');
  }
}

function auditGateIdInPRs() {
  console.log('🔍 Auditing Gate IDs in PRs...\n');
  
  // This would require GitHub API access
  // For now, we'll check if PR template exists
  const prTemplatePath = join(process.cwd(), '.github', 'PULL_REQUEST_TEMPLATE.md');
  
  if (existsSync(prTemplatePath)) {
    const template = readFileSync(prTemplatePath, 'utf-8');
    if (template.includes('Governance Gate ID') && template.includes('GATE-')) {
      addResult('PR Governance', 'Gate ID in PR template', 'pass', 'PR template requires Gate ID');
    } else {
      addResult('PR Governance', 'Gate ID in PR template', 'fail', 'PR template missing Gate ID requirement');
    }
  } else {
    addResult('PR Governance', 'Gate ID in PR template', 'fail', 'PR template not found');
  }
}

function auditGatePackageExists() {
  console.log('🔍 Auditing Governance Gate package...\n');
  
  const gatePackagePath = join(process.cwd(), 'packages', 'governance-gate');
  
  if (existsSync(gatePackagePath)) {
    const requiredFiles = [
      'index.ts',
      'registry/index.ts',
      'analyzers/index.ts',
      'workflows/index.ts',
      'approvals/index.ts',
      'validators/index.ts',
      'reports/index.ts',
      'policies/index.ts',
      'engine/index.ts',
      'cli/index.ts',
    ];
    
    let missingFiles = 0;
    for (const file of requiredFiles) {
      if (!existsSync(join(gatePackagePath, file))) {
        missingFiles++;
      }
    }
    
    if (missingFiles === 0) {
      addResult('Infrastructure', 'Governance Gate package', 'pass', 'All required files present');
    } else {
      addResult('Infrastructure', 'Governance Gate package', 'fail', `${missingFiles} required files missing`);
    }
  } else {
    addResult('Infrastructure', 'Governance Gate package', 'fail', 'Governance Gate package not found');
  }
}

function auditGateScripts() {
  console.log('🔍 Auditing Gate scripts...\n');
  
  const packageJsonPath = join(process.cwd(), 'package.json');
  
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const scripts = packageJson.scripts || {};
    
    const requiredScripts = [
      'governance:plan',
      'governance:approve',
      'governance:preflight',
    ];
    
    let missingScripts = 0;
    for (const script of requiredScripts) {
      if (!scripts[script]) {
        missingScripts++;
      }
    }
    
    if (missingScripts === 0) {
      addResult('Infrastructure', 'Gate scripts', 'pass', 'All required scripts present');
    } else {
      addResult('Infrastructure', 'Gate scripts', 'fail', `${missingScripts} required scripts missing`);
    }
  } else {
    addResult('Infrastructure', 'Gate scripts', 'fail', 'package.json not found');
  }
}

function auditGateContract() {
  console.log('🔍 Auditing Gate contract...\n');
  
  const gateContractPath = join(process.cwd(), 'docs', 'governance', 'governance-gate.md');
  
  if (existsSync(gateContractPath)) {
    const contract = readFileSync(gateContractPath, 'utf-8');
    
    const requiredSections = [
      'Governance Gate Contract',
      'Mandatory Rules',
      'Change Categories',
      'Gate Lifecycle',
    ];
    
    let missingSections = 0;
    for (const section of requiredSections) {
      if (!contract.includes(section)) {
        missingSections++;
      }
    }
    
    if (missingSections === 0) {
      addResult('Documentation', 'Gate contract', 'pass', 'All required sections present');
    } else {
      addResult('Documentation', 'Gate contract', 'warning', `${missingSections} sections missing`);
    }
  } else {
    addResult('Documentation', 'Gate contract', 'fail', 'Gate contract not found');
  }
}

function auditAgentContract() {
  console.log('🔍 Auditing Agent contract...\n');
  
  const agentContractPath = join(process.cwd(), 'docs', 'governance', 'agent-contract.md');
  
  if (existsSync(agentContractPath)) {
    const contract = readFileSync(agentContractPath, 'utf-8');
    
    if (contract.includes('Governance Gate Requirement') && contract.includes('governance:plan')) {
      addResult('Documentation', 'Agent contract', 'pass', 'Agent contract includes Gate requirements');
    } else {
      addResult('Documentation', 'Agent contract', 'fail', 'Agent contract missing Gate requirements');
    }
  } else {
    addResult('Documentation', 'Agent contract', 'fail', 'Agent contract not found');
  }
}

function auditPreflightInHooks() {
  console.log('🔍 Auditing preflight in hooks...\n');
  
  const preCommitPath = join(process.cwd(), '.husky', 'pre-commit');
  const prePushPath = join(process.cwd(), '.husky', 'pre-push');
  
  let hooksWithPreflight = 0;
  let totalHooks = 0;
  
  if (existsSync(preCommitPath)) {
    totalHooks++;
    const preCommit = readFileSync(preCommitPath, 'utf-8');
    if (preCommit.includes('governance:preflight')) {
      hooksWithPreflight++;
    }
  }
  
  if (existsSync(prePushPath)) {
    totalHooks++;
    const prePush = readFileSync(prePushPath, 'utf-8');
    if (prePush.includes('governance:preflight')) {
      hooksWithPreflight++;
    }
  }
  
  if (hooksWithPreflight === totalHooks && totalHooks > 0) {
    addResult('Enforcement', 'Preflight in hooks', 'pass', 'All hooks include preflight');
  } else if (totalHooks > 0) {
    addResult('Enforcement', 'Preflight in hooks', 'warning', `${hooksWithPreflight}/${totalHooks} hooks include preflight`);
  } else {
    addResult('Enforcement', 'Preflight in hooks', 'fail', 'No hooks found');
  }
}

function auditPreflightInCI() {
  console.log('🔍 Auditing preflight in CI/CD...\n');
  
  const ciPath = join(process.cwd(), '.github', 'workflows', 'ci.yml');
  
  if (existsSync(ciPath)) {
    const ci = readFileSync(ciPath, 'utf-8');
    
    if (ci.includes('governance:preflight')) {
      addResult('Enforcement', 'Preflight in CI/CD', 'pass', 'CI/CD includes preflight');
    } else {
      addResult('Enforcement', 'Preflight in CI/CD', 'warning', 'CI/CD missing preflight');
    }
  } else {
    addResult('Enforcement', 'Preflight in CI/CD', 'fail', 'CI workflow not found');
  }
}

function auditGateInDashboard() {
  console.log('🔍 Auditing Gate in dashboard...\n');
  
  const dashboardPath = join(process.cwd(), 'scripts', 'governance', 'governance-dashboard.ts');
  
  if (existsSync(dashboardPath)) {
    const dashboard = readFileSync(dashboardPath, 'utf-8');
    
    if (dashboard.includes('gateMetrics')) {
      addResult('Monitoring', 'Gate in dashboard', 'pass', 'Dashboard includes gate metrics');
    } else {
      addResult('Monitoring', 'Gate in dashboard', 'warning', 'Dashboard missing gate metrics');
    }
  } else {
    addResult('Monitoring', 'Gate in dashboard', 'fail', 'Dashboard not found');
  }
}

function generateAuditReport(): string {
  const lines: string[] = [];
  
  lines.push('# Governance Gate Audit Report');
  lines.push('');
  lines.push(`> **Source**: \`docs/audits/governance-gate-audit.md\``);
  lines.push(`> **Status**: Active`);
  lines.push(`> **Last Updated**: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Executive Summary');
  lines.push('');
  
  const totalChecks = auditResults.length;
  const passedChecks = auditResults.filter(r => r.status === 'pass').length;
  const failedChecks = auditResults.filter(r => r.status === 'fail').length;
  const warningChecks = auditResults.filter(r => r.status === 'warning').length;
  
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| **Total Checks** | ${totalChecks} |`);
  lines.push(`| **Passed** | ${passedChecks} ✅ |`);
  lines.push(`| **Failed** | ${failedChecks} ❌ |`);
  lines.push(`| **Warnings** | ${warningChecks} ⚠️ |`);
  lines.push('');
  
  const passRate = ((passedChecks / totalChecks) * 100).toFixed(1);
  lines.push(`**Pass Rate**: ${passRate}%`);
  lines.push('');
  
  lines.push('---');
  lines.push('');
  lines.push('## Audit Results');
  lines.push('');
  
  const categories = [...new Set(auditResults.map(r => r.category))];
  
  for (const category of categories) {
    lines.push(`### ${category}`);
    lines.push('');
    
    const categoryResults = auditResults.filter(r => r.category === category);
    for (const result of categoryResults) {
      const status = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
      lines.push(`${status} **${result.check}**: ${result.details}`);
    }
    lines.push('');
  }
  
  lines.push('---');
  lines.push('');
  lines.push('## Recommendations');
  lines.push('');
  
  const failedItems = auditResults.filter(r => r.status === 'fail');
  const warningItems = auditResults.filter(r => r.status === 'warning');
  
  if (failedItems.length > 0) {
    lines.push('### Immediate Actions');
    lines.push('');
    failedItems.forEach(item => {
      lines.push(`- Fix: ${item.check} - ${item.details}`);
    });
    lines.push('');
  }
  
  if (warningItems.length > 0) {
    lines.push('### Improvements');
    lines.push('');
    warningItems.forEach(item => {
      lines.push(`- Address: ${item.check} - ${item.details}`);
    });
    lines.push('');
  }
  
  if (failedItems.length === 0 && warningItems.length === 0) {
    lines.push('✅ All checks passed. Governance Gate is fully operational.');
    lines.push('');
  }
  
  lines.push('---');
  lines.push('');
  lines.push('**Audit Version**: 1.0.0');
  lines.push(`**Generated**: ${new Date().toISOString()}`);
  
  return lines.join('\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🔍 Governance Gate Audit\n');
console.log('====================================\n');

auditGatePackageExists();
auditGateScripts();
auditGateContract();
auditAgentContract();
auditPreflightInHooks();
auditPreflightInCI();
auditGateInDashboard();
auditGateIdInCommits();
auditGateIdInPRs();

// ============================================================================
// GENERATE REPORT
// ============================================================================

const report = generateAuditReport();

// Ensure audits directory exists
const auditsDir = join(process.cwd(), 'docs', 'audits');
if (!existsSync(auditsDir)) {
  mkdirSync(auditsDir, { recursive: true });
}

// Write audit report
const auditPath = join(auditsDir, 'governance-gate-audit.md');
writeFileSync(auditPath, report, 'utf-8');

console.log('====================================');
console.log('📊 Audit Summary\n');

const totalChecks = auditResults.length;
const passedChecks = auditResults.filter(r => r.status === 'pass').length;
const failedChecks = auditResults.filter(r => r.status === 'fail').length;
const warningChecks = auditResults.filter(r => r.status === 'warning').length;

console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks} ✅`);
console.log(`Failed: ${failedChecks} ❌`);
console.log(`Warnings: ${warningChecks} ⚠️`);
console.log(`\n📄 Report saved to: docs/audits/governance-gate-audit.md\n`);

if (failedChecks > 0) {
  console.log('⚠️  Some checks failed. Review the audit report for details.\n');
  process.exit(1);
} else {
  console.log('✅ All audit checks passed!\n');
  process.exit(0);
}
