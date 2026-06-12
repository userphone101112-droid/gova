# Frontend Summary

Quick reference for AI agents to understand the frontend architecture.

## Frontend Framework

Next.js 15 with App Router and Turbopack

## Key Features

- App Router (not Pages Router)
- Server Components by default
- Client Components with "use client"
- Turbopack for fast builds
- React Server Components

## Styling

- Tailwind CSS 4
- Design tokens from @gv/theme package
- CSS custom properties for theming
- Dark mode support

## State Management

- Zustand for global state
- React Context for component state
- Server state via TanStack Query (planned)

## Forms

- React Hook Form (planned)
- Zod validation
- Form components in `src/components/forms/`

## Component Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/            # Utilities
├── store/          # Zustand stores
└── middleware/     # Next.js middleware
```

## Routing

- App Router in `src/app/`
- File-based routing
- Route groups with parentheses
- Dynamic routes with brackets
- Layouts for shared UI

## Data Fetching

- TanStack Query for server state (planned)
- Server Actions for mutations (planned)
- API client in `src/lib/api-client.ts`

## Documentation

- Frontend architecture: [../architecture/frontend-architecture.md](../architecture/frontend-architecture.md)
- Theme system: [../modules/theme-system.md](../modules/theme-system.md)
- Localization: [../modules/localization-system.md](../modules/localization-system.md)
