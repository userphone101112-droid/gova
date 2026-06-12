# API Endpoints

## Overview

The API provides RESTful endpoints for user management, image handling, and health checks. Built with Fastify, it follows REST principles with JSON request/response format and comprehensive validation.

## Base URL

**Development**: `http://localhost:3000`
**Production**: Configured via environment

## Authentication

### JWT Authentication

Most endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <token>
```

### Public Endpoints

- `POST /users` - User registration
- `POST /users/login` - User login
- `GET /health` - Health check
- `GET /ready` - Readiness check

## User Endpoints

### Create User

**Endpoint**: `POST /users`

**Purpose**: Register a new user account

**Authentication**: Not required

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Validation**:
- `email`: Valid email format, unique
- `password`: Min 8 characters
- `name`: Min 2 characters

**Response** (201 Created):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 400: Invalid input
- 409: Email already exists
- 500: Internal server error

**Use Case**: CreateUserUseCase

**Controller**: UserController.create

**Route**: `apps/api/src/interfaces/http/routes/user.routes.ts`

---

### Login User

**Endpoint**: `POST /users/login`

**Purpose**: Authenticate user and receive JWT token

**Authentication**: Not required

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Validation**:
- `email`: Valid email format
- `password`: Required

**Response** (200 OK):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_string"
}
```

**Error Responses**:
- 400: Invalid input
- 401: Invalid credentials
- 404: User not found
- 500: Internal server error

**Use Case**: LoginUserUseCase

**Controller**: UserController.login

**Route**: `apps/api/src/interfaces/http/routes/user.routes.ts`

---

## Image Endpoints

### Upload Image

**Endpoint**: `POST /images/upload`

**Purpose**: Upload an image to storage

**Authentication**: Required

**Request**:
- Content-Type: `multipart/form-data`
- Body:
  - `file`: File (binary)
  - `fileName`: string
  - `mimeType`: string
  - `entityType`: string ('user' | 'product' | 'post' | 'other')
  - `entityId`: string

**Validation**:
- `file`: Required
- `fileName`: Required
- `mimeType`: Must be image/jpeg, image/png, image/webp, image/gif, image/svg+xml
- `entityType`: Required
- `entityId`: Required
- File size: Max 10MB

