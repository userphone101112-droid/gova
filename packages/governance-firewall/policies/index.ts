// packages/governance-firewall/policies/index.ts
// Firewall Policies - Define enforcement policies

export interface Policy {
  id: string;
  name: string;
  description: string;
  enforcement: 'strict' | 'lenient' | 'off';
  appliesTo: string[];
  rules: PolicyRule[];
}

export interface PolicyRule {
  check: string;
  action: 'block' | 'warn' | 'log';
  message: string;
}

export class PolicyEngine {
  private policies: Policy[] = [
    {
      id: 'strict-governance',
      name: 'Strict Governance Policy',
      description: 'Enforce strict governance for all operations',
      enforcement: 'strict',
      appliesTo: ['*'],
      rules: [
        {
          check: 'gate-required',
          action: 'block',
          message: 'All operations require a valid Governance Gate ID',
        },
        {
          check: 'ssot-required',
          action: 'block',
          message: 'All SSOT changes must be registered before implementation',
        },
        {
          check: 'traceability-required',
          action: 'block',
          message: 'All changes must have traceability information',
        },
      ],
    },
    {
      id: 'database-protection',
      name: 'Database Protection Policy',
      description: 'Protect database schema changes',
      enforcement: 'strict',
      appliesTo: ['database', 'migration', 'schema'],
      rules: [
        {
          check: 'adr-required',
          action: 'block',
          message: 'Database changes require ADR approval',
        },
        {
          check: 'db-admin-approval',
          action: 'block',
          message: 'Database changes require database admin approval',
        },
      ],
    },
    {
      id: 'security-protection',
      name: 'Security Protection Policy',
      description: 'Protect security-related changes',
      enforcement: 'strict',
      appliesTo: ['security', 'auth', 'permission'],
      rules: [
        {
          check: 'security-review',
          action: 'block',
          message: 'Security changes require security lead review',
        },
        {
          check: 'architect-approval',
          action: 'block',
          message: 'Security changes require platform architect approval',
        },
      ],
    },
    {
      id: 'api-protection',
      name: 'API Protection Policy',
      description: 'Protect API endpoint changes',
      enforcement: 'strict',
      appliesTo: ['api', 'route', 'endpoint'],
      rules: [
        {
          check: 'contract-defined',
          action: 'block',
          message: 'API changes require contract definition in @gv/contracts',
        },
        {
          check: 'schema-defined',
          action: 'block',
          message: 'API changes require schema definition in @gv/schemas',
        },
        {
          check: 'permission-defined',
          action: 'block',
          message: 'API changes require permission definition in @gv/permissions-ssot',
        },
      ],
    },
  ];

  getPolicy(id: string): Policy | undefined {
    return this.policies.find(p => p.id === id);
  }

  getPolicies(): Policy[] {
    return [...this.policies];
  }

  getPoliciesForOperation(operation: string): Policy[] {
    return this.policies.filter(p => 
      p.appliesTo.includes('*') || p.appliesTo.includes(operation)
    );
  }

  addPolicy(policy: Policy): void {
    this.policies.push(policy);
  }

  removePolicy(id: string): void {
    this.policies = this.policies.filter(p => p.id !== id);
  }

  updatePolicy(id: string, updates: Partial<Policy>): void {
    const index = this.policies.findIndex(p => p.id === id);
    if (index !== -1) {
      this.policies[index] = { ...this.policies[index], ...updates };
    }
  }
}

export const policyEngine = new PolicyEngine();
