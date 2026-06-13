// packages/governance-gate/engine/index.ts
// Governance Gate engine - main orchestration

import { z } from 'zod';
import {
  GateRecord,
  GateStatus,
  ChangeCategory,
  RiskLevel,
  generateGateId,
  registerGate,
  updateGate,
} from '../registry';
import { analyzeChange } from '../analyzers';
import { resolveWorkflow } from '../workflows';
import { determineRequiredApprovals } from '../approvals';
import { validatePreImplementation, validateSSOTExists, validateWorkflowExists, validateOwnershipExists } from '../validators';
import { generateGovernancePlan, generateGateReport } from '../reports';
import { validateAgainstPolicies } from '../policies';

export interface GateRequest {
  title: string;
  description: string;
  requester: string;
  category?: ChangeCategory;
  riskLevel?: RiskLevel;
  files?: string[];
  traceability?: {
    taskId?: string;
    featureId?: string;
    adrId?: string;
    changelogId?: string;
  };
}

export interface GateResponse {
  success: boolean;
  gateId?: string;
  plan?: any;
  errors: string[];
  warnings: string[];
}

export function createGate(request: GateRequest): GateResponse {
  const response: GateResponse = {
    success: false,
    errors: [],
    warnings: [],
  };
  
  // Validate request
  if (!request.title || request.title.length < 1) {
    response.errors.push('Title is required');
  }
  
  if (!request.description || request.description.length < 10) {
    response.errors.push('Description must be at least 10 characters');
  }
  
  if (!request.requester) {
    response.errors.push('Requester is required');
  }
  
  if (response.errors.length > 0) {
    return response;
  }
  
  // Analyze change if category not provided
  let category = request.category;
  let riskLevel = request.riskLevel;
  
  if (!category) {
    const analysis = analyzeChange(request.description, request.files);
    category = analysis.category;
    riskLevel = analysis.riskLevel;
    response.warnings.push(`Auto-classified as ${category} (${analysis.reason})`);
  }
  
  if (!riskLevel) {
    riskLevel = 'medium';
  }
  
  // Resolve workflow
  const workflow = resolveWorkflow(category);
  if (!workflow) {
    response.errors.push(`No workflow found for category: ${category}`);
    return response;
  }
  
  // Determine approvals
  const approvals = determineRequiredApprovals(category, riskLevel);
  
  // Validate against policies
  const policyValidation = validateAgainstPolicies(category, riskLevel);
  response.warnings.push(...policyValidation.warnings);
  
  // Generate gate ID
  const gateId = generateGateId();
  
  // Create gate record
  const now = new Date().toISOString();
  const gate: GateRecord = {
    id: gateId,
    title: request.title,
    description: request.description,
    category,
    status: 'pending',
    riskLevel,
    requester: request.requester,
    createdAt: now,
    updatedAt: now,
    impactedSSOTs: determineImpactedSSOTs(category),
    requiredWorkflow: workflow.id,
    requiredApprovals: approvals.map(a => a.role),
    requiredValidations: workflow.requiredValidations,
    requiredDocumentation: workflow.requiredDocumentation,
    checklist: workflow.steps.map(step => ({
      item: step.title,
      completed: false,
    })),
    traceability: request.traceability || {},
    approvals: approvals.map(approval => ({
      approver: approval.role,
      role: approval.role,
      status: approval.autoApprove ? 'approved' : 'pending',
      approvedAt: approval.autoApprove ? now : undefined,
    })),
  };
  
  // Register gate
  registerGate(gate);
  
  // Generate plan
  const plan = generateGovernancePlan(gate, workflow, approvals);
  
  response.success = true;
  response.gateId = gateId;
  response.plan = plan;
  
  return response;
}

