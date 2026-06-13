# Auth Integration Plan for Navigation System

> **Date**: 2026-06-13  
> **Status**: ✅ PLAN READY  
> **Version**: 1.0.0

## Executive Summary

This document defines the authentication integration plan for the Marketplace Navigation System. The current authentication architecture uses a custom JWT-based system with Zustand state management. This plan defines how to integrate this authentication system with the navigation foundation implemented in Phase 1.

## 1. Current Authentication Architecture

### 1.1 Authentication Provider

**Provider**: Custom JWT-based Authentication

**Components**:
- **JWT Service**: `apps/api/src/infrastructure/auth/jwt.service.ts`
  - Generates and verifies JWT tokens
  - Token expiration: 24 hours
  - Algorithm: HS256
  
- **Password Hasher**: `apps/api/src/infrastructure/auth/password-hasher.ts`
  - Uses bcrypt with 10 salt rounds
  - Async operations for security
  
- **Auth Store**: `src/store/slices/auth.slice.ts`
  - Zustand store with persistence
  - Manages: `isAuthenticated`, `user`, `token`, `isLoading`, `error`
  
- **Auth Adapter Interface**: `src/adapters/auth.adapter.ts`
  - Interface: `IAuthAdapter`
  - Implementations: `FirebaseAuthAdapter` (placeholder), `CustomAuthAdapter` (placeholder)

### 1.2 Current Auth State Structure

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  // Note: Role field not currently present
}
```

### 1.3 Authorization Status

**Current Status**: Basic authentication only

**Missing**:
- Role-based access control (RBAC)
- Permission system integration
- User role assignment
- Permission resolution

**Available**: `@gv/auth` package with role/permission definitions (not integrated)

```typescript
// @gv/auth package
type UserRole = 'ADMIN' | 'MERCHANT' | 'CUSTOMER' | 'MODERATOR';

type UserPermission =
  | 'products.create'
  | 'products.update'
  | 'products.delete'
  | 'products.view'
  | 'orders.manage'
  | 'orders.view'
  | 'merchants.manage'
  | 'users.manage';

const rolePermissions: Record<UserRole, UserPermission[]> = {
  ADMIN: ['products.create', 'products.update', 'products.delete', ...],
  MODERATOR: ['products.view', 'products.delete', ...],
  MERCHANT: ['products.create', 'products.update', ...],
  CUSTOMER: ['products.view', 'orders.view'],
};
```

## 2. Navigation Auth Adapter Implementation

### 2.1 Auth Adapter Interface (from MarketplaceNavigationProvider)

```typescript
export interface AuthAdapter {
  getRole: () => string | null;
  getPermissions: () => string[];
  onAuthChange?: (callback: (user: any) => void) => () => void;
}
```

### 2.2 Custom Auth Adapter Implementation

**Location**: `src/app/layout-integration.ts`

**Implementation**:

```typescript
import { useAuthStore } from '@/store/slices/auth.slice';
import { rolePermissions, hasPermission, type UserRole } from '@gv/auth';
import { resolveRolePermissions } from '@/lib/marketplace/ssot-integration';

export function createCustomAuthAdapter(): AuthAdapter {
  return {
    getRole: () => {
      const user = useAuthStore.getState().user;
      return user?.role || null;
    },

    getPermissions: () => {
      const user = useAuthStore.getState().user;
      if (!user?.role) return [];

      // Use permissions-ssot for permission resolution
      return resolveRolePermissions(user.role.toLowerCase());
    },

    onAuthChange: (callback) => {
      // Subscribe to Zustand store changes
      const unsubscribe = useAuthStore.subscribe(
        (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        (state, previousState) => {
          const userChanged = state.user !== previousState.user;
          const authChanged = state.isAuthenticated !== previousState.isAuthenticated;

          if (userChanged || authChanged) {
            callback({
              user: state.user,
              isAuthenticated: state.isAuthenticated,
            });
          }
        }
      );

      return unsubscribe;
    },
  };
}
```

### 2.3 User Type Extension

**Required Changes**:

```typescript
// src/store/types.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole; // Add role field
  permissions?: UserPermission[]; // Optional: cache permissions
}
```

## 3. Role Resolution Flow

### 3.1 Role Resolution Architecture

```
User Login
    ↓
