# @gv/features-ssot

Single Source of Truth for all platform features.

## Purpose

This package serves as the authoritative registry for every feature in the GV platform. No feature should exist without being registered in this SSOT.

## Feature Definition

Every feature must include:

- **id**: Unique identifier (lowercase with hyphens)
- **name**: Human-readable feature name
- **description**: Detailed feature description
- **owner**: Team or individual responsible
- **status**: Feature lifecycle status
- **permissions**: Required permissions
- **routes**: Associated routes
- **forms**: Associated forms
- **analyticsEvents**: Tracked analytics events
- **documentationRefs**: Links to documentation
- **adrRefs**: Related ADRs
- **dependencies**: Other features this depends on
- **version**: Semantic version
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Usage

```typescript
import { getFeature, getAllFeatures, featureExists } from '@gv/features-ssot';

// Get a specific feature
const usersFeature = getFeature('users');

// Get all features
const allFeatures = getAllFeatures();

// Check if a feature exists
if (featureExists('products')) {
  // Feature exists
}
```

## Validation

Run validation:

```bash
npm run validate
```

Or from root:

```bash
npm run validate:features
```

## Adding a New Feature

1. Add the feature definition to `featureRegistry` in `index.ts`
2. Run validation: `npm run validate`
3. Update related SSOT packages (pages, routes, forms, etc.)
4. Commit with descriptive message

## Feature Status

- `planned`: Feature is planned but not started
- `in_development`: Feature is actively being developed
- `in_review`: Feature is under review
- `released`: Feature is released and available
- `deprecated`: Feature is deprecated but still available
- `removed`: Feature has been removed

## Integration

This package integrates with:
- `@gv/pages-ssot` - Pages reference features
- `@gv/routes-ssot` - Routes reference features
- `@gv/forms-ssot` - Forms reference features
- `@gv/permissions-ssot` - Permissions reference features
- `@gv/analytics-ssot` - Analytics events reference features
