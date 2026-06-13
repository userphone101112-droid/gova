# Phase 1 File Tree Structure

> **Phase**: Navigation Foundation  
> **Date**: 2026-06-13  
> **Status**: Complete

## Complete File Structure

```
src/
├── types/
│   └── marketplace/
│       └── navigation.types.ts
├── context/
│   └── NavigationContext.tsx
├── lib/
│   └── marketplace/
│       ├── ssot-integration.ts
│       ├── route-resolution.ts
│       └── permission-resolution.ts
├── components/
│   └── marketplace/
│       └── providers/
│           └── MarketplaceNavigationProvider.tsx
├── hooks/
│   └── marketplace/
│       ├── useNavbar.ts
│       └── useRoleBasedNavigation.ts
└── app/
    └── layout-integration.ts
```

## File Descriptions

### Types Layer
- **`src/types/marketplace/navigation.types.ts`**
  - TypeScript type definitions for navigation system
  - Navigation state, actions, context types
  - SSOT integration types
  - Permission and route resolution types
  - Configuration schemas

### Context Layer
- **`src/context/NavigationContext.tsx`**
  - React Context for navigation state management
  - Navigation reducer for state updates
  - Provider component for context distribution
  - Selector hooks for accessing context state

### Library Layer
- **`src/lib/marketplace/ssot-integration.ts`**
  - Integration layer for SSOT packages
  - Caching mechanism for SSOT data
  - Navigation, route, permission, feature resolution functions
  - Validation functions for SSOT consistency

- **`src/lib/marketplace/route-resolution.ts`**
  - Route resolution service
  - Route building utilities
  - Parameter extraction and validation
  - Route matching logic

- **`src/lib/marketplace/permission-resolution.ts`**
  - Permission resolution service
  - Role-based permission checking
  - Navigation item visibility logic
  - Permission helper functions

### Components Layer
- **`src/components/marketplace/providers/MarketplaceNavigationProvider.tsx`**
  - Main provider for marketplace navigation
  - Auth adapter integration
  - Navigation initialization from SSOT
  - State synchronization with auth changes

### Hooks Layer
- **`src/hooks/marketplace/useNavbar.ts`**
  - Main navigation hook
  - Navigation item filtering
  - Active route management
  - Visibility checking utilities

- **`src/hooks/marketplace/useRoleBasedNavigation.ts`**
  - Role-specific navigation hook
  - Permission-based navigation filtering
  - Category-based navigation grouping
  - Access control utilities

### Integration Layer
- **`src/app/layout-integration.ts`**
  - Root layout integration points
  - Auth adapter implementations (NextAuth, Clerk, Custom)
  - Server-side integration helpers
  - Middleware integration helpers

## Dependencies

### Internal Dependencies
- `@gv/navigation-ssot` - Navigation SSOT package
- `@gv/routes-ssot` - Routes SSOT package
- `@gv/permissions-ssot` - Permissions SSOT package
- `@gv/features-ssot` - Features SSOT package

### External Dependencies
- `react` - React library
- `next` - Next.js framework (for App Router integration)

## Module Resolution

The implementation uses relative imports to access SSOT packages in the monorepo structure:

```typescript
import { getNavigation } from '../../../packages/navigation-ssot/index';
import { getRoute } from '../../../packages/routes-ssot/index';
import { getRolePermissions } from '../../../packages/permissions-ssot/index';
import { getFeature } from '../../../packages/features-ssot/index';
```

**Note**: Once the monorepo workspace is properly configured with package linking, these can be replaced with package name imports:

```typescript
import { getNavigation } from '@gv/navigation-ssot';
import { getRoute } from '@gv/routes-ssot';
import { getRolePermissions } from '@gv/permissions-ssot';
import { getFeature } from '@gv/features-ssot';
```

## Export Structure

Each module exports its public API:

### Types
```typescript
export type {
  NavbarConfig,
  NavigationState,
  NavigationAction,
  NavigationContextValue,
  SSOTNavigationItem,
  UserRole,
  // ... other types
};
export { DEFAULT_NAVBAR_CONFIG };
```

### Context
```typescript
export { NavigationProvider };
export {
  useNavigationContext,
  useNavigationState,
  useNavigationActions,
  useUserRole,
  useUserPermissions,
  // ... other selectors
};
```

### Library
```typescript
export {
  resolveNavigation,
  resolveNavigationForUser,
  resolveRoute,
  resolvePermission,
  clearSSOTCache,
  validateSSOTIntegrations,
};
export { RouteResolutionService, routeBuilder };
export {
  PermissionResolutionService,
  permissionHelpers,
  ROLE_PERMISSIONS,
};
```

### Components
```typescript
export { MarketplaceNavigationProvider };
export type { AuthAdapter };
export { defaultAuthAdapter };
```

### Hooks
```typescript
export { useNavbar, useNavbarState, useNavbarActions };
export {
  useRoleBasedNavigation,
  useNavigationVisibility,
  useNavigationRoute,
};
```

### Integration
```typescript
export {
  createAuthAdapter,
  getServerSideNavigationConfig,
  getServerSideUserPermissions,
  protectMarketplaceRoute,
};
```

## File Size Summary

| File | Lines | Purpose |
|------|-------|---------|
| navigation.types.ts | ~120 | Type definitions |
| NavigationContext.tsx | ~180 | Context and state management |
| ssot-integration.ts | ~280 | SSOT integration layer |
| route-resolution.ts | ~110 | Route resolution logic |
| permission-resolution.ts | ~160 | Permission resolution logic |
| MarketplaceNavigationProvider.tsx | ~210 | Main provider component |
| useNavbar.ts | ~90 | Navigation hook |
| useRoleBasedNavigation.ts | ~150 | Role-based hook |
| layout-integration.ts | ~190 | Integration points |

**Total**: ~1,490 lines of TypeScript/TSX code
