// @gv/governance-ssot/standards
// Governance standards for the GV Platform

import { z } from 'zod';

// ============================================================================
// STANDARD DEFINITION SCHEMA
// ============================================================================

export const standardDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Standard ID must be lowercase with hyphens'),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['coding', 'documentation', 'architecture', 'security', 'performance', 'testing', 'git']),
  rules: z.array(z.object({
    id: z.string(),
    description: z.string(),
    enforcement: z.enum(['manual', 'automated', 'blocking']),
  })),
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type StandardDefinition = z.infer<typeof standardDefinitionSchema>;

// ============================================================================
// STANDARD REGISTRY
// ============================================================================

export const standardRegistry: Record<string, StandardDefinition> = {
  'typescript-strict': {
    id: 'typescript-strict',
    name: 'TypeScript Strict Mode',
    description: 'TypeScript must use strict mode with all strict options enabled',
    category: 'coding',
    rules: [
      {
        id: 'strict-mode-enabled',
        description: 'strict mode must be enabled in tsconfig.json',
        enforcement: 'automated',
      },
      {
        id: 'no-any-type',
        description: 'Avoid using any type',
        enforcement: 'manual',
      },
      {
        id: 'type-everything',
        description: 'Type everything explicitly',
        enforcement: 'manual',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'naming-conventions': {
    id: 'naming-conventions',
    name: 'Naming Conventions',
    description: 'Consistent naming conventions across the codebase',
    category: 'coding',
    rules: [
      {
        id: 'kebab-case-files',
        description: 'Files and directories use kebab-case',
        enforcement: 'manual',
      },
      {
        id: 'camelcase-variables',
        description: 'Variables and functions use camelCase',
        enforcement: 'manual',
      },
      {
        id: 'pascalcase-types',
        description: 'Types and interfaces use PascalCase',
        enforcement: 'manual',
      },
      {
        id: 'upper-snake-case-constants',
        description: 'Constants use UPPER_SNAKE_CASE',
        enforcement: 'manual',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'conventional-commits': {
    id: 'conventional-commits',
    name: 'Conventional Commits',
    description: 'Git commit messages must follow conventional commit format',
    category: 'git',
    rules: [
      {
        id: 'commit-format',
        description: 'Use format: type(scope): description',
        enforcement: 'manual',
      },
      {
        id: 'commit-types',
        description: 'Allowed types: feat, fix, docs, refactor, test, chore',
        enforcement: 'manual',
      },
      {
        id: 'commit-description',
        description: 'Description should be imperative and lowercase',
        enforcement: 'manual',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'documentation-headers': {
    id: 'documentation-headers',
    name: 'Documentation Headers',
    description: 'All documentation files must have standardized headers',
    category: 'documentation',
    rules: [
      {
        id: 'header-required',
        description: 'Every .md file must have a header with Source, Status, Last Updated',
        enforcement: 'automated',
      },
      {
        id: 'header-format',
        description: 'Header format must match the standard template',
        enforcement: 'automated',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'security-input-validation': {
    id: 'security-input-validation',
    name: 'Input Validation',
    description: 'All user inputs must be validated',
    category: 'security',
    rules: [
      {
        id: 'validate-all-inputs',
        description: 'Use Zod schemas for input validation',
        enforcement: 'manual',
      },
      {
        id: 'sanitize-user-input',
        description: 'Sanitize HTML and user-provided content',
        enforcement: 'manual',
      },
      {
        id: 'validate-on-server',
        description: 'Always validate on the server, not just client',
        enforcement: 'manual',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// STANDARD QUERY HELPERS
// ============================================================================

export function getStandard(id: string): StandardDefinition | undefined {
  return standardRegistry[id];
}

export function getAllStandards(): StandardDefinition[] {
  return Object.values(standardRegistry);
}

export function getStandardsByCategory(category: StandardDefinition['category']): StandardDefinition[] {
  return getAllStandards().filter((s) => s.category === category);
}

export function standardExists(id: string): boolean {
  return id in standardRegistry;
}

export function validateStandard(standard: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = standardDefinitionSchema.safeParse(standard);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

export function validateStandardRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [id, standard] of Object.entries(standardRegistry)) {
    const validation = validateStandard(standard);
    if (!validation.valid) {
      errors.push(`Standard "${id}": ${validation.errors?.message}`);
    }

    if (standard.id !== id) {
      errors.push(`Standard "${id}": ID mismatch (registry key: ${id}, standard.id: ${standard.id})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
