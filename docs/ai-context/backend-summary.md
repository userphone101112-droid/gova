# Backend Summary

Quick reference for AI agents to understand the backend architecture.

## Backend Framework

Fastify with Clean + Hexagonal Architecture

## Architecture Layers

1. **Presentation Layer** (`interfaces/http/`): API routes, controllers, validators
2. **Application Layer** (`application/`): Use cases, DTOs, ports
3. **Domain Layer** (`domain/`): Entities, value objects, business rules
4. **Infrastructure Layer** (`infrastructure/`): Database, auth, storage

## Key Patterns

- **Hexagonal Architecture**: Ports and adapters for external services
- **Repository Pattern**: Abstract data access via interfaces
- **Use Case Pattern**: Business logic orchestration
- **Adapter Pattern**: Pluggable implementations (auth, storage)

## API Structure

**Location**: `apps/api/src/interfaces/http/`

- RESTful API design
- JWT authentication
- Request/response validation with Zod
- Error handling middleware
- Fastify route registration

**Endpoints**:
- `POST /users` - User registration
- `POST /users/login` - User login
- `POST /images/upload` - Image upload
- `GET /images/:id` - Get image
- `GET /images` - List images (paginated)
- `DELETE /images/:id` - Delete image

## Database

**ORM**: Drizzle ORM
**Development**: SQLite file database
**Production**: Turso (edge SQLite)

**Schema Location**: `apps/api/src/infrastructure/database/schema/`
**Tables**: users, products, images

**Migrations**: Tracked in Drizzle configuration

## Use Cases

**Location**: `apps/api/src/application/use-cases/`

**Implemented**:
- CreateUserUseCase - User registration with password hashing
- LoginUserUseCase - User authentication with JWT generation
- UploadImageUseCase - Image upload to storage
- DeleteImageUseCase - Image deletion
- GetImageUseCase - Image retrieval
- ListImagesUseCase - Paginated image listing

## Adapters

**Location**: `src/adapters/` and `apps/api/src/infrastructure/`

- `auth.adapter.ts` - Authentication adapter interface
- `storage.adapter.ts` - Storage adapter interface
- `queue.adapter.ts` - Queue adapter interface
- Password hasher - bcrypt implementation
- JWT service - Token generation and verification

## Documentation

- Full architecture: [../architecture/backend-architecture.md](../architecture/backend-architecture.md)
- Use cases: [../architecture/use-cases.md](../architecture/use-cases.md)
- API endpoints: [../architecture/api-endpoints.md](../architecture/api-endpoints.md)
- Repository layer: [../architecture/repository-layer.md](../architecture/repository-layer.md)
