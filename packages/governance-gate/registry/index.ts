// packages/governance-gate/registry/index.ts
// Gate registry - stores all governance gate records

import { z } from 'zod';

export const GateStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'in-progress',
  'completed',
  'cancelled',
]);

export const ChangeCategorySchema = z.enum([
  'new-feature',
  'new-page',
  'new-route',
  'new-form',
  'new-api',
  'new-schema',
  'new-contract',
  'new-translation',
  'new-permission',
  'new-business-rule',
  'new-database-entity',
  'storage-change',
  'infrastructure-change',
  'documentation-change',
  'bug-fix',
  'refactor',
  'performance',
  'security',
  'other',
]);

export const RiskLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);

export const GateRecordSchema = z.object({
  id: z.string().regex(/^GATE-\d{4}-\d{4}$/),
  title: z.string().min(1),
  description: z.string().min(10),
  category: ChangeCategorySchema,
  status: GateStatusSchema,
  riskLevel: RiskLevelSchema,
  requester: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  approvedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().datetime().optional(),
  impactedSSOTs: z.array(z.string()),
  requiredWorkflow: z.string(),
  requiredApprovals: z.array(z.string()),
  requiredValidations: z.array(z.string()),
  requiredDocumentation: z.array(z.string()),
  checklist: z.array(z.object({
    item: z.string(),
    completed: z.boolean(),
    completedAt: z.string().datetime().optional(),
  })),
  traceability: z.object({
    taskId: z.string().optional(),
    featureId: z.string().optional(),
    adrId: z.string().optional(),
    changelogId: z.string().optional(),
  }),
  approvals: z.array(z.object({
    approver: z.string(),
    role: z.string(),
    status: z.enum(['pending', 'approved', 'rejected']),
    approvedAt: z.string().datetime().optional(),
    comments: z.string().optional(),
  })),
});

export type GateRecord = z.infer<typeof GateRecordSchema>;
export type GateStatus = z.infer<typeof GateStatusSchema>;
export type ChangeCategory = z.infer<typeof ChangeCategorySchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

// In-memory registry (in production, this would be a database)
const gateRegistry: Map<string, GateRecord> = new Map();

let gateCounter = 1;

export function generateGateId(): string {
  const year = new Date().getFullYear();
  const counter = String(gateCounter++).padStart(4, '0');
  return `GATE-${year}-${counter}`;
}

export function registerGate(gate: GateRecord): void {
  gateRegistry.set(gate.id, gate);
}

export function getGate(id: string): GateRecord | undefined {
  return gateRegistry.get(id);
}

export function updateGate(id: string, updates: Partial<GateRecord>): GateRecord | undefined {
  const gate = gateRegistry.get(id);
  if (!gate) return undefined;
  
  const updatedGate = {
    ...gate,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  const validated = GateRecordSchema.parse(updatedGate);
  gateRegistry.set(id, validated);
  return validated;
}

export function getAllGates(): GateRecord[] {
  return Array.from(gateRegistry.values());
}

export function getGatesByStatus(status: GateStatus): GateRecord[] {
  return getAllGates().filter(gate => gate.status === status);
}

export function getGatesByCategory(category: ChangeCategory): GateRecord[] {
  return getAllGates().filter(gate => gate.category === category);
}

export function getGatesByRequester(requester: string): GateRecord[] {
  return getAllGates().filter(gate => gate.requester === requester);
}
