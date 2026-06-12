// @gv/governance-ssot/registry
// Central registry of all SSOT packages for the GV Platform

import { z } from 'zod';

// ============================================================================
// SSOT REGISTRY ENTRY SCHEMA
// ============================================================================

export const ssotRegistryEntrySchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'SSOT ID must be lowercase with hyphens'),
  name: z.string().min(1),
  packageName: z.string().min(1), // @gv/package-name
  description: z.string().min(1),
  category: z.enum(['theme', 'translation', 'contract', 'schema', 'page', 'route', 'navigation', 'form', 'feature', 'auth', 'permission', 'analytics', 'business-rule', 'storage', 'database', 'documentation', 'ai-context', 'governance']),
  status: z.enum(['active', 'deprecated', 'experimental']),
  validationScript: z.string().optional(), // Path to validation script
  documentationPath: z.string().optional(), // Path to documentation
  owner: z.string().min(1), // Team or individual owner
  dependencies: z.array(z.string()).default([]), // Other SSOT packages this depends on
  consumers: z.array(z.string()).default([]), // Packages that consume this SSOT
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type SSOTRegistryEntry = z.infer<typeof ssotRegistryEntrySchema>;

// ============================================================================
// SSOT REGISTRY
// ============================================================================

/**
 * Central registry of all SSOT packages.
 * 
 * This is the Single Source of Truth for SSOT package metadata.
 * All governance-related code must reference this registry.
 */
