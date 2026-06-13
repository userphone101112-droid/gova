# RBAC Implementation Plan

> **Date**: 2026-06-13  
> **Status**: ✅ PLAN READY  
> **Version**: 1.0.0

## Executive Summary

This implementation plan addresses the critical RBAC gaps identified in the RBAC Gap Report. The plan is structured in phases to ensure systematic implementation with minimal disruption to existing functionality.

## Implementation Phases

### Phase 1: Domain Layer Role Support

**Objective**: Add role field to User entity and related domain models.

**Estimated Time**: 1-2 hours

**Tasks**:

1. **Update User Entity**
   - **File**: `packages/domain/entities.ts`
   - **Changes**:
     ```typescript
     export class User {
       private _id: UserId;
       private _email: Email;
       private _name: string;
       private _password: string;
       private _role: string; // ADD THIS
       private _createdAt: Date;
       private _updatedAt: Date;

       constructor(
         id: UserId,
         email: Email,
         name: string,
         password: string,
         role: string = 'guest', // ADD THIS PARAMETER
         createdAt: Date = new Date(),
         updatedAt: Date = new Date()
       ) {
         this._id = id;
         this._email = email;
         this._name = name;
         this._password = password;
         this._role = role; // ADD THIS
         this._createdAt = createdAt;
         this._updatedAt = updatedAt;
       }

       get role(): string { // ADD THIS GETTER
         return this._role;
       }

       updateRole(role: string): void { // ADD THIS METHOD
         this._role = role;
         this._updatedAt = new Date();
       }

       toJSON() {
         return {
           id: this._id.value,
           email: this._email.value,
           name: this._name,
           password: this._password,
           role: this._role, // ADD THIS
           createdAt: this._createdAt,
           updatedAt: this._updatedAt,
         };
       }

       static fromJSON(json: {
         id: string;
         email: string;
         name: string;
         password: string;
         role?: string; // ADD THIS OPTIONAL FIELD
         createdAt: Date | string;
         updatedAt: Date | string;
       }): User {
         return new User(
           new UserId(json.id),
           new Email(json.email),
           json.name,
           json.password,
           json.role || 'guest', // ADD DEFAULT
           typeof json.createdAt === 'string' ? new Date(json.createdAt) : json.createdAt,
           typeof json.updatedAt === 'string' ? new Date(json.updatedAt) : json.updatedAt
         );
       }
     }
     ```

2. **Update User Type Definitions**
   - **File**: `src/store/types.ts` (if exists)
   - **Changes**: Add role field to User interface

**Validation**:
- Unit tests for User entity with role
- Verify JSON serialization/deserialization

---

### Phase 2: Database Schema Migration

**Objective**: Add role column to users table and create migration.

**Estimated Time**: 1-2 hours

**Tasks**:

1. **Update Database Schema**
   - **File**: `src/server/db/schema.ts`
   - **Changes**:
     ```typescript
     export const users = sqliteTable('users', {
       id: text('id').primaryKey(),
       email: text('email').notNull().unique(),
       name: text('name').notNull(),
       avatar: text('avatar'),
       role: text('role').notNull().default('guest'), // ADD THIS COLUMN
       createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
       updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
     });
     ```

2. **Create Database Migration**
   - **File**: `src/server/db/migrations/add_role_to_users.sql` (or Drizzle migration)
   - **SQL**:
     ```sql
     ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'guest';
     
     -- Update existing users to have 'guest' role
     UPDATE users SET role = 'guest' WHERE role IS NULL;
     ```

3. **Update TypeScript Types**
   - **File**: `src/server/db/schema.ts`
   - **Changes**: Update inferred types to include role

**Validation**:
- Run migration on test database
- Verify role column exists
- Verify default value works
- Test existing users get 'guest' role

---

### Phase 3: JWT Token Role Claims

**Objective**: Add role to JWT token payload and update token generation/verification.

**Estimated Time**: 1-2 hours

**Tasks**:

1. **Update Token Payload Interface**
   - **File**: `apps/api/src/infrastructure/auth/jwt.service.ts`
   - **Changes**:
     ```typescript
     export interface TokenPayload {
       userId: string;
       email: string;
       role: string; // ADD THIS
     }
     ```

2. **Update JWT Service Methods**
   - **File**: `apps/api/src/infrastructure/auth/jwt.service.ts`
   - **Changes**:
     ```typescript
     export class JWTService {
       generateToken(payload: TokenPayload): string {
         return this.jwt.sign(payload);
       }

       generateAccessToken(payload: TokenPayload): string {
         return this.jwt.sign(payload, { expiresIn: '15m' });
       }

       generateRefreshToken(payload: TokenPayload): string {
         return this.jwt.sign(payload, { expiresIn: '7d' });
       }

       verifyToken(token: string): TokenPayload {
         const decoded = this.jwt.verify(token);
         return {
           userId: decoded.userId,
           email: decoded.email,
           role: decoded.role || 'guest', // ADD THIS
         };
       }
     }
     ```

