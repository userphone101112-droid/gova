# Frontend Architecture

## Overview

The frontend is built with Next.js 16.2.9 using the App Router architecture. It follows a component-based architecture with state management via Zustand and data fetching via TanStack Query.

## Technology Stack

- **Framework**: Next.js 16.2.9 (App Router, Turbopack)
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS 4 with design tokens
- **State Management**: Zustand with modular stores
- **Data Fetching**: Axios with TanStack Query
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components with Lucide icons

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   └── favicon.ico         # Favicon
├── components/             # React components
│   ├── ui/                # Basic UI components (buttons, inputs, etc.)
│   ├── forms/             # Form components
│   ├── layouts/           # Layout components
│   └── shared/            # Shared components
├── features/              # Feature-based modules
├── domains/               # Domain-driven design entities
├── services/              # Business logic services
├── repositories/          # Data access layer
├── lib/                   # Utility functions
│   ├── api-client.ts      # Axios client configuration
│   ├── logger.ts          # Logging utilities
│   ├── performance.ts     # Performance monitoring
│   └── security.ts        # Security utilities
├── hooks/                 # Custom React hooks
├── providers/             # React context providers
├── store/                 # Zustand state management
│   ├── index.ts           # Store configuration
│   ├── slices/            # Individual store slices
│   │   ├── auth.slice.ts  # Authentication state
│   │   ├── data.slice.ts  # Data state
│   │   └── ui.slice.ts    # UI state
│   └── types.ts           # Store type definitions
├── middleware/            # Next.js middleware
├── api/                   # API routes and contracts
│   └── contracts/         # API contract definitions
├── server/                # Server-side code
│   └── db/               # Database configuration
├── constants/             # Application constants
├── configs/               # Configuration files
│   └── env.ts            # Environment configuration
├── validations/           # Validation schemas
├── schemas/               # Database schemas
├── types/                 # TypeScript types
├── utils/                 # Utility functions
├── helpers/               # Helper functions
├── styles/                # Global styles
├── assets/                # Static assets
├── tests/                 # Test files
├── mocks/                 # Mock data
├── docs/                  # Documentation
└── generated/             # Generated files
```

## Architecture Patterns

### Component Architecture

The frontend follows a hierarchical component structure:

1. **Layout Components**: Page-level layouts (header, footer, sidebar)
2. **Feature Components**: Business logic components (user forms, product lists)
3. **UI Components**: Reusable UI elements (buttons, inputs, cards)
4. **Shared Components**: Cross-cutting components (modals, toasts)

### State Management

State is managed through Zustand stores organized by domain:

- **auth.slice.ts**: Authentication state (user, token, loading state)
- **data.slice.ts**: Application data (users, products, images)
- **ui.slice.ts**: UI state (modals, toasts, theme)

### Data Fetching

Data fetching is handled through:
- **TanStack Query**: Server state management with caching and synchronization
- **Axios**: HTTP client with interceptors for auth and error handling
- **API Client**: Configured client in `src/lib/api-client.ts`

### Form Handling

Forms use React Hook Form with Zod validation:
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation and type inference
- **Form Components**: Reusable form components in `src/components/forms/`

## Key Components

### API Client (`src/lib/api-client.ts`)

Configured Axios client with:
- Base URL configuration
- Request/response interceptors
- Authentication token injection
- Error handling
- Request timeout configuration

### Store Configuration (`src/store/`)

Modular Zustand stores with:
- Type-safe state management
- DevTools integration
- Persistent state options
- Action creators

### Middleware (`src/middleware.ts`)

Next.js middleware for:
- Route protection
- Authentication checks
- Redirects
- Request logging

## Routing

The App Router uses file-based routing:

```
src/app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── login/
│   └── page.tsx        # Login page
├── dashboard/
│   └── page.tsx        # Dashboard page
└── ...
```

## Performance Optimization

- **Code Splitting**: Automatic via Next.js App Router
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: TanStack Query caching strategy
- **Bundle Optimization**: Turbopack for faster builds

## Security

- **Input Validation**: Zod schemas for all inputs
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Token-based protection
- **Secure Headers**: Comprehensive security headers
- **Environment Variables**: Secure environment handling

## Source Traceability

**Source Folders**:
- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/store/` - Zustand state management
- `src/lib/` - Utility functions
- `src/hooks/` - Custom React hooks

**Key Files**:
- `src/lib/api-client.ts` - API client configuration
- `src/store/index.ts` - Store configuration
- `src/middleware.ts` - Next.js middleware
- `src/configs/env.ts` - Environment configuration

**Dependencies**:
- `next` - Next.js framework
- `react` - React library
- `zustand` - State management
- `@tanstack/react-query` - Data fetching
- `axios` - HTTP client
- `react-hook-form` - Form handling
- `zod` - Validation
- `lucide-react` - Icons

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- `@gv/contracts` - API contracts
- `@gv/theme` - Theme system
- `@gv/schemas` - Validation schemas
