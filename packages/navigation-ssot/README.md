# @gv/navigation-ssot

Single Source of Truth for all platform navigation.

## Purpose

This package serves as the authoritative registry for every navigation structure in the GV platform. No navigation item should exist without being registered in this SSOT.

## Navigation Structure

Every navigation structure must include:

- **id**: Unique identifier
- **name**: Human-readable name
- **type**: Navigation type (sidebar, header, footer, breadcrumbs, quick-actions)
- **items**: Array of navigation items
- **permissions**: Required permissions
- **version**: Semantic version
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Navigation Item

Every navigation item must include:

- **id**: Unique identifier (lowercase with hyphens)
- **type**: Item type (link, button, dropdown, divider, header)
- **label**: Display label
- **translationKey**: Reference to @gv/translations
- **route**: Reference to @gv/routes-ssot (optional)
- **href**: External link (optional)
- **icon**: Icon name (optional)
- **permissions**: Required permissions
- **feature**: Reference to @gv/features-ssot (optional)
- **children**: Nested items (optional)
- **order**: Display order
- **hidden**: Is hidden
- **badge**: Badge text (optional)

## Usage

```typescript
import { getNavigation, getNavigationItemsForUser } from '@gv/navigation-ssot';

// Get a specific navigation structure
const sidebar = getNavigation('sidebar');

// Get navigation items for a user based on permissions
const userPermissions = ['user.read', 'product.read'];
const sidebarItems = getNavigationItemsForUser('sidebar', userPermissions);
```

## Validation

Run validation:

```bash
npm run validate
```

Or from root:

```bash
npm run validate:navigation
```

## Adding a New Navigation Item

1. Add the navigation item to the appropriate structure in `navigationRegistry`
2. Run validation: `npm run validate`
3. Update related routes SSOT
4. Commit with descriptive message

## Navigation Types

- `sidebar`: Main sidebar navigation
- `header`: Header navigation
- `footer`: Footer links
- `breadcrumbs`: Breadcrumb navigation
- `quick-actions`: Quick action buttons

## Integration

This package integrates with:
- `@gv/routes-ssot` - Navigation items reference routes
- `@gv/features-ssot` - Navigation items reference features
- `@gv/permissions-ssot` - Navigation items require permissions
- `@gv/translations` - Navigation items use translations
