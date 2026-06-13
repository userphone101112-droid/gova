// useNavbar Hook
// Phase 1: Navigation Foundation

'use client';

import { useMemo } from 'react';
import { useNavigationContext } from '@/context/NavigationContext';
import { resolveNavigation } from '@/lib/marketplace/ssot-integration';
import { PermissionResolutionService } from '@/lib/marketplace/permission-resolution';

// ============================================================================
// USE NAVBAR HOOK
// ============================================================================

export function useNavbar(navigationId: string = 'marketplace') {
  const { state, actions } = useNavigationContext();

  // Resolve navigation items from SSOT
  const navigationItems = useMemo(() => {
    const result = resolveNavigation(navigationId, {
      enableCaching: true,
      cacheTTL: 300000,
    });

    if (result.exists) {
      return result.items;
    }

    return [];
  }, [navigationId]);

  // Filter items based on user permissions
  const visibleItems = useMemo(() => {
    return PermissionResolutionService.filterItemsByPermissions(
      navigationItems,
      state.userPermissions
    );
  }, [navigationItems, state.userPermissions]);

  // Check if an item is visible
  const isItemVisible = (itemId: string): boolean => {
    const item = navigationItems.find(i => i.id === itemId);
    if (!item) return false;
    return PermissionResolutionService.isItemVisible(item, state.userPermissions);
  };

  // Get active item
  const activeItem = useMemo(() => {
    if (!state.activeRoute) return null;
    return navigationItems.find(item => item.route === state.activeRoute) || null;
  }, [navigationItems, state.activeRoute]);

  return {
    // State
    items: navigationItems,
    visibleItems,
    activeItem,
    activeRoute: state.activeRoute,
    config: state.config,

    // Actions
    setActiveRoute: actions.setActiveRoute,
    updateConfig: actions.updateConfig,

    // Utilities
    isItemVisible,
    hasVisibleItems: visibleItems.length > 0,
  };
}

// ============================================================================
// USE NAVBAR STATE HOOK
// ============================================================================

export function useNavbarState() {
  const { state } = useNavigationContext();

  return {
    userRole: state.userRole,
    userPermissions: state.userPermissions,
    activeRoute: state.activeRoute,
    config: state.config,
  };
}

// ============================================================================
// USE NAVBAR ACTIONS HOOK
// ============================================================================

export function useNavbarActions() {
  const { actions } = useNavigationContext();

  return {
    setRole: actions.setRole,
    setPermissions: actions.setPermissions,
    setActiveRoute: actions.setActiveRoute,
    updateConfig: actions.updateConfig,
    resetState: actions.resetState,
  };
}
