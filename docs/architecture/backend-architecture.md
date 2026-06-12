# Backend Architecture

## Overview

The backend is built with Fastify following Clean Architecture and Hexagonal Architecture principles. It implements a layered architecture with clear separation of concerns and dependency inversion.

## Technology Stack

- **Framework**: Fastify (high-performance Node.js web framework)
- **Language**: TypeScript 5 with strict mode
- **Database**: Drizzle ORM with SQLite (dev) / Turso (prod)
- **Authentication**: JWT with bcrypt password hashing
- **Storage**: Cloudflare R2 / Google Drive (adapter pattern)
- **Validation**: Zod schemas
- **Testing**: Vitest

## Architecture Patterns

### Clean Architecture

The backend follows Clean Architecture with four main layers:

1. **Domain Layer**: Core business logic and entities
2. **Application Layer**: Use cases and business logic orchestration
3. **Infrastructure Layer**: External services and data access
4. **Interfaces Layer**: HTTP controllers and routes

### Hexagonal Architecture

Implements ports and adapters pattern:
- **Ports**: Interfaces defined in application layer
- **Adapters**: Implementations in infrastructure layer

## Directory Structure

```
apps/api/src/
├── app.ts                  # Application entry point
├── server.ts               # Server configuration
├── application/            # Application layer
│   ├── dto/               # Data Transfer Objects
│   │   └── user.dto.ts    # User DTOs
│   ├── ports/             # Ports (interfaces)
│   │   ├── user.repository.port.ts
│   │   └── image-repository.port.ts
│   └── use-cases/         # Use cases
│       ├── create-user.use-case.ts
│       ├── login-user.use-case.ts
│       ├── upload-image.use-case.ts
│       ├── delete-image.use-case.ts
│       ├── get-image.use-case.ts
│       └── list-images.use-case.ts
├── domain/                 # Domain layer
│   ├── entities/          # Domain entities
│   │   ├── user.entity.ts
│   │   ├── product.entity.ts
│   │   └── image.entity.ts
│   ├── value-objects/     # Value objects
│   │   ├── email.ts
│   │   ├── user-id.ts
│   │   ├── product-id.ts
│   │   ├── image-id.ts
│   │   └── money.ts
│   ├── errors/            # Domain errors
│   ├── events/            # Domain events
│   ├── services/          # Domain services
│   └── index.ts           # Domain exports
├── infrastructure/         # Infrastructure layer
│   ├── auth/              # Authentication
│   │   ├── password-hasher.ts
│   │   └── jwt.service.ts
│   ├── database/          # Database
│   │   ├── adapters/      # Database adapters
│   │   │   └── database.factory.ts
│   │   ├── migrations/    # Database migrations
│   │   ├── repositories/  # Repository implementations
│   │   │   ├── user.repository.ts
│   │   │   └── image.repository.ts
│   │   ├── schema/        # Database schemas
│   │   │   ├── index.ts
│   │   │   └── image.schema.ts
│   │   ├── seeds/         # Seed data
│   │   └── index.ts       # Database exports
│   ├── storage/           # Storage adapters
│   │   ├── storage.factory.ts
│   │   ├── cloudflare.adapter.ts
│   │   └── google-drive.adapter.ts
│   ├── logger/            # Logging
│   └── index.ts           # Infrastructure exports
├── interfaces/             # Interfaces layer
│   ├── http/              # HTTP interface
│   │   ├── controllers/   # Controllers
│   │   │   ├── user.controller.ts
│   │   │   └── image.controller.ts
│   │   ├── middlewares/   # Middlewares
│   │   ├── plugins/      # Fastify plugins
│   │   ├── routes/       # Route definitions
│   │   │   ├── user.routes.ts
│   │   │   └── image.routes.ts
│   │   └── validators/    # Request validators
│   │       └── image.validator.ts
│   └── index.ts           # Interface exports
├── config/                 # Configuration
│   └── env.ts            # Environment configuration
└── shared/                # Shared utilities
```

## Application Layer

### Use Cases

The application layer contains use cases that orchestrate business logic:

- **CreateUserUseCase**: User registration with password hashing
- **LoginUserUseCase**: User authentication with JWT token generation
- **UploadImageUseCase**: Image upload with validation and storage
- **DeleteImageUseCase**: Image deletion from storage and database
- **GetImageUseCase**: Retrieve image by ID
- **ListImagesUseCase**: List images with pagination

### DTOs

Data Transfer Objects define the shape of data moving between layers:

- **CreateUserDTO**: User creation request
- **UpdateUserDTO**: User update request
- **UserResponseDTO**: User response
- **LoginDTO**: Login request
- **LoginResponseDTO**: Login response with token

### Ports

