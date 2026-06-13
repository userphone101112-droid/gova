// Route Resolution Layer
// Phase 1: Navigation Foundation

import { resolveRoute, resolveRouteByPath } from './ssot-integration';
import type { RouteResolutionResult } from '@/types/marketplace/navigation.types';

// ============================================================================
// ROUTE RESOLUTION SERVICE
// ============================================================================

export class RouteResolutionService {
  /**
   * Resolve a route by its ID
   */
  static resolveById(routeId: string): RouteResolutionResult {
    return resolveRoute(routeId);
  }

  /**
   * Resolve a route by its path
   */
  static resolveByPath(path: string): RouteResolutionResult {
    return resolveRouteByPath(path);
  }

  /**
   * Check if a route exists by ID
   */
  static existsById(routeId: string): boolean {
    const result = this.resolveById(routeId);
    return result.exists;
  }

  /**
   * Check if a route exists by path
   */
  static existsByPath(path: string): boolean {
    const result = this.resolveByPath(path);
    return result.exists;
  }

  /**
   * Build a route path with parameters
   */
  static buildPath(routeId: string, params?: Record<string, string>): string {
    const result = this.resolveById(routeId);
    
    if (!result.exists) {
      throw new Error(`Route "${routeId}" not found`);
    }

    let path = result.path;

    // Replace dynamic parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`[${key}]`, value);
      });
    }

    return path;
  }

  /**
   * Extract parameters from a route path
   */
  static extractParams(routeId: string, path: string): Record<string, string> {
    const result = this.resolveById(routeId);
    
    if (!result.exists) {
      return {};
    }

    const params: Record<string, string> = {};
    const routePattern = result.path;
    const pathSegments = path.split('/');
    const patternSegments = routePattern.split('/');

    patternSegments.forEach((segment, index) => {
      if (segment.startsWith('[') && segment.endsWith(']')) {
        const paramName = segment.slice(1, -1);
        params[paramName] = pathSegments[index] || '';
      }
    });

    return params;
  }

  /**
   * Validate if a path matches a route pattern
   */
  static matchesRoute(routeId: string, path: string): boolean {
    const result = this.resolveById(routeId);
    
    if (!result.exists) {
      return false;
    }

    const routePattern = result.path;
    
    // Exact match
    if (routePattern === path) {
      return true;
    }

    // Pattern match with parameters
    const patternSegments = routePattern.split('/');
    const pathSegments = path.split('/');

    if (patternSegments.length !== pathSegments.length) {
      return false;
    }

    return patternSegments.every((segment, index) => {
      if (segment.startsWith('[') && segment.endsWith(']')) {
        return true; // Dynamic segment matches anything
      }
      return segment === pathSegments[index];
    });
  }
}

// ============================================================================
// ROUTE BUILDER UTILITIES
// ============================================================================

export const routeBuilder = {
  home: () => RouteResolutionService.buildPath('home'),
  cart: () => RouteResolutionService.buildPath('cart'),
  profile: () => RouteResolutionService.buildPath('profile'),
  sellerDashboard: () => RouteResolutionService.buildPath('seller-dashboard'),
  adminDashboard: () => RouteResolutionService.buildPath('admin-dashboard'),
  notifications: () => RouteResolutionService.buildPath('notifications'),
};
