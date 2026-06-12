# Business Rules System Documentation

## Overview

`@gv/business-rules` centralizes all **named constants**, **limits**, and **domain constraints**. No magic numbers are allowed anywhere in the codebase.

## Usage

```ts
import { BUSINESS_RULES } from '@gv/business-rules';

// Product limits
BUSINESS_RULES.products.maxImages; // 5
BUSINESS_RULES.products.maxNameLength; // 100
BUSINESS_RULES.products.minNameLength; // 3
BUSINESS_RULES.products.minPrice; // 0.01

// Image limits
BUSINESS_RULES.images.maxSizeMB; // 5
BUSINESS_RULES.images.maxSizeBytes; // 5 * 1024 * 1024
BUSINESS_RULES.images.allowedMimeTypes; // ['image/jpeg', 'image/png', ...]

// Merchant limits
BUSINESS_RULES.merchants.maxStoreNameLength; // 100

// Order rules
BUSINESS_RULES.orders.maxItemsPerOrder; // 50

// Auth rules
BUSINESS_RULES.auth.minPasswordLength; // 8
```

## Key Rule

> **Never** use a raw number like `5`, `100`, `8` to enforce a business limit. Always reference `BUSINESS_RULES.*`. This ensures a single change here propagates everywhere.

## Extending

```ts
// In packages/business-rules/index.ts
export const BUSINESS_RULES = {
  // ... existing
  reviews: {
    maxLength: 2000,
    minLength: 10,
    maxRating: 5,
    minRating: 1,
  },
} as const;
```
