# Use Cases

## Overview

Use cases represent the application layer's business logic orchestration. They coordinate between domain entities, repositories, and external services to implement specific business operations.

## Architecture Pattern

### Use Case Pattern

Each use case:
1. Accepts a DTO (Data Transfer Object) as input
2. Validates input (if needed)
3. Coordinates with repositories and services
4. Applies business rules
5. Returns a response DTO

### Benefits

- **Encapsulation**: Business logic isolated in use cases
- **Reusability**: Use cases can be reused across different interfaces
- **Testability**: Easy to test in isolation
- **Maintainability**: Clear separation of concerns

## Implemented Use Cases

### CreateUserUseCase

**Location**: `apps/api/src/application/use-cases/create-user.use-case.ts`

**Purpose**: Register a new user with email validation and password hashing

**Input**: `CreateUserDTO`
- `email`: string (validated by Email value object)
- `password`: string (will be hashed)
- `name`: string

**Output**: `UserResponseDTO`
- `id`: string
- `email`: string
- `name`: string
- `createdAt`: Date
- `updatedAt`: Date

**Business Logic**:
1. Check if user already exists by email
2. Generate UserId using UserId.generate()
3. Create Email value object (validates format)
4. Hash password using password hasher
5. Create User entity with UserId, Email, name, hashed password
6. Persist user via repository
7. Return UserResponseDTO

**Error Handling**:
- `UserAlreadyExistsError`: Thrown if email already registered
- `InvalidEmailError`: Thrown if email format invalid
- `PasswordValidationError`: Thrown if password doesn't meet requirements

**Dependencies**:
- `IUserRepository`: User data access
- `PasswordHasher`: Password hashing service

**Related ADRs**: ADR-0001

---

### LoginUserUseCase

**Location**: `apps/api/src/application/use-cases/login-user.use-case.ts`

**Purpose**: Authenticate user and generate JWT token

**Input**: `LoginDTO`
- `email`: string
- `password`: string

**Output**: `LoginResponseDTO`
- `user`: UserResponseDTO
- `token`: string (JWT)

**Business Logic**:
1. Find user by email via repository
2. Verify password using password hasher
3. Generate JWT token using token generator
4. Return user data and token

**Error Handling**:
- `UserNotFoundError`: Thrown if email not found
- `InvalidCredentialsError`: Thrown if password verification fails

**Dependencies**:
- `IUserRepository`: User data access
- `PasswordHasher`: Password verification
- `TokenGenerator`: JWT token generation

**Related ADRs**: ADR-0001

---

### UploadImageUseCase

**Location**: `apps/api/src/application/use-cases/upload-image.use-case.ts`

**Purpose**: Upload image to storage and save metadata

**Input**: Upload parameters
- `file`: Buffer
- `fileName`: string
- `mimeType`: string
- `entityType`: string ('user' | 'product' | 'post' | 'other')
- `entityId`: string
- `maxSizeMB`: number (default: 10)

**Output**: `Image` entity

**Business Logic**:
1. Validate MIME type against allowed types
2. Validate file size against max size
3. Upload file to storage provider
4. Create Image entity with URL, provider, metadata
5. Save image metadata via repository
6. Return Image entity

**Validation Rules**:
- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif, image/svg+xml
- Max size: 10MB (configurable)

**Error Handling**:
- `InvalidImageTypeError`: Thrown if MIME type not allowed
- `ImageSizeExceededError`: Thrown if file too large
- `StorageError`: Thrown if upload fails

**Dependencies**:
- `IImageStorageProvider`: Storage service
- `IImageRepository`: Image data access

**Related ADRs**: ADR-0001

---

### DeleteImageUseCase

**Location**: `apps/api/src/application/use-cases/delete-image.use-case.ts`

**Purpose**: Delete image from storage and database

**Input**: `id` (string)

**Output**: void

**Business Logic**:
1. Find image by ID via repository
2. Delete file from storage provider
3. Delete image metadata from repository

**Error Handling**:
- `ImageNotFoundError`: Thrown if image not found
- `StorageError`: Thrown if storage deletion fails

**Dependencies**:
- `IImageStorageProvider`: Storage service
- `IImageRepository`: Image data access

**Related ADRs**: ADR-0001

---

### GetImageUseCase

**Location**: `apps/api/src/application/use-cases/get-image.use-case.ts`

**Purpose**: Retrieve image by ID

**Input**: `id` (string)

**Output**: `Image` entity

**Business Logic**:
1. Find image by ID via repository
2. Return Image entity

**Error Handling**:
- `ImageNotFoundError`: Thrown if image not found

**Dependencies**:
- `IImageRepository`: Image data access

**Related ADRs**: ADR-0001

---

### ListImagesUseCase

**Location**: `apps/api/src/application/use-cases/list-images.use-case.ts`

**Purpose**: List images with pagination

**Input**: List parameters
- `limit`: number (optional)
- `offset`: number (optional)

**Output**: List result
- `images`: Image[]
- `total`: number
- `limit`: number
- `offset`: number
- `hasMore`: boolean

**Business Logic**:
1. Query images with pagination via repository
2. Calculate hasMore flag
3. Return paginated result

**Error Handling**:
- None (returns empty list if no images)

**Dependencies**:
- `IImageRepository`: Image data access

**Related ADRs**: ADR-0001

---

## Use Case Patterns

### Standard Use Case Structure

```typescript
export class ExampleUseCase {
  constructor(
    private readonly dependency1: Dependency1,
    private readonly dependency2: Dependency2
  ) {}

  async execute(dto: InputDTO): Promise<OutputDTO> {
    // 1. Validate input (if needed)
    // 2. Check business rules
    // 3. Coordinate with repositories/services
    // 4. Apply business logic
    // 5. Return result
  }
}
```

### Error Handling Pattern

```typescript
try {
  // Business logic
} catch (error) {
  if (error instanceof SpecificError) {
    throw new DomainError();
  }
  throw new ApplicationError(error.message);
}
```

## Future Use Cases

### Planned Use Cases

- **CreateProductUseCase**: Create new product
- **UpdateProductUseCase**: Update product details
- **DeleteProductUseCase**: Delete product
- **ListProductsUseCase**: List products with filters
- **CreateMerchantUseCase**: Create merchant profile
- **CreateOrderUseCase**: Create new order
- **UpdateOrderStatusUseCase**: Update order status
- **ProcessPaymentUseCase**: Process payment
- **SendNotificationUseCase**: Send notifications

## Source Traceability

**Source Folders**:
- `apps/api/src/application/use-cases/` - Use case implementations
- `apps/api/src/application/dto/` - Data Transfer Objects
- `apps/api/src/application/ports/` - Repository interfaces

**Key Files**:
- `apps/api/src/application/use-cases/create-user.use-case.ts` - User creation
- `apps/api/src/application/use-cases/login-user.use-case.ts` - User authentication
- `apps/api/src/application/use-cases/upload-image.use-case.ts` - Image upload
- `apps/api/src/application/use-cases/delete-image.use-case.ts` - Image deletion
- `apps/api/src/application/use-cases/get-image.use-case.ts` - Image retrieval
- `apps/api/src/application/use-cases/list-images.use-case.ts` - Image listing

**Dependencies**:
- `@gv/domain` - Domain entities and value objects
- `@gv/contracts` - DTOs
- `@gv/business-rules` - Business rules

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- `@gv/domain` - Domain entities used in use cases
- `@gv/contracts` - DTOs for input/output
