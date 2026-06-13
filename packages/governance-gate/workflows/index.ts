// packages/governance-gate/workflows/index.ts
// Workflow definitions and resolution

import { ChangeCategory } from '../registry';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  estimatedDuration?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: ChangeCategory;
  steps: WorkflowStep[];
  requiredApprovals: string[];
  requiredValidations: string[];
  requiredDocumentation: string[];
}

const workflows: Workflow[] = [
  {
    id: 'new-feature-workflow',
    name: 'New Feature Workflow',
    description: 'Workflow for implementing new features',
    category: 'new-feature',
    steps: [
      {
        id: 'feature-discovery',
        title: 'Feature Discovery',
        description: 'Identify related SSOTs and analyze impact',
        required: true,
        estimatedDuration: '30m',
      },
      {
        id: 'feature-registration',
        title: 'Feature Registration',
        description: 'Register feature in features-ssot',
        required: true,
        estimatedDuration: '15m',
      },
      {
        id: 'feature-design',
        title: 'Feature Design',
        description: 'Create feature design document',
        required: true,
        estimatedDuration: '1h',
      },
      {
        id: 'feature-implementation',
        title: 'Feature Implementation',
        description: 'Implement the feature following design',
        required: true,
        estimatedDuration: '4h',
      },
      {
        id: 'feature-testing',
        title: 'Feature Testing',
        description: 'Write and run tests for the feature',
        required: true,
        estimatedDuration: '2h',
      },
      {
        id: 'feature-documentation',
        title: 'Feature Documentation',
        description: 'Update documentation for the feature',
        required: true,
        estimatedDuration: '1h',
      },
      {
        id: 'feature-changelog',
        title: 'Changelog Update',
        description: 'Update changelog with feature changes',
        required: true,
        estimatedDuration: '15m',
      },
      {
        id: 'feature-validation',
        title: 'Governance Validation',
        description: 'Run governance validation',
        required: true,
        estimatedDuration: '5m',
      },
    ],
    requiredApprovals: ['product-lead', 'frontend-lead'],
    requiredValidations: ['validate:features', 'validate:governance:features', 'typecheck', 'lint'],
    requiredDocumentation: ['docs/features/', 'docs/changelogs/frontend.md'],
  },
  {
    id: 'new-page-workflow',
    name: 'New Page Workflow',
    description: 'Workflow for implementing new pages',
    category: 'new-page',
    steps: [
      {
        id: 'page-discovery',
        title: 'Page Discovery',
        description: 'Identify related SSOTs and analyze impact',
        required: true,
        estimatedDuration: '20m',
      },
      {
        id: 'page-registration',
        title: 'Page Registration',
        description: 'Register page in pages-ssot',
        required: true,
        estimatedDuration: '10m',
      },
      {
        id: 'route-registration',
        title: 'Route Registration',
        description: 'Register route in routes-ssot',
        required: true,
        estimatedDuration: '10m',
      },
      {
        id: 'navigation-update',
        title: 'Navigation Update',
        description: 'Update navigation in navigation-ssot',
        required: true,
        estimatedDuration: '15m',
      },
      {
        id: 'page-implementation',
        title: 'Page Implementation',
        description: 'Implement the page',
        required: true,
        estimatedDuration: '2h',
      },
      {
        id: 'page-documentation',
        title: 'Page Documentation',
        description: 'Update documentation for the page',
        required: true,
        estimatedDuration: '30m',
      },
      {
        id: 'page-validation',
        title: 'Governance Validation',
        description: 'Run governance validation',
        required: true,
        estimatedDuration: '5m',
      },
    ],
    requiredApprovals: ['frontend-lead'],
    requiredValidations: ['validate:pages', 'validate:routes', 'validate:navigation', 'validate:governance:pages', 'typecheck', 'lint'],
    requiredDocumentation: ['docs/pages/', 'docs/changelogs/frontend.md'],
  },
  {
    id: 'new-api-workflow',
    name: 'New API Workflow',
    description: 'Workflow for implementing new APIs',
    category: 'new-api',
    steps: [
      {
        id: 'api-discovery',
        title: 'API Discovery',
        description: 'Identify related SSOTs and analyze impact',
        required: true,
        estimatedDuration: '30m',
      },
      {
        id: 'contract-definition',
        title: 'Contract Definition',
        description: 'Define API contracts in contracts-ssot',
        required: true,
        estimatedDuration: '30m',
      },
      {
        id: 'schema-definition',
        title: 'Schema Definition',
        description: 'Define validation schemas in schemas-ssot',
        required: true,
        estimatedDuration: '30m',
      },
      {
        id: 'route-registration',
        title: 'Route Registration',
        description: 'Register API route in routes-ssot',
        required: true,
        estimatedDuration: '10m',
      },
      {
        id: 'permission-definition',
        title: 'Permission Definition',
        description: 'Define required permissions in permissions-ssot',
        required: true,
        estimatedDuration: '20m',
      },
      {
        id: 'api-implementation',
        title: 'API Implementation',
        description: 'Implement the API endpoint',
        required: true,
        estimatedDuration: '3h',
      },
      {
        id: 'api-testing',
        title: 'API Testing',
        description: 'Write and run API tests',
        required: true,
        estimatedDuration: '2h',
      },
      {
        id: 'api-documentation',
        title: 'API Documentation',
        description: 'Update API documentation',
        required: true,
        estimatedDuration: '1h',
      },
      {
        id: 'api-validation',
        title: 'Governance Validation',
        description: 'Run governance validation',
        required: true,
        estimatedDuration: '5m',
      },
    ],
    requiredApprovals: ['api-lead', 'security-lead'],
    requiredValidations: ['validate:contracts', 'validate:schemas', 'validate:routes', 'validate:permissions', 'typecheck', 'lint'],
    requiredDocumentation: ['docs/api/', 'docs/changelogs/backend.md'],
  },
  {
    id: 'new-translation-workflow',
    name: 'New Translation Workflow',
    description: 'Workflow for adding new translations',
    category: 'new-translation',
    steps: [
      {
        id: 'translation-discovery',
        title: 'Translation Discovery',
        description: 'Identify strings requiring translation',
        required: true,
        estimatedDuration: '15m',
      },
      {
        id: 'translation-addition',
        title: 'Translation Addition',
        description: 'Add translations to translations-ssot',
        required: true,
        estimatedDuration: '30m',
      },
      {
        id: 'translation-validation',
        title: 'Translation Validation',
        description: 'Validate translations',
        required: true,
        estimatedDuration: '15m',
      },
    ],
    requiredApprovals: ['i18n-lead'],
    requiredValidations: ['validate:translations'],
    requiredDocumentation: ['docs/i18n/'],
  },
  {
    id: 'new-database-entity-workflow',
    name: 'New Database Entity Workflow',
    description: 'Workflow for adding new database entities',
    category: 'new-database-entity',
    steps: [
      {
        id: 'entity-discovery',
        title: 'Entity Discovery',
        description: 'Analyze entity requirements and relationships',
        required: true,
        estimatedDuration: '1h',
      },
      {
        id: 'entity-design',
        title: 'Entity Design',
        description: 'Design entity schema and relationships',
        required: true,
        estimatedDuration: '1h',
      },
      {
        id: 'entity-registration',
        title: 'Entity Registration',
        description: 'Register entity in domain-ssot',
        required: true,
        estimatedDuration: '15m',
      },
      {
        id: 'migration-creation',
        title: 'Migration Creation',
        description: 'Create database migration',
        required: true,
        estimatedDuration: '30m',
      },
      {
        id: 'entity-implementation',
        title: 'Entity Implementation',
        description: 'Implement entity in code',
        required: true,
        estimatedDuration: '2h',
      },
      {
        id: 'entity-testing',
        title: 'Entity Testing',
        description: 'Test entity operations',
        required: true,
        estimatedDuration: '1h',
      },
      {
        id: 'entity-documentation',
        title: 'Entity Documentation',
        description: 'Document entity schema and usage',
        required: true,
        estimatedDuration: '30m',
      },
      {
        id: 'adr-creation',
        title: 'ADR Creation',
        description: 'Create ADR for significant database changes',
        required: true,
        estimatedDuration: '30m',
      },
    ],
    requiredApprovals: ['backend-lead', 'database-admin'],
    requiredValidations: ['typecheck', 'lint'],
    requiredDocumentation: ['docs/database/', 'docs/decisions/', 'docs/changelogs/database.md'],
  },
];

export function resolveWorkflow(category: ChangeCategory): Workflow | undefined {
  return workflows.find(w => w.category === category);
}

export function getAllWorkflows(): Workflow[] {
  return workflows;
}

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find(w => w.id === id);
}
