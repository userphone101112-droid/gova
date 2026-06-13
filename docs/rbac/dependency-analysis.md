# RBAC Dependency Analysis

> **Date**: 2026-06-13  
> **Status**: ✅ ANALYSIS COMPLETE  
> **Version**: 1.0.0

## Executive Summary

This dependency analysis identifies all components that depend on or are affected by RBAC implementation. The analysis covers internal dependencies, external dependencies, and impact assessment.

## Component Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                         RBAC Implementation                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Domain Layer                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ User Entity  │───▶│ Role Field   │───▶│ Value Objects│      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database Layer                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Schema       │───▶│ Migration    │───▶│ Repository   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Application Layer                                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Use Cases    │───▶│ DTOs         │───▶│ Validators   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ JWT Service  │───▶│ Controllers  │───▶│ Middleware   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Client Layer                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Auth Store   │───▶│ API Client   │───▶│ Hooks        │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Navigation Layer                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Auth Adapter │───▶│ Context      │───▶│ Components   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Internal Dependencies

### Domain Layer Dependencies

| Component | Depends On | Impact Level |
|-----------|------------|--------------|
| User Entity | UserId, Email value objects | LOW |
| User Entity (updated) | Role field (new) | HIGH |
| User Repository | User Entity | MEDIUM |
| User Domain Service | User Entity, Repository | MEDIUM |

**Changes Required**:
- User Entity: Add role field
- User Repository: Update to handle role
- User Domain Service: Update to handle role

### Database Layer Dependencies

| Component | Depends On | Impact Level |
|-----------|------------|--------------|
| Database Schema | User Entity | HIGH |
| Migration Script | Database Schema | HIGH |
| User Repository | Database Schema | HIGH |

**Changes Required**:
- Database Schema: Add role column
- Migration Script: Create migration for role column
- User Repository: Update queries to include role

### Application Layer Dependencies

| Component | Depends On | Impact Level |
|-----------|------------|--------------|
| CreateUserUseCase | User Entity, Repository, DTOs | HIGH |
| LoginUserUseCase | User Entity, Repository, JWT Service, DTOs | HIGH |
| CreateUserDTO | User Entity | MEDIUM |
| UserResponseDTO | User Entity | MEDIUM |
| LoginResponseDTO | UserResponseDTO, JWT Service | MEDIUM |

**Changes Required**:
- CreateUserUseCase: Handle role assignment
- LoginUserUseCase: Include role in token
- CreateUserDTO: Add optional role field
- UserResponseDTO: Add role field
- LoginResponseDTO: Ensure role is included

### Infrastructure Layer Dependencies

| Component | Depends On | Impact Level |
|-----------|------------|--------------|
| JWT Service | TokenPayload interface | HIGH |
| UserController | Use Cases, DTOs | HIGH |
| Auth Middleware | JWT Service | MEDIUM |

**Changes Required**:
- JWT Service: Update TokenPayload, generateToken, verifyToken
- UserController: Ensure role in responses (handled by DTOs)
- Auth Middleware: May need updates for role-based checks

### Client Layer Dependencies

| Component | Depends On | Impact Level |
|-----------|------------|--------------|
| Auth Store | User type, API Client | HIGH |
| API Client | Auth Store, API endpoints | HIGH |
| useAuth Hook | Auth Store | MEDIUM |
| useNavigationAuth Hook | useAuth Hook, Navigation Context | MEDIUM |

**Changes Required**:
- Auth Store: Add role field, actions
- API Client: Extract role from responses
- useAuth Hook: Add role to return value
- useNavigationAuth Hook: Use role from useAuth

### Navigation Layer Dependencies

| Component | Depends On | Impact Level |
|-----------|------------|--------------|
| Auth Adapter | Auth Store, permissions-ssot | HIGH |
| Navigation Context | Auth Adapter | HIGH |
| MarketplaceNavigationProvider | Auth Adapter | HIGH |
| Navigation Hooks | Navigation Context | MEDIUM |

**Changes Required**:
- Auth Adapter: Implement using auth store
- Navigation Context: No changes (uses Auth Adapter)
- MarketplaceNavigationProvider: No changes (uses Auth Adapter)
- Navigation Hooks: No changes (uses Navigation Context)

## External Dependencies

### Package Dependencies

| Package | Purpose | Role in RBAC | Impact Level |
|---------|---------|--------------|--------------|
| @gv/domain | Domain entities | User Entity | HIGH |
| @gv/auth | Role definitions | Role mapping | LOW |
| @gv/permissions-ssot | Permission definitions | Permission resolution | HIGH |
| @gv/navigation-ssot | Navigation definitions | Navigation integration | MEDIUM |
| zustand | State management | Auth Store | HIGH |
| drizzle-orm | Database ORM | Database Schema | HIGH |
| @fastify/jwt | JWT implementation | JWT Service | HIGH |
| zod | Schema validation | DTOs | MEDIUM |

### Library Dependencies

| Library | Purpose | Role in RBAC | Impact Level |
|---------|---------|--------------|--------------|
| bcrypt | Password hashing | No role impact | NONE |
| jsonwebtoken | JWT implementation | JWT Service | HIGH |
| typescript | Type system | Type definitions | HIGH |

