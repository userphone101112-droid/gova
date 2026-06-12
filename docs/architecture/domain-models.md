# Domain Models

## Overview

Domain models represent the core business logic and entities of the application. They follow Domain-Driven Design (DDD) principles with entities, value objects, and domain services.

## Architecture Pattern

### Domain-Driven Design

The domain layer implements DDD concepts:
- **Entities**: Objects with identity and lifecycle
- **Value Objects**: Immutable objects defined by their attributes
- **Domain Services**: Stateless operations on domain objects
- **Domain Events**: Events that occur within the domain

### Benefits

- **Business Logic Encapsulation**: Business rules in domain objects
- **Type Safety**: Compile-time validation of domain concepts
- **Immutability**: Value objects prevent unintended mutations
- **Testability**: Domain logic can be tested in isolation

## Value Objects

### Email

**Location**: `packages/domain/value-objects.ts`

**Purpose**: Represents a validated email address

**Properties**:
- `value`: string (lowercase, validated format)

**Validation**:
- Must match email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Automatically lowercased on creation

**Methods**:
- `equals(other: Email): boolean` - Compare emails
- `toJSON(): string` - Serialize to string
- `static fromJSON(value: string): Email` - Deserialize from string

**Invariants**:
- Email format must be valid
- Email is case-insensitive (stored as lowercase)

---

### UserId

**Location**: `packages/domain/value-objects.ts`

**Purpose**: Represents a user identifier

**Properties**:
- `value`: string (UUID v4 format)

**Validation**:
- Must match UUID v4 regex: `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`

**Methods**:
- `equals(other: UserId): boolean` - Compare user IDs
- `toJSON(): string` - Serialize to string
- `static generate(): UserId` - Generate new UUID
- `static fromJSON(value: string): UserId` - Deserialize from string

**Invariants**:
- Must be valid UUID v4
- Immutable once created

---

### ProductId

**Location**: `packages/domain/value-objects.ts`

**Purpose**: Represents a product identifier

**Properties**:
- `value`: string (UUID v4 format)

**Validation**:
- Must match UUID v4 regex

**Methods**:
- `equals(other: ProductId): boolean` - Compare product IDs
- `toJSON(): string` - Serialize to string
- `static generate(): ProductId` - Generate new UUID
- `static fromJSON(value: string): ProductId` - Deserialize from string

**Invariants**:
- Must be valid UUID v4
- Immutable once created

---

### ImageId

**Location**: `packages/domain/value-objects.ts`

**Purpose**: Represents an image identifier

**Properties**:
- `value`: string (UUID v4 format)

**Validation**:
- Must match UUID v4 regex

**Methods**:
- `equals(other: ImageId): boolean` - Compare image IDs
- `toJSON(): string` - Serialize to string
- `static generate(): ImageId` - Generate new UUID
- `static fromJSON(value: string): ImageId` - Deserialize from string

**Invariants**:
- Must be valid UUID v4
- Immutable once created

---

### Money

**Location**: `packages/domain/value-objects.ts`

**Purpose**: Represents monetary values

**Properties**:
- `value`: number (non-negative, finite)

**Validation**:
- Must be >= 0
- Must be finite

**Methods**:
- `add(other: Money): Money` - Add monetary values
- `subtract(other: Money): Money` - Subtract monetary values
- `multiply(factor: number): Money` - Multiply by factor
- `equals(other: Money): boolean` - Compare monetary values
- `isGreaterThan(other: Money): boolean` - Greater than comparison
- `isLessThan(other: Money): boolean` - Less than comparison
- `toJSON(): number` - Serialize to number
- `static fromJSON(value: number): Money` - Deserialize from number
- `static zero(): Money` - Create zero value

**Invariants**:
- Value cannot be negative
- Value must be finite
- Arithmetic operations return new Money objects (immutable)

---

## Entities

### User

**Location**: `packages/domain/entities.ts`

**Purpose**: Represents a user account

**Properties**:
- `_id`: UserId (private)
- `_email`: Email (private)
- `_name`: string (private)
- `_password`: string (private, hashed)
- `_createdAt`: Date (private)
- `_updatedAt`: Date (private)

**Getters**:
- `id`: UserId
- `email`: Email
- `name`: string
- `password`: string
- `createdAt`: Date
- `updatedAt`: Date

**Methods**:
- `updateName(name: string): void` - Update user name (min 2 characters)
- `updatePassword(password: string): void` - Update password (min 8 characters)
- `toJSON(): object` - Serialize to JSON
- `static fromJSON(json: object): User` - Deserialize from JSON

**Business Rules**:
- Name must be at least 2 characters
- Password must be at least 8 characters
- Email must be valid format
- Updated timestamp changes on any update

**Lifecycle**:
- Created with UserId, Email, name, password
- Can update name and password
- Cannot change ID or email
- Cannot change creation timestamp

---

### Product

**Location**: `packages/domain/entities.ts`

**Purpose**: Represents a product in the catalog

**Properties**:
- `_id`: ProductId (private)
- `_name`: string (private)
- `_description`: string (private)
- `_price`: Money (private)
- `_stock`: number (private)
- `_userId`: string (private)
- `_createdAt`: Date (private)
- `_updatedAt`: Date (private)

