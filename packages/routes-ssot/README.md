# @gv/routes-ssot

Single Source of Truth for all platform routes.

## Purpose

This package serves as the authoritative registry for every route in the GV platform. No route should exist without being registered in this SSOT.

## Route Definition

Every route must include:

- **id**: Unique identifier (lowercase with hyphens)
- **path**: Next.js route path
- **page**: Reference to @gv/pages-ssot
- **feature**: Reference to @gv/features-ssot
- **params**: Route parameters (optional)
- **query**: Query parameters (optional)
- **permissions**: Required permissions
- **public**: Is publicly accessible
- **version**: Semantic version
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Usage

```typescript
import { getRoute, buildRoute, routes } from '@gv/routes-ssot';

// Get a specific route
const homeRoute = getRoute('home');

// Build a route with parameters
const productUrl = buildRoute('product-details', { id: '123' });

// Use type-safe route helpers
const productsUrl = routes.productsList({ page: '1', limit: '10' });
const productDetailUrl = routes.productDetails({ id: '123' });
```

## Validation

Run validation:

```bash
npm run validate
```

Or from root:

```bash
npm run validate:routes
```

## Adding a New Route

1. Add the route definition to `routeRegistry` in `index.ts`
2. Run validation: `npm run validate`
3. Update related pages SSOT
4. Commit with descriptive message

## Type-Safe Route Helpers

The package provides type-safe route helpers for all registered routes:

```typescript
routes.home() → '/'
routes.login() → '/login'
routes.productDetails({ id: '123' }) → '/products/123'
routes.productsList({ page: '1', limit: '10' }) → '/products?page=1&limit=10'
```

## Integration

This package integrates with:
- `@gv/pages-ssot` - Routes reference pages
- `@gv/features-ssot` - Routes reference features
- `@gv/permissions-ssot` - Routes require permissions