## Cross-Layer Dependencies

### Data Flow Dependencies

```
User Registration
  ↓
CreateUserDTO (with optional role)
  ↓
CreateUserUseCase
  ↓
User Entity (with role)
  ↓
User Repository
  ↓
Database Schema (with role column)
  ↓
UserResponseDTO (with role)
  ↓
API Response
```

```
User Login
  ↓
LoginDTO
  ↓
LoginUserUseCase
  ↓
User Entity (with role)
  ↓
JWT Service (with role in payload)
  ↓
JWT Token (with role claim)
  ↓
LoginResponseDTO (with role)
  ↓
API Response
  ↓
Auth Store (stores role)
  ↓
Auth Adapter (reads role)
  ↓
Navigation Context (uses role)
  ↓
Navigation Components (filtered by role)
```

### Configuration Dependencies

| Configuration | Depends On | Impact Level |
|---------------|------------|--------------|
| Database Schema | Drizzle ORM config | HIGH |
| JWT Secret | Environment variables | MEDIUM |
| Default Role | Application config | MEDIUM |

## Impact Assessment

### Breaking Changes

| Change | Breaking? | Affected Components | Mitigation |
|--------|-----------|-------------------|------------|
| User Entity role field | YES | All User Entity consumers | Add default value, update all consumers |
| Database role column | YES | All database queries | Migration script, update queries |
| JWT TokenPayload role | YES | All token consumers | Make role optional with default |
| API Response DTOs role | YES | All API consumers | Version API or make optional |
| Auth Store role field | YES | All Auth Store consumers | Add default value, update consumers |

### Non-Blocking Changes

| Change | Affected Components | Notes |
|--------|-------------------|-------|
| Role mapping functions | Auth Adapter | New file, no impact |
| Permission resolution | Auth Adapter | Already compatible |
| Navigation integration | Navigation components | Already compatible |

### Test Dependencies

| Test Component | Depends On | Impact Level |
|---------------|------------|--------------|
| User Entity Tests | User Entity | HIGH |
| Repository Tests | Database Schema | HIGH |
| Use Case Tests | Use Cases, DTOs | HIGH |
| JWT Service Tests | JWT Service | HIGH |
| API Tests | Controllers, DTOs | HIGH |
| Auth Store Tests | Auth Store | HIGH |
| Navigation Tests | Navigation Context | MEDIUM |

## Dependency Resolution Strategy

### Phase 1: Domain Layer
- **Priority**: HIGH
- **Dependencies**: None
- **Affected**: User Entity, Repository, Domain Services
- **Strategy**: Update User Entity first, then update consumers

### Phase 2: Database Layer
- **Priority**: HIGH
- **Dependencies**: Phase 1 (User Entity)
- **Affected**: Database Schema, Migration, Repository
- **Strategy**: Update schema, create migration, update repository

### Phase 3: Application Layer
- **Priority**: HIGH
- **Dependencies**: Phase 1, 2
- **Affected**: Use Cases, DTOs
- **Strategy**: Update DTOs first, then use cases

### Phase 4: Infrastructure Layer
- **Priority**: HIGH
- **Dependencies**: Phase 3
- **Affected**: JWT Service, Controllers
- **Strategy**: Update JWT Service first, then controllers

### Phase 5: Client Layer
- **Priority**: HIGH
- **Dependencies**: Phase 4
- **Affected**: Auth Store, API Client, Hooks
- **Strategy**: Update Auth Store first, then API Client, then hooks

### Phase 6: Navigation Layer
- **Priority**: MEDIUM
- **Dependencies**: Phase 5
- **Affected**: Auth Adapter, Navigation Context
- **Strategy**: Implement Auth Adapter, test integration

## Risk Analysis

### Dependency Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Circular dependencies | LOW | HIGH | Careful dependency ordering |
| Missing updates in consumers | MEDIUM | HIGH | Comprehensive testing |
| Database migration failure | LOW | HIGH | Test on staging first |
| JWT token compatibility | LOW | MEDIUM | Make role optional |
| API breaking changes | MEDIUM | MEDIUM | Version API endpoints |

### Mitigation Strategies

1. **Incremental Updates**: Update components incrementally to minimize risk
2. **Comprehensive Testing**: Test each layer before proceeding
3. **Backward Compatibility**: Make role optional with defaults where possible
4. **Staging Environment**: Test all changes on staging before production
5. **Rollback Plan**: Have rollback plan for each phase

## Conclusion

The RBAC implementation has significant dependencies across all layers of the application. The dependency analysis reveals:

**Critical Path**: Domain → Database → Application → Infrastructure → Client → Navigation

**Total Dependencies**: 25+ components affected

**Estimated Impact**: HIGH - Most layers require updates

**Recommendation**: Follow the phased implementation plan, testing each phase before proceeding. Ensure backward compatibility where possible and have rollback plans ready.

---

**Analysis Generated**: 2026-06-13  
**Analysis Status**: ✅ COMPLETE