**Response** (201 Created):
```json
{
  "id": "uuid",
  "url": "https://storage.example.com/image.jpg",
  "provider": "cloudflare",
  "providerFileId": "provider_file_id",
  "entityType": "user",
  "entityId": "user_uuid",
  "mimeType": "image/jpeg",
  "size": 1024000,
  "width": 1920,
  "height": 1080,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 400: Invalid input or file validation failed
- 401: Unauthorized
- 413: File too large
- 500: Internal server error

**Use Case**: UploadImageUseCase

**Controller**: ImageController.upload

**Route**: `apps/api/src/interfaces/http/routes/image.routes.ts`

---

### Get Image

**Endpoint**: `GET /images/:id`

**Purpose**: Retrieve image metadata by ID

**Authentication**: Required

**Request Parameters**:
- `id`: string (path parameter)

**Response** (200 OK):
```json
{
  "id": "uuid",
  "url": "https://storage.example.com/image.jpg",
  "provider": "cloudflare",
  "providerFileId": "provider_file_id",
  "entityType": "user",
  "entityId": "user_uuid",
  "mimeType": "image/jpeg",
  "size": 1024000,
  "width": 1920,
  "height": 1080,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 401: Unauthorized
- 404: Image not found
- 500: Internal server error

**Use Case**: GetImageUseCase

**Controller**: ImageController.get

**Route**: `apps/api/src/interfaces/http/routes/image.routes.ts`

---

### List Images

**Endpoint**: `GET /images`

**Purpose**: List images with pagination

**Authentication**: Required

**Query Parameters**:
- `limit`: number (optional, default: 50)
- `offset`: number (optional, default: 0)

**Response** (200 OK):
```json
{
  "images": [
    {
      "id": "uuid",
      "url": "https://storage.example.com/image.jpg",
      "provider": "cloudflare",
      "providerFileId": "provider_file_id",
      "entityType": "user",
      "entityId": "user_uuid",
      "mimeType": "image/jpeg",
      "size": 1024000,
      "width": 1920,
      "height": 1080,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0,
  "hasMore": true
}
```

**Error Responses**:
- 401: Unauthorized
- 500: Internal server error

**Use Case**: ListImagesUseCase

**Controller**: ImageController.list

**Route**: `apps/api/src/interfaces/http/routes/image.routes.ts`

---

### Delete Image

**Endpoint**: `DELETE /images/:id`

**Purpose**: Delete image from storage and database

**Authentication**: Required

**Request Parameters**:
- `id`: string (path parameter)

**Response**: 204 No Content

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (not owner)
- 404: Image not found
- 500: Internal server error

**Use Case**: DeleteImageUseCase

**Controller**: ImageController.delete

**Route**: `apps/api/src/interfaces/http/routes/image.routes.ts`

---

## Health Endpoints

### Health Check

**Endpoint**: `GET /health`

**Purpose**: Basic health check

**Authentication**: Not required

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Use Case**: System health monitoring

---

### Ready Check

**Endpoint**: `GET /ready`

**Purpose**: Check if application is ready to serve requests

**Authentication**: Not required

**Response** (200 OK):
```json
{
  "status": "ready",
  "database": true
}
```

**Response** (503 Service Unavailable):
```json
{
  "status": "not ready",
  "database": false
}
```

**Use Case**: Kubernetes readiness probe

---

## Data Transfer Objects (DTOs)

### User DTOs

**Location**: `packages/contracts/index.ts`

**CreateUserDTO**:
```typescript
{
  email: string;
  password: string;
  name: string;
}
```

**UpdateUserDTO**:
```typescript
{
  name?: string;
  password?: string;
}
```

**UserResponseDTO**:
```typescript
{
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

**LoginDTO**:
```typescript
{
  email: string;
  password: string;
}
```

**LoginResponseDTO**:
```typescript
{
  user: UserResponseDTO;
  token: string;
}
```

---

### Image DTOs

**UploadImageDTO**:
```typescript
{
  file: unknown;
  fileName: string;
  mimeType: string;
  entityType: string;
  entityId: string;
}
```

**ImageResponseDTO**:
```typescript
{
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

**ListImagesQueryDTO**:
```typescript
{
  limit?: number;
  offset?: number;
}
```

**ListImagesResponseDTO**:
```typescript
{
  images: ImageResponseDTO[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
```

---

### Product DTOs

**CreateProductDTO**:
```typescript
{
  name: string;
  description: string;
  price: number;
  stock?: number;
}
```

**UpdateProductDTO**:
```typescript
{
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}
```

**ProductResponseDTO**:
```typescript
{
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

## Validation Rules

### User Validation

**Email**:
- Format: Valid email regex
- Unique: Must not exist in database

**Password**:
- Length: Min 8 characters
- Complexity: (planned) uppercase, lowercase, number, special char

**Name**:
- Length: Min 2 characters
- Max: 100 characters

---

### Image Validation

**MIME Type**:
- Allowed: image/jpeg, image/png, image/webp, image/gif, image/svg+xml

**File Size**:
- Max: 10MB (configurable)

**Entity Association**:
- entityType: Required
- entityId: Required
- Must be valid entity

---

### Product Validation

**Name**:
- Length: Min 3 characters
- Max: 100 characters

**Description**:
- Length: Min 10 characters
- Max: 2000 characters

**Price**:
- Min: 0.01
- Must be positive number

**Stock**:
- Min: 0
- Must be non-negative integer

---

## Error Responses

### Standard Error Format

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: Record<string, unknown>
  }
}
```

### Error Codes

**Authentication Errors**:
- `UNAUTHORIZED`: Invalid or missing token
- `INVALID_CREDENTIALS`: Wrong email or password
- `USER_NOT_FOUND`: User does not exist
- `USER_ALREADY_EXISTS`: Email already registered

**Validation Errors**:
- `INVALID_INPUT`: Request validation failed
- `INVALID_EMAIL`: Email format invalid
- `INVALID_PASSWORD`: Password doesn't meet requirements
- `INVALID_IMAGE_TYPE`: Unsupported image format
- `IMAGE_SIZE_EXCEEDED`: File too large

**Resource Errors**:
- `NOT_FOUND`: Resource not found
- `FORBIDDEN`: Access denied
- `CONFLICT`: Resource conflict

**Server Errors**:
- `INTERNAL_ERROR`: Internal server error
- `DATABASE_ERROR`: Database operation failed
- `STORAGE_ERROR`: Storage operation failed

---

## Rate Limiting

**Planned**: Implement rate limiting per endpoint

**Default Limits** (planned):
- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- Upload endpoints: 10 requests/minute

---

## CORS

**Configuration**: Fastify CORS plugin

**Allowed Origins**: Configured via environment

**Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers**: Content-Type, Authorization

---

## Source Traceability

**Source Folders**:
- `apps/api/src/interfaces/http/controllers/` - Controllers
- `apps/api/src/interfaces/http/routes/` - Route definitions
- `apps/api/src/application/use-cases/` - Use cases
- `apps/api/src/application/dto/` - DTOs
- `apps/api/src/interfaces/http/validators/` - Validation schemas

**Key Files**:
- `apps/api/src/interfaces/http/controllers/user.controller.ts` - User controller
- `apps/api/src/interfaces/http/controllers/image.controller.ts` - Image controller
- `apps/api/src/interfaces/http/routes/user.routes.ts` - User routes
- `apps/api/src/interfaces/http/routes/image.routes.ts` - Image routes
- `packages/contracts/index.ts` - DTO definitions

**Dependencies**:
- `fastify` - Web framework
- `@fastify/jwt` - JWT authentication
- `zod` - Validation
- `@gv/schemas` - Validation schemas

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions

**Related Packages**:
- `@gv/contracts` - DTO definitions
- `@gv/schemas` - Validation schemas
