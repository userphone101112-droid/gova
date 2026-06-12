# Contracts System

## Overview

The `@gv/contracts` package is the **single source of truth (SSOT)** for all API request and response shapes. Frontend and Backend must **never** define their own DTO interfaces — they must import from this package.

## Architecture

### Package Structure

```
packages/contracts/
└── index.ts      → All DTOs and API response types
```

### Design Philosophy

- **Single Source of Truth**: All API contracts in one place
- **Type Safety**: TypeScript interfaces for compile-time validation
- **Shared Types**: Frontend and backend use identical types
- **Versioning**: Contract versioning for API evolution
- **Documentation**: Self-documenting via TypeScript

## Generic Types

### ApiResponse<T>

**Purpose**: Standard wrapper for all API responses

**Structure**:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  meta?: ResponseMeta;
}
```

**Usage**: All API endpoints return this wrapper

---

### ApiError

**Purpose**: Standard error structure

**Structure**:
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

**Error Codes**:
- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access denied
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `INTERNAL_ERROR`: Server error

---

### ResponseMeta

**Purpose**: Metadata for paginated responses

**Structure**:
```typescript
interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}
```

---

### PaginationParams

**Purpose**: Standard pagination parameters

**Structure**:
```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
}
```

---

### FilterParams

**Purpose**: Standard filter parameters

**Structure**:
```typescript
interface FilterParams {
  [key: string]: unknown;
}
```

---

## User Contracts

### CreateUserDTO

**Purpose**: User registration request

**Structure**:
```typescript
interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}
```

**Validation**:
- `email`: Valid email format
- `password`: Min 8 characters
- `name`: Min 2 characters

---

### UpdateUserDTO

**Purpose**: User update request

**Structure**:
```typescript
interface UpdateUserDTO {
  name?: string;
  password?: string;
  avatar?: string;
}
```

---

### UserResponseDTO

**Purpose**: User data response

**Structure**:
```typescript
interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

---

### LoginDTO

**Purpose**: User login request

**Structure**:
```typescript
interface LoginDTO {
  email: string;
  password: string;
}
```

---

### LoginResponseDTO

**Purpose**: Login response with token

**Structure**:
```typescript
interface LoginResponseDTO {
  user: UserResponseDTO;
  token: string;
}
```

---

## Product Contracts

### CreateProductDTO

**Purpose**: Product creation request

**Structure**:
```typescript
interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock?: number;
}
```

**Validation**:
- `name`: Min 3 characters
- `description`: Min 10 characters
- `price`: Must be > 0
- `stock`: Must be >= 0

---

### UpdateProductDTO

**Purpose**: Product update request

**Structure**:
```typescript
interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}
```

---

### ProductResponseDTO

**Purpose**: Product data response

**Structure**:
```typescript
interface ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

---

### ListProductsResponseDTO

**Purpose**: Paginated product list response

**Structure**:
```typescript
interface ListProductsResponseDTO {
  products: ProductResponseDTO[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

---

## Image Contracts

### UploadImageDTO

**Purpose**: Image upload request

**Structure**:
```typescript
interface UploadImageDTO {
  file: unknown;
  fileName: string;
  mimeType: string;
  entityType: string;
  entityId: string;
}
```

**Validation**:
- `mimeType`: Must be valid image type
- `entityType`: Required
- `entityId`: Required

---

### ImageResponseDTO

**Purpose**: Image metadata response

**Structure**:
```typescript
interface ImageResponseDTO {
  id: string;
  url: string;
  provider: string;
  providerFileId: string;
  entityType: string;
  entityId: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string | Date;
}
```

---

### ListImagesResponseDTO

**Purpose**: Paginated image list response

**Structure**:
```typescript
interface ListImagesResponseDTO {
  images: ImageResponseDTO[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
```

---

## Placeholder Contracts

### MerchantResponseDTO

**Purpose**: Merchant data response (placeholder)

**Structure**:
```typescript
interface MerchantResponseDTO {
  id: string;
  userId: string;
  storeName: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

**Status**: Placeholder, not yet implemented

---

### OrderResponseDTO

**Purpose**: Order data response (placeholder)

**Structure**:
```typescript
interface OrderResponseDTO {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string | Date;
}
```

**Status**: Placeholder, not yet implemented

---

### CategoryResponseDTO

**Purpose**: Category data response (placeholder)

**Structure**:
```typescript
interface CategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
```

**Status**: Placeholder, not yet implemented

---

## Usage Patterns

### Frontend Usage

**Import**:
```typescript
import type { UserResponseDTO, CreateUserDTO, ApiResponse } from '@gv/contracts';
```

**API Client**:
```typescript
const register = async (dto: CreateUserDTO): Promise<ApiResponse<UserResponseDTO>> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  return response.json();
};
```

**Type Safety**:
```typescript
const user: UserResponseDTO = response.data;
user.email; // TypeScript knows this is a string
```

---

### Backend Usage

**Import**:
```typescript
import type { CreateUserDTO, UserResponseDTO } from '@gv/contracts';
```

**Use Case**:
```typescript
export class CreateUserUseCase {
  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    // Business logic
    return userResponse;
  }
}
```

**Controller**:
```typescript
async create(request: FastifyRequest, reply: FastifyReply) {
  const dto = request.body as CreateUserDTO;
  const user = await this.createUserUseCase.execute(dto);
  return reply.status(201).send(user);
}
```

---

## Contract Evolution

### Versioning Strategy

**Current**: v1 (implicit)

**Future**: Versioned contracts
```typescript
// v1 contracts
export namespace v1 {
  export interface UserResponseDTO { ... }
}

// v2 contracts
export namespace v2 {
  export interface UserResponseDTO { ... }
}
```

### Backward Compatibility

- **Add Fields**: New optional fields are backward compatible
- **Remove Fields**: Breaking change, requires version bump
- **Rename Fields**: Breaking change, requires version bump
- **Change Types**: Breaking change, requires version bump

---

## Validation

### Contract Validation

**Purpose**: Ensure contracts match implementation

**Validation** (planned):
- Check DTOs match route schemas
- Check response DTOs match actual responses
- Verify all contracts are used

---

## Best Practices

### Contract Design

- **Immutable**: DTOs should be treated as immutable
- **Optional Fields**: Use optional fields for nullable data
- **Date Formats**: Use ISO 8601 strings for dates
- **Enum Types**: Use string unions for enums
- **Generic Types**: Use generics for reusable patterns

### Contract Maintenance

- **Update Together**: Update contracts and implementation together
- **Document Changes**: Document breaking changes
- **Version Control**: Use semantic versioning
- **Deprecation**: Mark deprecated contracts before removal

---

## Source Traceability

**Source Folders**:
- `packages/contracts/` - Contracts package

**Key Files**:
- `packages/contracts/index.ts` - All DTOs and types

**Dependencies**:
- None (pure TypeScript)

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- `@gv/domain` - Domain entities that map to DTOs
- `@gv/schemas` - Validation schemas that match DTOs

**Usage In**:
- `apps/api/src/application/dto/` - Backend DTOs (should use contracts)
- `src/lib/api-client.ts` - Frontend API client
