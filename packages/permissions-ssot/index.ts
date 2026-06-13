// @gv/permissions-ssot
// Single Source of Truth for all platform permissions

import { z } from 'zod';

// ============================================================================
// PERMISSION DEFINITION SCHEMA
// ============================================================================

export const permissionDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-:]+$/, 'Permission ID must be lowercase with hyphens and colons'),
  name: z.string().min(1),
  description: z.string().min(1),
  resource: z.string().min(1), // Resource type (user, product, order, etc.)
  action: z.string().min(1), // Action type (read, write, delete, etc.)
  feature: z.string().min(1), // Reference to @gv/features-ssot
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type PermissionDefinition = z.infer<typeof permissionDefinitionSchema>;

// ============================================================================
// ROLE DEFINITION SCHEMA
// ============================================================================

export const roleDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Role ID must be lowercase with hyphens'),
  name: z.string().min(1),
  description: z.string().min(1),
  permissions: z.array(z.string()).default([]), // Permission IDs
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type RoleDefinition = z.infer<typeof roleDefinitionSchema>;

// ============================================================================
// PERMISSION REGISTRY
// ============================================================================

/**
 * Authoritative registry of all platform permissions.
 * 
 * This is the Single Source of Truth for permission definitions.
 * All permission-related code must reference this registry.
 * 
 * To add a new permission:
 * 1. Add definition to this registry
 * 2. Run validation: npm run validate:permissions
 * 3. Update related role definitions
 */
