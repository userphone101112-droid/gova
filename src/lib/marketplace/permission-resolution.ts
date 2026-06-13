// Permission Resolution Layer
// Phase 1: Navigation Foundation

import { resolvePermission, resolveRolePermissions } from './ssot-integration';
import type { PermissionResolutionResult } from '@/types/marketplace/navigation.types';

// ============================================================================
// PERMISSION RESOLUTION SERVICE
// ============================================================================

export class PermissionResolutionService {
  /**
   * Resolve a permission for a specific role
   */
  static resolveForRole(
    permissionId: string,
    roleId: string
  ): PermissionResolutionResult {
    return resolvePermission(permissionId, roleId);
  }

  /**
   * Get all permissions for a role
   */
  static getRolePermissions(roleId: string): string[] {
    return resolveRolePermissions(roleId);
  }

  /**
   * Check if a role has a specific permission
   */
  static roleHasPermission(roleId: string, permissionId: string): boolean {
    const result = this.resolveForRole(permissionId, roleId);
    return result.granted;
  }

  /**
   * Check if a role has all specified permissions (AND logic)
   */
  static roleHasAllPermissions(roleId: string, permissionIds: string[]): boolean {
    return permissionIds.every(permissionId =>
      this.roleHasPermission(roleId, permissionId)
    );
  }

  /**
   * Check if a role has any of the specified permissions (OR logic)
   */
  static roleHasAnyPermission(roleId: string, permissionIds: string[]): boolean {
    return permissionIds.some(permissionId =>
      this.roleHasPermission(roleId, permissionId)
    );
  }

  /**
   * Filter navigation items based on user permissions
   */
  static filterItemsByPermissions<T extends { permissions: string[] }>(
    items: T[],
    userPermissions: string[]
  ): T[] {
    return items.filter(item => {
      if (item.permissions.length === 0) return true;
      return item.permissions.every(perm =>
        userPermissions.includes(perm)
      );
    });
  }

  /**
   * Check if a navigation item is visible to a user
   */
  static isItemVisible<T extends { permissions: string[]; hidden: boolean }>(
    item: T,
    userPermissions: string[]
  ): boolean {
    // Check hidden flag
    if (item.hidden) return false;

    // Check permissions (AND logic - must have ALL)
    if (item.permissions.length > 0) {
      const hasAllPermissions = item.permissions.every(perm =>
        userPermissions.includes(perm)
      );
      if (!hasAllPermissions) return false;
    }

    return true;
  }
}

// ============================================================================
// ROLE PERMISSION CONSTANTS
// ============================================================================

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  buyer: [
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
  seller: [
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
  admin: [
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
  guest: [
    'product:read',
    'merchant:read',
  ],
};

// ============================================================================
// PERMISSION HELPERS
// ============================================================================

export const permissionHelpers = {
  /**
   * Get permissions for a role
   */
  getPermissions: (role: string): string[] => {
    return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
  },

  /**
   * Check if role can access cart
   */
  canAccessCart: (role: string): boolean => {
    const permissions = permissionHelpers.getPermissions(role);
    return permissions.includes('cart:read') && permissions.includes('marketplace:read');
  },

  /**
   * Check if role can access dashboard
   */
  canAccessDashboard: (role: string): boolean => {
    const permissions = permissionHelpers.getPermissions(role);
    return permissions.includes('merchant:write') && permissions.includes('marketplace:read');
  },

  /**
   * Check if role can access admin
   */
  canAccessAdmin: (role: string): boolean => {
    const permissions = permissionHelpers.getPermissions(role);
    return permissions.includes('admin:read') && permissions.includes('marketplace:read');
  },

  /**
   * Check if role can access notifications
   */
  canAccessNotifications: (role: string): boolean => {
    const permissions = permissionHelpers.getPermissions(role);
    return permissions.includes('notification:read') && permissions.includes('marketplace:read');
  },

  /**
   * Check if role can access profile
   */
  canAccessProfile: (role: string): boolean => {
    const permissions = permissionHelpers.getPermissions(role);
    return permissions.includes('user:read') && permissions.includes('marketplace:read');
  },
};
