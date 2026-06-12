# Business Rules System

## Overview

The `@gv/business-rules` package centralizes all **named constants**, **limits**, and **domain constraints**. No magic numbers are allowed anywhere in the codebase.

## Architecture

### Package Structure

```
packages/business-rules/
└── index.ts      → All business rule constants
```

### Design Philosophy

- **Single Source of Truth**: All business limits in one place
- **No Magic Numbers**: All constants have semantic names
- **Type Safety**: TypeScript `as const` for type inference
- **Easy Updates**: Single change propagates everywhere
- **Documentation**: Self-documenting via naming

## Business Rules Structure

### Products

**Location**: `packages/business-rules/index.ts`

**Rules**:
```typescript
products: {
  maxImages: 5,
  maxNameLength: 100,
  minNameLength: 3,
  maxDescriptionLength: 2000,
  minDescriptionLength: 10,
  minPrice: 0.01,
  maxPrice: 1000000,
  minStock: 0,
  maxStock: 10000,
}
```

**Usage**:
```typescript
import { BUSINESS_RULES } from '@gv/business-rules';

if (product.name.length > BUSINESS_RULES.products.maxNameLength) {
  throw new Error('Name too long');
}

if (product.price < BUSINESS_RULES.products.minPrice) {
  throw new Error('Price too low');
}
```

---

### Images

**Rules**:
```typescript
images: {
  maxSizeMB: 5,
  maxSizeBytes: 5 * 1024 * 1024,
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ],
  maxWidth: 4000,
  maxHeight: 4000,
  minDimensions: 10,
}
```

**Usage**:
```typescript
if (file.size > BUSINESS_RULES.images.maxSizeBytes) {
  throw new ImageSizeExceededError(file.size, BUSINESS_RULES.images.maxSizeBytes);
}

if (!BUSINESS_RULES.images.allowedMimeTypes.includes(mimeType)) {
  throw new InvalidImageTypeError(mimeType);
}
```

---

### Merchants

**Rules**:
```typescript
merchants: {
  maxStoreNameLength: 100,
  minStoreNameLength: 3,
  maxDescriptionLength: 2000,
  minDescriptionLength: 10,
  maxProducts: 1000,
}
```

**Status**: Placeholder, not yet implemented

---

### Orders

**Rules**:
```typescript
orders: {
  maxItemsPerOrder: 50,
  minItemsPerOrder: 1,
  maxTotalAmount: 100000,
  minTotalAmount: 0.01,
  maxQuantityPerItem: 100,
  cancellationHours: 24,
}
```

**Status**: Placeholder, not yet implemented

---

### Auth

**Rules**:
```typescript
auth: {
  minPasswordLength: 8,
  maxPasswordLength: 100,
  minEmailLength: 5,
  maxEmailLength: 255,
  sessionTimeoutHours: 24,
  maxLoginAttempts: 5,
  lockoutMinutes: 15,
}
```

**Usage**:
```typescript
if (password.length < BUSINESS_RULES.auth.minPasswordLength) {
  throw new PasswordValidationError('Password too short');
}
```

---

### Pagination

**Rules**:
```typescript
pagination: {
  defaultLimit: 50,
  maxLimit: 100,
  minLimit: 1,
  defaultOffset: 0,
}
```

**Usage**:
```typescript
const limit = Math.min(
  requestedLimit || BUSINESS_RULES.pagination.defaultLimit,
  BUSINESS_RULES.pagination.maxLimit
);
```

---

## Usage Patterns

### Validation

**Domain Entity Validation**:
```typescript
class Product {
  updateName(name: string) {
    if (name.length < BUSINESS_RULES.products.minNameLength) {
      throw new Error('Name too short');
    }
    if (name.length > BUSINESS_RULES.products.maxNameLength) {
      throw new Error('Name too long');
    }
    this._name = name;
  }
}
```

### API Validation

**Request Validation**:
```typescript
const schema = z.object({
  name: z.string()
    .min(BUSINESS_RULES.products.minNameLength)
    .max(BUSINESS_RULES.products.maxNameLength),
  price: z.number()
    .min(BUSINESS_RULES.products.minPrice)
    .max(BUSINESS_RULES.products.maxPrice),
});
```

### UI Validation

**Form Validation**:
```typescript
const validateProductName = (name: string) => {
  return {
    isValid: name.length >= BUSINESS_RULES.products.minNameLength &&
              name.length <= BUSINESS_RULES.products.maxNameLength,
    maxLength: BUSINESS_RULES.products.maxNameLength,
    minLength: BUSINESS_RULES.products.minNameLength,
  };
};
```

---

## Extending Business Rules

### Adding New Rules

**1. Add to BUSINESS_RULES object**:
```typescript
export const BUSINESS_RULES = {
  // ... existing rules
  reviews: {
    maxLength: 2000,
    minLength: 10,
    maxRating: 5,
    minRating: 1,
  },
} as const;
```

**2. Update TypeScript types** (if needed):
```typescript
export type BusinessRules = typeof BUSINESS_RULES;
```

**3. Update documentation**:
- Document the new rule in this file
- Add usage examples
- Update related validation logic

### Rule Categories

**Validation Rules**: Input validation constraints
**Business Limits**: Business logic constraints
**Configuration**: System configuration values
**Thresholds**: Performance and rate limits

---

## Best Practices

### Rule Definition

- **Semantic Names**: Use clear, descriptive names
- **Constants**: Use `as const` for type safety
- **Grouping**: Group related rules together
- **Documentation**: Document rule purpose and rationale

### Rule Usage

- **No Magic Numbers**: Never use hardcoded values
- **Import Rules**: Always import from `@gv/business-rules`
- **Type Safety**: Leverage TypeScript type inference
- **Consistent Usage**: Use rules consistently across codebase

### Rule Maintenance

- **Version Control**: Track rule changes in git
- **Changelog**: Document rule changes in changelog
- **Testing**: Update tests when rules change
- **Review**: Review rule changes with team

---

## Validation

### Rule Validation

**Purpose**: Ensure rules are used correctly

**Validation** (planned):
- Check for magic numbers in codebase
- Verify all rules are documented
- Check for unused rules
- Validate rule consistency

---

## Source Traceability

**Source Folders**:
- `packages/business-rules/` - Business rules package

**Key Files**:
- `packages/business-rules/index.ts` - All business rule constants

**Dependencies**:
- None (pure TypeScript)

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- `@gv/domain` - Domain entities that enforce business rules
- `@gv/schemas` - Validation schemas that use business rules

**Usage In**:
- `packages/domain/entities.ts` - Domain entity validation
- `apps/api/src/application/use-cases/` - Use case validation
- `src/validations/` - Frontend validation
