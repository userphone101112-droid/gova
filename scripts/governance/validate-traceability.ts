// scripts/governance/validate-traceability.ts
// Traceability governance validator

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const SRC_DIR = join(process.cwd(), 'src');
const PACKAGES_DIR = join(process.cwd(), 'packages');

interface TraceabilityInfo {
  taskId?: string;
  featureId?: string;
  adrId?: string;
  changelog?: string;
  documentation?: string[];
  ssotUpdates?: string[];
}

function extractTraceabilityFromCommitMessage(message: string): TraceabilityInfo {
  const info: TraceabilityInfo = {};

  // Extract task ID
  const taskMatch = message.match(/task:\s*([^\s,]+)/i);
  if (taskMatch) info.taskId = taskMatch[1];

  // Extract feature ID
  const featureMatch = message.match(/feature:\s*([^\s,]+)/i);
  if (featureMatch) info.featureId = featureMatch[1];

  // Extract ADR ID
  const adrMatch = message.match(/adr:\s*([^\s,]+)/i);
  if (adrMatch) info.adrId = adrMatch[1];

  return info;
}

function extractTraceabilityFromPRDescription(description: string): TraceabilityInfo {
  const info: TraceabilityInfo = {};

  // Extract task ID
  const taskMatch = description.match(/Task:\s*([^\n]+)/i);
  if (taskMatch) info.taskId = taskMatch[1].trim();

  // Extract feature ID
  const featureMatch = description.match(/Feature:\s*([^\n]+)/i);
  if (featureMatch) info.featureId = featureMatch[1].trim();

  // Extract ADR ID
  const adrMatch = description.match(/ADR:\s*([^\n]+)/i);
  if (adrMatch) info.adrId = adrMatch[1].trim();

  // Extract changelog
  const changelogMatch = description.match(/Changelog:\s*([^\n]+)/i);
  if (changelogMatch) info.changelog = changelogMatch[1].trim();

  // Extract documentation
  const docMatches = description.matchAll(/Documentation:\s*\n((?:- [^\n]+\n)+)/i);
  for (const match of docMatches) {
    info.documentation = match[1].split('\n').map(line => line.replace(/-\s*/, '').trim()).filter(Boolean);
  }

  // Extract SSOT updates
  const ssotMatches = description.matchAll(/SSOT Updates:\s*\n((?:- [^\n]+\n)+)/i);
  for (const match of ssotMatches) {
    info.ssotUpdates = match[1].split('\n').map(line => line.replace(/-\s*/, '').trim()).filter(Boolean);
  }

  return info;
}

function scanSourceFiles(): string[] {
  const files: string[] = [];

  if (!existsSync(SRC_DIR)) return files;

  function scanDir(dir: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
  }

  scanDir(SRC_DIR);
  return files;
}

function checkTraceabilityInCode(filePath: string): TraceabilityInfo[] {
  const content = readFileSync(filePath, 'utf-8');
  const traceabilityInfos: TraceabilityInfo[] = [];

  // Look for traceability comments
  const commentMatches = content.matchAll(/\/\*\*[\s\S]*?\*\//g);
  for (const match of commentMatches) {
    const comment = match[0];
    const info = extractTraceabilityFromPRDescription(comment);
    if (Object.keys(info).length > 0) {
      traceabilityInfos.push(info);
    }
  }

  return traceabilityInfos;
}

console.log('🔍 Validating Traceability Governance...\n');

const violations: string[] = [];

// Check recent commits
try {
  const recentCommits = execSync('git log -10 --pretty=format:"%H|%s|%b"', { encoding: 'utf-8' });
  const commits = recentCommits.split('\n');

  for (const commit of commits) {
    if (!commit) continue;
    const [hash, subject, body] = commit.split('|');
    const fullMessage = `${subject}\n\n${body}`;
    const traceability = extractTraceabilityFromCommitMessage(fullMessage);

    if (Object.keys(traceability).length === 0) {
      violations.push(`Commit ${hash.substring(0, 7)}: Missing traceability in commit message`);
    }
  }
} catch (error) {
  console.log('⚠️  Could not check git commits (not a git repository or git not available)\n');
}

// Check source files for traceability comments
const sourceFiles = scanSourceFiles();
let filesWithoutTraceability = 0;

for (const file of sourceFiles) {
  const traceabilityInfos = checkTraceabilityInCode(file);
  if (traceabilityInfos.length === 0) {
    filesWithoutTraceability++;
  }
}

if (filesWithoutTraceability > 0) {
  violations.push(`${filesWithoutTraceability} source files lack traceability comments`);
}

if (violations.length === 0) {
  console.log('✅ Traceability governance is valid!\n');
  process.exit(0);
} else {
  console.log(`❌ Found ${violations.length} traceability governance violations:\n`);
  violations.forEach((violation) => {
    console.log(`  - ${violation}`);
  });
  console.log('\n');
  console.log('To fix these violations:');
  console.log('1. Add traceability information to commit messages');
  console.log('2. Add traceability comments to source files');
  console.log('3. Reference task, feature, ADR, changelog, documentation, SSOT updates\n');
  process.exit(1);
}
