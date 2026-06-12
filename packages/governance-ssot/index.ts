// @gv/governance-ssot
// Single Source of Truth for all platform governance

// ============================================================================
// POLICIES
// ============================================================================

export {
  policyDefinitionSchema,
  type PolicyDefinition,
  policyRegistry,
  getPolicy,
  getAllPolicies,
  getPoliciesByCategory,
  getPoliciesBySeverity,
  getPoliciesByEnforcement,
  policyExists,
  validatePolicy,
  validatePolicyRegistry,
} from './policies';

import { validatePolicyRegistry as _validatePolicyRegistry } from './policies';

// ============================================================================
// WORKFLOWS
// ============================================================================

export {
  workflowDefinitionSchema,
  type WorkflowDefinition,
  workflowRegistry,
  getWorkflow,
  getAllWorkflows,
  getWorkflowByType,
  workflowExists,
  validateWorkflow,
  validateWorkflowRegistry,
} from './workflows';

import { validateWorkflowRegistry as _validateWorkflowRegistry } from './workflows';

// ============================================================================
// VALIDATORS
// ============================================================================

export {
  validatorDefinitionSchema,
  type ValidatorDefinition,
  validatorRegistry,
  getValidator,
  getAllValidators,
  getValidatorsByType,
  getValidatorsBySeverity,
  validatorExists,
  validateValidator,
  validateValidatorRegistry,
} from './validators';

import { validateValidatorRegistry as _validateValidatorRegistry } from './validators';

// ============================================================================
// OWNERSHIP
// ============================================================================

export {
  ownershipDefinitionSchema,
  type OwnershipDefinition,
  ownershipRegistry,
  getOwnership,
  getAllOwnership,
  getOwnershipByType,
  getOwnershipForPattern,
  ownershipExists,
  validateOwnership,
  validateOwnershipRegistry,
} from './ownership';

import { validateOwnershipRegistry as _validateOwnershipRegistry } from './ownership';

// ============================================================================
// STANDARDS
// ============================================================================

export {
  standardDefinitionSchema,
  type StandardDefinition,
  standardRegistry,
  getStandard,
  getAllStandards,
  getStandardsByCategory,
  standardExists,
  validateStandard,
  validateStandardRegistry,
} from './standards';

import { validateStandardRegistry as _validateStandardRegistry } from './standards';

// ============================================================================
// TEMPLATES
// ============================================================================

export {
  templateDefinitionSchema,
  type TemplateDefinition,
  templateRegistry,
  getTemplate,
  getAllTemplates,
  getTemplatesByType,
  getTemplatesByCategory,
  templateExists,
  validateTemplate,
  validateTemplateRegistry,
} from './templates';

import { validateTemplateRegistry as _validateTemplateRegistry } from './templates';

// ============================================================================
// COMPLIANCE
// ============================================================================

export {
  complianceDefinitionSchema,
  type ComplianceDefinition,
  complianceRegistry,
  getCompliance,
  getAllCompliance,
  getComplianceByCategory,
  complianceExists,
  validateCompliance,
  validateComplianceRegistry,
} from './compliance';

import { validateComplianceRegistry as _validateComplianceRegistry } from './compliance';

// ============================================================================
// SSOT REGISTRY
// ============================================================================

export {
  ssotRegistryEntrySchema,
  type SSOTRegistryEntry,
  ssotRegistry,
  getSSOT,
  getAllSSOTs,
  getSSOTByCategory,
  getSSOTByStatus,
  getSSOTByOwner,
  getSSOTDependencies,
  getSSOTConsumers,
  ssotExists,
  validateSSOT,
  validateSSOTRegistry,
} from './registry';

import { validateSSOTRegistry as _validateSSOTRegistry } from './registry';

// ============================================================================
// COMPREHENSIVE VALIDATION
// ============================================================================

export function validateGovernanceSSOT(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate all registries
  const policyResult = _validatePolicyRegistry();
  if (!policyResult.valid) errors.push(...policyResult.errors);

  const workflowResult = _validateWorkflowRegistry();
  if (!workflowResult.valid) errors.push(...workflowResult.errors);

  const validatorResult = _validateValidatorRegistry();
  if (!validatorResult.valid) errors.push(...validatorResult.errors);

  const ownershipResult = _validateOwnershipRegistry();
  if (!ownershipResult.valid) errors.push(...ownershipResult.errors);

  const standardResult = _validateStandardRegistry();
  if (!standardResult.valid) errors.push(...standardResult.errors);

  const templateResult = _validateTemplateRegistry();
  if (!templateResult.valid) errors.push(...templateResult.errors);

  const complianceResult = _validateComplianceRegistry();
  if (!complianceResult.valid) errors.push(...complianceResult.errors);

  const ssotResult = _validateSSOTRegistry();
  if (!ssotResult.valid) errors.push(...ssotResult.errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}
