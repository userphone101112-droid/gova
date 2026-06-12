// @gv/governance-ssot/policies
// Governance policies for the GV Platform

import { z } from 'zod';

// ============================================================================
// POLICY DEFINITION SCHEMA
// ============================================================================

export const policyDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Policy ID must be lowercase with hyphens'),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['documentation', 'code', 'architecture', 'security', 'performance', 'testing', 'deployment']),
  severity: z.enum(['error', 'warning', 'info']),
  enforcement: z.enum(['manual', 'automated', 'blocking']),
  appliesTo: z.array(z.string()).default([]), // File patterns, package names, etc.
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type PolicyDefinition = z.infer<typeof policyDefinitionSchema>;

// ============================================================================
// POLICY REGISTRY
// ============================================================================

/**
 * Authoritative registry of all governance policies.
 * 
 * This is the Single Source of Truth for governance policies.
 * All governance-related code must reference this registry.
 */
export const policyRegistry: Record<string, PolicyDefinition> = {
  'no-duplicate-dtos': {
    id: 'no-duplicate-dtos',
    name: 'No Duplicate DTOs',
    description: 'DTOs must be defined in @gv/contracts only',
    category: 'code',
    severity: 'error',
    enforcement: 'automated',
    appliesTo: ['**/*.ts', '**/*.tsx'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'no-duplicate-schemas': {
    id: 'no-duplicate-schemas',
    name: 'No Duplicate Schemas',
    description: 'Zod schemas must be defined in @gv/schemas only',
    category: 'code',
    severity: 'error',
    enforcement: 'automated',
    appliesTo: ['**/*.ts', '**/*.tsx'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'no-hardcoded-strings': {
    id: 'no-hardcoded-strings',
    name: 'No Hardcoded Strings',
    description: 'User-facing strings must use @gv/translations',
    category: 'code',
    severity: 'error',
    enforcement: 'automated',
    appliesTo: ['src/**/*.{ts,tsx}', 'apps/**/*.{ts,tsx}'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'no-hardcoded-colors': {
    id: 'no-hardcoded-colors',
    name: 'No Hardcoded Colors',
    description: 'Colors must use @gv/theme CSS variables',
    category: 'code',
    severity: 'error',
    enforcement: 'automated',
    appliesTo: ['**/*.{css,scss,ts,tsx}'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'documentation-location': {
    id: 'documentation-location',
    name: 'Documentation Location',
    description: 'All .md files must be in docs/ directory',
    category: 'documentation',
    severity: 'error',
    enforcement: 'blocking',
    appliesTo: ['**/*.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'adr-required': {
    id: 'adr-required',
    name: 'ADR Required',
    description: 'Significant architectural decisions must have an ADR',
    category: 'architecture',
    severity: 'warning',
    enforcement: 'manual',
    appliesTo: ['**/*.{ts,tsx}'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'changelog-required': {
    id: 'changelog-required',
    name: 'Changelog Required',
    description: 'Significant changes must update changelog',
    category: 'documentation',
    severity: 'warning',
    enforcement: 'manual',
    appliesTo: ['**/*.{ts,tsx}'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'traceability-required': {
    id: 'traceability-required',
    name: 'Traceability Required',
    description: 'Every change must reference task, feature, ADR, changelog, documentation, SSOT',
    category: 'code',
    severity: 'error',
    enforcement: 'automated',
    appliesTo: ['**/*.{ts,tsx}'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// POLICY QUERY HELPERS
// ============================================================================

export function getPolicy(id: string): PolicyDefinition | undefined {
  return policyRegistry[id];
}

export function getAllPolicies(): PolicyDefinition[] {
  return Object.values(policyRegistry);
}

export function getPoliciesByCategory(category: PolicyDefinition['category']): PolicyDefinition[] {
  return getAllPolicies().filter((p) => p.category === category);
}

export function getPoliciesBySeverity(severity: PolicyDefinition['severity']): PolicyDefinition[] {
  return getAllPolicies().filter((p) => p.severity === severity);
}

export function getPoliciesByEnforcement(enforcement: PolicyDefinition['enforcement']): PolicyDefinition[] {
  return getAllPolicies().filter((p) => p.enforcement === enforcement);
}

export function policyExists(id: string): boolean {
  return id in policyRegistry;
}

export function validatePolicy(policy: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = policyDefinitionSchema.safeParse(policy);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

export function validatePolicyRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [id, policy] of Object.entries(policyRegistry)) {
    const validation = validatePolicy(policy);
    if (!validation.valid) {
      errors.push(`Policy "${id}": ${validation.errors?.message}`);
    }

    if (policy.id !== id) {
      errors.push(`Policy "${id}": ID mismatch (registry key: ${id}, policy.id: ${policy.id})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
