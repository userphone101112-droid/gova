# Enterprise Backend API

Production-grade backend API built with Clean Architecture, Hexagonal Architecture, and Domain-Driven Design principles.

## Architecture

This backend follows a strict architectural separation:

- **Domain Layer**: Pure business logic with no external dependencies
- **Application Layer**: Use cases coordinating domain and infrastructure
- **Infrastructure Layer**: External systems implementation (database, auth, logging)
- **Interface Layer**: Fastify HTTP API with routes and controllers

## Tech Stack

- **Runtime**: Node.js (latest LTS)
- **Language**: TypeScript (strict mode)
- **Framework**: Fastify
- **Database**: Drizzle ORM with SQLite (dev) / Turso (prod)
- **Validation**: Zod
- **Logging**: Pino
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
cd apps/api
npm install
```

### Configuration

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Database Operations

```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio
```

## Project Structure

```
apps/api/
├── src/
│   ├── domain/              # Pure business logic
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── services/
│   │   ├── events/
│   │   └── errors/
│   │
│   ├── application/         # Use cases layer
│   │   ├── use-cases/
│   │   ├── dto/
│   │   └── ports/
│   │
│   ├── infrastructure/      # External systems
│   │   ├── database/
│   │   ├── auth/
│   │   ├── logger/
│   │   └── config/
│   │
│   ├── interfaces/         # API layer
│   │   └── http/
│   │
│   ├── shared/             # Shared utilities
│   ├── config/             # Configuration
│   ├── app.ts
│   └── server.ts
│
├── tests/
├── docs/
└── package.json
```

## Key Features

- **Database Abstraction**: Switch between SQLite and Turso via environment variables
- **Repository Pattern**: Clean data access with generic base repository
- **Domain-Driven Design**: Rich domain model with value objects and entities
- **Hexagonal Architecture**: Ports and adapters for external dependencies
- **Type Safety**: Strict TypeScript with comprehensive type definitions
- **Security**: JWT auth, password hashing, rate limiting, security headers
- **Observability**: Structured logging, health checks, ready checks
- **Testing**: Vitest with coverage reporting

## API Endpoints

### Health Checks

- `GET /health` - Health check endpoint
- `GET /ready` - Readiness check endpoint

### Users

- `POST /api/v1/users` - Create a new user
- `POST /api/v1/users/login` - User login

## Environment Variables

| Variable          | Description                      | Default       |
| ----------------- | -------------------------------- | ------------- |
| NODE_ENV          | Environment                      | development   |
| PORT              | Server port                      | 4000          |
| DATABASE_PROVIDER | Database provider (sqlite/turso) | sqlite        |
| DATABASE_URL      | Database connection string       | file:./dev.db |
| TURSO_AUTH_TOKEN  | Turso authentication token       | -             |
| JWT_SECRET        | JWT secret key                   | -             |
| JWT_EXPIRES_IN    | JWT expiration time              | 7d            |
| LOG_LEVEL         | Logging level                    | info          |

## Development Guidelines

- Follow Clean Architecture principles
- No external dependencies in domain layer
- Use repositories for all database access
- Implement use cases for business logic
- Keep controllers thin - delegate to use cases
- Use Zod for all input validation
- Write tests for all business logic

## License

MIT
