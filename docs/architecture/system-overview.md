# System Architecture Overview

> **Source**: `docs/architecture/system-overview.md`
> **Status**: Active | Last Updated: 2026-06-12

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GV Monorepo                             │
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────────────────┐  │
│  │   Next.js App    │         │      Fastify API             │  │
│  │   (src/)         │         │      (apps/api/)             │  │
│  │                  │◄────────►                              │  │
│  │  - App Router    │  HTTP   │  - Clean Architecture        │  │
│  │  - Zustand       │         │  - Hexagonal Pattern         │  │
│  │  - TanStack Q    │         │  - Repository Pattern        │  │
│  │  - Tailwind v4   │         │  - Domain-Driven Design      │  │
│  └──────────────────┘         └──────────────────────────────┘  │
│          │                                    │                  │
│          └──────────────┬─────────────────────┘                  │
│                         │                                       │
│              ┌──────────▼──────────┐                            │
│              │  Shared SSOT Pkgs   │                            │
│              │  (packages/*)       │                            │
│              │                     │                            │
│              │  @gv/domain         │                            │
│              │  @gv/contracts      │                            │
│              │  @gv/schemas        │                            │
│              │  @gv/auth           │                            │
│              │  @gv/theme          │                            │
│              │  @gv/translations   │                            │
│              │  ... (16 total)     │                            │
│              └─────────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer Architecture (Backend — Fastify)

```
Interface Layer     (apps/api/src/interfaces/)
    │
Application Layer   (apps/api/src/application/)
    │
Domain Layer        (packages/domain/) ← SSOT
    │
Infrastructure Layer (apps/api/src/infrastructure/)
```

### Domain Layer Rules

- Zero external dependencies
- Pure TypeScript classes
- Validated by value objects
- Shared via `@gv/domain`

### Application Layer Rules

- Orchestrates use-cases
- DTOs from `@gv/contracts`
- Schemas from `@gv/schemas`

### Infrastructure Layer Rules

- Database: Drizzle ORM (SQLite/Turso)
- Auth: JWT (`@fastify/jwt`)
- Storage: Cloudflare R2 / Google Drive (adapter pattern)

---

## Layer Architecture (Frontend — Next.js)

```
Pages / App Router  (src/app/)
    │
Components          (src/components/)
    │
Feature Modules     (src/features/)
    │
State (Zustand)     (src/store/)
    │
API Client          (src/api/)
    │
SSOT Packages       (packages/*) ← contracts, schemas, translations, theme
```

---

## Key Architectural Patterns

| Pattern                    | Where Used                 | Package                                              |
| -------------------------- | -------------------------- | ---------------------------------------------------- |
| Clean Architecture         | Fastify backend            | `apps/api/src/`                                      |
| Hexagonal (Ports/Adapters) | Backend external services  | `apps/api/src/application/ports/`                    |
| Repository Pattern         | Database access            | `apps/api/src/infrastructure/database/repositories/` |
| Adapter Pattern            | Storage providers          | `apps/api/src/infrastructure/storage/`               |
| SSOT Packages              | All cross-cutting concerns | `packages/*`                                         |
| Feature Flags              | Runtime toggles            | `@gv/features`                                       |
| Domain-Driven Design       | Business entities          | `@gv/domain`                                         |

---

## Data Flow — API Request

```
Browser → Next.js API Route / External Client
       → Fastify HTTP Layer (Controller)
       → Use Case (Application Layer)
       → Domain Entities (Domain Layer)
       → Repository (Infrastructure Layer)
       → Drizzle ORM → SQLite/Turso
```

---

## Related Documents

- [Backend Architecture](./backend-architecture.md)
- [Frontend Architecture](./frontend-architecture.md)
- [Database Architecture](./database-architecture.md)
- [SSOT Packages Overview](../packages/ssot-overview.md)
- [ADR-0001: Clean Architecture Selection](../decisions/ADR-0001.md)
- [ADR-0002: SSOT Package Strategy](../decisions/ADR-0002.md)
