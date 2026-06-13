// useRoleBasedNavigation Hook
// Phase 1: Navigation Foundation

'use client';

import { useMemo } from 'react';
import { useNavigationContext } from '@/context/NavigationContext';
import { resolveNavigationForUser } from '@/lib/marketplace/ssot-integration';
import { permissionHelpers } from '@/lib/marketplace/permission-resolution';
import type { SSOTNavigationItem, UserRole } from '@/types/marketplace/navigation.types';

// ============================================================================
// USE ROLE BASED NAVIGATION HOOK
// ============================================================================

export function useRoleBasedNavigation(navigationId: string = 'marketplace') {
  const { state, actions } = useNavigationContext();

  // Get navigation items filtered for user's role
  const navigationItems = useMemo(() => {
    if (state.userPermissions.length === 0) return [];

    const result = resolveNavigationForUser(navigationId, state.userPermissions, {
      enableCaching: true,
      cacheTTL: 300000,
    });

    if (result.success && result.data) {
      const items = result.data as SSOTNavigationItem[];
      // Sort items by order
      return items.sort((a, b) => a.order - b.order);
    }

    return [];
  }, [navigationId, state.userPermissions]);

  // Get role-specific navigation items
  const getRoleNavigation = (role: UserRole): SSOTNavigationItem[] => {
    const permissions = permissionHelpers.getPermissions(role);
    const result = resolveNavigationForUser(navigationId, permissions, {
      enableCaching: true,
      cacheTTL: 300000,
    });

    if (result.success && result.data) {
      const items = result.data as SSOTNavigationItem[];
      return items.sort((a, b) => a.order - b.order);
    }

    return [];
  };

  // Check if user can access specific navigation areas
  const canAccess = {
    cart: permissionHelpers.canAccessCart(state.userRole || 'guest'),
    dashboard: permissionHelpers.canAccessDashboard(state.userRole || 'guest'),
    admin: permissionHelpers.canAccessAdmin(state.userRole || 'guest'),
    notifications: permissionHelpers.canAccessNotifications(state.userRole || 'guest'),
    profile: permissionHelpers.canAccessProfile(state.userRole || 'guest'),
  };

  // Get navigation items by category
  const getItemsByCategory = (category: string): SSOTNavigationItem[] => {
    return navigationItems.filter(item => {
      // Simple categorization based on item ID
      if (category === 'main') {
        return ['marketplace-home', 'marketplace-profile'].includes(item.id);
      }
      if (category === 'commerce') {
        return ['marketplace-cart'].includes(item.id);
      }
      if (category === 'management') {
        return ['marketplace-dashboard', 'marketplace-admin'].includes(item.id);
      }
      if (category === 'communication') {
        return ['marketplace-notifications'].includes(item.id);
      }
      return false;
    });
  };

  return {
    // Navigation items
    items: navigationItems,
    visibleItems: navigationItems, // Already filtered by permissions

    // Role helpers
    currentRole: state.userRole,
    getRoleNavigation,
    canAccess,

    // Category helpers
    getItemsByCategory,

    // Actions
    setRole: actions.setRole,
    setPermissions: actions.setPermissions,

    // Utilities
    hasItems: navigationItems.length > 0,
    itemCount: navigationItems.length,
  };
}

// ============================================================================
// USE NAVIGATION VISIBILITY HOOK
// ============================================================================

export function useNavigationVisibility(navigationId: string = 'marketplace') {
  const { state } = useNavigationContext();

  const isVisible = useMemo(() => {
    // Navigation is visible if user has marketplace.read permission
    return state.userPermissions.includes('marketplace:read');
  }, [state.userPermissions]);

  const getItemVisibility = (itemId: string): boolean => {
    const result = resolveNavigationForUser(navigationId, state.userPermissions, {
      enableCaching: true,
      cacheTTL: 300000,
    });

    if (result.success && result.data) {
      const items = result.data as SSOTNavigationItem[];
      return items.some(item => item.id === itemId);
    }

    return false;
  };

  return {
    isVisible,
    getItemVisibility,
    hasMarketplaceAccess: isVisible,
  };
}

// ============================================================================
// USE NAVIGATION ROUTE HOOK
// ============================================================================

export function useNavigationRoute() {
  const { state, actions } = useNavigationContext();

  const navigateToRoute = (routeId: string) => {
    actions.setActiveRoute?.(routeId);
    // Note: Actual router navigation would be handled here
    // For now, we just update the active route in context
  };

  const isActiveRoute = (routeId: string): boolean => {
    return state.activeRoute === routeId;
  };

  return {
    activeRoute: state.activeRoute,
    navigateToRoute,
    isActiveRoute,
  };
}
