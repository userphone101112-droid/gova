# AI Agent Contract

> **Source**: `docs/governance/agent-contract.md`
> **Status**: Active
> **Last Updated**: 2026-06-13

---

## Purpose

This document defines the mandatory contract that all AI agents (Antigravity, Claude, Gemini, Copilot, Cascade, etc.) MUST follow when operating in the GV Platform repository. This is a binding contract - violations will cause governance validation to fail.

---

## The Governance Contract

By operating in this repository, AI agents agree to:

1. **Run Governance Gate BEFORE implementing anything**
2. **Discover related SSOT before implementing anything**
3. **Update authoritative SSOT before writing implementation code**
4. **Validate SSOT changes before proceeding**
5. **Implement changes only after SSOT is updated**
6. **Update documentation for all changes**
7. **Update changelog for significant changes**
8. **Run governance validation before completing**
9. **Produce compliance report for all changes**

---

## Governance Gate Requirement

**AI agents MUST run Governance Gate before ANY implementation.**

### Step 0: Run Governance Gate

Before implementing ANY change, AI agents MUST:

```bash
npm run governance:plan -- \
  --title "Change Title" \
  --description "Change description" \
  --requester "agent-name"
```

This will:

- Generate a Gate ID (e.g., GATE-2026-0001)
- Classify the change type
- Determine affected SSOTs
- Resolve required workflow
- Generate implementation checklist
- Determine required approvals

### Gate Approval Required

AI agents MUST:

- Review the generated governance plan
- Wait for gate approval (if required)
- Run preflight validation
- Only then proceed to implementation

### Gate ID in Commits

AI agents MUST include the Gate ID in all commit messages:

```
feat: implement new feature [GATE-2026-0001]

This commit implements the feature approved in GATE-2026-0001.
```

### Gate ID in PRs

AI agents MUST include the Gate ID in all PR descriptions:

```
## Governance Gate ID
GATE-2026-0001
```

---

## Mandatory Pre-Implementation Workflow

Before implementing ANY change, AI agents MUST:

### Step 1: Discover Related SSOT

```typescript
// Query the governance SSOT to discover relevant packages
import { getSSOT, getWorkflow } from '@gv/governance-ssot';

// Identify which SSOT packages are affected
const affectedSSOTs = discoverAffectedSSOTs(changeType);
```

**Affected SSOTs by change type:**

| Change Type         | Required SSOTs                                                           |
| ------------------- | ------------------------------------------------------------------------ |
| New Feature         | features-ssot, contracts, schemas, permissions-ssot, translations        |
| New Page            | pages-ssot, routes-ssot, navigation-ssot, permissions-ssot, translations |
| New API             | contracts, schemas, domain                                               |
| New Form            | forms-ssot, schemas, permissions-ssot, translations                      |
| New Permission      | permissions-ssot                                                         |
| New Analytics Event | analytics-ssot                                                           |

### Step 2: Update Authoritative SSOT

```typescript
// Update the relevant SSOT package first
// Example: Adding a new feature
import { featureRegistry } from '@gv/features-ssot';

featureRegistry['new-feature'] = {
  id: 'new-feature',
  name: 'New Feature',
  // ... complete feature definition
};
```

**SSOT Update Order:**

1. Feature SSOT (if applicable)
2. Contracts SSOT
3. Schemas SSOT
4. Permissions SSOT
5. Translations SSOT
6. Analytics SSOT (if applicable)

### Step 3: Validate SSOT

```bash
# Run validation for the updated SSOT
npm run validate:features
npm run validate:contracts
npm run validate:schemas
npm run validate:permissions
```

**Validation MUST pass before proceeding to implementation.**

### Step 4: Implement Change

Only after SSOT is updated and validated:

```typescript
// Now implement the actual code
// Use the SSOT definitions
import { getFeature } from '@gv/features-ssot';
import { getContract } from '@gv/contracts';
import { getSchema } from '@gv/schemas';
```

### Step 5: Update Documentation

```markdown
# Update relevant documentation

- docs/packages/<package-name>.md
- docs/modules/<module-name>.md
- docs/architecture/<architecture-name>.md
```

### Step 6: Update Changelog

```markdown
# Update relevant changelog

- docs/changelogs/frontend.md
- docs/changelogs/backend.md
- docs/changelogs/packages.md
```

### Step 7: Run Governance Validation

```bash
# Run comprehensive governance validation
npm run validate:governance
npm run validate:all
```

**Validation MUST pass before completing the task.**

### Step 8: Produce Compliance Report

```typescript
// Generate compliance report
import { validateGovernanceSSOT } from '@gv/governance-ssot';

const result = validateGovernanceSSOT();
// Log compliance status
```

---

## Prohibited Actions

AI agents MAY NOT:

### 1. Create Duplicate Authority

**PROHIBITED:**

- Define DTOs locally in `src/` or `apps/api/src/`
- Define Zod schemas locally
- Define roles/permissions locally
- Hardcode colors or spacing values
- Hardcode user-facing strings
- Use `process.env` directly
- Define business limits as magic numbers

**REQUIRED:**

- Use `@gv/contracts` for DTOs
- Use `@gv/schemas` for Zod schemas
- Use `@gv/permissions-ssot` for permissions
- Use `@gv/theme` for colors
- Use `@gv/translations` for strings
- Use `@gv/config` for environment variables
- Use `@gv/business-rules` for business limits

