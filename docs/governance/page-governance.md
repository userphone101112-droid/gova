# Page & Feature Governance System

## Overview

This document defines the governance rules for AI agents working on the GV Platform's Page & Feature Governance System. All AI agents must follow these rules to ensure consistency and compliance with the Single Source of Truth (SSOT) architecture.

## SSOT Packages

The following SSOT packages have been created and must be referenced by all code:

- `@gv/features-ssot` - Authoritative registry for all platform features
- `@gv/pages-ssot` - Authoritative registry for all platform pages
- `@gv/routes-ssot` - Authoritative registry for all platform routes
- `@gv/navigation-ssot` - Authoritative registry for all platform navigation
- `@gv/forms-ssot` - Authoritative registry for all platform forms
- `@gv/permissions-ssot` - Authoritative registry for all platform permissions and roles
- `@gv/analytics-ssot` - Authoritative registry for all platform analytics events

## AI Agent Rules

### 1. Page Creation Rules

**DO NOT:**
- Create `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, or `not-found.tsx` files in `src/app/` without registering them in `@gv/pages-ssot`

**DO:**
1. Add the page definition to `packages/pages-ssot/index.ts` in the `pageRegistry`
2. Include all required fields: `id`, `feature`, `route`, `title`, `description`, `type`, `permissions`, `seo`, `translations`, `contracts`, `schemas`, `analyticsEvents`, `documentationRefs`
3. Run validation: `npm run validate:pages`
4. Create the page file in `src/app/`
5. Update related routes in `@gv/routes-ssot`
6. Commit with descriptive message

### 2. Route Usage Rules

**DO NOT:**
- Hardcode route strings in code (e.g., `href="/products"`, `router.push('/login')`)

**DO:**
1. Import route helpers from `@gv/routes-ssot`
2. Use type-safe route helpers: `routes.home()`, `routes.productsList()`, `routes.productDetails({ id: '123' })`
3. Run validation: `npm run validate:routes`

### 3. Feature Folder Rules

**DO NOT:**
- Create new feature folders in `src/features/` without registering them in `@gv/features-ssot`

**DO:**
1. Add the feature definition to `packages/features-ssot/index.ts` in the `featureRegistry`
2. Include all required fields: `id`, `name`, `description`, `status`, `owner`, `routes`, `forms`, `permissions`, `analyticsEvents`
3. Run validation: `npm run validate:features`
4. Create the feature folder in `src/features/`
5. Commit with descriptive message

### 4. Form Creation Rules

**DO NOT:**
- Create forms without registering them in `@gv/forms-ssot`
- Use inline Zod schemas without registering them in `@gv/schemas`

**DO:**
1. Add the form definition to `packages/forms-ssot/index.ts` in the `formRegistry`
2. Reference existing schemas from `@gv/schemas`
3. Include all required fields: `id`, `name`, `description`, `page`, `feature`, `schema`, `dto`, `permissions`, `translations`, `fields`
4. Run validation: `npm run validate:forms`
5. Commit with descriptive message

### 5. Permission Usage Rules

**DO NOT:**
- Create new permissions without registering them in `@gv/permissions-ssot`
- Hardcode permission checks

**DO:**
1. Use existing permissions from `@gv/permissions-ssot`
2. Use helper functions: `userHasPermission(roleId, permissionId)`, `getRolePermissions(roleId)`
3. If a new permission is needed, add it to `packages/permissions-ssot/index.ts` in the `permissionRegistry`
4. Run validation: `npm run validate:permissions`

### 6. Analytics Event Rules

**DO NOT:**
- Track analytics events without registering them in `@gv/analytics-ssot`

**DO:**
1. Use existing analytics events from `@gv/analytics-ssot`
2. If a new event is needed, add it to `packages/analytics-ssot/index.ts` in the `analyticsEventRegistry`
3. Include all required fields: `id`, `name`, `description`, `category`, `page`, `feature`, `properties`
4. Run validation: `npm run validate:analytics`

### 7. Navigation Rules

**DO NOT:**
- Create navigation items without registering them in `@gv/navigation-ssot`

**DO:**
1. Add navigation items to the appropriate structure in `packages/navigation-ssot/index.ts`
2. Include all required fields: `id`, `type`, `label`, `translationKey`, `route`, `permissions`, `children`, `order`
3. Run validation: `npm run validate:navigation`

## Validation Commands

All AI agents must run validation before committing changes:

```bash
# Validate individual SSOT packages
npm run validate:features
npm run validate:pages
npm run validate:routes
npm run validate:navigation
npm run validate:forms
npm run validate:permissions
npm run validate:analytics

# Validate governance rules
npm run validate:governance:pages
npm run validate:governance:routes
npm run validate:governance:features
npm run validate:governance:forms

# Validate everything
npm run validate:all
```

## Traceability Requirements

Every page must reference:
- **feature**: The feature it belongs to (from `@gv/features-ssot`)
- **contracts**: DTOs it uses (from `@gv/contracts`)
- **schemas**: Validation schemas it uses (from `@gv/schemas`)
- **permissions**: Required permissions (from `@gv/permissions-ssot`)
- **analyticsEvents**: Analytics events it tracks (from `@gv/analytics-ssot`)
- **documentationRefs**: Links to documentation

## Enforcement

Governance is enforced through:
1. **Pre-commit hooks**: Run `npm run validate:governance` before each commit
2. **GitHub Actions**: Run all validations in CI/CD pipeline
3. **Manual validation**: AI agents must run `npm run validate:all` before completing tasks

## Violation Handling

If a governance violation is detected:
1. The validation will fail with a descriptive error message
2. The commit will be blocked
3. The AI agent must fix the violation by:
   - Registering the missing item in the appropriate SSOT package
   - Running validation to confirm the fix
   - Re-attempting the commit

## Examples

### Creating a New Page (Correct)

```typescript
// 1. Add to packages/pages-ssot/index.ts
newPage: {
  id: 'new-page',
  feature: 'users',
  route: '/new-page',
  title: 'New Page',
  description: 'A new page',
  type: 'page',
  permissions: ['user.read'],
  seo: { title: 'New Page', description: 'A new page', keywords: [] },
  translations: ['newPage.title'],
  contracts: ['UserResponseDTO'],
  schemas: ['userSchema'],
  analyticsEvents: ['page.view.new-page'],
  documentationRefs: ['/docs/pages/new-page.md'],
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
},

// 2. Run validation
npm run validate:pages

// 3. Create the page file
// src/app/new-page/page.tsx

// 4. Add route to packages/routes-ssot/index.ts
newPage: {
  id: 'new-page',
  path: '/new-page',
  page: 'new-page',
  feature: 'users',
  permissions: ['user.read'],
  public: false,
  // ...
},

// 5. Run validation
npm run validate:routes
```

### Using Routes (Correct)

```typescript
// ✅ Correct - Use route helpers
import { routes } from '@gv/routes-ssot';

<Link href={routes.home()}>Home</Link>
router.push(routes.productDetails({ id: '123' }));

// ❌ Incorrect - Hardcoded routes
<Link href="/">Home</Link>
router.push('/products/123');
```

## Summary

By following these governance rules, AI agents ensure:
- Consistency across the codebase
- Traceability of all pages, routes, and features
- Type safety through SSOT packages
- Automated validation and enforcement
- Clear documentation and ownership

All AI agents must internalize these rules and apply them consistently when working on the GV Platform.
