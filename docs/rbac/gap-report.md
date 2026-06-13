# RBAC Gap Report

> **Date**: 2026-06-13  
> **Status**: ⚠️ GAPS IDENTIFIED  
> **Version**: 1.0.0

## Executive Summary

RBAC (Role-Based Access Control) readiness assessment has identified **CRITICAL GAPS** in the current authentication system. The system lacks role support at all layers: entity, database, JWT, API, and client store. However, role definitions exist in both `@gv/auth` and `permissions-ssot` packages, providing a foundation for implementation.

## Validation Results

### 1. User Entity Role Support

**Status**: ❌ NOT SUPPORTED

**Location**: `packages/domain/entities.ts`

**Current State**:
```typescript
export class User {
  private _id: UserId;
  private _email: Email;
  private _name: string;
  private _password: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  // NO ROLE FIELD
}
```

**Gap**: User entity does not have a role field.

**Impact**: HIGH - Cannot store or retrieve user roles from domain layer.

**Required Changes**:
- Add `private _role: string;` field
- Add getter/setter for role
- Update constructor to accept role
- Update `toJSON()` and `fromJSON()` methods

---

### 2. Database Role Storage

**Status**: ❌ NOT SUPPORTED

**Location**: `src/server/db/schema.ts`

**Current State**:
```typescript
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // NO ROLE COLUMN
});
```

**Gap**: Database schema does not have a role column.

**Impact**: HIGH - Cannot persist user roles in database.

**Required Changes**:
- Add `role: text('role').notNull().default('guest')` column
- Create database migration
- Update TypeScript types

---

### 3. JWT Role Claims

**Status**: ❌ NOT SUPPORTED

**Location**: `apps/api/src/infrastructure/auth/jwt.service.ts`

**Current State**:
```typescript
export interface TokenPayload {
  userId: string;
  email: string;
  // NO ROLE CLAIM
}

export class JWTService {
  generateToken(payload: TokenPayload): string {
    return this.jwt.sign(payload);
  }

  verifyToken(token: string): TokenPayload {
    const decoded = this.jwt.verify(token);
    return {
      userId: decoded.userId,
      email: decoded.email,
      // NO ROLE RETURNED
    };
  }
}
```

**Gap**: JWT token payload does not include role claim.

**Impact**: HIGH - Role information not available in JWT tokens for client-side use.

**Required Changes**:
- Add `role: string;` to `TokenPayload` interface
- Update `generateToken()` to include role
- Update `verifyToken()` to return role
- Update token generation in login flow

---

### 4. Role Propagation Through APIs

**Status**: ❌ NOT SUPPORTED

**Location**: `apps/api/src/interfaces/http/controllers/user.controller.ts`

**Current State**:
```typescript
export class UserController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const dto = request.body as CreateUserDTO;
    const user = await this.createUserUseCase.execute(dto);
    return reply.status(201).send(user);
    // NO ROLE IN RESPONSE
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const dto = request.body as LoginDTO;
    const result = await this.loginUserUseCase.execute(dto);
    return reply.send(result);
    // NEED TO CHECK IF ROLE IS IN RESPONSE
  }
}
```

**Gap**: API endpoints do not return role information.

**Impact**: HIGH - Client cannot receive role information from API.

**Required Changes**:
- Update `CreateUserDTO` to include role (optional with default)
- Update `LoginResponseDTO` to include role
- Update use cases to handle role assignment
- Update controllers to return role in responses

---

### 5. Zustand Auth Store Role Support

**Status**: ❌ NOT SUPPORTED

**Location**: `src/store/slices/auth.slice.ts`

**Current State**:
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  // NO ROLE FIELD
}

interface User {
  id: string;
  email: string;
  name: string;
  // NO ROLE FIELD
}
```

**Gap**: Auth store does not store role information.

**Impact**: HIGH - Navigation auth adapter cannot retrieve role from store.

**Required Changes**:
- Add `role: string | null` to `AuthState`
- Add `role` field to `User` type
- Add `setRole: (role: string) => void` action
- Add role to persistence configuration

---

### 6. Permission Resolution Compatibility

**Status**: ✅ COMPATIBLE

**Location**: `src/lib/marketplace/permission-resolution.ts`, `src/lib/marketplace/ssot-integration.ts`

**Current State**:
```typescript
// ssot-integration.ts
export function resolveRolePermissions(roleId: string): string[] {
  const rolePermissions = getRolePermissions(roleId);
  return rolePermissions.permissions || [];
}
```

**Gap**: NONE - Permission resolution is compatible with permissions-ssot.

**Impact**: NONE - Permission resolution works correctly.

**Required Changes**: None

---

### 7. Existing @gv/auth Role Definitions

**Status**: ✅ AVAILABLE

**Location**: `packages/auth/index.ts`

**Current State**:
```typescript
export type UserRole = 'ADMIN' | 'MERCHANT' | 'CUSTOMER' | 'MODERATOR';