JWT Token Generated (includes userId)
    ↓
Token Verified
    ↓
User Data Fetched from API
    ↓
Role Retrieved from User Entity
    ↓
Role Stored in Auth Store
    ↓
Navigation Auth Adapter Reads Role
    ↓
Role Used for Permission Resolution
```

### 3.2 Role Resolution Implementation

**Server-Side** (API):

```typescript
// apps/api/src/infrastructure/auth/user.service.ts
async function getUserWithRole(userId: string): Promise<UserWithRole> {
  const user = await userRepository.findById(userId);
  
  // Fetch user role from database
  const userRole = await userRoleRepository.findByUserId(userId);
  
  return {
    ...user,
    role: userRole.role,
  };
}
```

**Client-Side** (Auth Store):

```typescript
// src/store/slices/auth.slice.ts
interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUserRole: (role: UserRole) => void; // Add this action
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ... existing state
      setUserRole: (role) => set({ user: { ...state.user, role } }),
    }),
    // ... persist config
  )
);
```

**API Integration**:

```typescript
// src/lib/api-client.ts
async function login(email: string, password: string) {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  
  // Store user with role
  useAuthStore.getState().login(data.user, data.token);
}
```

### 3.3 Role Mapping

**Current @gv/auth Roles** → **Navigation Roles**:

| @gv/auth Role | Navigation Role | Notes |
|---------------|-----------------|-------|
| ADMIN | admin | Full system access |
| MERCHANT | seller | Product/order management |
| CUSTOMER | buyer | View and purchase products |
| MODERATOR | admin | Content moderation |

**Mapping Function**:

```typescript
function mapAuthRoleToNavigationRole(authRole: UserRole): string {
  const roleMap: Record<UserRole, string> = {
    ADMIN: 'admin',
    MERCHANT: 'seller',
    CUSTOMER: 'buyer',
    MODERATOR: 'admin',
  };
  return roleMap[authRole] || 'guest';
}
```

## 4. Permission Resolution Flow

### 4.1 Permission Resolution Architecture

```
User Role Retrieved
    ↓
Role Mapped to Navigation Role
    ↓
Permissions Fetched from permissions-ssot
    ↓
Permissions Stored in Auth Store (optional cache)
    ↓
Navigation Auth Adapter Returns Permissions
    ↓
Navigation Context Updates with Permissions
    ↓
Navigation Items Filtered by Permissions
```

### 4.2 Permission Resolution Implementation

**Primary Resolution** (via permissions-ssot):

```typescript
// src/lib/marketplace/ssot-integration.ts
export function resolveRolePermissions(roleId: string): string[] {
  const rolePermissions = getRolePermissions(roleId);
  return rolePermissions.permissions || [];
}
```

**Secondary Resolution** (via @gv/auth - fallback):

```typescript
// src/lib/marketplace/permission-resolution.ts
import { rolePermissions as authRolePermissions } from '@gv/auth';

export function getPermissionsFromAuth(role: UserRole): string[] {
  return authRolePermissions[role] || [];
}
```

**Permission Mapping**:

| @gv/auth Permission | permissions-ssot Permission | Notes |
|---------------------|----------------------------|-------|
| products.create | product.write | Create products |
| products.update | product.write | Update products |
| products.delete | product.delete | Delete products |
| products.view | product.read | View products |
| orders.manage | order.write | Manage orders |
| orders.view | order.read | View orders |
| merchants.manage | merchant.write | Manage merchants |
| users.manage | admin.write | Manage users |

**Mapping Function**:

```typescript
function mapAuthPermissionToSSOTPermission(authPermission: UserPermission): string {
  const permissionMap: Record<UserPermission, string> = {
    'products.create': 'product.write',
    'products.update': 'product.write',
    'products.delete': 'product.delete',
    'products.view': 'product.read',
    'orders.manage': 'order.write',
    'orders.view': 'order.read',
    'merchants.manage': 'merchant.write',
    'users.manage': 'admin.write',
  };
  return permissionMap[authPermission] || authPermission;
}