3. **Update Token Generation in Login Flow**
   - **File**: `apps/api/src/application/use-cases/login-user.use-case.ts` (or similar)
   - **Changes**: Include role in token payload

**Validation**:
- Generate token with role
- Verify token returns role
- Test with different roles

---

### Phase 4: API Role Propagation

**Objective**: Update API endpoints to include role in responses.

**Estimated Time**: 2-3 hours

**Tasks**:

1. **Update DTOs**
   - **File**: `apps/api/src/application/dtos/user.dto.ts` (or similar)
   - **Changes**:
     ```typescript
     export class CreateUserDTO {
       email: string;
       password: string;
       name: string;
       role?: string; // ADD OPTIONAL ROLE
     }

     export class UserResponseDTO {
       id: string;
       email: string;
       name: string;
       role: string; // ADD ROLE
       createdAt: Date;
       updatedAt: Date;
     }

     export class LoginResponseDTO {
       user: UserResponseDTO;
       token: string;
     }
     ```

2. **Update Use Cases**
   - **File**: `apps/api/src/application/use-cases/create-user.use-case.ts`
   - **Changes**:
     ```typescript
     async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
       // ... existing logic
       const role = dto.role || 'guest'; // ADD DEFAULT ROLE
       const user = new User(userId, email, name, hashedPassword, role);
       // ... persist user
       return new UserResponseDTO(user);
     }
     ```

   - **File**: `apps/api/src/application/use-cases/login-user.use-case.ts`
   - **Changes**:
     ```typescript
     async execute(dto: LoginDTO): Promise<LoginResponseDTO> {
       // ... existing logic
       const token = this.jwtService.generateToken({
         userId: user.id,
         email: user.email,
         role: user.role, // ADD ROLE
       });
       return new LoginResponseDTO(user, token);
     }
     ```

3. **Update Controllers**
   - **File**: `apps/api/src/interfaces/http/controllers/user.controller.ts`
   - **Changes**: Ensure role is included in responses (handled by DTOs)

**Validation**:
- Test user creation with role
- Test user creation without role (default to 'guest')
- Test login returns role
- Verify role in API responses

---

### Phase 5: Zustand Auth Store Role Support

**Objective**: Add role field to Zustand auth store and update actions.

**Estimated Time**: 1-2 hours

**Tasks**:

1. **Update Auth State Interface**
   - **File**: `src/store/slices/auth.slice.ts`
   - **Changes**:
     ```typescript
     interface AuthState {
       isAuthenticated: boolean;
       user: User | null;
       token: string | null;
       role: string | null; // ADD THIS
       permissions: string[]; // ADD THIS (optional cache)
       isLoading: boolean;
       error: string | null;
     }

     interface User {
       id: string;
       email: string;
       name: string;
       role: string; // ADD THIS
     }
     ```

2. **Update Auth Actions**
   - **File**: `src/store/slices/auth.slice.ts`
   - **Changes**:
     ```typescript
     interface AuthActions {
       login: (user: User, token: string) => void;
       logout: () => void;
       setLoading: (loading: boolean) => void;
       setError: (error: string | null) => void;
       setRole: (role: string) => void; // ADD THIS
       setPermissions: (permissions: string[]) => void; // ADD THIS
     }

     export const useAuthStore = create<AuthStore>()(
       persist(
         (set) => ({
           isAuthenticated: false,
           user: null,
           token: null,
           role: null, // ADD THIS
           permissions: [], // ADD THIS
           isLoading: false,
           error: null,

           login: (user, token) =>
             set({
               isAuthenticated: true,
               user,
               token,
               role: user.role, // ADD THIS
               permissions: [], // Will be loaded separately
               error: null,
             }),

           logout: () =>
             set({
               isAuthenticated: false,
               user: null,
               token: null,
               role: null, // ADD THIS
               permissions: [], // ADD THIS
               error: null,
             }),

           setLoading: (isLoading) => set({ isLoading }),

           setError: (error) => set({ error }),

           setRole: (role) => set({ role }), // ADD THIS

           setPermissions: (permissions) => set({ permissions }), // ADD THIS
         }),
         {
           name: 'auth-storage',
           partialize: (state) => ({
             isAuthenticated: state.isAuthenticated,
             user: state.user,
             token: state.token,
             role: state.role, // ADD THIS
             permissions: state.permissions, // ADD THIS
           }),
         }
       )
     );
     ```

3. **Update API Client**
   - **File**: `src/lib/api-client.ts`
   - **Changes**: Ensure role is extracted from login response and stored

**Validation**:
- Test login stores role
- Test logout clears role
- Test role persists across page refresh
- Test setRole action

---

### Phase 6: Role Standardization

**Objective**: Standardize role definitions between @gv/auth and permissions-ssot.

**Estimated Time**: 1 hour

**Tasks**:

1. **Create Role Mapping Function**
   - **File**: `src/lib/marketplace/role-mapping.ts` (new file)
   - **Changes**:
     ```typescript
     import type { UserRole } from '@gv/auth';

     export function mapAuthRoleToNavigationRole(authRole: UserRole): string {
       const roleMap: Record<UserRole, string> = {
         ADMIN: 'admin',
         MERCHANT: 'seller',
         CUSTOMER: 'buyer',
         MODERATOR: 'admin', // Map moderator to admin
       };
       return roleMap[authRole] || 'guest';
     }

     export function mapNavigationRoleToAuthRole(navigationRole: string): UserRole {
       const roleMap: Record<string, UserRole> = {
         admin: 'ADMIN',
         seller: 'MERCHANT',
         buyer: 'CUSTOMER',
         guest: 'CUSTOMER', // Map guest to customer
       };
       return roleMap[navigationRole] || 'CUSTOMER';
     }
     ```

2. **Update Auth Adapter**
   - **File**: `src/app/layout-integration.ts`
   - **Changes**: Use role mapping in auth adapter

**Validation**:
- Test role mapping for all roles
- Test reverse mapping
- Verify navigation works with mapped roles

---

### Phase 7: Navigation Auth Adapter Implementation

**Objective**: Implement Navigation Auth Adapter using updated auth store.

**Estimated Time**: 2-3 hours

**Tasks**:

1. **Implement Custom Auth Adapter**
   - **File**: `src/app/layout-integration.ts`
   - **Changes**:
     ```typescript
     import { useAuthStore } from '@/store/slices/auth.slice';
     import { resolveRolePermissions } from '@/lib/marketplace/ssot-integration';

     export function createCustomAuthAdapter(): AuthAdapter {
       return {
         getRole: () => {
           const role = useAuthStore.getState().role;
           return role || 'guest';
         },

         getPermissions: () => {
           const role = useAuthStore.getState().role;
           if (!role) return [];

           // Use permissions-ssot for permission resolution
           return resolveRolePermissions(role);
         },

         onAuthChange: (callback) => {
           const unsubscribe = useAuthStore.subscribe(
             (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, role: state.role }),
             (state, previousState) => {
               const userChanged = state.user !== previousState.user;
               const authChanged = state.isAuthenticated !== previousState.isAuthenticated;
               const roleChanged = state.role !== previousState.role;

               if (userChanged || authChanged || roleChanged) {
                 callback({
                   user: state.user,
                   isAuthenticated: state.isAuthenticated,
                   role: state.role,
                 });
               }
             }
           );

           return unsubscribe;
         },
       };
     }
     ```

2. **Update Root Layout**
   - **File**: `src/app/layout.tsx`
   - **Changes**: Integrate MarketplaceNavigationProvider with auth adapter

**Validation**:
- Test auth adapter returns correct role
- Test auth adapter returns correct permissions
- Test auth change listener works
- Test navigation updates on auth change

---

### Phase 8: Testing and Validation

**Objective**: Comprehensive testing of RBAC implementation.

**Estimated Time**: 3-4 hours

**Tasks**:

1. **Unit Tests**
   - User entity with role
   - JWT service with role
   - Auth store with role
   - Role mapping functions
   - Auth adapter

2. **Integration Tests**
   - User creation with role
   - Login with role
   - Token generation with role
   - API responses with role
   - Navigation with role

3. **E2E Tests**
   - Complete auth flow with role
   - Navigation rendering based on role
   - Permission-based access control

4. **Manual Testing**
   - Test all role types (guest, buyer, seller, admin)
   - Test navigation items for each role
   - Test permission-based access

**Validation**:
- All tests pass
- Manual testing successful
- No regressions in existing functionality

---

## Implementation Order

**Recommended Order**: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8

**Total Estimated Time**: 12-19 hours

**Dependencies**:
- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 1
- Phase 4 depends on Phase 1, 2, 3
- Phase 5 depends on Phase 4
- Phase 6 can be done in parallel with Phase 5
- Phase 7 depends on Phase 5, 6
- Phase 8 depends on all previous phases

## Rollback Plan

If issues arise during implementation:

1. **Database Rollback**: Revert migration using `ALTER TABLE users DROP COLUMN role`
2. **Code Rollback**: Revert changes using git
3. **API Rollback**: Deploy previous version if needed

## Success Criteria

- ✅ User entity has role field
- ✅ Database has role column with default value
- ✅ JWT tokens include role claim
- ✅ API responses include role
- ✅ Zustand store stores role
- ✅ Navigation auth adapter works correctly
- ✅ Navigation items filtered by role/permissions
- ✅ All tests pass

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Database migration fails | Test migration on staging first |
| JWT token size increases | Monitor token size, acceptable for small role string |
| API breaking changes | Make role optional in DTOs with default |
| Client store sync issues | Test thoroughly with different auth flows |
| Role mapping errors | Test all role mappings before deployment |

## Conclusion

This implementation plan provides a systematic approach to implementing RBAC in the authentication system. Following this plan will ensure all critical gaps are addressed before implementing the Navigation Auth Adapter.

**Recommendation**: Implement phases sequentially, testing each phase before proceeding to the next.

---

**Plan Generated**: 2026-06-13  
**Plan Status**: ✅ READY FOR IMPLEMENTATION
