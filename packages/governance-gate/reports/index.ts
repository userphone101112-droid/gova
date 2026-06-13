// packages/governance-gate/reports/index.ts
// Report generators

import { GateRecord, ChangeCategory, RiskLevel } from '../registry';
import { Workflow } from '../workflows';
import { ApprovalRequirement } from '../approvals';

export interface GovernancePlan {
  gateId: string;
  title: string;
  description: string;
  category: ChangeCategory;
  riskLevel: RiskLevel;
  impactedSSOTs: string[];
  workflow: Workflow;
  requiredApprovals: ApprovalRequirement[];
  requiredValidations: string[];
  requiredDocumentation: string[];
  checklist: string[];
  estimatedDuration: string;
  createdAt: string;
}

export function generateGovernancePlan(
  gate: GateRecord,
  workflow: Workflow,
  approvals: ApprovalRequirement[]
): GovernancePlan {
  const totalDuration = workflow.steps.reduce((sum, step) => {
    if (step.estimatedDuration) {
      const match = step.estimatedDuration.match(/(\d+)/);
      if (match) {
        return sum + parseInt(match[1]);
      }
    }
    return sum;
  }, 0);
  
  const estimatedDuration = totalDuration > 0 ? `${totalDuration}h` : 'Unknown';
  
  return {
    gateId: gate.id,
    title: gate.title,
    description: gate.description,
    category: gate.category,
    riskLevel: gate.riskLevel,
    impactedSSOTs: gate.impactedSSOTs,
    workflow,
    requiredApprovals: approvals,
    requiredValidations: workflow.requiredValidations,
    requiredDocumentation: workflow.requiredDocumentation,
    checklist: workflow.steps.map(step => step.title),
    estimatedDuration,
    createdAt: gate.createdAt,
  };
}

export function generateGateReport(gate: GateRecord): string {
  const lines: string[] = [];
  
  lines.push('# Governance Gate Report');
  lines.push('');
  lines.push(`**Gate ID**: ${gate.id}`);
  lines.push(`**Title**: ${gate.title}`);
  lines.push(`**Status**: ${gate.status.toUpperCase()}`);
  lines.push(`**Category**: ${gate.category}`);
  lines.push(`**Risk Level**: ${gate.riskLevel.toUpperCase()}`);
  lines.push(`**Requester**: ${gate.requester}`);
  lines.push(`**Created**: ${gate.createdAt}`);
  lines.push('');
  
  lines.push('## Description');
  lines.push('');
  lines.push(gate.description);
  lines.push('');
  
  lines.push('## Impacted SSOTs');
  lines.push('');
  gate.impactedSSOTs.forEach(ssot => {
    lines.push(`- ${ssot}`);
  });
  lines.push('');
  
  lines.push('## Required Workflow');
  lines.push('');
  lines.push(`- ${gate.requiredWorkflow}`);
  lines.push('');
  
  lines.push('## Required Approvals');
  lines.push('');
  gate.requiredApprovals.forEach(approval => {
    lines.push(`- ${approval}`);
  });
  lines.push('');
  
  lines.push('## Required Validations');
  lines.push('');
  gate.requiredValidations.forEach(validation => {
    lines.push(`- ${validation}`);
  });
  lines.push('');
  
  lines.push('## Required Documentation');
  lines.push('');
  gate.requiredDocumentation.forEach(doc => {
    lines.push(`- ${doc}`);
  });
  lines.push('');
  
  lines.push('## Checklist');
  lines.push('');
  gate.checklist.forEach(item => {
    const status = item.completed ? '✅' : '☐';
    lines.push(`${status} ${item.item}`);
  });
  lines.push('');
  
  lines.push('## Traceability');
  lines.push('');
  if (gate.traceability.taskId) lines.push(`- Task: ${gate.traceability.taskId}`);
  if (gate.traceability.featureId) lines.push(`- Feature: ${gate.traceability.featureId}`);
  if (gate.traceability.adrId) lines.push(`- ADR: ${gate.traceability.adrId}`);
  if (gate.traceability.changelogId) lines.push(`- Changelog: ${gate.traceability.changelogId}`);
  lines.push('');
  
  lines.push('## Approvals');
  lines.push('');
  gate.approvals.forEach(approval => {
    const status = approval.status.toUpperCase();
    lines.push(`- ${approval.approver} (${approval.role}): ${status}`);
    if (approval.comments) {
      lines.push(`  Comment: ${approval.comments}`);
    }
  });
  lines.push('');
  
  return lines.join('\n');
}