export function resolvePermissions(role: UserRole): string[] {
  const authPermissions = authRolePermissions[role] || [];
  return authPermissions.map(mapAuthPermissionToSSOTPermission);
}
```

### 4.3 Permission Caching

**Optional Client-Side Cache**:

```typescript
// src/store/slices/auth.slice.ts
interface AuthState {
  // ... existing fields
  permissions: string[]; // Add permission cache
  permissionsLoaded: boolean;
}

interface AuthActions {
  // ... existing actions
  loadPermissions: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      permissions: [],
      permissionsLoaded: false,
      
      loadPermissions: async () => {
        const user = useAuthStore.getState().user;
        if (!user?.role) return;

        const permissions = resolvePermissions(user.role);
        set({ permissions, permissionsLoaded: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        permissions: state.permissions,
      }),
    }
  )
);
```

## 5. Session Lifecycle Integration

### 5.1 Session Lifecycle Flow

```
User Logs In
    ↓
JWT Token Generated
    ↓
Token Stored in Auth Store
    ↓
User Data Fetched (including role)
    ↓
Role Stored in Auth Store
    ↓
Permissions Resolved
    ↓
Navigation Auth Adapter Notified
    ↓
Navigation Context Updated
    ↓
Navigation Items Rendered Based on Permissions
```

```
User Logs Out
    ↓
Token Cleared from Auth Store
    ↓
User Data Cleared
    ↓
Role Cleared
    ↓
Permissions Cleared
    ↓
Navigation Auth Adapter Notified
    ↓
Navigation Context Reset
    ↓
Navigation Items Rendered as Guest
```

### 5.2 Session Initialization

**Root Layout Integration**:

```typescript
// src/app/layout.tsx
'use client';

import { MarketplaceNavigationProvider } from '@/components/marketplace/providers/MarketplaceNavigationProvider';
import { createCustomAuthAdapter } from '@/app/layout-integration';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/slices/auth.slice';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loadPermissions } = useAuthStore();

  // Load permissions on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      loadPermissions();
    }
  }, [isAuthenticated, user, loadPermissions]);

  const authAdapter = createCustomAuthAdapter();

  return (
    <MarketplaceNavigationProvider
      navigationId="marketplace"
      config={{ type: 'sidebar', mode: 'sticky', theme: 'dynamic' }}
      authAdapter={authAdapter}
    >
      {children}
    </MarketplaceNavigationProvider>
  );
}
```

### 5.3 Session Refresh

**Token Refresh Flow**:

```typescript
// src/lib/api-client.ts
async function refreshToken() {
  const currentToken = useAuthStore.getState().token;
  
  const response = await fetch('/api/users/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${currentToken}`,
    },
  });

  const data = await response.json();
  
  // Update token in store
  useAuthStore.getState().login(data.user, data.newToken);
  
  // Reload permissions (role might have changed)
  if (data.user.role) {
    useAuthStore.getState().loadPermissions();
  }
}
```

**Auto-Refresh on 401**:

```typescript
// src/lib/api-client.ts
const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshToken();
        // Retry original request
        return apiClient.request(error.config);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## 6. SSR and Client Integration Points

### 6.1 Server-Side Rendering (SSR)

**Server-Side Auth Check**:

