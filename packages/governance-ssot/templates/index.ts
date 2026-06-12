// @gv/governance-ssot/templates
// Governance templates for the GV Platform

import { z } from 'zod';

// ============================================================================
// TEMPLATE DEFINITION SCHEMA
// ============================================================================

export const templateDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Template ID must be lowercase with hyphens'),
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['file', 'document', 'code', 'workflow']),
  category: z.string(),
  template: z.string(), // Template content or path to template file
  variables: z.array(z.object({
    name: z.string(),
    description: z.string(),
    required: z.boolean().default(true),
    default: z.string().optional(),
  })),
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type TemplateDefinition = z.infer<typeof templateDefinitionSchema>;

// ============================================================================
// TEMPLATE REGISTRY
// ============================================================================

export const templateRegistry: Record<string, TemplateDefinition> = {
  'adr-template': {
    id: 'adr-template',
    name: 'ADR Template',
    description: 'Template for Architecture Decision Records',
    type: 'document',
    category: 'decisions',
    template: 'docs/decisions/.template.md',
    variables: [
      { name: 'title', description: 'ADR title', required: true },
      { name: 'status', description: 'ADR status', required: true, default: 'Proposed' },
      { name: 'context', description: 'Context and problem statement', required: true },
      { name: 'decision', description: 'Decision and outcome', required: true },
      { name: 'consequences', description: 'Positive and negative consequences', required: true },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'document-header': {
    id: 'document-header',
    name: 'Document Header Template',
    description: 'Standard header for all documentation files',
    type: 'document',
    category: 'documentation',
    template: '# Title\n\n> **Source**: `docs/path/to/file.md`\n> **Status**: Active | Draft | Deprecated\n> **Last Updated**: YYYY-MM-DD',
    variables: [
      { name: 'title', description: 'Document title', required: true },
      { name: 'source', description: 'File path', required: true },
      { name: 'status', description: 'Document status', required: true, default: 'Active' },
      { name: 'lastUpdated', description: 'Last updated date', required: true },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'pr-description': {
    id: 'pr-description',
    name: 'PR Description Template',
    description: 'Template for pull request descriptions',
    type: 'document',
    category: 'git',
    template: '## Summary\n\nBrief description of what this PR does.\n\n## Related\n\n- Task: docs/tracking/in-progress.md#task-id\n- ADR: docs/decisions/ADR-XXXX.md (if applicable)\n- Bug: docs/tracking/bugs/open.md#bug-id (if applicable)\n\n## Changes\n\n- List of files changed\n- Reason for each change\n\n## Testing\n\n- How was this tested?\n\n## Documentation Updated\n\n- [ ] Changelog updated\n- [ ] ADR created (if needed)\n- [ ] AI context updated (if architecture changed)',
    variables: [
      { name: 'summary', description: 'PR summary', required: true },
      { name: 'task', description: 'Related task', required: false },
      { name: 'adr', description: 'Related ADR', required: false },
      { name: 'bug', description: 'Related bug', required: false },
      { name: 'changes', description: 'List of changes', required: true },
      { name: 'testing', description: 'Testing approach', required: true },
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// TEMPLATE QUERY HELPERS
// ============================================================================

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templateRegistry[id];
}

export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(templateRegistry);
}

export function getTemplatesByType(type: TemplateDefinition['type']): TemplateDefinition[] {
  return getAllTemplates().filter((t) => t.type === type);
}

export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return getAllTemplates().filter((t) => t.category === category);
}

export function templateExists(id: string): boolean {
  return id in templateRegistry;
}

export function validateTemplate(template: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = templateDefinitionSchema.safeParse(template);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

export function validateTemplateRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [id, template] of Object.entries(templateRegistry)) {
    const validation = validateTemplate(template);
    if (!validation.valid) {
      errors.push(`Template "${id}": ${validation.errors?.message}`);
    }

    if (template.id !== id) {
      errors.push(`Template "${id}": ID mismatch (registry key: ${id}, template.id: ${template.id})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
