# Governance Gate Contract

> **Source**: `docs/governance/governance-gate.md`
> **Status**: Active
> **Last Updated**: 2026-06-13

---

## Purpose

The Governance Gate is the **mandatory entry point** for all changes before implementation begins. No feature, page, route, API, form, schema, contract, translation, permission, database entity, storage provider, or infrastructure change may start implementation without passing through the Governance Gate.

---

## Core Principle

Governance must shift from:

**Detect → Reject**

to

**Analyze → Approve → Implement**

Before any implementation, the system must determine:

1. **What is being changed?** - Change classification
2. **Which SSOTs are affected?** - SSOT impact analysis
3. **Which workflows apply?** - Workflow resolution
4. **Which documents must be updated?** - Documentation requirements
5. **Which validations are required?** - Validation requirements
6. **Which approvals are required?** - Approval requirements

Only then can implementation begin.

---

## Mandatory Rules

### Rule 1: Gate Required

**All changes must pass through Governance Gate before implementation.**

No implementation may begin without an approved Governance Gate ID.

**Enforcement**: Pre-commit, pre-push, CI/CD, PR validation

**Violation**: Commit/push/PR will be rejected

---

### Rule 2: Gate Approval Required

**Governance Gate must be approved before implementation.**

A gate in "pending" status does not authorize implementation. Only "approved" gates authorize implementation.

**Enforcement**: Pre-commit, pre-push, CI/CD

**Violation**: Implementation will be rejected

---

### Rule 3: Preflight Validation Required

**Preflight validation must pass before implementation.**

Preflight validation ensures:

- Affected SSOTs exist
- Workflow exists
- Required ownership exists
- Documentation location exists

**Enforcement**: Pre-commit, pre-push, CI/CD

**Violation**: Implementation will be rejected

---

### Rule 4: Workflow Compliance Required

**Generated workflow must be followed.**

All steps in the generated workflow must be completed in order.

**Enforcement**: Manual review, PR validation

**Violation**: PR will be rejected

---

### Rule 5: Checklist Completion Required

**All checklist items must be completed.**

The generated checklist is mandatory. All items must be marked as completed.

**Enforcement**: PR validation

**Violation**: PR will be rejected

---

### Rule 6: SSOT Updates Required

**All affected SSOTs must be updated before implementation.**

SSOTs must be updated in the order specified by the workflow.

**Enforcement**: Pre-commit validation

**Violation**: Commit will be rejected

---

### Rule 7: Documentation Updates Required

**All required documentation must be updated.**

Documentation must be updated before implementation is considered complete.

**Enforcement**: PR validation

**Violation**: PR will be rejected

---

### Rule 8: Approvals Required

**All required approvals must be obtained.**

High-risk changes require platform architect approval. Security-related changes require security lead approval. Database changes require database admin approval.

**Enforcement**: Manual review, PR validation

**Violation**: PR will be rejected

---

### Rule 9: Traceability Required

**All changes must have traceability.**

Gate ID must be linked to:

- Task ID (if applicable)
- Feature ID (if applicable)
- ADR ID (if applicable)
- Changelog ID (if applicable)

**Enforcement**: PR validation

**Violation**: PR will be rejected

---

### Rule 10: Risk Assessment Required

**Risk level must be assessed and appropriate approvals obtained.**

- **Low risk**: Standard approvals
- **Medium risk**: Standard approvals + documentation review
- **High risk**: Platform architect approval
- **Critical risk**: Platform architect + security lead approval

**Enforcement**: Manual review, PR validation

**Violation**: PR will be rejected

---

## Change Categories

The following change categories are recognized:

### New Feature

- **Affected SSOTs**: features-ssot, translations, analytics-ssot, permissions-ssot, docs/
- **Required Approvals**: product-lead, frontend-lead
- **Risk Level**: Medium

### New Page

- **Affected SSOTs**: pages-ssot, routes-ssot, navigation-ssot, translations, analytics-ssot, docs/
- **Required Approvals**: frontend-lead
- **Risk Level**: Low

### New Route

- **Affected SSOTs**: routes-ssot, contracts, schemas, permissions-ssot, analytics-ssot
- **Required Approvals**: api-lead
- **Risk Level**: Medium

### New Form

- **Affected SSOTs**: forms-ssot, schemas, translations, analytics-ssot
- **Required Approvals**: fullstack-lead
- **Risk Level**: Low

### New API

