// @gv/governance-ssot/compliance
// Compliance definitions for the GV Platform

import { z } from 'zod';

// ============================================================================
// COMPLIANCE DEFINITION SCHEMA
// ============================================================================

export const complianceDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Compliance ID must be lowercase with hyphens'),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['ssot', 'documentation', 'traceability', 'workflow', 'architecture']),
  checks: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    validator: z.string().optional(), // Reference to validator ID
    threshold: z.number().optional(), // Pass/fail threshold
  })),
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type ComplianceDefinition = z.infer<typeof complianceDefinitionSchema>;

// ============================================================================
// COMPLIANCE REGISTRY
// ============================================================================

export const complianceRegistry: Record<string, ComplianceDefinition> = {
  'ssot-compliance': {
    id: 'ssot-compliance',
    name: 'SSOT Compliance',
    description: 'Compliance check for SSOT packages',
    category: 'ssot',
    checks: [
      {
        id: 'ssot-registry-complete',
        name: 'SSOT Registry Complete',
        description: 'All SSOT packages must be registered in governance registry',
      },
      {
        id: 'ssot-validation-exists',
        name: 'SSOT Validation Exists',
        description: 'All SSOT packages must have validation scripts',
      },
      {
        id: 'ssot-documentation-exists',
        name: 'SSOT Documentation Exists',
        description: 'All SSOT packages must have README documentation',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'documentation-compliance': {
    id: 'documentation-compliance',
    name: 'Documentation Compliance',
    description: 'Compliance check for documentation',
    category: 'documentation',
    checks: [
      {
        id: 'docs-in-correct-location',
        name: 'Docs in Correct Location',
        description: 'All .md files must be in docs/ directory',
        validator: 'validate-docs',
      },
      {
        id: 'docs-have-headers',
        name: 'Docs Have Headers',
        description: 'All documentation files must have standardized headers',
        validator: 'validate-docs',
      },
      {
        id: 'docs-are-reachable',
        name: 'Docs Are Reachable',
        description: 'All documents must be reachable from docs/README.md',
        validator: 'validate-links',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'traceability-compliance': {
    id: 'traceability-compliance',
    name: 'Traceability Compliance',
    description: 'Compliance check for traceability',
    category: 'traceability',
    checks: [
      {
        id: 'changes-referenced',
        name: 'Changes Referenced',
        description: 'Every change must reference task, feature, ADR, changelog, documentation, SSOT',
      },
      {
        id: 'adr-created',
        name: 'ADR Created',
        description: 'Significant architectural decisions must have an ADR',
      },
      {
        id: 'changelog-updated',
        name: 'Changelog Updated',
        description: 'Significant changes must update changelog',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'workflow-compliance': {
    id: 'workflow-compliance',
    name: 'Workflow Compliance',
    description: 'Compliance check for implementation workflows',
    category: 'workflow',
    checks: [
      {
        id: 'workflow-followed',
        name: 'Workflow Followed',
        description: 'Implementation must follow the defined workflow',
      },
      {
        id: 'ssot-updated-first',
        name: 'SSOT Updated First',
        description: 'SSOT must be updated before implementation',
      },
      {
        id: 'validation-passed',
        name: 'Validation Passed',
        description: 'All validation steps must pass',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'architecture-compliance': {
    id: 'architecture-compliance',
    name: 'Architecture Compliance',
    description: 'Compliance check for architecture rules',
    category: 'architecture',
    checks: [
      {
        id: 'no-duplicates',
        name: 'No Duplicates',
        description: 'No duplicate DTOs, schemas, routes, permissions, translations',
        validator: 'detect:drift',
      },
      {
        id: 'no-unauthorized-abstractions',
        name: 'No Unauthorized Abstractions',
        description: 'No unauthorized abstractions or folders',
        validator: 'detect:drift',
      },
      {
        id: 'ssot-used',
        name: 'SSOT Used',
        description: 'SSOT packages must be used instead of local definitions',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// COMPLIANCE QUERY HELPERS
// ============================================================================

export function getCompliance(id: string): ComplianceDefinition | undefined {
  return complianceRegistry[id];
}

export function getAllCompliance(): ComplianceDefinition[] {
  return Object.values(complianceRegistry);
}

export function getComplianceByCategory(category: ComplianceDefinition['category']): ComplianceDefinition[] {
  return getAllCompliance().filter((c) => c.category === category);
}

export function complianceExists(id: string): boolean {
  return id in complianceRegistry;
}

export function validateCompliance(compliance: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = complianceDefinitionSchema.safeParse(compliance);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

export function validateComplianceRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [id, compliance] of Object.entries(complianceRegistry)) {
    const validation = validateCompliance(compliance);
    if (!validation.valid) {
      errors.push(`Compliance "${id}": ${validation.errors?.message}`);
    }

    if (compliance.id !== id) {
      errors.push(`Compliance "${id}": ID mismatch (registry key: ${id}, compliance.id: ${compliance.id})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
