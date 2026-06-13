// Permission Resolution Layer
// Phase 1.5: Foundation Remediation

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
// PERMISSION HELPERS
// ============================================================================

export const permissionHelpers = {
  /**
   * Get permissions for a role from permissions-ssot
   */
  getPermissions: (role: string): string[] => {
    return resolveRolePermissions(role);
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
