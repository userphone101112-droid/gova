# SSOT Architecture Overview

## What is SSOT?

**Single Source of Truth (SSOT)** is the principle that every piece of knowledge (data, logic, type, rule) must have exactly **one authoritative location** in the codebase. All consumers (frontend, backend, mobile, etc.) must import from that single location instead of duplicating it.

---

## Package Ecosystem Map

```
packages/
├── theme/          → @gv/theme          CSS variables, ThemeTokens, light/dark/brand themes
├── design-system/  → @gv/design-system  Token-driven React primitives (Button, Input, Card)
├── branding/       → @gv/branding       AppName, Logo, Favicon, multi-brand config
├── translations/   → @gv/translations   Type-safe en/ar dictionary + getTranslation()
├── localization/   → @gv/localization   RTL/LTR detection, locale persistence
├── contracts/      → @gv/contracts      Shared API DTOs (request/response shapes)
├── domain/         → @gv/domain         Domain entities (User, Product, Image) + value objects
├── schemas/        → @gv/schemas        Zod validation schemas for all operations
├── auth/           → @gv/auth           Roles, Permissions, access-control helpers
├── features/       → @gv/features       Feature flags with per-tenant override support
├── storage/        → @gv/storage        Cloud storage provider contracts and config types
├── business-rules/ → @gv/business-rules Named constants: MAX_PRODUCT_IMAGES, MIN_PRICE, etc.
├── config/         → @gv/config         Zod-validated env config loaders for FE and BE
├── formatting/     → @gv/formatting     Locale-aware currency, date, number, % formatters
├── shared-types/   → @gv/shared-types   Utility types: Nullable, PaginatedResult, etc.
└── shared/         → @gv/shared         Utilities + validate-ssot.ts audit script
```

---

## Dependency Graph

```
@gv/domain
  └── @gv/domain/value-objects (Email, UserId, ProductId, ImageId, Money)
  └── @gv/domain/entities (User, Product, Image, Merchant, Category, Order)

@gv/contracts  (DTO shapes consumed by both FE and BE)
  └── CreateUserDTO, LoginDTO, UserResponseDTO
  └── ProductResponseDTO, ImageResponseDTO, ListImagesResponseDTO
  └── OrderResponseDTO, MerchantResponseDTO

@gv/schemas  (Zod schemas consumed by both FE forms and BE validators)
  └── createUserSchema, loginSchema, uploadImageSchema, etc.

@gv/auth  (roles and permissions used by both FE guards and BE middleware)

@gv/config  (env variable loaders for FE and BE — no more raw process.env)

@gv/theme  ← @gv/design-system  ← Next.js page components
@gv/translations  ← Next.js page components
@gv/localization  ← Next.js page components
@gv/branding      ← Next.js layout.tsx metadata
```

---

## Ownership Rules

| Package              | Owner              | Can be consumed by       |
| -------------------- | ------------------ | ------------------------ |
| `@gv/domain`         | Backend architects | FE, BE, Mobile, Admin    |
| `@gv/contracts`      | API team           | FE, BE, Mobile           |
| `@gv/schemas`        | Fullstack team     | FE forms, BE validators  |
| `@gv/auth`           | Security team      | FE guards, BE middleware |
| `@gv/theme`          | Design team        | FE only                  |
| `@gv/translations`   | i18n team          | FE, Mobile               |
| `@gv/business-rules` | Product team       | FE, BE, Mobile           |
| `@gv/config`         | DevOps             | FE, BE                   |

---

## Key Principle: No Duplication

| Type                   | Before SSOT                                                                   | After SSOT                                |
| ---------------------- | ----------------------------------------------------------------------------- | ----------------------------------------- |
| User interface         | Defined in `src/store/types.ts`, `src/api/contracts/types.ts`, backend entity | `@gv/contracts` → `UserResponseDTO`       |
| Zod validation         | Duplicated in `user.routes.ts`, `image.validator.ts`                          | `@gv/schemas`                             |
| API response shape     | Each controller returns different shape                                       | `@gv/contracts` → `ApiResponse<T>`        |
| Auth roles/permissions | Scattered strings                                                             | `@gv/auth` → `UserRole`, `UserPermission` |
| Theme colors           | Hardcoded hex in `globals.css`                                                | `@gv/theme` → `theme.css` CSS vars        |
| Business limits        | Magic numbers in code                                                         | `@gv/business-rules` → `BUSINESS_RULES`   |

---

## How to Add a New Feature

1. **Define the domain model** → `packages/domain/entities.ts`
2. **Add Zod schema** → `packages/schemas/index.ts`
3. **Add request/response DTOs** → `packages/contracts/index.ts`
4. **Add permissions** → `packages/auth/index.ts`
5. **Add translations** → `packages/translations/index.ts` (both `en` and `ar`)
6. **Add business rules** → `packages/business-rules/index.ts`
7. **Run `npm run validate:ssot`** to ensure translations stay in sync

---

## White-Label / Multi-Tenant Extension

To add a new brand or tenant:

1. Add brand config to `packages/branding/index.ts`:

```ts
brandC: {
  id: 'brandC',
  appName: 'My New Brand',
  ...
}
```

2. Add tenant theme overrides to `packages/theme/index.ts` extending `lightTheme`
3. Add tenant feature overrides via `features.tenantOverrides`

No code duplication required.