export type UserPermission =
  | 'products.create'
  | 'products.update'
  | 'products.delete'
  | 'products.view'
  | 'orders.manage'
  | 'orders.view'
  | 'merchants.manage'
  | 'users.manage';

export const rolePermissions: Record<UserRole, UserPermission[]> = {
  ADMIN: ['products.create', 'products.update', ...],
  MODERATOR: ['products.view', 'products.delete', ...],
  MERCHANT: ['products.create', 'products.update', ...],
  CUSTOMER: ['products.view', 'orders.view'],
};
```

**Gap**: NONE - Role definitions exist but use different naming convention.

**Impact**: LOW - Role names differ from permissions-ssot (ADMIN vs admin, MERCHANT vs seller, CUSTOMER vs buyer).

**Required Changes**:
- Map @gv/auth roles to permissions-ssot roles
- OR standardize on one role definition source

---

### 8. Existing permissions-ssot Integration

**Status**: ✅ AVAILABLE

**Location**: `packages/permissions-ssot/index.ts`

**Current State**:
```typescript
export const roleRegistry: Record<string, RoleDefinition> = {
  guest: {
    id: 'guest',
    name: 'Guest',
    description: 'Unauthenticated user with minimal permissions',
    permissions: ['product:read', 'merchant:read'],
  },
  buyer: {
    id: 'buyer',
    name: 'Buyer',
    description: 'Buyer role with cart and order permissions',
    permissions: ['user:read', 'user:write', 'product:read', ...],
  },
  seller: {
    id: 'seller',
    name: 'Seller',
    description: 'Seller role with product management permissions',
    permissions: ['user:read', 'user:write', 'product:read', ...],
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Administrator with full system permissions',
    permissions: ['user:read', 'user:write', 'user:delete', ...],
  },
};
```

**Gap**: NONE - permissions-ssot has complete role definitions.

**Impact**: NONE - permissions-ssot is the authoritative source for roles and permissions.

**Required Changes**: None

---

## Gap Summary

| Component | Status | Gap | Severity |
|-----------|--------|-----|----------|
| User Entity | ❌ | No role field | HIGH |
| Database Schema | ❌ | No role column | HIGH |
| JWT Claims | ❌ | No role in token | HIGH |
| API Propagation | ❌ | No role in responses | HIGH |
| Zustand Store | ❌ | No role storage | HIGH |
| Permission Resolution | ✅ | None | NONE |
| @gv/auth Roles | ✅ | Naming mismatch | LOW |
| permissions-ssot | ✅ | None | NONE |

## Critical Gaps

### High Priority (Must Fix Before Navigation Auth Adapter)

1. **User Entity Role Support** - Cannot store role in domain layer
2. **Database Role Storage** - Cannot persist role in database
3. **JWT Role Claims** - Cannot transmit role in token
4. **API Role Propagation** - Cannot send role to client
5. **Zustand Store Role Support** - Cannot store role in client state

### Low Priority (Can Address Later)

1. **@gv/auth Role Naming** - Role names differ from permissions-ssot (can be mapped)

## Recommendations

### Immediate Actions

1. **Add role to User entity** - Update domain model
2. **Add role column to database** - Create migration
3. **Add role to JWT payload** - Update token generation
4. **Update API responses** - Include role in login/create responses
5. **Update Zustand store** - Add role field and actions

### Secondary Actions

1. **Standardize role definitions** - Decide between @gv/auth and permissions-ssot
2. **Implement role mapping** - If keeping both sources, create mapping function
3. **Add role assignment API** - Endpoint to assign roles to users
4. **Add default role logic** - Assign 'guest' or 'buyer' on registration

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Cannot implement Navigation Auth Adapter | HIGH | CERTAIN | Fix all HIGH priority gaps first |
| Role data loss during migration | MEDIUM | LOW | Backup database before migration |
| JWT token size increase | LOW | LOW | Role is small string, minimal impact |
| API breaking changes | MEDIUM | MEDIUM | Version API endpoints or make role optional |

## Conclusion

**RBAC Readiness**: ❌ NOT READY

The current authentication system is **NOT READY** for RBAC implementation. Critical gaps exist at all layers of the authentication stack. However, role definitions exist in permissions-ssot, providing a solid foundation for implementation.

**Estimated Effort**: 8-12 hours to fix all critical gaps

**Recommendation**: Fix all HIGH priority gaps before implementing Navigation Auth Adapter.

---

**Report Generated**: 2026-06-13  
**Assessment Status**: ⚠️ GAPS IDENTIFIED
