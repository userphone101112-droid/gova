# Architecture Summary

Quick reference for AI agents to understand the system architecture.

## System Overview

Enterprise-grade monorepo with Clean Architecture, Domain-Driven Design, and SSOT packages for cross-cutting concerns.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios + TanStack Query (planned)

### Backend
- **Framework**: Fastify
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: SQLite (dev) / Turso (prod)
- **Auth**: JWT + bcrypt

### Infrastructure
- **Deployment**: Vercel
- **Database**: Turso (edge SQLite)
- **Storage**: Cloudflare R2, Google Drive (adapter pattern)
- **CI/CD**: GitHub Actions

## Architecture Patterns

- **Clean Architecture**: Separation of concerns with layers
- **Hexagonal Architecture**: Port-adapter pattern
- **Domain-Driven Design**: Entities, value objects, domain services
- **Repository Pattern**: Abstract data access
- **Adapter Pattern**: Pluggable implementations (auth, storage)
- **SSOT Pattern**: Single source of truth packages

## Directory Structure

### Frontend (src/)
```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/            # Utilities
├── store/          # Zustand stores
├── middleware/     # Next.js middleware
└── adapters/       # Adapter interfaces
```

### Backend (apps/api/src/)
```
apps/api/src/
├── application/     # Use cases, DTOs, ports
│   ├── use-cases/
│   ├── dto/
│   └── ports/
├── domain/          # Entities, value objects
│   ├── entities/
│   └── value-objects/
├── infrastructure/  # External services
│   ├── database/
│   ├── auth/
│   └── storage/
├── interfaces/     # HTTP layer
│   ├── http/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── validators/
│   └── queue/
└── app.ts          # Application entry
```

### Packages (packages/)
```
packages/
├── domain/          # Domain entities and value objects
├── contracts/       # API DTOs (SSOT)
├── schemas/        # Validation schemas (SSOT)
├── business-rules/  # Business constants (SSOT)
├── theme/          # Design tokens (SSOT)
├── translations/   # UI translations (SSOT)
├── localization/   # Locale utilities (SSOT)
├── auth/           # Auth package
├── branding/       # Branding package
├── config/         # Configuration package
└── [8 more packages]
```

## Key Architectural Decisions

- **ADR-0001**: Initial Architecture Decisions
- **ADR-0002**: Database Schema Decisions
- **ADR-0003**: SSOT Architecture Implementation
- **ADR-0004**: Monorepo Structure

See [docs/decisions/](../decisions/) for detailed ADRs.

## SSOT Packages

- **@gv/domain**: Domain entities and value objects
- **@gv/contracts**: API DTOs and response types
- **@gv/schemas**: Validation schemas
- **@gv/business-rules**: Business constants and limits
- **@gv/theme**: Design tokens (colors, spacing, typography)
- **@gv/translations**: UI translations
- **@gv/localization**: Locale detection and RTL support
- **@gv/auth**: Authentication package
- **@gv/branding**: Branding package
- **@gv/config**: Configuration package
- **[8 more packages]**: Additional shared packages

## Documentation Coverage (95%+ Complete)

### Architecture Documentation
- ✅ Frontend Architecture
- ✅ Backend Architecture
- ✅ Database Layer
- ✅ Repository Layer
- ✅ Use Cases
- ✅ Domain Models
- ✅ Authentication System
- ✅ Authorization System
- ✅ Storage System
- ✅ Image System
- ✅ API Endpoints
- ✅ Validation Layer
- ✅ Configuration System
- ✅ Deployment System
- ✅ CI/CD
- ✅ Testing Architecture

### Module Documentation
- ✅ Theme System
- ✅ Localization System
- ✅ Contracts System
- ✅ Business Rules System

## Documentation Location

All documentation is in [docs/](../) following the Documentation SSOT Governance System.

**Architecture**: [docs/architecture/](../architecture/)
**Modules**: [docs/modules/](../modules/)
**Deployment**: [docs/deployment/](../deployment/)
**Governance**: [docs/governance/](../governance/)
