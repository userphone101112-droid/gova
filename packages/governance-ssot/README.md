# @gv/governance-ssot

Single Source of Truth for all platform governance.

## Purpose

This package serves as the authoritative registry for all governance rules, policies, workflows, validators, ownership, standards, templates, compliance checks, and SSOT package metadata. No governance-related code should exist without being registered in this SSOT.

## Structure

```
packages/governance-ssot/
├── policies/          # Governance policies
├── workflows/         # Implementation workflows
├── validators/        # Validation scripts registry
├── ownership/         # Code ownership definitions
├── standards/         # Coding and documentation standards
├── templates/         # Document and code templates
├── compliance/        # Compliance check definitions
├── registry/          # Central SSOT package registry
└── scripts/           # Validation scripts
```

## Usage

```typescript
import {
  getPolicy,
  getWorkflow,
  getValidator,
  getOwnership,
  getStandard,
  getTemplate,
  getCompliance,
  getSSOT,
  validateGovernanceSSOT
} from '@gv/governance-ssot';

// Get a specific policy
const policy = getPolicy('no-duplicate-dtos');

// Get a specific workflow
const workflow = getWorkflow('new-feature');

// Get SSOT by ID
const ssot = getSSOT('theme');

// Validate entire governance SSOT
const result = validateGovernanceSSOT();
```

## Validation

Run validation:

```bash
npm run validate
```

Or from root:

```bash
npm run validate:governance-ssot
```

## Adding a New Policy

1. Add the policy definition to `policies/index.ts` in the `policyRegistry`
2. Run validation: `npm run validate`
3. Update related compliance checks
4. Commit with descriptive message

## Adding a New Workflow

1. Add the workflow definition to `workflows/index.ts` in the `workflowRegistry`
2. Run validation: `npm run validate`
3. Update related documentation
4. Commit with descriptive message

## Adding a New SSOT Package to Registry

1. Add the SSOT entry to `registry/index.ts` in the `ssotRegistry`
2. Run validation: `npm run validate`
3. Create package documentation in `docs/packages/`
4. Commit with descriptive message

## Integration

This package integrates with:
- All SSOT packages - Central registry
- Validation scripts - Validator registry
- Documentation - Standards and templates
- CI/CD - Compliance checks
- Code ownership - Ownership definitions
