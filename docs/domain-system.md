# Domain System Documentation

## Overview

`@gv/domain` is the **single source of truth** for all domain entities, value objects, and core business logic. These are pure TypeScript classes with no infrastructure dependencies.

## Architecture

```
packages/domain/
├── value-objects.ts  → Email, UserId, ProductId, ImageId, Money
├── entities.ts       → User, Product, Image, Merchant, Category, Order
└── index.ts          → re-exports everything
```

## Value Objects

Value objects are immutable, self-validating primitives:

```ts
import { Email, UserId, Money } from '@gv/domain';

const email = new Email('test@example.com'); // validates format
const id = UserId.generate(); // creates a new UUID
const price = new Money(100); // validates >= 0

email.value; // 'test@example.com'
id.value; // 'uuid-string'
price.add(new Money(50)).value; // 150
```

## Entities

Entities encapsulate state and business rules:

```ts
import { User, Product, Image } from '@gv/domain';

// Reconstruct from DB
const user = User.fromJSON({ id, email, name, password, createdAt, updatedAt });

// Apply business rules
user.updateName('New Name'); // validates min length
user.updatePassword('short'); // throws Error

// Serialize
const json = user.toJSON(); // plain object safe for DB/API
```

## Cross-Environment Support

The domain package works in:

- **Node.js** (Fastify backend)
- **Browser** (Next.js frontend)
- **React Native** (future mobile app)

UUID generation uses `globalThis.crypto.randomUUID()` with a Math.random fallback for environments without WebCrypto.

## Extending the Domain

To add a new entity (e.g., `Review`):

1. Add value objects if needed (e.g., `ReviewId`) in `value-objects.ts`
2. Add entity class in `entities.ts`
3. Export from `index.ts`
4. Add corresponding `ReviewResponseDTO` in `@gv/contracts`
5. Add Zod schema in `@gv/schemas`