export const permissionRegistry: Record<string, PermissionDefinition> = {
  'user:read': {
    id: 'user:read',
    name: 'Read User',
    description: 'Permission to read user information',
    resource: 'user',
    action: 'read',
    feature: 'users',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'user:write': {
    id: 'user:write',
    name: 'Write User',
    description: 'Permission to write/update user information',
    resource: 'user',
    action: 'write',
    feature: 'users',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'user:delete': {
    id: 'user:delete',
    name: 'Delete User',
    description: 'Permission to delete user',
    resource: 'user',
    action: 'delete',
    feature: 'users',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'product:read': {
    id: 'product:read',
    name: 'Read Product',
    description: 'Permission to read product information',
    resource: 'product',
    action: 'read',
    feature: 'products',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'product:write': {
    id: 'product:write',
    name: 'Write Product',
    description: 'Permission to write/update product information',
    resource: 'product',
    action: 'write',
    feature: 'products',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'product:delete': {
    id: 'product:delete',
    name: 'Delete Product',
    description: 'Permission to delete product',
    resource: 'product',
    action: 'delete',
    feature: 'products',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'order:read': {
    id: 'order:read',
    name: 'Read Order',
    description: 'Permission to read order information',
    resource: 'order',
    action: 'read',
    feature: 'orders',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'order:write': {
    id: 'order:write',
    name: 'Write Order',
    description: 'Permission to write/update order information',
    resource: 'order',
    action: 'write',
    feature: 'orders',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'cart:read': {
    id: 'cart:read',
    name: 'Read Cart',
    description: 'Permission to read cart information',
    resource: 'cart',
    action: 'read',
    feature: 'cart',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'cart:write': {
    id: 'cart:write',
    name: 'Write Cart',
    description: 'Permission to write/update cart information',
    resource: 'cart',
    action: 'write',
    feature: 'cart',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'checkout:write': {
    id: 'checkout:write',
    name: 'Write Checkout',
    description: 'Permission to perform checkout',
    resource: 'checkout',
    action: 'write',
    feature: 'checkout',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'merchant:read': {
    id: 'merchant:read',
    name: 'Read Merchant',
    description: 'Permission to read merchant information',
    resource: 'merchant',
    action: 'read',
    feature: 'merchants',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'merchant:write': {
    id: 'merchant:write',
    name: 'Write Merchant',
    description: 'Permission to write/update merchant information',
    resource: 'merchant',
    action: 'write',
    feature: 'merchants',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'admin:read': {
    id: 'admin:read',
    name: 'Read Admin',
    description: 'Permission to access admin dashboard',
    resource: 'admin',
    action: 'read',
    feature: 'admin',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'admin:write': {
    id: 'admin:write',
    name: 'Write Admin',
    description: 'Permission to perform admin actions',
    resource: 'admin',
    action: 'write',
    feature: 'admin',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'notification:read': {
    id: 'notification:read',
    name: 'Read Notification',
    description: 'Permission to read notifications',
    resource: 'notification',
    action: 'read',
    feature: 'notifications',
    version: '1.0.0',
    createdAt: '2026-06-13T01:35:00.000Z',
    updatedAt: '2026-06-13T01:35:00.000Z',
  },
  'marketplace:read': {
    id: 'marketplace:read',
    name: 'Read Marketplace',
    description: 'Permission to access marketplace navigation',
    resource: 'marketplace',
    action: 'read',
    feature: 'marketplace-navigation',
    version: '1.0.0',
    createdAt: '2026-06-13T01:30:00.000Z',
    updatedAt: '2026-06-13T01:30:00.000Z',
  },
};

// ============================================================================
// ROLE REGISTRY
// ============================================================================

/**
 * Authoritative registry of all platform roles.
 * 
 * This is the Single Source of Truth for role definitions.
 * All role-related code must reference this registry.
 * 
 * To add a new role:
 * 1. Add definition to this registry
 * 2. Run validation: npm run validate:permissions
 * 3. Update related user assignments
 */
export const roleRegistry: Record<string, RoleDefinition> = {
  guest: {
    id: 'guest',
    name: 'Guest',
    description: 'Unauthenticated user with minimal permissions',
    permissions: ['product:read', 'merchant:read'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  buyer: {
    id: 'buyer',
    name: 'Buyer',
    description: 'Buyer role with cart and order permissions',
    permissions: [
      'user:read',
      'user:write',
      'product:read',
      'order:read',
      'cart:read',
      'cart:write',
      'checkout:write',
      'merchant:read',
      'notification:read',
      'marketplace:read',
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T01:30:00.000Z',
    updatedAt: '2026-06-13T01:30:00.000Z',
  },
  seller: {
    id: 'seller',
    name: 'Seller',
    description: 'Seller role with product management and dashboard permissions',
    permissions: [
      'user:read',
      'user:write',
      'product:read',
      'product:write',
      'product:delete',
      'order:read',
      'order:write',
      'cart:read',
      'cart:write',
      'checkout:write',
      'merchant:read',
      'merchant:write',
      'notification:read',
      'marketplace:read',
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T01:30:00.000Z',
    updatedAt: '2026-06-13T01:30:00.000Z',
  },
  user: {
    id: 'user',
    name: 'User',
    description: 'Authenticated user with basic permissions',
    permissions: [
      'user:read',
      'user:write',
      'product:read',
      'order:read',
      'cart:read',
      'cart:write',
      'checkout:write',
      'merchant:read',
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  merchant: {
    id: 'merchant',
    name: 'Merchant',
    description: 'Merchant with product management permissions',
    permissions: [
      'user:read',
      'user:write',
      'product:read',
      'product:write',
      'product:delete',
      'order:read',
      'order:write',
      'cart:read',
      'cart:write',
      'checkout:write',
      'merchant:read',
      'merchant:write',
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Administrator with full system permissions',
    permissions: [
      'user:read',
      'user:write',
      'user:delete',
      'product:read',
      'product:write',
      'product:delete',
      'order:read',
      'order:write',
      'cart:read',
      'cart:write',
      'checkout:write',
      'merchant:read',
      'merchant:write',
      'admin:read',
      'admin:write',
      'notification:read',
      'marketplace:read',
    ],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// PERMISSION QUERY HELPERS
// ============================================================================

/**
 * Get a permission by ID
 */
export function getPermission(id: string): PermissionDefinition | undefined {
  return permissionRegistry[id];
}

/**
 * Get all permissions
 */
export function getAllPermissions(): PermissionDefinition[] {
  return Object.values(permissionRegistry);
}

/**
 * Get permissions by resource
 */
export function getPermissionsByResource(resource: string): PermissionDefinition[] {
  return getAllPermissions().filter((p) => p.resource === resource);
}

/**
 * Get permissions by feature
 */
export function getPermissionsByFeature(featureId: string): PermissionDefinition[] {
  return getAllPermissions().filter((p) => p.feature === featureId);
}

/**
 * Check if a permission exists
 */
export function permissionExists(id: string): boolean {
  return id in permissionRegistry;
}

/**
 * Get a role by ID
 */
export function getRole(id: string): RoleDefinition | undefined {
  return roleRegistry[id];
}

/**
 * Get all roles
 */
export function getAllRoles(): RoleDefinition[] {
  return Object.values(roleRegistry);
}

/**
 * Get permissions for a role
 */
export function getRolePermissions(roleId: string): string[] {
  const role = getRole(roleId);
  return role?.permissions || [];
}

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(roleId: string, permissionId: string): boolean {
  return getRolePermissions(roleId).includes(permissionId);
}

/**
 * Check if a user has a specific permission (based on their role)
 */
export function userHasPermission(userRoleId: string, permissionId: string): boolean {
  return roleHasPermission(userRoleId, permissionId);
}

/**
 * Validate a permission definition
 */
export function validatePermission(permission: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = permissionDefinitionSchema.safeParse(permission);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

/**
 * Validate a role definition
 */
export function validateRole(role: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = roleDefinitionSchema.safeParse(role);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

/**
 * Validate the entire permission registry
 */
export function validatePermissionRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate each permission definition
  for (const [id, permission] of Object.entries(permissionRegistry)) {
    const validation = validatePermission(permission);
    if (!validation.valid) {
      errors.push(`Permission "${id}": ${validation.errors?.message}`);
    }

    // Check ID consistency
    if (permission.id !== id) {
      errors.push(`Permission "${id}": ID mismatch (registry key: ${id}, permission.id: ${permission.id})`);
    }
  }

  // Validate each role definition
  for (const [id, role] of Object.entries(roleRegistry)) {
    const validation = validateRole(role);
    if (!validation.valid) {
      errors.push(`Role "${id}": ${validation.errors?.message}`);
    }

    // Check ID consistency
    if (role.id !== id) {
      errors.push(`Role "${id}": ID mismatch (registry key: ${id}, role.id: ${role.id})`);
    }

    // Check that all referenced permissions exist
    for (const permId of role.permissions) {
      if (!permissionExists(permId)) {
        errors.push(`Role "${id}" references non-existent permission "${permId}"`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================
