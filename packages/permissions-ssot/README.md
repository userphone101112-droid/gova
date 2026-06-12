# @gv/permissions-ssot

Single Source of Truth for all platform permissions.

## Purpose

This package serves as the authoritative registry for every permission and role in the GV platform. No permission or role should exist without being registered in this SSOT.

## Permission Definition

Every permission must include:

- **id**: Unique identifier (lowercase with hyphens and colons, e.g., `user:read`)
- **name**: Human-readable permission name
- **description**: Detailed permission description
- **resource**: Resource type (user, product, order, etc.)
- **action**: Action type (read, write, delete, etc.)
- **feature**: Reference to @gv/features-ssot
- **version**: Semantic version
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Role Definition

Every role must include:

- **id**: Unique identifier (lowercase with hyphens)
- **name**: Human-readable role name
- **description**: Detailed role description
- **permissions**: Array of permission IDs
- **version**: Semantic version
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Usage

```typescript
import { 
  getPermission, 
  getRole, 
  getRolePermissions, 
  userHasPermission 
} from '@gv/permissions-ssot';

// Get a specific permission
const readUserPerm = getPermission('user:read');

// Get a specific role
const userRole = getRole('user');

// Get permissions for a role
const userPerms = getRolePermissions('user');

// Check if a user has a permission
const canRead = userHasPermission('user', 'user:read');
```

## Validation

Run validation:

```bash
npm run validate
```

Or from root:

```bash
npm run validate:permissions
```

## Adding a New Permission

1. Add the permission definition to `permissionRegistry` in `index.ts`
2. Run validation: `npm run validate`
3. Update related role definitions
4. Commit with descriptive message

## Adding a New Role

1. Add the role definition to `roleRegistry` in `index.ts`
2. Run validation: `npm run validate`
3. Update related user assignments
4. Commit with descriptive message

## Predefined Roles

- **guest**: Unauthenticated user with minimal permissions
- **user**: Authenticated user with basic permissions
- **merchant**: Merchant with product management permissions
- **admin**: Administrator with full system permissions

## Integration

This package integrates with:
- `@gv/features-ssot` - Permissions reference features
- `@gv/pages-ssot` - Pages require permissions
- `@gv/forms-ssot` - Forms require permissions
- `@gv/routes-ssot` - Routes require permissions
