// @gv/governance-ssot/templates/traceability
// Traceability templates for the GV Platform

import { z } from 'zod';

// ============================================================================
// TRACEABILITY DEFINITION SCHEMA
// ============================================================================

export const traceabilityDefinitionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['feature', 'bugfix', 'refactor', 'documentation', 'infrastructure']),
  taskId: z.string().optional(), // Reference to docs/tracking/
  featureId: z.string().optional(), // Reference to @gv/features-ssot
  adrId: z.string().optional(), // Reference to docs/decisions/ADR-XXXX.md
  changelog: z.string().optional(), // Reference to docs/changelogs/
  documentation: z.array(z.string()).default([]), // References to docs/
  ssotUpdates: z.array(z.object({
    ssot: z.string(), // SSOT package name
    change: z.string(), // Description of change
  })).default([]),
  commitMessage: z.string().min(1),
  author: z.string().min(1),
  timestamp: z.string().default(() => new Date().toISOString()),
});

export type TraceabilityDefinition = z.infer<typeof traceabilityDefinitionSchema>;

// ============================================================================
// TRACEABILITY TEMPLATE
// ============================================================================

export const traceabilityTemplate = {
  // Commit message template
  commitMessage: (type: string, scope: string, description: string) => {
    return `${type}(${scope}): ${description}`;
  },

  // PR description template
  prDescription: (traceability: Partial<TraceabilityDefinition>) => {
    return `## Summary

${traceability.id ? `Task: ${traceability.id}` : ''}

## Related

${traceability.taskId ? `- Task: docs/tracking/in-progress.md#${traceability.taskId}` : ''}
${traceability.featureId ? `- Feature: @gv/features-ssot#${traceability.featureId}` : ''}
${traceability.adrId ? `- ADR: docs/decisions/${traceability.adrId}.md` : ''}

## SSOT Updates

${traceability.ssotUpdates?.map(update => `- ${update.ssot}: ${update.change}`).join('\n') || 'None'}

## Documentation

${traceability.documentation?.map(doc => `- ${doc}`).join('\n') || 'None'}

## Changelog

${traceability.changelog ? `- Updated: ${traceability.changelog}` : 'None'}

## Testing

[Describe testing approach]

## Compliance

- [ ] All SSOTs updated before implementation
- [ ] All validations pass
- [ ] Documentation updated
- [ ] Changelog updated (if applicable)
- [ ] ADR created (if architectural decision)
`;
  },

  // Code comment template
  codeComment: (traceability: Partial<TraceabilityDefinition>) => {
    return `/**
 * Change: ${traceability.id}
 * 
 * Related:
 * - Task: ${traceability.taskId || 'N/A'}
 * - Feature: ${traceability.featureId || 'N/A'}
 * - ADR: ${traceability.adrId || 'N/A'}
 * 
 * SSOT Updates:
 * ${traceability.ssotUpdates?.map(update => `- ${update.ssot}: ${update.change}`).join('\n') || 'None'}
 */`;
  },
};

// ============================================================================
// TRACEABILITY VALIDATOR
// ============================================================================

export function validateTraceability(traceability: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = traceabilityDefinitionSchema.safeParse(traceability);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

export function validateTraceabilityCompleteness(traceability: TraceabilityDefinition): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  if (!traceability.taskId) missing.push('taskId');
  if (!traceability.featureId && traceability.type === 'feature') missing.push('featureId');
  if (!traceability.adrId && traceability.type === 'refactor') missing.push('adrId');
  if (!traceability.changelog && traceability.type !== 'documentation') missing.push('changelog');
  if (traceability.documentation.length === 0) missing.push('documentation');
  if (traceability.ssotUpdates.length === 0) missing.push('ssotUpdates');

  return {
    valid: missing.length === 0,
    missing,
  };
}
