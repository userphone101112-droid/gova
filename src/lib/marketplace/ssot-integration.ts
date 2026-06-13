// SSOT Integration Layer
// Phase 1: Navigation Foundation

// Using relative imports to access SSOT packages in monorepo
import {
  getNavigation,
  getNavigationItemsForUser,
  navigationExists,
} from '../../../packages/navigation-ssot/index';
import {
  getRoute,
  routeExists,
} from '../../../packages/routes-ssot/index';
import {
  getRolePermissions,
  roleHasPermission,
  permissionExists,
} from '../../../packages/permissions-ssot/index';
import {
  getFeature,
  featureExists,
} from '../../../packages/features-ssot/index';
import type {
  SSOTIntegrationConfig,
  SSOTIntegrationResult,
  NavigationResolutionResult,
  RouteResolutionResult,
  PermissionResolutionResult,
} from '@/types/marketplace/navigation.types';

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SSOTCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }
}

const cache = new SSOTCache();

// ============================================================================
// NAVIGATION SSOT INTEGRATION
// ============================================================================

export function resolveNavigation(
  navigationId: string,
  config?: SSOTIntegrationConfig
): NavigationResolutionResult {
  const enableCaching = config?.enableCaching ?? true;
  const cacheTTL = config?.cacheTTL ?? 300000; // 5 minutes default

  if (enableCaching) {
    const cached = cache.get<NavigationResolutionResult>(`nav:${navigationId}`);
    if (cached) return cached;
  }

  const exists = navigationExists(navigationId);
  
  if (!exists) {
    return {
      navigationId,
      exists: false,
      items: [],
    };
  }

  const navigation = getNavigation(navigationId);
  
  const result: NavigationResolutionResult = {
    navigationId,
    exists: true,
    items: navigation?.items || [],
  };

  if (enableCaching) {
    cache.set(`nav:${navigationId}`, result, cacheTTL);
  }

  return result;
}

export function resolveNavigationForUser(
  navigationId: string,
  userPermissions: string[],
  config?: SSOTIntegrationConfig
): SSOTIntegrationResult {
  const enableCaching = config?.enableCaching ?? true;
  const cacheKey = `nav:user:${navigationId}:${userPermissions.join(',')}`;
  const cacheTTL = config?.cacheTTL ?? 300000;

  if (enableCaching) {
    const cached = cache.get<SSOTIntegrationResult>(cacheKey);
    if (cached) return cached;
  }

  const exists = navigationExists(navigationId);
  
  if (!exists) {
    return {
      success: false,
      error: `Navigation "${navigationId}" not found`,
    };
  }

  const items = getNavigationItemsForUser(navigationId, userPermissions);
  
  const result: SSOTIntegrationResult = {
    success: true,
    data: items,
  };

  if (enableCaching) {
    cache.set(cacheKey, result, cacheTTL);
  }

  return result;
}

// ============================================================================
// ROUTE SSOT INTEGRATION
// ============================================================================

export function resolveRoute(routeId: string): RouteResolutionResult {
  const cached = cache.get<RouteResolutionResult>(`route:${routeId}`);
  if (cached) return cached;

  const exists = routeExists(routeId);
  
  if (!exists) {
    return {
      routeId,
      path: '',
      exists: false,
    };
  }

  const route = getRoute(routeId);
  
  const result: RouteResolutionResult = {
    routeId,
    path: route?.path || '',
    exists: true,
  };

  cache.set(`route:${routeId}`, result, 300000);

  return result;
}

export function resolveRouteByPath(path: string): RouteResolutionResult {
  const cached = cache.get<RouteResolutionResult>(`route:path:${path}`);
  if (cached) return cached;

  // Import dynamically to avoid type issues
  const routesModule = require('../../../packages/routes-ssot/index');
  const routeRegistry = routesModule.routeRegistry || {};
  
  const route = Object.values(routeRegistry).find(
    (r: any) => r.path === path
  ) as { id: string; path: string } | undefined;
  
  const result: RouteResolutionResult = {
    routeId: route?.id || '',
    path: path,
    exists: !!route,
  };

  cache.set(`route:path:${path}`, result, 300000);

  return result;
}

// ============================================================================
// PERMISSION SSOT INTEGRATION
// ============================================================================

export function resolvePermission(
  permissionId: string,
  userRoleId: string
): PermissionResolutionResult {
  const cacheKey = `perm:${permissionId}:${userRoleId}`;
  const cached = cache.get<PermissionResolutionResult>(cacheKey);
  if (cached) return cached;

  const exists = permissionExists(permissionId);
  
  if (!exists) {
    return {
      permissionId,
      exists: false,
      granted: false,
    };
  }

  const granted = roleHasPermission(userRoleId, permissionId);
  
  const result: PermissionResolutionResult = {
    permissionId,
    exists: true,
    granted,
  };

  cache.set(cacheKey, result, 300000);

  return result;
}

export function resolveRolePermissions(roleId: string): string[] {
  const cached = cache.get<string[]>(`role:perms:${roleId}`);
  if (cached) return cached;

  const permissions = getRolePermissions(roleId);
  
  cache.set(`role:perms:${roleId}`, permissions, 300000);

  return permissions;
}

// ============================================================================
// FEATURE SSOT INTEGRATION
// ============================================================================

export function resolveFeature(featureId: string): SSOTIntegrationResult {
  const cached = cache.get<SSOTIntegrationResult>(`feature:${featureId}`);
  if (cached) return cached;

  const exists = featureExists(featureId);
  
  if (!exists) {
    return {
      success: false,
      error: `Feature "${featureId}" not found`,
    };
  }

  const feature = getFeature(featureId);
  
  const result: SSOTIntegrationResult = {
    success: true,
    data: feature,
  };

  cache.set(`feature:${featureId}`, result, 300000);

  return result;
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

export function clearSSOTCache(): void {
  cache.clear();
}

export function invalidateSSOTCache(key: string): void {
  cache.invalidate(key);
}

// ============================================================================
// VALIDATION
// ============================================================================

export function validateSSOTIntegrations(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Test navigation SSOT
  try {
    const navResult = resolveNavigation('marketplace');
    if (!navResult.exists) {
      errors.push('Navigation SSOT: marketplace navigation not found');
    }
  } catch (error) {
    errors.push(`Navigation SSOT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test route SSOT
  try {
    const routeResult = resolveRoute('home');
    if (!routeResult.exists) {
      errors.push('Route SSOT: home route not found');
    }
  } catch (error) {
    errors.push(`Route SSOT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test permission SSOT
  try {
    const permResult = resolvePermission('marketplace:read', 'buyer');
    if (!permResult.exists) {
      errors.push('Permission SSOT: marketplace:read permission not found');
    }
  } catch (error) {
    errors.push(`Permission SSOT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test feature SSOT
  try {
    const featureResult = resolveFeature('marketplace-navigation');
    if (!featureResult.success) {
      errors.push('Feature SSOT: marketplace-navigation feature not found');
    }
  } catch (error) {
    errors.push(`Feature SSOT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
