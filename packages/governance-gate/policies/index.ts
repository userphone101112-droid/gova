// packages/governance-gate/policies/index.ts
// Governance gate policies

import { ChangeCategory, RiskLevel } from '../registry';

export interface Policy {
  id: string;
  name: string;
  description: string;
  appliesTo: ChangeCategory[];
  rule: string;
  severity: 'error' | 'warning' | 'info';
}

const policies: Policy[] = [
  {
    id: 'gate-required',
    name: 'Gate Required',
    description: 'All changes must pass through Governance Gate',
    appliesTo: Object.values(['new-feature', 'new-page', 'new-route', 'new-api', 'new-schema', 'new-contract', 'new-translation', 'new-permission', 'new-business-rule', 'new-database-entity', 'storage-change', 'infrastructure-change']),
    rule: 'No implementation may begin without an approved Governance Gate',
    severity: 'error',
  },
  {
    id: 'high-risk-approval',
    name: 'High Risk Approval',
    description: 'High-risk changes require platform architect approval',
    appliesTo: ['new-permission', 'new-database-entity', 'infrastructure-change', 'security'],
    rule: 'High-risk changes must be approved by platform architect',
    severity: 'error',
  },
  {
    id: 'database-adr',
    name: 'Database ADR',
    description: 'Database changes require ADR',
    appliesTo: ['new-database-entity'],
    rule: 'All database schema changes must have an ADR',
    severity: 'error',
  },
  {
    id: 'security-review',
    name: 'Security Review',
    description: 'Security-related changes require security lead approval',
    appliesTo: ['new-permission', 'new-api', 'security'],
    rule: 'Security-related changes must be reviewed by security lead',
    severity: 'error',
  },
  {
    id: 'documentation-required',
    name: 'Documentation Required',
    description: 'All changes must update documentation',
    appliesTo: Object.values(['new-feature', 'new-page', 'new-api', 'new-database-entity']),
    rule: 'Documentation must be updated for all changes',
    severity: 'warning',
  },
  {
    id: 'changelog-required',
    name: 'Changelog Required',
    description: 'Significant changes must update changelog',
    appliesTo: ['new-feature', 'new-api', 'new-database-entity', 'infrastructure-change'],
    rule: 'Changelog must be updated for significant changes',
    severity: 'warning',
  },
  {
    id: 'traceability-required',
    name: 'Traceability Required',
    description: 'All changes must have traceability',
    appliesTo: Object.values(['new-feature', 'new-page', 'new-api', 'new-database-entity']),
    rule: 'All changes must reference task, feature, or ADR',
    severity: 'warning',
  },
];

export function getApplicablePolicies(category: ChangeCategory): Policy[] {
  return policies.filter(policy => policy.appliesTo.includes(category));
}

export function getAllPolicies(): Policy[] {
  return policies;
}

export function getPolicyById(id: string): Policy | undefined {
  return policies.find(policy => policy.id === id);
}

export function validateAgainstPolicies(category: ChangeCategory, riskLevel: RiskLevel): {
  errors: string[];
  warnings: string[];
} {
  const applicablePolicies = getApplicablePolicies(category);
  const errors: string[] = [];
  const warnings: string[] = [];
  
  applicablePolicies.forEach(policy => {
    if (policy.severity === 'error') {
      errors.push(policy.rule);
    } else if (policy.severity === 'warning') {
      warnings.push(policy.rule);
    }
  });
  
  return { errors, warnings };
}
