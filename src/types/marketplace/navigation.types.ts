// Marketplace Navigation Types
// Phase 1: Navigation Foundation

// Note: SSOT imports will be resolved once packages are properly configured
// For now, we define the types inline to avoid module resolution issues

export interface SSOTNavigationItem {
  id: string;
  type: 'link' | 'button' | 'dropdown' | 'divider' | 'header';
  label: string;
  translationKey: string;
  route?: string;
  href?: string;
  icon?: string;
  permissions: string[];
  feature?: string;
  children: SSOTNavigationItem[];
  order: number;
  hidden: boolean;
  badge?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// NAVIGATION CONFIGURATION
// ============================================================================

export interface NavbarConfig {
  type: 'sidebar' | 'header' | 'footer';
  mode: 'sticky' | 'fixed' | 'static';
  theme: 'light' | 'dark' | 'dynamic';
  showBadge: boolean;
  badgeRefreshInterval: number;
  mobileBreakpoint: number;
  collapsible: boolean;
  defaultCollapsed: boolean;
}

export const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
  type: 'sidebar',
  mode: 'sticky',
  theme: 'dynamic',
  showBadge: true,
  badgeRefreshInterval: 30000,
  mobileBreakpoint: 768,
  collapsible: true,
  defaultCollapsed: false,
};

// ============================================================================
// NAVIGATION STATE
// ============================================================================

export interface NavigationState {
  userRole: 'buyer' | 'seller' | 'admin' | 'guest' | null;
  userPermissions: string[];
  navigationItems: SSOTNavigationItem[];
  visibleItems: SSOTNavigationItem[];
  activeRoute: string | null;
  config: NavbarConfig;
}

// ============================================================================
// NAVIGATION ACTIONS
// ============================================================================

export type NavigationAction =
  | { type: 'SET_ROLE'; payload: string }
  | { type: 'SET_PERMISSIONS'; payload: string[] }
  | { type: 'SET_NAVIGATION_ITEMS'; payload: SSOTNavigationItem[] }
  | { type: 'SET_VISIBLE_ITEMS'; payload: SSOTNavigationItem[] }
  | { type: 'SET_ACTIVE_ROUTE'; payload: string | null }
  | { type: 'UPDATE_CONFIG'; payload: Partial<NavbarConfig> }
  | { type: 'RESET_STATE' };

// ============================================================================
// NAVIGATION CONTEXT
// ============================================================================

export interface NavigationContextValue {
  state: NavigationState;
  dispatch: React.Dispatch<NavigationAction>;
  actions: {
    setRole: (role: string) => void;
    setPermissions: (permissions: string[]) => void;
    setActiveRoute: (route: string | null) => void;
    updateConfig: (config: Partial<NavbarConfig>) => void;
    resetState: () => void;
  };
}

// ============================================================================
// RESOLUTION LAYERS
// ============================================================================

export interface RouteResolutionResult {
  routeId: string;
  path: string;
  exists: boolean;
}

export interface PermissionResolutionResult {
  permissionId: string;
  exists: boolean;
  granted: boolean;
}

export interface NavigationResolutionResult {
  navigationId: string;
  exists: boolean;
  items: SSOTNavigationItem[];
}

// ============================================================================
// SSOT INTEGRATION
// ============================================================================

export interface SSOTIntegrationConfig {
  enableCaching: boolean;
  cacheTTL: number;
}

export interface SSOTIntegrationResult {
  success: boolean;
  data?: any;
  error?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type UserRole = 'buyer' | 'seller' | 'admin' | 'guest';

export type NavigationItemType = SSOTNavigationItem['type'];

export type NavigationVisibility = 'visible' | 'hidden' | 'disabled';
