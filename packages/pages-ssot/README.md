# @gv/pages-ssot

Single Source of Truth for all platform pages.

## Purpose

This package serves as the authoritative registry for every page in the GV platform. No page should exist without being registered in this SSOT.

## Page Definition

Every page must include:

- **id**: Unique identifier (lowercase with hyphens)
- **feature**: Reference to @gv/features-ssot
- **route**: Next.js route path
- **title**: Human-readable page title
- **description**: Detailed page description
- **type**: Page type (page, layout, loading, error, not-found, template)
- **layout**: Layout reference (optional)
- **permissions**: Required permissions
- **seo**: SEO metadata
- **translations**: Translation keys
- **contracts**: Contract references from @gv/contracts
- **schemas**: Schema references from @gv/schemas
- **analyticsEvents**: Analytics events from @gv/analytics-ssot
- **documentationRefs**: Links to documentation
- **version**: Semantic version
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Usage

```typescript
import { getPage, getAllPages, getPageByRoute } from '@gv/pages-ssot';

// Get a specific page
const homePage = getPage('home');

// Get page by route
const loginPage = getPageByRoute('/login');

// Get all pages
const allPages = getAllPages();
```

## Validation

Run validation:

```bash
npm run validate
```

Or from root:

```bash
npm run validate:pages
```

## Adding a New Page

1. Add the page definition to `pageRegistry` in `index.ts`
2. Run validation: `npm run validate`
3. Create the page file in `src/app/`
4. Update related routes SSOT
5. Commit with descriptive message

## Page Types

- `page`: Regular page component
- `layout`: Layout component
- `loading`: Loading state component
- `error`: Error boundary component
- `not-found`: Not found component
- `template`: Template component

## Integration

This package integrates with:
- `@gv/features-ssot` - Pages reference features
- `@gv/routes-ssot` - Routes reference pages
- `@gv/permissions-ssot` - Pages require permissions
- `@gv/contracts` - Pages use contracts
- `@gv/schemas` - Pages use schemas
- `@gv/analytics-ssot` - Pages track analytics
