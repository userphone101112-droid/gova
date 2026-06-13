// Navigation Context
// Phase 1: Navigation Foundation

'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  NavigationState,
  NavigationAction,
  NavigationContextValue,
  NavbarConfig,
  SSOTNavigationItem,
} from '@/types/marketplace/navigation.types';
import { DEFAULT_NAVBAR_CONFIG } from '@/types/marketplace/navigation.types';

// ============================================================================
// NAVIGATION REDUCER
// ============================================================================

function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        userRole: action.payload as any,
      };

    case 'SET_PERMISSIONS':
      return {
        ...state,
        userPermissions: action.payload,
      };

    case 'SET_NAVIGATION_ITEMS':
      return {
        ...state,
        navigationItems: action.payload,
      };

    case 'SET_VISIBLE_ITEMS':
      return {
        ...state,
        visibleItems: action.payload,
      };

    case 'SET_ACTIVE_ROUTE':
      return {
        ...state,
        activeRoute: action.payload,
      };

    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
        },
      };

    case 'RESET_STATE':
      return {
        userRole: null,
        userPermissions: [],
        navigationItems: [],
        visibleItems: [],
        activeRoute: null,
        config: DEFAULT_NAVBAR_CONFIG,
      };

    default:
      return state;
  }
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialState = (config?: Partial<NavbarConfig>): NavigationState => ({
  userRole: null,
  userPermissions: [],
  navigationItems: [],
  visibleItems: [],
  activeRoute: null,
  config: {
    ...DEFAULT_NAVBAR_CONFIG,
    ...config,
  },
});

// ============================================================================
// NAVIGATION CONTEXT
// ============================================================================

const NavigationContext = createContext<NavigationContextValue | null>(null);

// ============================================================================
// NAVIGATION PROVIDER
// ============================================================================

interface NavigationProviderProps {
  children: React.ReactNode;
  config?: Partial<NavbarConfig>;
  initialRole?: string | null;
  initialPermissions?: string[];
}

export function NavigationProvider({
  children,
  config,
  initialRole = null,
  initialPermissions = [],
}: NavigationProviderProps) {
  const [state, dispatch] = useReducer(
    navigationReducer,
    createInitialState(config)
  );

  // Initialize with provided values
  React.useEffect(() => {
    if (initialRole) {
      dispatch({ type: 'SET_ROLE', payload: initialRole });
    }
    if (initialPermissions.length > 0) {
      dispatch({ type: 'SET_PERMISSIONS', payload: initialPermissions });
    }
  }, [initialRole, initialPermissions]);

  // Actions
  const setRole = useCallback((role: string) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  }, []);

  const setPermissions = useCallback((permissions: string[]) => {
    dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
  }, []);

  const setActiveRoute = useCallback((route: string | null) => {
    dispatch({ type: 'SET_ACTIVE_ROUTE', payload: route });
  }, []);

  const updateConfig = useCallback((newConfig: Partial<NavbarConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: newConfig });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const actions: NavigationContextValue['actions'] = {
    setRole,
    setPermissions,
    setActiveRoute,
    updateConfig,
    resetState,
  };

  const contextValue: NavigationContextValue = {
    state,
    dispatch,
    actions,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

// ============================================================================
// USE NAVIGATION CONTEXT HOOK
// ============================================================================

export function useNavigationContext(): NavigationContextValue {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }

  return context;
}

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

export function useNavigationState(): NavigationState {
  const { state } = useNavigationContext();
  return state;
}

export function useNavigationActions() {
  const { actions } = useNavigationContext();
  return actions;
}

export function useUserRole(): string | null {
  const { state } = useNavigationContext();
  return state.userRole;
}

export function useUserPermissions(): string[] {
  const { state } = useNavigationContext();
  return state.userPermissions;
}

export function useNavigationItems(): SSOTNavigationItem[] {
  const { state } = useNavigationContext();
  return state.navigationItems;
}

export function useVisibleItems(): SSOTNavigationItem[] {
  const { state } = useNavigationContext();
  return state.visibleItems;
}

export function useActiveRoute(): string | null {
  const { state } = useNavigationContext();
  return state.activeRoute;
}

export function useNavbarConfig(): NavbarConfig {
  const { state } = useNavigationContext();
  return state.config;
}
