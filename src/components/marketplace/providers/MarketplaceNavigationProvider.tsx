// Marketplace Navigation Provider
// Phase 1: Navigation Foundation

'use client';

import React, { useEffect } from 'react';
import { NavigationProvider } from '@/context/NavigationContext';
import { useNavigationContext } from '@/context/NavigationContext';
import { resolveNavigationForUser } from '@/lib/marketplace/ssot-integration';
import type { NavbarConfig, SSOTNavigationItem } from '@/types/marketplace/navigation.types';

// ============================================================================
// MARKETPLACE NAVIGATION PROVIDER
// ============================================================================

interface MarketplaceNavigationProviderProps {
  children: React.ReactNode;
  config?: Partial<NavbarConfig>;
  navigationId?: string;
  authAdapter?: {
    getRole: () => string | null;
    getPermissions: () => string[];
    onAuthChange?: (callback: (user: any) => void) => () => void;
  };
}

export function MarketplaceNavigationProvider({
  children,
  config,
  navigationId = 'marketplace',
  authAdapter,
}: MarketplaceNavigationProviderProps) {
  return (
    <NavigationProvider config={config || {}}>
      <MarketplaceNavigationInitializer
        navigationId={navigationId}
        authAdapter={authAdapter}
      >
        {children}
      </MarketplaceNavigationInitializer>
    </NavigationProvider>
  );
}

// ============================================================================
// MARKETPLACE NAVIGATION INITIALIZER
// ============================================================================

interface MarketplaceNavigationInitializerProps {
  children: React.ReactNode;
  navigationId: string;
  authAdapter?: MarketplaceNavigationProviderProps['authAdapter'];
}

function MarketplaceNavigationInitializer({
  children,
  navigationId,
  authAdapter,
}: MarketplaceNavigationInitializerProps) {
  const { state, actions } = useNavigationContext();

  // Initialize navigation from SSOT
  useEffect(() => {
    const initializeNavigation = async () => {
      try {
        const result = resolveNavigation(navigationId, {
          enableCaching: true,
          cacheTTL: 300000,
        });

        if (result.success && result.data) {
          actions.setPermissions?.(result.data.permissions || []);
          // Note: Navigation items will be loaded based on user permissions
        }
      } catch (error) {
        console.error('Failed to initialize navigation:', error);
      }
    };

    initializeNavigation();
  }, [navigationId, actions]);

  // Initialize authentication state
  useEffect(() => {
    if (!authAdapter) return;

    const initializeAuth = () => {
      try {
        const role = authAdapter.getRole();
        const permissions = authAdapter.getPermissions();

        if (role) {
          actions.setRole?.(role);
        }

        if (permissions.length > 0) {
          actions.setPermissions?.(permissions);
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
      }
    };

    initializeAuth();

    // Subscribe to auth changes if adapter provides it
    let unsubscribe: (() => void) | undefined;

    if (authAdapter.onAuthChange) {
      unsubscribe = authAdapter.onAuthChange((user) => {
        if (user) {
          const role = user.role || null;
          const permissions = user.permissions || [];

          actions.setRole?.(role);
          actions.setPermissions?.(permissions);
        } else {
          actions.resetState?.();
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [authAdapter, actions]);

  // Update visible items based on permissions
  useEffect(() => {
    const updateVisibleItems = async () => {
      if (state.userPermissions.length === 0) return;

      try {
        const result = resolveNavigationForUser(navigationId, state.userPermissions, {
          enableCaching: true,
          cacheTTL: 300000,
        });

        if (result.success && result.data) {
          const items = result.data as SSOTNavigationItem[];
          // Sort items by order
          items.sort((a, b) => a.order - b.order);
          // Note: This would dispatch SET_VISIBLE_ITEMS if we had that action
          // For now, we'll handle this in the hooks
        }
      } catch (error) {
        console.error('Failed to update visible items:', error);
      }
    };

    updateVisibleItems();
  }, [navigationId, state.userPermissions]);

  return <>{children}</>;
}

// ============================================================================
// AUTH ADAPTER INTERFACE
// ============================================================================

export interface AuthAdapter {
  getRole: () => string | null;
  getPermissions: () => string[];
  onAuthChange?: (callback: (user: any) => void) => () => void;
}

// ============================================================================
// DEFAULT AUTH ADAPTER
// ============================================================================

export const defaultAuthAdapter: AuthAdapter = {
  getRole: () => {
    // Default implementation - should be overridden
    if (typeof window !== 'undefined') {
      const user = (window as any).user;
      return user?.role || null;
    }
    return null;
  },

  getPermissions: () => {
    // Default implementation - should be overridden
    if (typeof window !== 'undefined') {
      const user = (window as any).user;
      return user?.permissions || [];
    }
    return [];
  },

  onAuthChange: () => {
    // Default implementation - no auth change listener
    return () => {};
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function resolveNavigation(
  _navigationId: string,
  _config: { enableCaching: boolean; cacheTTL: number }
) {
  // This would call the SSOT integration layer
  // For now, return a mock result
  return {
    success: true,
    data: {
      permissions: [],
    },
  };
}
