# Authorization System

## Overview

The authorization system controls access to resources and actions based on user permissions and roles. Currently, the system is in early stages with basic authentication but no role-based access control (RBAC) implementation.

## Current Status

**Implementation Level**: Basic

**Current Capabilities**:
- JWT-based authentication
- User identity verification
- Token-based session management

**Missing Capabilities**:
- Role-based access control (RBAC)
- Permission system
- Resource ownership verification
- Access control lists (ACLs)
- Policy-based access control (PBAC)

## Planned Architecture

### Role-Based Access Control (RBAC)

**Roles**:
- **Admin**: Full system access
- **Merchant**: Product and order management
- **Customer**: View and purchase products
- **Guest**: Limited read-only access

**Permissions**:
- **User Management**: create, read, update, delete users
- **Product Management**: create, read, update, delete products
- **Order Management**: create, read, update, delete orders
- **Image Management**: upload, view, delete images
- **Settings Management**: configure system settings

### Resource Ownership

**Ownership Model**:
- Users own their own data
- Merchants own their products and orders
- Admins can access all resources

**Ownership Verification**:
- Check resource owner against authenticated user
- Allow admin override
- Implement in repository or service layer

## Implementation Plan

### Phase 1: Basic RBAC

**Components**:
- Role entity in database
- User-role association table
- Permission entity
- Role-permission association table
- Authorization middleware

**Database Schema**:
```sql
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT
);

CREATE TABLE user_roles (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);
```

### Phase 2: Authorization Middleware

**Location**: `apps/api/src/interfaces/http/middlewares/authorization.middleware.ts`

**Implementation**:
```typescript
export function authorize(permission: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    
    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    
    const hasPermission = await checkPermission(user.id, permission);
    
    if (!hasPermission) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };
}
```

### Phase 3: Resource Ownership

**Implementation**:
```typescript
export function checkOwnership(resource: string, resourceId: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    
    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    
    const isOwner = await verifyOwnership(user.id, resource, resourceId);
    const isAdmin = await hasRole(user.id, 'admin');
    
    if (!isOwner && !isAdmin) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };
}
```

## Authorization Patterns

### Decorator Pattern

```typescript
@authorize('product:create')
async createProduct(request: FastifyRequest, reply: FastifyReply) {
  // Handler logic
}
```

### Middleware Pattern

```typescript
fastify.post('/products', {
  preHandler: authorize('product:create')
}, createProductHandler);
```

### Service Layer Pattern

```typescript
class ProductService {
  async createProduct(user: User, productData: ProductData) {
    if (!await this.authService.canCreateProduct(user)) {
      throw new ForbiddenError();
    }
    // Create product
  }
}
```

## Security Considerations

### Principle of Least Privilege

- Users should only have access to resources they need
- Default deny: deny all, allow specific
- Regular permission audits

### Defense in Depth

- Multiple authorization checks
- Frontend and backend validation
- Database-level constraints

### Audit Logging

- Log all authorization decisions
- Track permission changes
- Monitor for suspicious activity

## Frontend Integration

### Permission Store

**Location**: `src/store/slices/permissions.slice.ts`

**State**:
- `permissions`: string[]
- `roles`: string[]
- `isLoading`: boolean

**Actions**:
- `loadPermissions(): Promise<void>`
- `hasPermission(permission: string): boolean`
- `hasRole(role: string): boolean`

### Route Guards

```typescript
const ProtectedRoute = ({ permission, children }) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

### UI Components

```typescript
<Permission permission="product:create">
  <Button>Create Product</Button>
</Permission>
```

## Configuration

### Environment Variables

```bash
# Authorization Settings
AUTHORIZATION_ENABLED=true
DEFAULT_ROLE=guest
ADMIN_EMAIL=admin@example.com
```

### Role Definitions

```typescript
const ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  CUSTOMER: 'customer',
  GUEST: 'guest'
} as const;
```

### Permission Definitions

```typescript
const PERMISSIONS = {
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  // ... more permissions
} as const;
```

## Error Handling

### Authorization Errors

- **UnauthorizedError**: User not authenticated
- **ForbiddenError**: User lacks permission
- **InsufficientPrivilegeError**: User privilege insufficient
- **ResourceAccessDeniedError**: User cannot access resource

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: "FORBIDDEN",
    message: "You do not have permission to perform this action",
    details: {
      requiredPermission: "product:create",
      userPermissions: ["product:read"]
    }
  }
}
```

## Testing

### Unit Tests

- Permission checking logic
- Role assignment logic
- Authorization middleware
- Ownership verification

### Integration Tests

- Protected endpoint access
- Permission-based routing
- Role-based functionality
- Cross-user access prevention

### Security Tests

- Permission escalation attempts
- Direct object reference attacks
- Session hijacking prevention
- Token manipulation attempts

## Future Enhancements

### Advanced Features

- **Policy-Based Access Control (PBAC)**: Complex policy rules
- **Attribute-Based Access Control (ABAC)**: Dynamic permissions based on attributes
- **Time-Based Access**: Temporary permissions
- **Location-Based Access**: Geographic restrictions
- **Multi-Factor Authorization**: Additional verification for sensitive actions

### Integration

- **OAuth 2.0**: Third-party authorization
- **OpenID Connect**: Identity layer
- **SAML**: Enterprise SSO
- **LDAP**: Directory service integration

## Source Traceability

**Source Folders**:
- `apps/api/src/interfaces/http/middlewares/` - Authorization middleware (planned)
- `src/store/slices/` - Frontend permission store (planned)

**Key Files**:
- `apps/api/src/infrastructure/auth/jwt.service.ts` - JWT service (current auth)
- `src/store/slices/auth.slice.ts` - Auth state (current)

**Dependencies**:
- None currently (planned: casbin, accesscontrol)

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions

**Related Packages**:
- `@gv/domain` - User entity (will need role field)
- `@gv/contracts` - Permission DTOs (planned)