export function approveGate(gateId: string, approver: string, comments?: string): GateResponse {
  const response: GateResponse = {
    success: false,
    errors: [],
    warnings: [],
  };
  
  const gate = updateGate(gateId, {
    approvals: [
      {
        approver,
        role: approver,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        comments,
      },
    ],
  });
  
  if (!gate) {
    response.errors.push(`Gate not found: ${gateId}`);
    return response;
  }
  
  // Check if all approvals are complete
  const allApproved = gate.approvals.every(a => a.status === 'approved');
  if (allApproved) {
    updateGate(gateId, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
    });
  }
  
  response.success = true;
  response.gateId = gateId;
  
  return response;
}

export function completeChecklistItem(gateId: string, itemIndex: number): GateResponse {
  const response: GateResponse = {
    success: false,
    errors: [],
    warnings: [],
  };
  
  const gate = updateGate(gateId, {
    checklist: [
      {
        item: 'Item completed',
        completed: true,
        completedAt: new Date().toISOString(),
      },
    ],
  });
  
  if (!gate) {
    response.errors.push(`Gate not found: ${gateId}`);
    return response;
  }
  
  response.success = true;
  response.gateId = gateId;
  
  return response;
}

export function preflightValidation(gateId: string): GateResponse {
  const response: GateResponse = {
    success: false,
    errors: [],
    warnings: [],
  };
  
  const gate = updateGate(gateId, {});
  if (!gate) {
    response.errors.push(`Gate not found: ${gateId}`);
    return response;
  }
  
  // Validate SSOTs exist
  gate.impactedSSOTs.forEach(ssot => {
    const validation = validateSSOTExists(ssot);
    response.errors.push(...validation.errors);
    response.warnings.push(...validation.warnings);
  });
  
  // Validate workflow exists
  const workflowValidation = validateWorkflowExists(gate.requiredWorkflow);
  response.errors.push(...workflowValidation.errors);
  response.warnings.push(...workflowValidation.warnings);
  
  // Validate ownership exists
  gate.requiredApprovals.forEach(role => {
    const validation = validateOwnershipExists(role);
    response.errors.push(...validation.errors);
    response.warnings.push(...validation.warnings);
  });
  
  // Validate pre-implementation
  const preImplValidation = validatePreImplementation(gate.category, gate.description);
  response.errors.push(...preImplValidation.errors);
  response.warnings.push(...preImplValidation.warnings);
  
  response.success = response.errors.length === 0;
  
  return response;
}

function determineImpactedSSOTs(category: ChangeCategory): string[] {
  const ssotMap: Record<ChangeCategory, string[]> = {
    'new-feature': ['@gv/features-ssot', '@gv/translations', '@gv/analytics-ssot', '@gv/permissions-ssot', 'docs/'],
    'new-page': ['@gv/pages-ssot', '@gv/routes-ssot', '@gv/navigation-ssot', '@gv/translations', '@gv/analytics-ssot', 'docs/'],
    'new-route': ['@gv/routes-ssot', '@gv/contracts', '@gv/schemas', '@gv/permissions-ssot', '@gv/analytics-ssot'],
    'new-form': ['@gv/forms-ssot', '@gv/schemas', '@gv/translations', '@gv/analytics-ssot'],
    'new-api': ['@gv/contracts', '@gv/schemas', '@gv/routes-ssot', '@gv/permissions-ssot', '@gv/analytics-ssot', 'docs/api/'],
    'new-schema': ['@gv/schemas', '@gv/forms-ssot'],
    'new-contract': ['@gv/contracts', '@gv/schemas'],
    'new-translation': ['@gv/translations'],
    'new-permission': ['@gv/permissions-ssot', '@gv/auth'],
    'new-business-rule': ['@gv/business-rules'],
    'new-database-entity': ['@gv/domain', 'docs/database/', 'docs/decisions/'],
    'storage-change': ['@gv/storage'],
    'infrastructure-change': ['@gv/config', 'docs/'],
    'documentation-change': ['docs/'],
    'bug-fix': [],
    'refactor': [],
    'performance': [],
    'security': ['@gv/permissions-ssot', '@gv/auth', 'docs/'],
    'other': [],
  };
  
  return ssotMap[category] || [];
}
