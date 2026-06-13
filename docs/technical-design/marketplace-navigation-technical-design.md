# Marketplace Navigation System - Technical Design Document

> **Document Version**: 1.0.0  
> **Created**: 2026-06-13  
> **Status**: Design Phase  
> **Gate ID**: GATE-2026-0001  
> **Related Docs**: `docs/modules/marketplace-navigation.md`

---

## Table of Contents

1. [Component Hierarchy](#1-component-hierarchy)
2. [State Management Strategy](#2-state-management-strategy)
3. [Navbar Configuration Schema](#3-navbar-configuration-schema)
4. [Route Visibility Strategy](#4-route-visibility-strategy)
5. [Role Visibility Strategy](#5-role-visibility-strategy)
6. [Badge Update Architecture](#6-badge-update-architecture)
7. [Mobile Navigation Architecture](#7-mobile-navigation-architecture)
8. [Desktop Navigation Architecture](#8-desktop-navigation-architecture)
9. [Provider and Hook Architecture](#9-provider-and-hook-architecture)
10. [Integration Points with App Router](#10-integration-points-with-app-router)
11. [Integration Points with Authentication](#11-integration-points-with-authentication)
12. [Future Extensibility Plan](#12-future-extensibility-plan)

---

## 1. Component Hierarchy

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App Router                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Root Layout                             │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │         MarketplaceNavigationProvider               │ │  │
│  │  │  ┌─────────────────────────────────────────────────┐ │ │  │
│  │  │  │         RoleBasedLayout                        │ │ │  │
│  │  │  │  ┌───────────────┐  ┌───────────────────────┐ │ │ │  │
│  │  │  │  │   Navbar     │  │    Page Content       │ │ │ │  │
│  │  │  │  │  (Sidebar/   │  │                       │ │ │ │  │
│  │  │  │  │   Header)    │  │                       │ │ │ │  │
│  │  │  │  └───────────────┘  └───────────────────────┘ │ │ │  │
│  │  │  └─────────────────────────────────────────────────┘ │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Tree

```
MarketplaceNavigationProvider
├── RoleBasedLayout
│   ├── BuyerLayout
│   │   ├── MarketplaceNavigation (type: 'sidebar')
│   │   │   ├── NavigationContainer
│   │   │   │   ├── NavigationItem (Home)
│   │   │   │   ├── NavigationItem (Cart)
│   │   │   │   │   └── NavigationBadge
│   │   │   │   ├── NavigationItem (Notifications)
│   │   │   │   │   └── NavigationBadge
│   │   │   │   └── NavigationItem (Profile)
│   │   │   └── MobileNavigationToggle
│   │   └── PageContent
│   ├── SellerLayout
│   │   ├── MarketplaceNavigation (type: 'sidebar')
│   │   │   ├── NavigationContainer
│   │   │   │   ├── NavigationItem (Home)
│   │   │   │   ├── NavigationItem (Dashboard)
│   │   │   │   ├── NavigationItem (Notifications)
│   │   │   │   │   └── NavigationBadge
│   │   │   │   └── NavigationItem (Profile)
│   │   │   └── MobileNavigationToggle
│   │   └── PageContent
│   └── AdminLayout
│       ├── MarketplaceNavigation (type: 'sidebar')
│       │   ├── NavigationContainer
│       │   │   ├── NavigationItem (Home)
│       │   │   ├── NavigationItem (Admin)
│       │   │   ├── NavigationItem (Notifications)
│       │   │   │   └── NavigationBadge
│       │   │   └── NavigationItem (Profile)
│       │   └── MobileNavigationToggle
│       └── PageContent
└── NavigationContext
```

### 1.3 File Structure

```
src/
├── components/
│   └── marketplace/
│       ├── navigation/
│       │   ├── MarketplaceNavigation.tsx
│       │   ├── NavigationContainer.tsx
│       │   ├── NavigationItem.tsx
│       │   ├── NavigationBadge.tsx
│       │   ├── MobileNavigationToggle.tsx
│       │   ├── MobileNavigationDrawer.tsx
│       │   └── index.ts
│       ├── layouts/
│       │   ├── RoleBasedLayout.tsx
│       │   ├── BuyerLayout.tsx
│       │   ├── SellerLayout.tsx
│       │   ├── AdminLayout.tsx
│       │   └── index.ts
│       └── providers/
│           ├── MarketplaceNavigationProvider.tsx
│           └── index.ts
├── hooks/
│   └── marketplace/
│       ├── useMarketplaceNavigation.ts
│       ├── useRoleBasedNavigation.ts
│       ├── useNavigationVisibility.ts
│       ├── useBadgeUpdates.ts
│       └── index.ts
├── context/
│   └── NavigationContext.tsx
├── types/
│   └── marketplace/
│       ├── navigation.types.ts
│       ├── layout.types.ts
│       └── index.ts
└── app/
    └── layout.tsx (root layout integration)
```

---

## 2. State Management Strategy

### 2.1 State Architecture

The navigation system uses a hybrid state management approach:

- **Context API**: For global navigation state (user role, permissions, navigation items)
- **React Query**: For badge counts and dynamic data (cart items, notifications)
- **Local State**: For UI state (mobile menu open/closed, active item)

### 2.2 State Schema

```typescript
// NavigationContext State
interface NavigationState {
  userRole: 'buyer' | 'seller' | 'admin' | 'guest' | null;
  userPermissions: string[];
  navigationItems: NavigationItem[];
  badgeCounts: Record<string, number>;
  isMobileMenuOpen: boolean;
  activeRoute: string | null;
}

// Navigation Item (from navigation-ssot)
interface NavigationItem {
  id: string;
  type: 'link' | 'button' | 'dropdown';
  label: string;
  translationKey: string;
  route?: string;
  icon?: string;
  permissions: string[];
  order: number;
  hidden: boolean;
  badge?: string;
}
```

### 2.3 State Flow Diagram

```
┌─────────────────┐
│   Auth Session  │
│  (user, role)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Adapter   │
│  extractRole()  │
│  extractPerms() │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ NavigationContext│
│  (role, perms)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useMarketplace  │
│  Navigation()   │
│  filterItems()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Filtered Items │
│  (visible only) │
└─────────────────┘
```

### 2.4 State Updates

- **Role Change**: Triggered by auth adapter, updates entire navigation state
- **Permission Change**: Re-filters navigation items
- **Badge Update**: React Query refetches, updates specific badge count
- **Route Change**: Updates active route in context

---

## 3. Navbar Configuration Schema

### 3.1 Configuration Interface

```typescript
interface NavbarConfig {
  type: 'sidebar' | 'header' | 'footer';
  mode: 'sticky' | 'fixed' | 'static';
  theme: 'light' | 'dark' | 'dynamic';
  showBadge: boolean;
  badgeRefreshInterval: number; // milliseconds
  mobileBreakpoint: number; // pixels
  collapsible: boolean;
  defaultCollapsed: boolean;
}

interface NavigationItemConfig {
  id: string;
  label: string;
  icon: string;
  route: string;
  permissions: string[];
  order: number;
  badge?: {
    enabled: boolean;
    source: 'cart' | 'notifications' | 'custom';
    queryKey: string;
  };
}
```

### 3.2 Default Configuration

```typescript
const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
  type: 'sidebar',
  mode: 'sticky',
  theme: 'dynamic',
  showBadge: true,
  badgeRefreshInterval: 30000, // 30 seconds
  mobileBreakpoint: 768,
  collapsible: true,
  defaultCollapsed: false,
};
```

### 3.3 Configuration Sources

1. **SSOT**: Base configuration from `@gv/navigation-ssot`
2. **Environment**: Override via environment variables
3. **User Preferences**: Per-user customization (future)
4. **Runtime Props**: Component-level overrides

---

## 4. Route Visibility Strategy

### 4.1 Visibility Logic

A navigation item is visible if:
1. The user has ALL permissions specified in the item's `permissions` array
2. The item is not marked as `hidden`
3. The item's associated feature is enabled (feature flags)

### 4.2 Visibility Algorithm

```typescript
function isItemVisible(
  item: NavigationItem,
  userPermissions: string[],
  featureFlags: Record<string, boolean>
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

  // Check feature flag
  if (item.feature && !featureFlags[item.feature]) {
    return false;
  }

  return true;
}
```

### 4.3 Route Visibility Matrix

| Item | Permissions | Buyer | Seller | Admin | Guest |
|------|-------------|-------|--------|-------|-------|
| Home | `marketplace.read` | ✅ | ✅ | ✅ | ❌ |
| Cart | `cart.read`, `marketplace.read` | ✅ | ✅ | ✅ | ❌ |
| Dashboard | `merchant.write`, `marketplace.read` | ❌ | ✅ | ❌ | ❌ |
| Admin | `admin.read`, `marketplace.read` | ❌ | ❌ | ✅ | ❌ |
| Notifications | `notification.read`, `marketplace.read` | ✅ | ✅ | ✅ | ❌ |
| Profile | `user.read`, `marketplace.read` | ✅ | ✅ | ✅ | ❌ |

### 4.4 Caching Strategy

- **Visibility Cache**: Memoized per user role/permissions combination
- **Cache Key**: `hash(userPermissions + featureFlags)`
- **Cache TTL**: 5 minutes (cleared on auth state change)
- **Invalidation**: On role change, permission change, or feature flag toggle

---

## 5. Role Visibility Strategy

### 5.1 Role-Based Layout Mapping

```typescript
const ROLE_LAYOUT_MAP: Record<string, React.ComponentType> = {
  buyer: BuyerLayout,
  seller: SellerLayout,
  admin: AdminLayout,
  guest: BuyerLayout, // Fallback to buyer layout (limited items)
};
```

### 5.2 Role Detection Flow

```
┌─────────────────┐
│  Auth Session  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Adapter  │
│  getUserRole()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Role Lookup     │
│ permissions-ssot│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Layout Selector │
│ ROLE_LAYOUT_MAP │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Render Layout   │
│  (Buyer/Seller/ │
│   Admin)        │
└─────────────────┘
```

### 5.3 Role Transition Handling

- **Login**: Detect role, switch layout, load navigation items
- **Logout**: Clear navigation state, switch to guest layout
- **Role Change**: Re-render with new layout, re-filter navigation items
- **Permission Change**: Re-filter navigation items without layout change

---

## 6. Badge Update Architecture

### 6.1 Badge Data Sources

```typescript
interface BadgeSource {
  cart: {
    queryKey: ['cart', 'count'];
    queryFn: () => Promise<number>;
    staleTime: 30000; // 30 seconds
  };
  notifications: {
    queryKey: ['notifications', 'unread'];
    queryFn: () => Promise<number>;
    staleTime: 60000; // 1 minute
  };
}
```

### 6.2 Badge Update Flow

```
┌─────────────────┐
│  Navigation    │
│    Item        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useBadgeUpdates │
│   (hook)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Query   │
│  (fetch data)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Badge State   │
│  (context)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ NavigationBadge│
│  (render)      │
└─────────────────┘
```

### 6.3 Real-Time Updates

- **WebSocket**: Subscribe to badge update events
- **Event Types**: `cart.updated`, `notification.received`
- **Update Strategy**: 
  - WebSocket event → Invalidate React Query cache
  - React Query auto-refetches with new data
  - Component re-renders with updated badge

### 6.4 Badge Fallback Strategy

- **API Failure**: Show cached badge count with warning indicator
- **Loading State**: Show skeleton or previous count
- **Zero Count**: Hide badge entirely
- **High Count**: Show "+99" for counts > 99

---

## 7. Mobile Navigation Architecture

### 7.1 Mobile Navigation Pattern

- **Default**: Bottom navigation bar (iOS-style) or hamburger menu
- **Drawer**: Slide-in drawer from left/right
- **Overlay**: Full-screen overlay with backdrop
- **Gesture**: Swipe to open/close drawer

### 7.2 Mobile Component Structure

```
MobileNavigationToggle
├── HamburgerButton
└── BadgeIndicator

MobileNavigationDrawer
├── Backdrop
├── DrawerContainer
│   ├── DrawerHeader
│   │   ├── UserAvatar
│   │   └── RoleBadge
│   ├── NavigationList
│   │   └── NavigationItem (reused)
│   └── DrawerFooter
│       ├── LogoutButton
│       └── SettingsButton
```

### 7.3 Responsive Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: 0,      // 0 - 767px
  tablet: 768,    // 768 - 1023px
  desktop: 1024,  // 1024px+
};

const MOBILE_NAV_BREAKPOINT = 768;
```

### 7.4 Mobile State Management

```typescript
interface MobileNavState {
  isOpen: boolean;
  position: 'left' | 'right' | 'bottom';
  animation: 'slide' | 'fade' | 'scale';
  gestureEnabled: boolean;
}
```

---

## 8. Desktop Navigation Architecture

### 8.1 Desktop Navigation Pattern

- **Sidebar**: Left sidebar with collapsible sections
- **Header**: Top header with user menu and notifications
- **Breadcrumb**: Breadcrumb navigation below header
- **Quick Actions**: Floating action buttons for common tasks

### 8.2 Desktop Component Structure

```
DesktopNavigation
├── Sidebar
│   ├── SidebarHeader
│   │   ├── Logo
│   │   └── CollapseToggle
│   ├── NavigationList
│   │   └── NavigationItem (reused)
│   └── SidebarFooter
│       └── UserMenu
├── Header
│   ├── Breadcrumb
│   ├── QuickActions
│   └── UserDropdown
└── MainContent
    └── PageContent
```

### 8.3 Sidebar Collapse Behavior

- **Default**: Expanded (250px width)
- **Collapsed**: Icon-only (64px width)
- **Hover**: Show tooltips on collapsed items
- **Persistence**: Save collapse state to localStorage
- **Responsive**: Auto-collapse on tablet

### 8.4 Keyboard Navigation

- **Tab**: Navigate between items
- **Enter/Space**: Activate item
- **Escape**: Close drawer/dropdown
- **Arrow Keys**: Navigate within lists
- **Shortcuts**: Alt+K for quick actions

---

## 9. Provider and Hook Architecture

### 9.1 Provider Hierarchy

```
App Router
└── MarketplaceNavigationProvider
    ├── NavigationContext
    │   ├── NavigationState
    │   └── NavigationDispatch
    └── Children
        ├── RoleBasedLayout
        └── Page Components
```

### 9.2 Context Schema

```typescript
interface NavigationContextValue {
  state: NavigationState;
  dispatch: React.Dispatch<NavigationAction>;
  actions: {
    setRole: (role: string) => void;
    setPermissions: (perms: string[]) => void;
    toggleMobileMenu: () => void;
    setActiveRoute: (route: string) => void;
    updateBadge: (itemId: string, count: number) => void;
  };
}
```

### 9.3 Hook Architecture

```typescript
// Primary hooks
useMarketplaceNavigation()     // Main navigation hook
useRoleBasedNavigation()       // Role-specific navigation
useNavigationVisibility()      // Visibility logic
useBadgeUpdates()              // Badge data fetching

// Utility hooks
useNavigationState()           // Access navigation context
useNavigationActions()         // Access navigation actions
useMobileNavigation()          // Mobile-specific logic
useKeyboardNavigation()        // Keyboard shortcuts
```

### 9.4 Hook Dependencies

```
useMarketplaceNavigation
├── useNavigationState (context)
├── useRoleBasedNavigation
│   ├── getNavigation() (navigation-ssot)
│   ├── getRolePermissions() (permissions-ssot)
│   └── isItemVisible() (utility)
└── useBadgeUpdates
    ├── useQuery (React Query)
    └── useWebSocket (real-time)
```

---

## 10. Integration Points with App Router

### 10.1 Root Layout Integration

```typescript
// src/app/layout.tsx
import { MarketplaceNavigationProvider } from '@/components/marketplace/providers';
import { RoleBasedLayout } from '@/components/marketplace/layouts';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MarketplaceNavigationProvider>
          <RoleBasedLayout>
            {children}
          </RoleBasedLayout>
        </MarketplaceNavigationProvider>
      </body>
    </html>
  );
}
```

### 10.2 Route-Based Navigation

- **Route Changes**: Update `activeRoute` in navigation context
- **Route Guards**: Check permissions before navigation
- **Route Parameters**: Handle dynamic routes (e.g., `/products/[id]`)
- **Route Transitions**: Animate navigation changes

### 10.3 Middleware Integration

```typescript
// src/middleware.ts
import { authAdapter } from '@/adapters/auth.adapter';

export function middleware(request: NextRequest) {
  const user = authAdapter.getSession(request);
  
  // Protect marketplace routes
  if (request.nextUrl.pathname.startsWith('/seller/dashboard')) {
    if (!user?.permissions.includes('merchant.write')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### 10.4 Server Component Integration

- **Server Components**: Access navigation data via server-side helpers
- **Client Components**: Use context and hooks for navigation state
- **Hybrid**: Server renders initial state, client hydrates interactivity

---

## 11. Integration Points with Authentication

### 11.1 Auth Adapter Integration

```typescript
// src/adapters/auth.adapter.ts
import { getRolePermissions } from '@gv/permissions-ssot';

export const authAdapter = {
  getSession: (request: NextRequest) => {
    // Extract session from cookie/token
    return session;
  },
  
  getUserRole: (session: Session) => {
    return session.user.role;
  },
  
  getUserPermissions: (session: Session) => {
    const role = session.user.role;
    return getRolePermissions(role);
  },
  
  onAuthChange: (callback: (user: User | null) => void) => {
    // Subscribe to auth state changes
  },
};
```

### 11.2 Auth State Synchronization

```
Auth Provider (NextAuth/Clerk)
         │
         ▼
Auth Adapter
         │
         ▼
Navigation Context
         │
         ▼
Navigation Provider
         │
         ▼
Role-Based Layout
```

### 11.3 Protected Route Handling

- **Client-Side**: Check permissions before rendering navigation items
- **Server-Side**: Middleware checks before route access
- **Fallback**: Redirect to unauthorized page or login

### 11.4 Session Management

- **Login**: Initialize navigation context with user role/permissions
- **Logout**: Clear navigation state, switch to guest layout
- **Session Refresh**: Re-validate permissions on session renewal
- **Token Expiry**: Handle token refresh without navigation disruption

---

## 12. Future Extensibility Plan

### 12.1 Planned Enhancements

#### Phase 2: Customization
- **User Customization**: Allow users to customize navigation order
- **Theme Customization**: Per-user theme preferences
- **Layout Customization**: Choose between sidebar/header/footer layouts
- **Shortcut Customization**: User-defined keyboard shortcuts

#### Phase 3: Advanced Features
- **Nested Navigation**: Support for nested dropdowns and sections
- **Search Navigation**: Command palette for quick navigation
- **Recent Items**: Track and show recently accessed items
- **Favorites**: Allow users to favorite navigation items

#### Phase 4: Analytics & Optimization
- **Navigation Analytics**: Track navigation usage patterns
- **Performance Monitoring**: Monitor navigation render performance
- **A/B Testing**: Test different navigation layouts
- **Personalization**: ML-based navigation recommendations

### 12.2 Extension Points

```typescript
// Plugin system for navigation extensions
interface NavigationPlugin {
  id: string;
  name: string;
  version: string;
  
  // Lifecycle hooks
  onInit?: (context: NavigationContext) => void;
  onItemRender?: (item: NavigationItem) => NavigationItem;
  onRouteChange?: (route: string) => void;
  
  // Custom components
  customItems?: NavigationItem[];
  customLayouts?: Record<string, React.ComponentType>;
  
  // Data sources
  badgeSources?: Record<string, BadgeSource>;
}
```

### 12.3 API Extension Points

- **Navigation API**: REST API for navigation configuration
- **Webhook API**: Webhooks for navigation state changes
- **GraphQL API**: GraphQL queries for navigation data
- **Event Bus**: Event system for navigation events

### 12.4 Integration Roadmap

| Timeline | Feature | Priority |
|----------|---------|----------|
| Q3 2026 | User Customization | Medium |
| Q3 2026 | Search Navigation | High |
| Q4 2026 | Nested Navigation | Medium |
| Q4 2026 | Navigation Analytics | Low |
| Q1 2027 | Plugin System | High |
| Q1 2027 | ML Recommendations | Low |

---

## Appendix A: Component Props Reference

### MarketplaceNavigation

```typescript
interface MarketplaceNavigationProps {
  config?: Partial<NavbarConfig>;
  className?: string;
  onItemClick?: (item: NavigationItem) => void;
  onBadgeClick?: (item: NavigationItem) => void;
}
```

### NavigationItem

```typescript
interface NavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  onClick?: () => void;
  showBadge?: boolean;
}
```

### NavigationBadge

```typescript
interface NavigationBadgeProps {
  count: number;
  max?: number;
  variant?: 'default' | 'error' | 'warning';
}
```

---

## Appendix B: Event Schema

### Navigation Events

```typescript
type NavigationEvent =
  | { type: 'NAVIGATION_ITEM_CLICK'; payload: { itemId: string } }
  | { type: 'NAVIGATION_BADGE_CLICK'; payload: { itemId: string } }
  | { type: 'NAVIGATION_ROUTE_CHANGE'; payload: { route: string } }
  | { type: 'NAVIGATION_MOBILE_TOGGLE'; payload: { isOpen: boolean } }
  | { type: 'NAVIGATION_ROLE_CHANGE'; payload: { role: string } }
  | { type: 'NAVIGATION_PERMISSION_CHANGE'; payload: { permissions: string[] } };
```

---

## Appendix C: Performance Considerations

### 10.1 Optimization Strategies

- **Memoization**: Memoize navigation items and visibility calculations
- **Virtual Scrolling**: For long navigation lists
- **Code Splitting**: Lazy load navigation components
- **Image Optimization**: Optimize icon assets
- **Bundle Size**: Minimize navigation bundle size

### 10.2 Performance Metrics

- **First Paint**: < 1.5s
- **Interactive**: < 3s
- **Navigation Switch**: < 100ms
- **Badge Update**: < 500ms

---

**Document End**