### 2. Bypass SSOT

**PROHIBITED:**

- Implement features without updating features-ssot
- Create pages without updating pages-ssot
- Define routes without updating routes-ssot
- Create forms without updating forms-ssot
- Add permissions without updating permissions-ssot
- Track analytics without updating analytics-ssot

**REQUIRED:**

- Update the relevant SSOT before implementation
- Validate SSOT before proceeding
- Reference SSOT in implementation

### 3. Bypass Validation

**PROHIBITED:**

- Skip SSOT validation
- Skip governance validation
- Skip documentation validation
- Proceed with failed validation

**REQUIRED:**

- Run validation after each SSOT update
- Run comprehensive validation before completion
- Fix all validation errors before proceeding

### 4. Bypass Documentation

**PROHIBITED:**

- Create `.md` files outside `docs/`
- Create undocumented code
- Create undocumented APIs
- Skip documentation updates

**REQUIRED:**

- All documentation in `docs/`
- Document all public APIs
- Update documentation for all changes
- Run `npm run validate:docs`

### 5. Bypass Traceability

**PROHIBITED:**

- Make changes without referencing task
- Make changes without referencing feature
- Make architectural decisions without ADR
- Make significant changes without changelog

**REQUIRED:**

- Reference task ID in commit message
- Reference feature ID in implementation
- Create ADR for architectural decisions
- Update changelog for significant changes

---

## Implementation Workflows

### New Feature Workflow

```
1. Discover: Identify affected SSOTs (features, contracts, schemas, permissions, translations)
2. Update: Add feature to @gv/features-ssot
3. Validate: npm run validate:features
4. Update: Add DTOs to @gv/contracts
5. Validate: npm run validate:ssot
6. Update: Add schemas to @gv/schemas
7. Validate: npm run validate:ssot
8. Update: Add permissions to @gv/permissions-ssot
9. Validate: npm run validate:permissions
10. Update: Add translations to @gv/translations
11. Validate: npm run validate:ssot
12. Implement: Write feature code using SSOT definitions
13. Document: Update docs/packages/features.md
14. Changelog: Update docs/changelogs/packages.md
15. Validate: npm run validate:governance
16. Report: Produce compliance report
```

### New Page Workflow

```
1. Discover: Identify affected SSOTs (pages, routes, navigation, permissions, translations)
2. Update: Add page to @gv/pages-ssot
3. Validate: npm run validate:pages
4. Update: Add route to @gv/routes-ssot
5. Validate: npm run validate:routes
6. Update: Add navigation item to @gv/navigation-ssot
7. Validate: npm run validate:navigation
8. Update: Add permissions to @gv/permissions-ssot
9. Validate: npm run validate:permissions
10. Update: Add translations to @gv/translations
11. Validate: npm run validate:ssot
12. Implement: Write page.tsx using SSOT definitions
13. Document: Update docs/modules/frontend.md
14. Validate: npm run validate:governance
15. Report: Produce compliance report
```

### New API Workflow

```
1. Discover: Identify affected SSOTs (contracts, schemas, domain)
2. Update: Add DTOs to @gv/contracts
3. Validate: npm run validate:ssot
4. Update: Add schemas to @gv/schemas
5. Validate: npm run validate:ssot
6. Update: Add domain entities to @gv/domain
7. Validate: npm run typecheck
8. Implement: Write API handler using SSOT definitions
9. Document: Update docs/modules/backend-api.md
10. Changelog: Update docs/changelogs/backend.md
11. Validate: npm run validate:governance
12. Report: Produce compliance report
```

---

## Compliance Checklist

Before completing any task, AI agents MUST verify:

- [ ] All affected SSOTs have been discovered
- [ ] All SSOTs have been updated before implementation
- [ ] All SSOT validations pass
- [ ] Implementation uses SSOT definitions
- [ ] Documentation has been updated
- [ ] Changelog has been updated (if applicable)
- [ ] ADR has been created (if architectural decision)
- [ ] Governance validation passes
- [ ] Compliance report has been produced

---

## Enforcement

Governance is enforced through:

1. **Pre-commit hooks**: Run `npm run validate:governance` before each commit
2. **GitHub Actions**: Run all validations in CI/CD pipeline
3. **Manual validation**: AI agents must run `npm run validate:all` before completing
4. **Compliance reporting**: AI agents must produce compliance reports

---

## Violation Handling

If a governance violation is detected:

1. The validation will fail with a descriptive error message
2. The commit will be blocked
3. The AI agent must fix the violation by:
   - Updating the missing SSOT
   - Running validation to confirm the fix
   - Re-attempting the commit

---

## Success Criteria

AI agent work is considered compliant when:

- All SSOTs are updated before implementation
- All validations pass
- Documentation is updated
- Changelog is updated (if applicable)
- Traceability is maintained
- Compliance report is produced

---

## Acknowledgment

By operating in this repository, AI agents acknowledge and agree to this contract. Violations will be detected and blocked by the governance system.

---

**Contract Version:** 1.0.0  
**Effective Date:** 2026-06-13  
**Governance SSOT:** @gv/governance-ssot
