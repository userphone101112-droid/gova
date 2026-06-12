// @gv/governance-ssot/validators
// Governance validators for the GV Platform

import { z } from 'zod';

// ============================================================================
// VALIDATOR DEFINITION SCHEMA
// ============================================================================

export const validatorDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Validator ID must be lowercase with hyphens'),
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['ssot', 'documentation', 'code', 'architecture', 'security', 'performance']),
  script: z.string(), // Path to validation script
  severity: z.enum(['error', 'warning', 'info']),
  autoFix: z.boolean().default(false),
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type ValidatorDefinition = z.infer<typeof validatorDefinitionSchema>;

// ============================================================================
// VALIDATOR REGISTRY
// ============================================================================

export const validatorRegistry: Record<string, ValidatorDefinition> = {
  'validate-ssot': {
    id: 'validate-ssot',
    name: 'SSOT Validator',
    description: 'Validates SSOT package consistency',
    type: 'ssot',
    script: 'packages/shared/scripts/validate-ssot.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-docs': {
    id: 'validate-docs',
    name: 'Documentation Validator',
    description: 'Validates documentation governance',
    type: 'documentation',
    script: 'scripts/validate-docs.js',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-links': {
    id: 'validate-links',
    name: 'Documentation Links Validator',
    description: 'Validates documentation links',
    type: 'documentation',
    script: 'scripts/validate-links.js',
    severity: 'warning',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-features': {
    id: 'validate-features',
    name: 'Features SSOT Validator',
    description: 'Validates features SSOT',
    type: 'ssot',
    script: 'packages/features-ssot/scripts/validate-features.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-pages': {
    id: 'validate-pages',
    name: 'Pages SSOT Validator',
    description: 'Validates pages SSOT',
    type: 'ssot',
    script: 'packages/pages-ssot/scripts/validate-pages.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-routes': {
    id: 'validate-routes',
    name: 'Routes SSOT Validator',
    description: 'Validates routes SSOT',
    type: 'ssot',
    script: 'packages/routes-ssot/scripts/validate-routes.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-navigation': {
    id: 'validate-navigation',
    name: 'Navigation SSOT Validator',
    description: 'Validates navigation SSOT',
    type: 'ssot',
    script: 'packages/navigation-ssot/scripts/validate-navigation.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-forms': {
    id: 'validate-forms',
    name: 'Forms SSOT Validator',
    description: 'Validates forms SSOT',
    type: 'ssot',
    script: 'packages/forms-ssot/scripts/validate-forms.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-permissions': {
    id: 'validate-permissions',
    name: 'Permissions SSOT Validator',
    description: 'Validates permissions SSOT',
    type: 'ssot',
    script: 'packages/permissions-ssot/scripts/validate-permissions.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-analytics': {
    id: 'validate-analytics',
    name: 'Analytics SSOT Validator',
    description: 'Validates analytics SSOT',
    type: 'ssot',
    script: 'packages/analytics-ssot/scripts/validate-analytics.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-governance-pages': {
    id: 'validate-governance-pages',
    name: 'Page Governance Validator',
    description: 'Validates page governance rules',
    type: 'code',
    script: 'scripts/governance/validate-pages-governance.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-governance-routes': {
    id: 'validate-governance-routes',
    name: 'Route Governance Validator',
    description: 'Validates route governance rules',
    type: 'code',
    script: 'scripts/governance/validate-routes-governance.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-governance-features': {
    id: 'validate-governance-features',
    name: 'Feature Governance Validator',
    description: 'Validates feature governance rules',
    type: 'code',
    script: 'scripts/governance/validate-features-governance.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'validate-governance-forms': {
    id: 'validate-governance-forms',
    name: 'Form Governance Validator',
    description: 'Validates form governance rules',
    type: 'code',
    script: 'scripts/governance/validate-forms-governance.ts',
    severity: 'error',
    autoFix: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// VALIDATOR QUERY HELPERS
// ============================================================================

export function getValidator(id: string): ValidatorDefinition | undefined {
  return validatorRegistry[id];
}

export function getAllValidators(): ValidatorDefinition[] {
  return Object.values(validatorRegistry);
}

export function getValidatorsByType(type: ValidatorDefinition['type']): ValidatorDefinition[] {
  return getAllValidators().filter((v) => v.type === type);
}

export function getValidatorsBySeverity(severity: ValidatorDefinition['severity']): ValidatorDefinition[] {
  return getAllValidators().filter((v) => v.severity === severity);
}

export function validatorExists(id: string): boolean {
  return id in validatorRegistry;
}

export function validateValidator(validator: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = validatorDefinitionSchema.safeParse(validator);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

export function validateValidatorRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [id, validator] of Object.entries(validatorRegistry)) {
    const validation = validateValidator(validator);
    if (!validation.valid) {
      errors.push(`Validator "${id}": ${validation.errors?.message}`);
    }

    if (validator.id !== id) {
      errors.push(`Validator "${id}": ID mismatch (registry key: ${id}, validator.id: ${validator.id})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