```typescript
// src/app/layout-integration.ts
export async function getServerSideUserPermissions(userId: string): Promise<string[]> {
  // Verify JWT token on server
  const user = await verifyTokenOnServer(userId);
  
  if (!user?.role) return [];
  
  // Resolve permissions from permissions-ssot
  return resolveRolePermissions(user.role.toLowerCase());
}

export async function getServerSideUserRole(userId: string): Promise<string | null> {
  const user = await verifyTokenOnServer(userId);
  return user?.role || null;
}
```

**Middleware Integration**:

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSideUserRole, getServerSideUserPermissions } from '@/app/layout-integration';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const userId = verifyToken(token);
    const role = await getServerSideUserRole(userId);
    const permissions = await getServerSideUserPermissions(userId);
    
    // Store in headers for server components
    const response = NextResponse.next();
    response.headers.set('x-user-role', role || '');
    response.headers.set('x-user-permissions', permissions.join(','));
    
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/marketplace/:path*', '/seller/:path*', '/admin/:path*'],
};
```

### 6.2 Client-Side Integration

**Client-Side Auth Hook**:

```typescript
// src/hooks/useAuth.ts
import { useAuthStore } from '@/store/slices/auth.slice';

export function useAuth() {
  const { isAuthenticated, user, token, isLoading, error, permissions } = useAuthStore();

  return {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    permissions,
    hasPermission: (permission: string) => permissions.includes(permission),
    hasRole: (role: string) => user?.role === role,
  };
}
```

**Navigation Auth Hook**:

```typescript
// src/hooks/marketplace/useNavigationAuth.ts
import { useAuth } from '@/hooks/useAuth';
import { useNavigationContext } from '@/context/NavigationContext';

export function useNavigationAuth() {
  const { user, permissions, hasPermission, hasRole } = useAuth();
  const { state } = useNavigationContext();

  return {
    user,
    permissions,
    hasPermission,
    hasRole,
    canAccessNavigation: (navigationId: string) => {
      // Check if user has required permissions for navigation
      const navigation = state.visibleItems.find(item => item.id === navigationId);
      if (!navigation) return false;
      
      return navigation.permissions.every(perm => hasPermission(perm));
    },
  };
}
```

### 6.3 Hybrid SSR/Client Pattern

**Server Component with Client Auth**:

```typescript
// src/app/marketplace/page.tsx
import { MarketplaceNavigationProvider } from '@/components/marketplace/providers/MarketplaceNavigationProvider';
import { createCustomAuthAdapter } from '@/app/layout-integration';
import { NavigationClient } from './NavigationClient';

export default function MarketplacePage() {
  // Server-side: Get initial auth state
  const token = cookies().get('token')?.value;
  const user = token ? await getUserFromToken(token) : null;
  const role = user?.role || null;
  const permissions = role ? await getServerSideUserPermissions(user.id) : [];

  return (
    <MarketplaceNavigationProvider
      navigationId="marketplace"
      authAdapter={createCustomAuthAdapter()}
      initialAuthState={{ user, role, permissions }}
    >
      <NavigationClient />
    </MarketplaceNavigationProvider>
  );
}
```

**Client Component**:

```typescript
// src/app/marketplace/NavigationClient.tsx
'use client';

import { useNavigationAuth } from '@/hooks/marketplace/useNavigationAuth';
import { useRoleBasedNavigation } from '@/hooks/marketplace/useRoleBasedNavigation';