- **Affected SSOTs**: contracts, schemas, routes-ssot, permissions-ssot, analytics-ssot, docs/api/
- **Required Approvals**: api-lead, security-lead
- **Risk Level**: Medium

### New Schema

- **Affected SSOTs**: schemas, forms-ssot
- **Required Approvals**: fullstack-lead
- **Risk Level**: Medium

### New Contract

- **Affected SSOTs**: contracts, schemas
- **Required Approvals**: api-lead
- **Risk Level**: Medium

### New Translation

- **Affected SSOTs**: translations
- **Required Approvals**: i18n-lead
- **Risk Level**: Low

### New Permission

- **Affected SSOTs**: permissions-ssot, auth
- **Required Approvals**: security-lead, platform-architect
- **Risk Level**: High

### New Business Rule

- **Affected SSOTs**: business-rules
- **Required Approvals**: product-lead
- **Risk Level**: Medium

### New Database Entity

- **Affected SSOTs**: domain, docs/database/, docs/decisions/
- **Required Approvals**: backend-lead, database-admin
- **Risk Level**: High

### Storage Change

- **Affected SSOTs**: storage
- **Required Approvals**: devops-lead
- **Risk Level**: Medium

### Infrastructure Change

- **Affected SSOTs**: config, docs/
- **Required Approvals**: devops-lead, platform-architect
- **Risk Level**: High

### Documentation Change

- **Affected SSOTs**: docs/
- **Required Approvals**: docs-lead
- **Risk Level**: Low

### Bug Fix

- **Affected SSOTs**: (varies)
- **Required Approvals**: tech-lead
- **Risk Level**: Medium

### Refactor

- **Affected SSOTs**: (varies)
- **Required Approvals**: tech-lead
- **Risk Level**: Medium

### Performance

- **Affected SSOTs**: (varies)
- **Required Approvals**: tech-lead
- **Risk Level**: Medium

### Security

- **Affected SSOTs**: permissions-ssot, auth, docs/
- **Required Approvals**: security-lead, platform-architect
- **Risk Level**: Critical

---

## Usage

### Creating a Governance Gate

```bash
npm run governance:plan -- \
  --title "New Product Page" \
  --description "Create a new product listing page with search and filters" \
  --requester "developer"
```

### Approving a Gate

```bash
npm run governance:approve -- \
  --gate-id "GATE-2026-0001" \
  --approver "frontend-lead" \
  --comments "Approved for implementation"
```

### Running Preflight Validation

```bash
npm run governance:preflight -- --gate-id "GATE-2026-0001"
```

---

## Gate Lifecycle

1. **Create** - Gate is created with pending status
2. **Analyze** - Change is analyzed and categorized
3. **Resolve** - Workflow, approvals, validations are determined
4. **Approve** - Required approvals are obtained
5. **Preflight** - Preflight validation passes
6. **Implement** - Implementation begins
7. **Complete** - Checklist is completed
8. **Validate** - Governance validation passes
9. **Close** - Gate is marked as completed

---

## Enforcement Points

### Pre-commit Hook

- Validates gate ID exists in commit message
- Validates gate is approved
- Validates preflight passed

### Pre-push Hook

- Validates gate ID exists in commit messages
- Validates gate is approved
- Validates preflight passed
- Validates checklist is completed

### Pull Request Template

- Requires gate ID in PR description
- Requires checklist completion status
- Requires approval status

### CI/CD Pipeline

- Validates gate ID in PR
- Validates gate is approved
- Validates preflight passed
- Validates workflow compliance
- Validates documentation updates

---

## Violation Handling

### First Violation

- Warning issued
- Commit/push/PR rejected
- Guidance provided

### Second Violation

- Warning issued
- Commit/push/PR rejected
- Required training

### Third Violation

- Commit/push/PR blocked
- Required governance review
- Potential access restriction

---

## Exceptions

### Emergency Changes

- Require platform architect approval
- Must create gate with "emergency" flag
- Must complete retrospective within 24 hours
- Must document exception in governance audit

### Hotfixes

- Require tech-lead approval
- Must create gate with "hotfix" flag
- Must complete full workflow within 48 hours
- Must document in changelog

---

## Compliance

All developers, AI agents, and automation tools must comply with this contract.

**Non-compliance will result in:**

- Commit/push/PR rejection
- Access restriction
- Required training
- Performance review

---

**Contract Version**: 1.0.0  
**Effective Date**: 2026-06-13  
**Next Review**: 2026-12-13