export const ssotRegistry: Record<string, SSOTRegistryEntry> = {
  'theme': {
    id: 'theme',
    name: 'Theme SSOT',
    packageName: '@gv/theme',
    description: 'CSS variables, ThemeTokens, light/dark/brand themes',
    category: 'theme',
    status: 'active',
    validationScript: undefined,
    documentationPath: 'docs/packages/theme.md',
    owner: 'Design Team',
    dependencies: [],
    consumers: ['@gv/design-system', 'frontend'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'translation': {
    id: 'translation',
    name: 'Translation SSOT',
    packageName: '@gv/translations',
    description: 'Type-safe en/ar dictionary + getTranslation()',
    category: 'translation',
    status: 'active',
    validationScript: 'packages/shared/scripts/validate-ssot.ts',
    documentationPath: 'docs/packages/translations.md',
    owner: 'i18n Team',
    dependencies: [],
    consumers: ['frontend', 'mobile'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'contract': {
    id: 'contract',
    name: 'Contracts SSOT',
    packageName: '@gv/contracts',
    description: 'Shared API DTOs (request/response shapes)',
    category: 'contract',
    status: 'active',
    validationScript: 'packages/shared/scripts/validate-ssot.ts',
    documentationPath: 'docs/packages/contracts.md',
    owner: 'API Team',
    dependencies: [],
    consumers: ['frontend', 'backend', 'mobile'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'schema': {
    id: 'schema',
    name: 'Schemas SSOT',
    packageName: '@gv/schemas',
    description: 'Zod validation schemas for all operations',
    category: 'schema',
    status: 'active',
    validationScript: 'packages/shared/scripts/validate-ssot.ts',
    documentationPath: 'docs/packages/schemas.md',
    owner: 'Fullstack Team',
    dependencies: [],
    consumers: ['frontend forms', 'backend validators'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page': {
    id: 'page',
    name: 'Pages SSOT',
    packageName: '@gv/pages-ssot',
    description: 'Authoritative page registry and strongly typed definitions',
    category: 'page',
    status: 'active',
    validationScript: 'packages/pages-ssot/scripts/validate-pages.ts',
    documentationPath: 'docs/packages/pages-ssot.md',
    owner: 'Frontend Team',
    dependencies: ['feature', 'route', 'permission', 'analytics'],
    consumers: ['frontend', 'navigation'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'route': {
    id: 'route',
    name: 'Routes SSOT',
    packageName: '@gv/routes-ssot',
    description: 'Route helpers and type-safe route maps',
    category: 'route',
    status: 'active',
    validationScript: 'packages/routes-ssot/scripts/validate-routes.ts',
    documentationPath: 'docs/packages/routes-ssot.md',
    owner: 'Frontend Team',
    dependencies: ['page', 'feature', 'permission'],
    consumers: ['frontend', 'navigation'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'navigation': {
    id: 'navigation',
    name: 'Navigation SSOT',
    packageName: '@gv/navigation-ssot',
    description: 'Sidebar, menus, footer, breadcrumbs, quick actions',
    category: 'navigation',
    status: 'active',
    validationScript: 'packages/navigation-ssot/scripts/validate-navigation.ts',
    documentationPath: 'docs/packages/navigation-ssot.md',
    owner: 'Frontend Team',
    dependencies: ['route', 'permission', 'feature'],
    consumers: ['frontend'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'form': {
    id: 'form',
    name: 'Forms SSOT',
    packageName: '@gv/forms-ssot',
    description: 'Form schemas, DTOs, permissions, translations',
    category: 'form',
    status: 'active',
    validationScript: 'packages/forms-ssot/scripts/validate-forms.ts',
    documentationPath: 'docs/packages/forms-ssot.md',
    owner: 'Fullstack Team',
    dependencies: ['schema', 'contract', 'permission', 'translation'],
    consumers: ['frontend', 'backend'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'feature': {
    id: 'feature',
    name: 'Features SSOT',
    packageName: '@gv/features-ssot',
    description: 'Feature definitions, validators, and registry',
    category: 'feature',
    status: 'active',
    validationScript: 'packages/features-ssot/scripts/validate-features.ts',
    documentationPath: 'docs/packages/features-ssot.md',
    owner: 'Product Team',
    dependencies: ['permission', 'analytics'],
    consumers: ['page', 'route', 'navigation', 'form'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'auth': {
    id: 'auth',
    name: 'Auth SSOT',
    packageName: '@gv/auth',
    description: 'Roles, Permissions, access-control helpers',
    category: 'auth',
    status: 'active',
    validationScript: undefined,
    documentationPath: 'docs/packages/auth.md',
    owner: 'Security Team',
    dependencies: [],
    consumers: ['frontend guards', 'backend middleware'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'permission': {
    id: 'permission',
    name: 'Permissions SSOT',
    packageName: '@gv/permissions-ssot',
    description: 'Roles, permissions, access rules matrix',
    category: 'permission',
    status: 'active',
    validationScript: 'packages/permissions-ssot/scripts/validate-permissions.ts',
    documentationPath: 'docs/packages/permissions-ssot.md',
    owner: 'Security Team',
    dependencies: [],
    consumers: ['page', 'route', 'navigation', 'form', 'feature'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'analytics': {
    id: 'analytics',
    name: 'Analytics SSOT',
    packageName: '@gv/analytics-ssot',
    description: 'Page views, click events, checkout events, merchant events',
    category: 'analytics',
    status: 'active',
    validationScript: 'packages/analytics-ssot/scripts/validate-analytics.ts',
    documentationPath: 'docs/packages/analytics-ssot.md',
    owner: 'Analytics Team',
    dependencies: ['page', 'feature'],
    consumers: ['frontend', 'backend'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'business-rule': {
    id: 'business-rule',
    name: 'Business Rules SSOT',
    packageName: '@gv/business-rules',
    description: 'Named constants: MAX_PRODUCT_IMAGES, MIN_PRICE, etc.',
    category: 'business-rule',
    status: 'active',
    validationScript: undefined,
    documentationPath: 'docs/packages/business-rules.md',
    owner: 'Product Team',
    dependencies: [],
    consumers: ['frontend', 'backend', 'mobile'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'storage': {
    id: 'storage',
    name: 'Storage SSOT',
    packageName: '@gv/storage',
    description: 'Cloud storage provider contracts and config types',
    category: 'storage',
    status: 'active',
    validationScript: undefined,
    documentationPath: 'docs/packages/storage.md',
    owner: 'DevOps Team',
    dependencies: [],
    consumers: ['backend', 'frontend'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'database': {
    id: 'database',
    name: 'Database SSOT',
    packageName: '@gv/domain',
    description: 'Domain entities and value objects',
    category: 'database',
    status: 'active',
    validationScript: undefined,
    documentationPath: 'docs/packages/domain.md',
    owner: 'Backend Team',
    dependencies: [],
    consumers: ['backend'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'documentation': {
    id: 'documentation',
    name: 'Documentation SSOT',
    packageName: 'docs/',
    description: 'Central documentation location',
    category: 'documentation',
    status: 'active',
    validationScript: 'scripts/validate-docs.js',
    documentationPath: 'docs/README.md',
    owner: 'Documentation Team',
    dependencies: [],
    consumers: ['all'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'ai-context': {
    id: 'ai-context',
    name: 'AI Context SSOT',
    packageName: 'docs/ai-context/',
    description: 'AI context for system knowledge',
    category: 'ai-context',
    status: 'active',
    validationScript: undefined,
    documentationPath: 'docs/ai-context/README.md',
    owner: 'Platform Architect',
    dependencies: [],
    consumers: ['AI agents'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'governance': {
    id: 'governance',
    name: 'Governance SSOT',
    packageName: '@gv/governance-ssot',
    description: 'Single Source of Truth for all platform governance',
    category: 'governance',
    status: 'active',
    validationScript: 'packages/governance-ssot/scripts/validate-governance-ssot.ts',
    documentationPath: 'docs/packages/governance-ssot.md',
    owner: 'Platform Architect',
    dependencies: ['all'],
    consumers: ['all'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// SSOT REGISTRY QUERY HELPERS
// ============================================================================

export function getSSOT(id: string): SSOTRegistryEntry | undefined {
  return ssotRegistry[id];
}

export function getAllSSOTs(): SSOTRegistryEntry[] {
  return Object.values(ssotRegistry);
}

export function getSSOTByCategory(category: SSOTRegistryEntry['category']): SSOTRegistryEntry[] {
  return getAllSSOTs().filter((s) => s.category === category);
}

export function getSSOTByStatus(status: SSOTRegistryEntry['status']): SSOTRegistryEntry[] {
  return getAllSSOTs().filter((s) => s.status === status);
}

export function getSSOTByOwner(owner: string): SSOTRegistryEntry[] {
  return getAllSSOTs().filter((s) => s.owner === owner);
}

export function getSSOTDependencies(id: string): SSOTRegistryEntry[] {
  const ssot = getSSOT(id);
  if (!ssot) return [];
  return ssot.dependencies.map((depId) => getSSOT(depId)).filter((s): s is SSOTRegistryEntry => s !== undefined);
}

export function getSSOTConsumers(id: string): SSOTRegistryEntry[] {
  const ssot = getSSOT(id);
  if (!ssot) return [];
  return ssot.consumers.map((consumerId) => getSSOT(consumerId)).filter((s): s is SSOTRegistryEntry => s !== undefined);
}

export function ssotExists(id: string): boolean {
  return id in ssotRegistry;
}

export function validateSSOT(ssot: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = ssotRegistryEntrySchema.safeParse(ssot);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

export function validateSSOTRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [id, ssot] of Object.entries(ssotRegistry)) {
    const validation = validateSSOT(ssot);
    if (!validation.valid) {
      errors.push(`SSOT "${id}": ${validation.errors?.message}`);
    }

    if (ssot.id !== id) {
      errors.push(`SSOT "${id}": ID mismatch (registry key: ${id}, ssot.id: ${ssot.id})`);
    }

    // Validate dependencies exist
    for (const depId of ssot.dependencies) {
      if (!ssotExists(depId)) {
        errors.push(`SSOT "${id}" references non-existent dependency "${depId}"`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