Ports define interfaces for infrastructure implementations:

- **IUserRepository**: User data access interface
- **IImageRepository**: Image data access interface
- **IImageStorageProvider**: Image storage interface

## Domain Layer

### Entities

Domain entities contain business logic and invariants:

- **User**: User entity with email validation and password rules
- **Product**: Product entity with pricing and stock management
- **Image**: Image entity with validation and provider abstraction

### Value Objects

Value objects represent immutable concepts:

- **Email**: Email address with validation
- **UserId**: User identifier with UUID validation
- **ProductId**: Product identifier with UUID validation
- **ImageId**: Image identifier with UUID validation
- **Money**: Monetary value with arithmetic operations

### Domain Errors

Custom error types for domain-specific failures:

- **UserAlreadyExistsError**: Duplicate user registration
- **UserNotFoundError**: User not found
- **InvalidCredentialsError**: Authentication failure
- **InvalidImageTypeError**: Unsupported image format
- **ImageSizeExceededError**: Image too large

## Infrastructure Layer

### Database

**Database Factory**: Creates database connections based on environment
- SQLite for development
- Turso for production

**Repositories**: Implement data access ports
- **UserRepository**: User CRUD operations
- **ImageRepository**: Image CRUD operations

**Migrations**: Database schema migrations
- Initial schema creation
- Index creation
- Relationship definitions

### Authentication

**Password Hasher**: bcrypt-based password hashing
- Hash passwords on creation
- Verify passwords on login

**JWT Service**: JWT token generation and verification
- Generate access tokens
- Verify token validity
- Extract user claims

### Storage

**Storage Factory**: Creates storage provider based on configuration
- Cloudflare R2 for production
- Google Drive for alternative

**Storage Adapters**: Implement storage interface
- **CloudflareAdapter**: Cloudflare R2 implementation
- **GoogleDriveAdapter**: Google Drive implementation

## Interfaces Layer

### Controllers

HTTP controllers handle incoming requests:

- **UserController**: User registration and login
- **ImageController**: Image upload, retrieval, deletion

### Routes

Route definitions with Fastify schema validation:

- **user.routes.ts**: POST /users, POST /users/login
- **image.routes.ts**: POST /images/upload, GET /images/:id, GET /images, DELETE /images/:id

### Validators

Request validation using Zod schemas:

- **createUserSchema**: User creation validation
- **loginSchema**: Login validation
- **uploadImageSchema**: Image upload validation

### Plugins

Fastify plugins for cross-cutting concerns:

- **JWT authentication**: Token verification middleware
- **CORS**: Cross-origin resource sharing
- **Rate limiting**: Request rate limiting
- **Error handling**: Global error handling

## API Endpoints

### User Endpoints

- `POST /users` - Create new user
- `POST /users/login` - User login

### Image Endpoints

- `POST /images/upload` - Upload image
- `GET /images/:id` - Get image by ID
- `GET /images` - List images with pagination
- `DELETE /images/:id` - Delete image

### Health Endpoints

- `GET /health` - Health check
- `GET /ready` - Readiness check

## Security

### Authentication

- JWT-based authentication
- Password hashing with bcrypt
- Token-based API access

### Authorization

- Role-based access control (planned)
- Resource ownership verification (planned)

### Input Validation

- Zod schema validation
- Type-safe request handling
- Sanitization of user input

### Security Headers

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## Error Handling

### Error Types

- **Domain Errors**: Business logic failures
- **Infrastructure Errors**: External service failures
- **Validation Errors**: Input validation failures
- **HTTP Errors**: HTTP-specific errors

### Error Response Format

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

## Performance

### Database Optimization

- Connection pooling
- Query optimization
- Index usage
- Prepared statements

### Caching

- Response caching (planned)
- Database query caching (planned)
- CDN integration for images

### Monitoring

- Request logging
- Performance metrics
- Error tracking
- Health checks

## Source Traceability

**Source Folders**:
- `apps/api/src/application/` - Application layer
- `apps/api/src/domain/` - Domain layer
- `apps/api/src/infrastructure/` - Infrastructure layer
- `apps/api/src/interfaces/` - Interfaces layer

**Key Files**:
- `apps/api/src/app.ts` - Application entry point
- `apps/api/src/config/env.ts` - Environment configuration
- `apps/api/src/infrastructure/database/schema/index.ts` - Database schema

**Dependencies**:
- `fastify` - Web framework
- `drizzle-orm` - ORM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT implementation
- `zod` - Validation

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0002: Documentation Governance Strategy
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- `@gv/domain` - Domain entities and value objects
- `@gv/contracts` - API contracts
- `@gv/schemas` - Validation schemas
- `@gv/business-rules` - Business rules