export function NavigationClient() {
  const { user, permissions } = useNavigationAuth();
  const { navigationItems, canAccess } = useRoleBasedNavigation();

  return (
    <div>
      {navigationItems.map(item => (
        <div key={item.id}>
          {canAccess(item.id) && <NavigationItem item={item} />}
        </div>
      ))}
    </div>
  );
}
```

## 7. Implementation Plan

### 7.1 Phase 1: Backend Role Integration

**Tasks**:
1. Add `role` field to User entity in database
2. Create user_roles table for role assignment
3. Update login endpoint to return user role
4. Update JWT payload to include role
5. Implement role assignment API endpoint

**Files**:
- `apps/api/src/domain/user.entity.ts`
- `apps/api/src/infrastructure/database/schema.ts`
- `apps/api/src/interfaces/http/controllers/user.controller.ts`
- `apps/api/src/infrastructure/auth/jwt.service.ts`

**Estimated Time**: 4-6 hours

### 7.2 Phase 2: Client-Side Auth Integration

**Tasks**:
1. Update User type to include role field
2. Update Auth Store to include role and permissions
3. Implement role mapping function
4. Implement permission mapping function
5. Update API client to handle role in login response
6. Implement permission resolution from permissions-ssot

**Files**:
- `src/store/types.ts`
- `src/store/slices/auth.slice.ts`
- `src/lib/api-client.ts`
- `src/lib/marketplace/permission-resolution.ts`
- `src/app/layout-integration.ts`

**Estimated Time**: 3-4 hours

### 7.3 Phase 3: Navigation Auth Adapter

**Tasks**:
1. Implement createCustomAuthAdapter
2. Integrate with Zustand store
3. Implement auth change listener
4. Test role resolution
5. Test permission resolution

**Files**:
- `src/app/layout-integration.ts`

**Estimated Time**: 2-3 hours

### 7.4 Phase 4: Root Layout Integration

**Tasks**:
1. Integrate MarketplaceNavigationProvider in root layout
2. Implement permission loading on mount
3. Implement session initialization
4. Test navigation rendering with auth

**Files**:
- `src/app/layout.tsx`

**Estimated Time**: 1-2 hours

### 7.5 Phase 5: SSR Integration

**Tasks**:
1. Implement server-side token verification
2. Implement server-side role resolution
3. Implement server-side permission resolution
4. Add middleware for protected routes
5. Test SSR auth flow

**Files**:
- `src/app/layout-integration.ts`
- `src/middleware.ts`

**Estimated Time**: 3-4 hours

### 7.6 Phase 6: Testing and Validation

**Tasks**:
1. Unit tests for auth adapter
2. Unit tests for role mapping
3. Unit tests for permission mapping
4. Integration tests for navigation with auth
5. E2E tests for auth flow

**Estimated Time**: 4-6 hours

## 8. Risk Assessment

### 8.1 Technical Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Role not returned from API | HIGH | MEDIUM | Add fallback to guest role |
| Permission mapping mismatch | MEDIUM | LOW | Use permissions-ssot as primary source |
| Zustand store sync issues | MEDIUM | LOW | Use proper subscription patterns |
| SSR auth state mismatch | MEDIUM | MEDIUM | Implement proper hydration |

### 8.2 Integration Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Backend role not ready | HIGH | HIGH | Implement client-side fallback |
| permissions-ssot not ready | HIGH | LOW | Use @gv/auth as fallback |
| Navigation context conflicts | MEDIUM | LOW | Test thoroughly before deployment |

## 9. Success Criteria

- ✅ User role is retrieved from API and stored in auth store
- ✅ Permissions are resolved from permissions-ssot
- ✅ Navigation auth adapter returns correct role and permissions
- ✅ Navigation items are filtered based on user permissions
- ✅ Auth changes trigger navigation context updates
- ✅ SSR auth integration works correctly
- ✅ Session lifecycle is properly managed

## 10. Conclusion

This auth integration plan provides a comprehensive approach to integrating the custom JWT-based authentication system with the Marketplace Navigation System. The plan addresses role resolution, permission resolution, session lifecycle, and SSR/Client integration points.

**Recommendation**: Implement phases sequentially, starting with backend role integration, then client-side integration, followed by navigation auth adapter, root layout integration, SSR integration, and finally testing.

**Total Estimated Time**: 17-25 hours

---

**Plan Generated**: 2026-06-13  
**Plan Status**: ✅ READY FOR IMPLEMENTATION
