// @gv/governance-ssot/ownership
// Code ownership definitions for the GV Platform

import { z } from 'zod';

// ============================================================================
// OWNERSHIP DEFINITION SCHEMA
// ============================================================================

export const ownershipDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Ownership ID must be lowercase with hyphens'),
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['package', 'directory', 'file-pattern', 'documentation']),
  pattern: z.string(), // Glob pattern or package name
  owners: z.array(z.object({
    name: z.string(),
    email: z.string().email().optional(),
    role: z.enum(['owner', 'maintainer', 'contributor', 'reviewer']),
  })),
  approvers: z.array(z.string()).default([]), // GitHub usernames required for approval
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type OwnershipDefinition = z.infer<typeof ownershipDefinitionSchema>;

// ============================================================================
// OWNERSHIP REGISTRY
// ============================================================================

export const ownershipRegistry: Record<string, OwnershipDefinition> = {
  'governance-ssot': {
    id: 'governance-ssot',
    name: 'Governance SSOT',
    description: 'Governance SSOT package ownership',
    type: 'package',
    pattern: '@gv/governance-ssot',
    owners: [
      { name: 'Platform Architect', role: 'owner' },
    ],
    approvers: ['platform-architect'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'features-ssot': {
    id: 'features-ssot',
    name: 'Features SSOT',
    description: 'Features SSOT package ownership',
    type: 'package',
    pattern: '@gv/features-ssot',
    owners: [
      { name: 'Product Team', role: 'owner' },
    ],
    approvers: ['product-lead'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'pages-ssot': {
    id: 'pages-ssot',
    name: 'Pages SSOT',
    description: 'Pages SSOT package ownership',
    type: 'package',
    pattern: '@gv/pages-ssot',
    owners: [
      { name: 'Frontend Team', role: 'owner' },
    ],
    approvers: ['frontend-lead'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'routes-ssot': {
    id: 'routes-ssot',
    name: 'Routes SSOT',
    description: 'Routes SSOT package ownership',
    type: 'package',
    pattern: '@gv/routes-ssot',
    owners: [
      { name: 'Frontend Team', role: 'owner' },
    ],
    approvers: ['frontend-lead'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'contracts': {
    id: 'contracts',
    name: 'Contracts SSOT',
    description: 'Contracts package ownership',
    type: 'package',
    pattern: '@gv/contracts',
    owners: [
      { name: 'API Team', role: 'owner' },
    ],
    approvers: ['api-lead'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'schemas': {
    id: 'schemas',
    name: 'Schemas SSOT',
    description: 'Schemas package ownership',
    type: 'package',
    pattern: '@gv/schemas',
    owners: [
      { name: 'Fullstack Team', role: 'owner' },
    ],
    approvers: ['fullstack-lead'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'permissions-ssot': {
    id: 'permissions-ssot',
    name: 'Permissions SSOT',
    description: 'Permissions SSOT package ownership',
    type: 'package',
    pattern: '@gv/permissions-ssot',
    owners: [
      { name: 'Security Team', role: 'owner' },
    ],
    approvers: ['security-lead'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'documentation': {
    id: 'documentation',
    name: 'Documentation',
    description: 'Documentation directory ownership',
    type: 'directory',
    pattern: 'docs/**',
    owners: [
      { name: 'Documentation Team', role: 'owner' },
    ],
    approvers: ['docs-lead'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'governance': {
    id: 'governance',
    name: 'Governance',
    description: 'Governance directory ownership',
    type: 'directory',
    pattern: 'docs/governance/**',
    owners: [
      { name: 'Platform Architect', role: 'owner' },
    ],
    approvers: ['platform-architect'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// OWNERSHIP QUERY HELPERS
// ============================================================================

export function getOwnership(id: string): OwnershipDefinition | undefined {
  return ownershipRegistry[id];
}

export function getAllOwnership(): OwnershipDefinition[] {
  return Object.values(ownershipRegistry);
}

export function getOwnershipByType(type: OwnershipDefinition['type']): OwnershipDefinition[] {
  return getAllOwnership().filter((o) => o.type === type);
}

export function getOwnershipForPattern(pattern: string): OwnershipDefinition | undefined {
  return getAllOwnership().find((o) => {
    if (o.type === 'package') {
      return pattern.includes(o.pattern);
    }
    if (o.type === 'directory' || o.type === 'file-pattern') {
      return pattern.match(o.pattern.replace(/\*/g, '.*'));
    }
    return false;
  });
}

export function ownershipExists(id: string): boolean {
  return id in ownershipRegistry;
}

export function validateOwnership(ownership: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = ownershipDefinitionSchema.safeParse(ownership);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

export function validateOwnershipRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [id, ownership] of Object.entries(ownershipRegistry)) {
    const validation = validateOwnership(ownership);
    if (!validation.valid) {
      errors.push(`Ownership "${id}": ${validation.errors?.message}`);
    }

    if (ownership.id !== id) {
      errors.push(`Ownership "${id}": ID mismatch (registry key: ${id}, ownership.id: ${ownership.id})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