**Getters**:
- `id`: ProductId
- `name`: string
- `description`: string
- `price`: Money
- `stock`: number
- `userId`: string
- `createdAt`: Date
- `updatedAt`: Date

**Methods**:
- `updateName(name: string): void` - Update product name (min 3 characters)
- `updateDescription(description: string): void` - Update description (min 10 characters)
- `updatePrice(price: Money): void` - Update price (must be > 0)
- `addStock(quantity: number): void` - Add stock (quantity > 0)
- `removeStock(quantity: number): void` - Remove stock (quantity > 0, sufficient stock)
- `isInStock(): boolean` - Check if product has stock
- `toJSON(): object` - Serialize to JSON
- `static fromJSON(json: object): Product` - Deserialize from JSON

**Business Rules**:
- Name must be at least 3 characters
- Description must be at least 10 characters
- Price must be greater than 0
- Stock cannot be negative
- Cannot remove more stock than available

**Lifecycle**:
- Created with ProductId, name, description, price, stock, userId
- Can update name, description, price
- Can add/remove stock
- Cannot change ID or userId
- Cannot change creation timestamp

---

### Image

**Location**: `packages/domain/entities.ts`

**Purpose**: Represents an uploaded image

**Properties**:
- `_id`: string (private, UUID)
- `_url`: string (private)
- `_provider`: ImageProvider (private)
- `_providerFileId`: string (private)
- `_entityType`: EntityType (private)
- `_entityId`: string (private)
- `_mimeType`: string (private)
- `_size`: number (private)
- `_width`: number | undefined (private)
- `_height`: number | undefined (private)
- `_createdAt`: Date (private)

**Types**:
- `ImageProvider`: 'cloudflare' | 'google_drive' | 's3' | 'minio'
- `EntityType`: 'user' | 'product' | 'post' | 'other' | 'merchant'

**Getters**:
- `id`: string
- `url`: string
- `provider`: ImageProvider
- `providerFileId`: string
- `entityType`: EntityType
- `entityId`: string
- `mimeType`: string
- `size`: number
- `width`: number | undefined
- `height`: number | undefined
- `createdAt`: Date

**Methods**:
- `isAssociatedWith(entityType: EntityType, entityId: string): boolean` - Check association
- `isValidMimeType(): boolean` - Validate MIME type
- `isValidSize(maxSizeMB: number): boolean` - Validate file size
- `toJSON(): object` - Serialize to JSON
- `static fromJSON(json: object): Image` - Deserialize from JSON

**Business Rules**:
- MIME type must be valid (jpeg, png, webp, gif, svg+xml)
- File size must not exceed max size
- Image must be associated with an entity

**Lifecycle**:
- Created with URL, provider, providerFileId, entityType, entityId, metadata
- Immutable after creation
- Cannot change ID or association
- Cannot change creation timestamp

---

### Placeholder Entities

#### Merchant

**Location**: `packages/domain/entities.ts`

**Purpose**: Placeholder for merchant entity

**Properties**:
- `id`: string
- `userId`: string
- `storeName`: string
- `description`: string | undefined
- `createdAt`: Date
- `updatedAt`: Date

**Status**: Interface only, not yet implemented as full entity

---

#### Category

**Location**: `packages/domain/entities.ts`

**Purpose**: Placeholder for category entity

**Properties**:
- `id`: string
- `name`: string
- `slug`: string
- `description`: string | undefined

**Status**: Interface only, not yet implemented as full entity

---

#### Order

**Location**: `packages/domain/entities.ts`

**Purpose**: Placeholder for order entity

**Properties**:
- `id`: string
- `userId`: string
- `items`: OrderItem[]
- `totalAmount`: number
- `status`: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
- `createdAt`: Date

**Status**: Interface only, not yet implemented as full entity

---

#### OrderItem

**Location**: `packages/domain/entities.ts`

**Purpose**: Placeholder for order item

**Properties**:
- `productId`: string
- `quantity`: number
- `price`: number

**Status**: Interface only, not yet implemented as full entity

---

## Domain Errors

### UserAlreadyExistsError

Thrown when attempting to create a user with an email that already exists.

### UserNotFoundError

Thrown when a user cannot be found by email or ID.

### InvalidCredentialsError

Thrown when login credentials are invalid.

### InvalidImageTypeError

Thrown when an image has an unsupported MIME type.

### ImageSizeExceededError

Thrown when an image exceeds the maximum allowed size.

## Source Traceability

**Source Folders**:
- `packages/domain/` - Domain package
- `apps/api/src/domain/` - Backend domain references

**Key Files**:
- `packages/domain/entities.ts` - Domain entities
- `packages/domain/value-objects.ts` - Value objects
- `apps/api/src/domain/entities/` - Backend entity references
- `apps/api/src/domain/value-objects/` - Backend value object references

**Dependencies**:
- None (pure TypeScript)

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- `@gv/contracts` - DTOs that map to domain entities
- `@gv/business-rules` - Business rules that domain entities enforce
