// @gv/governance-ssot/workflows
// Governance workflows for the GV Platform

import { z } from 'zod';

// ============================================================================
// WORKFLOW DEFINITION SCHEMA
// ============================================================================

export const workflowDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Workflow ID must be lowercase with hyphens'),
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['new-feature', 'new-page', 'new-api', 'new-ssot', 'new-database-entity', 'new-storage-provider']),
  steps: z.array(z.object({
    order: z.number(),
    name: z.string(),
    description: z.string(),
    ssot: z.string().optional(),
    action: z.string(),
    validation: z.string().optional(),
  })),
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type WorkflowDefinition = z.infer<typeof workflowDefinitionSchema>;

// ============================================================================
// WORKFLOW REGISTRY
// ============================================================================

export const workflowRegistry: Record<string, WorkflowDefinition> = {
  'new-feature': {
    id: 'new-feature',
    name: 'New Feature Workflow',
    description: 'Workflow for creating a new feature',
    type: 'new-feature',
    steps: [
      {
        order: 1,
        name: 'Feature SSOT',
        description: 'Add feature definition to @gv/features-ssot',
        ssot: '@gv/features-ssot',
        action: 'Add feature to featureRegistry',
        validation: 'npm run validate:features',
      },
      {
        order: 2,
        name: 'Contracts SSOT',
        description: 'Add DTOs to @gv/contracts',
        ssot: '@gv/contracts',
        action: 'Add DTOs to contracts',
        validation: 'npm run validate:ssot',
      },
      {
        order: 3,
        name: 'Schemas SSOT',
        description: 'Add Zod schemas to @gv/schemas',
        ssot: '@gv/schemas',
        action: 'Add schemas to schemas',
        validation: 'npm run validate:ssot',
      },
      {
        order: 4,
        name: 'Permissions SSOT',
        description: 'Add permissions to @gv/permissions-ssot',
        ssot: '@gv/permissions-ssot',
        action: 'Add permissions to permissionRegistry',
        validation: 'npm run validate:permissions',
      },
      {
        order: 5,
        name: 'Translations SSOT',
        description: 'Add translations to @gv/translations',
        ssot: '@gv/translations',
        action: 'Add translations to dictionary',
        validation: 'npm run validate:ssot',
      },
      {
        order: 6,
        name: 'Implementation',
        description: 'Implement the feature',
        action: 'Write code',
        validation: 'npm run typecheck && npm run lint',
      },
      {
        order: 7,
        name: 'Documentation',
        description: 'Update documentation',
        action: 'Update docs/',
        validation: 'npm run validate:docs',
      },
      {
        order: 8,
        name: 'Changelog',
        description: 'Update changelog',
        action: 'Update docs/changelogs/',
        validation: 'Manual review',
      },
      {
        order: 9,
        name: 'Validation',
        description: 'Run governance validation',
        action: 'npm run validate:governance',
        validation: 'npm run validate:governance',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'new-page': {
    id: 'new-page',
    name: 'New Page Workflow',
    description: 'Workflow for creating a new page',
    type: 'new-page',
    steps: [
      {
        order: 1,
        name: 'Pages SSOT',
        description: 'Add page definition to @gv/pages-ssot',
        ssot: '@gv/pages-ssot',
        action: 'Add page to pageRegistry',
        validation: 'npm run validate:pages',
      },
      {
        order: 2,
        name: 'Routes SSOT',
        description: 'Add route to @gv/routes-ssot',
        ssot: '@gv/routes-ssot',
        action: 'Add route to routeRegistry',
        validation: 'npm run validate:routes',
      },
      {
        order: 3,
        name: 'Navigation SSOT',
        description: 'Add navigation item to @gv/navigation-ssot',
        ssot: '@gv/navigation-ssot',
        action: 'Add navigation item to navigationRegistry',
        validation: 'npm run validate:navigation',
      },
      {
        order: 4,
        name: 'Permissions SSOT',
        description: 'Add permissions to @gv/permissions-ssot',
        ssot: '@gv/permissions-ssot',
        action: 'Add permissions to permissionRegistry',
        validation: 'npm run validate:permissions',
      },
      {
        order: 5,
        name: 'Translations SSOT',
        description: 'Add translations to @gv/translations',
        ssot: '@gv/translations',
        action: 'Add translations to dictionary',
        validation: 'npm run validate:ssot',
      },
      {
        order: 6,
        name: 'Implementation',
        description: 'Implement the page',
        action: 'Write page.tsx',
        validation: 'npm run typecheck && npm run lint',
      },
      {
        order: 7,
        name: 'Documentation',
        description: 'Update documentation',
        action: 'Update docs/',
        validation: 'npm run validate:docs',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'new-api': {
    id: 'new-api',
    name: 'New API Workflow',
    description: 'Workflow for creating a new API endpoint',
    type: 'new-api',
    steps: [
      {
        order: 1,
        name: 'Contracts SSOT',
        description: 'Add DTOs to @gv/contracts',
        ssot: '@gv/contracts',
        action: 'Add DTOs to contracts',
        validation: 'npm run validate:ssot',
      },
      {
        order: 2,
        name: 'Schemas SSOT',
        description: 'Add Zod schemas to @gv/schemas',
        ssot: '@gv/schemas',
        action: 'Add schemas to schemas',
        validation: 'npm run validate:ssot',
      },
      {
        order: 3,
        name: 'Domain',
        description: 'Add domain entities to @gv/domain',
        ssot: '@gv/domain',
        action: 'Add entities to domain',
        validation: 'npm run typecheck',
      },
      {
        order: 4,
        name: 'Implementation',
        description: 'Implement the API endpoint',
        action: 'Write API handler',
        validation: 'npm run typecheck && npm run lint',
      },
      {
        order: 5,
        name: 'Documentation',
        description: 'Update API documentation',
        action: 'Update docs/modules/backend-api.md',
        validation: 'npm run validate:docs',
      },
      {
        order: 6,
        name: 'Changelog',
        description: 'Update changelog',
        action: 'Update docs/changelogs/backend.md',
        validation: 'Manual review',
      },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// WORKFLOW QUERY HELPERS
// ============================================================================

export function getWorkflow(id: string): WorkflowDefinition | undefined {
  return workflowRegistry[id];
}

export function getAllWorkflows(): WorkflowDefinition[] {
  return Object.values(workflowRegistry);
}

export function getWorkflowByType(type: WorkflowDefinition['type']): WorkflowDefinition[] {
  return getAllWorkflows().filter((w) => w.type === type);
}

export function workflowExists(id: string): boolean {
  return id in workflowRegistry;
}

export function validateWorkflow(workflow: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = workflowDefinitionSchema.safeParse(workflow);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

export function validateWorkflowRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [id, workflow] of Object.entries(workflowRegistry)) {
    const validation = validateWorkflow(workflow);
    if (!validation.valid) {
      errors.push(`Workflow "${id}": ${validation.errors?.message}`);
    }

    if (workflow.id !== id) {
      errors.push(`Workflow "${id}": ID mismatch (registry key: ${id}, workflow.id: ${workflow.id})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
