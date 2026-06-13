// packages/governance-gate/validators/index.ts
// Pre-implementation validators

import { ChangeCategory } from '../registry';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validatePreImplementation(
  category: ChangeCategory,
  description: string,
  files?: string[]
): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };
  
  // Validate description
  if (description.length < 10) {
    result.errors.push('Description must be at least 10 characters');
    result.valid = false;
  }
  
  if (description.length > 1000) {
    result.warnings.push('Description is very long, consider summarizing');
  }
  
  // Category-specific validations
  switch (category) {
    case 'new-feature':
      if (!description.toLowerCase().includes('feature')) {
        result.warnings.push('Description does not explicitly mention "feature"');
      }
      break;
      
    case 'new-page':
      if (!description.toLowerCase().includes('page')) {
        result.warnings.push('Description does not explicitly mention "page"');
      }
      break;
      
    case 'new-api':
      if (!description.toLowerCase().includes('api')) {
        result.warnings.push('Description does not explicitly mention "api"');
      }
      break;
      
    case 'new-database-entity':
      if (!description.toLowerCase().includes('table') && !description.toLowerCase().includes('entity')) {
        result.warnings.push('Description should mention table or entity');
      }
      break;
  }
  
  return result;
}

export function validateSSOTExists(ssotId: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };
  
  const knownSSOTs = [
    '@gv/features-ssot',
    '@gv/pages-ssot',
    '@gv/routes-ssot',
    '@gv/navigation-ssot',
    '@gv/forms-ssot',
    '@gv/permissions-ssot',
    '@gv/analytics-ssot',
    '@gv/contracts',
    '@gv/schemas',
    '@gv/translations',
    '@gv/business-rules',
    '@gv/storage',
    '@gv/domain',
    '@gv/auth',
    '@gv/theme',
    '@gv/branding',
    '@gv/config',
    '@gv/governance-ssot',
  ];
  
  if (!knownSSOTs.includes(ssotId)) {
    result.errors.push(`Unknown SSOT: ${ssotId}`);
    result.valid = false;
  }
  
  return result;
}

export function validateWorkflowExists(workflowId: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };
  
  const knownWorkflows = [
    'new-feature-workflow',
    'new-page-workflow',
    'new-api-workflow',
    'new-translation-workflow',
    'new-database-entity-workflow',
  ];
  
  if (!knownWorkflows.includes(workflowId)) {
    result.errors.push(`Unknown workflow: ${workflowId}`);
    result.valid = false;
  }
  
  return result;
}

export function validateOwnershipExists(role: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };
  
  const knownRoles = [
    'platform-architect',
    'product-lead',
    'frontend-lead',
    'backend-lead',
    'api-lead',
    'fullstack-lead',
    'security-lead',
    'devops-lead',
    'database-admin',
    'docs-lead',
    'i18n-lead',
    'design-lead',
    'analytics-lead',
    'tech-lead',
  ];
  
  if (!knownRoles.includes(role)) {
    result.errors.push(`Unknown role: ${role}`);
    result.valid = false;
  }
  
  return result;
}
