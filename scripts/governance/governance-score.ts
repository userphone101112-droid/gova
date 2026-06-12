// scripts/governance/governance-score.ts
// Governance compliance scoring engine

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface ScoreResult {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  details: string[];
}

interface ComplianceReport {
  timestamp: string;
  overallScore: number;
  overallPercentage: number;
  scores: {
    governance: ScoreResult;
    ssot: ScoreResult;
    documentation: ScoreResult;
    traceability: ScoreResult;
    architecture: ScoreResult;
    compliance: ScoreResult;
  };
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

function runValidation(command: string): boolean {
  try {
    execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function calculateGovernanceScore(): ScoreResult {
  const details: string[] = [];
  let score = 0;
  const maxScore = 5;

  // Check governance SSOT exists
  if (existsSync(join(process.cwd(), 'packages', 'governance-ssot'))) {
    score++;
    details.push('✅ Governance SSOT package exists');
  } else {
    details.push('❌ Governance SSOT package missing');
  }

  // Check governance SSOT validation
  if (runValidation('npm run validate:governance-ssot')) {
    score++;
    details.push('✅ Governance SSOT validation passes');
  } else {
    details.push('❌ Governance SSOT validation fails');
  }

  // Check agent contract exists
  if (existsSync(join(process.cwd(), 'docs', 'governance', 'agent-contract.md'))) {
    score++;
    details.push('✅ Agent contract exists');
  } else {
    details.push('❌ Agent contract missing');
  }

  // Check governance validators exist
  if (existsSync(join(process.cwd(), 'scripts', 'governance'))) {
    score++;
    details.push('✅ Governance validators exist');
  } else {
    details.push('❌ Governance validators missing');
  }

  // Check governance policies exist
  if (existsSync(join(process.cwd(), 'packages', 'governance-ssot', 'policies'))) {
    score++;
    details.push('✅ Governance policies exist');
  } else {
    details.push('❌ Governance policies missing');
  }

  return {
    category: 'Governance',
    score,
    maxScore,
    percentage: (score / maxScore) * 100,
    details,
  };
}

function calculateSSOTScore(): ScoreResult {
  const details: string[] = [];
  let score = 0;
  const maxScore = 8;

  const ssotPackages = [
    'features-ssot',
    'pages-ssot',
    'routes-ssot',
    'navigation-ssot',
    'forms-ssot',
    'permissions-ssot',
    'analytics-ssot',
    'governance-ssot',
  ];

  for (const ssot of ssotPackages) {
    if (existsSync(join(process.cwd(), 'packages', ssot))) {
      score++;
      details.push(`✅ ${ssot} exists`);
    } else {
      details.push(`❌ ${ssot} missing`);
    }
  }

  return {
    category: 'SSOT',
    score,
    maxScore,
    percentage: (score / maxScore) * 100,
    details,
  };
}

function calculateDocumentationScore(): ScoreResult {
  const details: string[] = [];
  let score = 0;
  const maxScore = 5;

  // Check documentation validation
  if (runValidation('npm run validate:docs')) {
    score++;
    details.push('✅ Documentation validation passes');
  } else {
    details.push('❌ Documentation validation fails');
  }

  // Check link validation
  if (runValidation('npm run validate:links')) {
    score++;
    details.push('✅ Documentation links are valid');
  } else {
    details.push('❌ Documentation links have issues');
  }

  // Check docs directory exists
  if (existsSync(join(process.cwd(), 'docs'))) {
    score++;
    details.push('✅ Documentation directory exists');
  } else {
    details.push('❌ Documentation directory missing');
  }

  // Check governance docs exist
  if (existsSync(join(process.cwd(), 'docs', 'governance'))) {
    score++;
    details.push('✅ Governance documentation exists');
  } else {
    details.push('❌ Governance documentation missing');
  }

  // Check architecture docs exist
  if (existsSync(join(process.cwd(), 'docs', 'architecture'))) {
    score++;
    details.push('✅ Architecture documentation exists');
  } else {
    details.push('❌ Architecture documentation missing');
  }

  return {
    category: 'Documentation',
    score,
    maxScore,
    percentage: (score / maxScore) * 100,
    details,
  };
}

function calculateTraceabilityScore(): ScoreResult {
  const details: string[] = [];
  let score = 0;
  const maxScore = 4;

  // Check traceability validator exists
  if (existsSync(join(process.cwd(), 'scripts', 'governance', 'validate-traceability.ts'))) {
    score++;
    details.push('✅ Traceability validator exists');
  } else {
    details.push('❌ Traceability validator missing');
  }

  // Check ADR system exists
  if (existsSync(join(process.cwd(), 'docs', 'decisions'))) {
    score++;
    details.push('✅ ADR system exists');
  } else {
    details.push('❌ ADR system missing');
  }

  // Check changelog system exists
  if (existsSync(join(process.cwd(), 'docs', 'changelogs'))) {
    score++;
    details.push('✅ Changelog system exists');
  } else {
    details.push('❌ Changelog system missing');
  }

  // Check task tracking exists
  if (existsSync(join(process.cwd(), 'docs', 'tracking'))) {
    score++;
    details.push('✅ Task tracking exists');
  } else {
    details.push('❌ Task tracking missing');
  }

  return {
    category: 'Traceability',
    score,
    maxScore,
    percentage: (score / maxScore) * 100,
    details,
  };
}

function calculateArchitectureScore(): ScoreResult {
  const details: string[] = [];
  let score = 0;
  const maxScore = 4;

  // Check typecheck passes
  if (runValidation('npm run typecheck')) {
    score++;
    details.push('✅ TypeScript type check passes');
  } else {
    details.push('❌ TypeScript type check fails');
  }

  // Check lint passes
  if (runValidation('npm run lint')) {
    score++;
    details.push('✅ ESLint validation passes');
  } else {
    details.push('❌ ESLint validation fails');
  }

  // Check drift detection exists
  if (existsSync(join(process.cwd(), 'scripts', 'governance', 'detect-drift.ts'))) {
    score++;
    details.push('✅ Drift detection exists');
  } else {
    details.push('❌ Drift detection missing');
  }

  // Check SSOT doctor exists
  if (existsSync(join(process.cwd(), 'scripts', 'governance', 'ssot-doctor.ts'))) {
    score++;
    details.push('✅ SSOT doctor exists');
  } else {
    details.push('❌ SSOT doctor missing');
  }

  return {
    category: 'Architecture',
    score,
    maxScore,
    percentage: (score / maxScore) * 100,
    details,
  };
}

function calculateComplianceScore(): ScoreResult {
  const details: string[] = [];
  let score = 0;
  const maxScore = 5;

  // Check comprehensive governance validation exists
  if (existsSync(join(process.cwd(), 'scripts', 'governance', 'validate-governance.ts'))) {
    score++;
    details.push('✅ Comprehensive governance validation exists');
  } else {
    details.push('❌ Comprehensive governance validation missing');
  }

  // Check pre-commit hook exists
  if (existsSync(join(process.cwd(), '.husky', 'pre-commit'))) {
    score++;
    details.push('✅ Pre-commit hook exists');
  } else {
    details.push('❌ Pre-commit hook missing');
  }

  // Check CI workflow exists
  if (existsSync(join(process.cwd(), '.github', 'workflows', 'ci.yml'))) {
    score++;
    details.push('✅ CI workflow exists');
  } else {
    details.push('❌ CI workflow missing');
  }

  // Check package.json has governance scripts
  const packageJsonPath = join(process.cwd(), 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);
    const hasGovernanceScripts =
      packageJson.scripts['validate:governance'] &&
      packageJson.scripts['detect:drift'] &&
      packageJson.scripts['ssot:doctor'];
    if (hasGovernanceScripts) {
      score++;
      details.push('✅ Governance scripts registered');
    } else {
      details.push('❌ Governance scripts incomplete');
    }
  } else {
    details.push('❌ package.json missing');
  }

  // Check governance registry exists
  if (existsSync(join(process.cwd(), 'packages', 'governance-ssot', 'registry'))) {
    score++;
    details.push('✅ Governance registry exists');
  } else {
    details.push('❌ Governance registry missing');
  }

  return {
    category: 'Compliance',
    score,
    maxScore,
    percentage: (score / maxScore) * 100,
    details,
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('📊 Governance Compliance Score\n');
console.log('====================================\n');

const report: ComplianceReport = {
  timestamp: new Date().toISOString(),
  overallScore: 0,
  overallPercentage: 0,
  scores: {
    governance: calculateGovernanceScore(),
    ssot: calculateSSOTScore(),
    documentation: calculateDocumentationScore(),
    traceability: calculateTraceabilityScore(),
    architecture: calculateArchitectureScore(),
    compliance: calculateComplianceScore(),
  },
  status: 'poor',
};

// Calculate overall score
const totalScore = Object.values(report.scores).reduce((sum, score) => sum + score.score, 0);
const totalMaxScore = Object.values(report.scores).reduce((sum, score) => sum + score.maxScore, 0);
report.overallScore = totalScore;
report.overallPercentage = (totalScore / totalMaxScore) * 100;

// Determine status
if (report.overallPercentage >= 90) {
  report.status = 'excellent';
} else if (report.overallPercentage >= 75) {
  report.status = 'good';
} else if (report.overallPercentage >= 50) {
  report.status = 'fair';
} else {
  report.status = 'poor';
}

// Display results
console.log(`Overall Score: ${report.overallScore}/${totalMaxScore} (${report.overallPercentage.toFixed(1)}%)`);
console.log(`Status: ${report.status.toUpperCase()}\n`);

Object.entries(report.scores).forEach(([key, score]) => {
  console.log(`${score.category}: ${score.score}/${score.maxScore} (${score.percentage.toFixed(1)}%)`);
  score.details.forEach((detail) => {
    console.log(`  ${detail}`);
  });
  console.log();
});

// Output machine-readable JSON
console.log('====================================');
console.log('Machine-Readable Output:\n');
console.log(JSON.stringify(report, null, 2));

// Exit with appropriate code
if (report.status === 'excellent' || report.status === 'good') {
  process.exit(0);
} else {
  process.exit(1);
}
