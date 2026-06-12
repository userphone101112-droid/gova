# Database Layer

## Overview

The database layer uses Drizzle ORM with SQLite for development and Turso for production. It follows a schema-first approach with type-safe queries and migrations.

## Technology Stack

- **ORM**: Drizzle ORM
- **Database**: SQLite (development) / Turso (production)
- **Schema Definition**: TypeScript with Drizzle ORM
- **Migrations**: Drizzle Kit
- **Type Safety**: Full TypeScript inference

## Database Schema

### Tables

#### users

User accounts table storing authentication and profile information.

**Fields**:
- `id` (text, primary key): User UUID
- `email` (text, unique, not null): User email address
- `password` (text, not null): Hashed password
- `name` (text, not null): User display name
- `created_at` (integer, timestamp, not null): Account creation timestamp
- `updated_at` (integer, timestamp, not null): Last update timestamp

**Indexes**:
- Primary key on `id`
- Unique index on `email`

**Relationships**:
- One-to-many with `products` (via `user_id`)
- One-to-many with `images` (via `entity_id` when `entity_type = 'user'`)

#### products

Product catalog table storing product information.

**Fields**:
- `id` (text, primary key): Product UUID
- `name` (text, not null): Product name
- `description` (text, not null): Product description
- `price` (integer, not null): Product price in cents
- `stock` (integer, not null, default 0): Available stock quantity
- `user_id` (text, not null, foreign key): Owner user ID
- `created_at` (integer, timestamp, not null): Product creation timestamp
- `updated_at` (integer, timestamp, not null): Last update timestamp

**Indexes**:
- Primary key on `id`
- Foreign key on `user_id` references `users.id` (cascade delete)

**Relationships**:
- Many-to-one with `users` (via `user_id`)

#### images

Image metadata table storing image information and storage references.

**Fields**:
- `id` (text, primary key): Image UUID
- `url` (text, not null): Image URL
- `provider` (text, not null): Storage provider ('cloudflare' | 'google_drive')
- `provider_file_id` (text, not null): Provider-specific file identifier
- `entity_type` (text, not null): Associated entity type ('user' | 'product' | 'post' | 'other')
- `entity_id` (text, not null): Associated entity ID
- `mime_type` (text, not null): Image MIME type
- `size` (integer, not null): File size in bytes
- `width` (integer, optional): Image width in pixels
- `height` (integer, optional): Image height in pixels
- `created_at` (integer, timestamp, not null): Upload timestamp

**Indexes**:
- Primary key on `id`
- Composite index on `entity_type` and `entity_id`

**Relationships**:
- Many-to-one with `users` (via `entity_id` when `entity_type = 'user'`)

### Entity Relationship Diagram

```
users (1) ----< (N) products
  |                    |
  |                    |
  +----< (N) images (entity_type = 'user')
       (entity_id = user_id)

products (1) ----< (N) images (entity_type = 'product')
                     (entity_id = product_id)
```

## Schema Definition

### Main Schema (`apps/api/src/infrastructure/database/schema/index.ts`)

```typescript
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull().default(0),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  provider: text('provider').notNull(),
  providerFileId: text('provider_file_id').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

### Image Schema (`apps/api/src/infrastructure/database/schema/image.schema.ts`)

```typescript
export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  provider: text('provider').notNull(),
  providerFileId: text('provider_file_id').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const imageRelations = relations(images, ({ one }) => ({
  user: one(users, {
    fields: [images.entityId],
    references: [users.id],
  }),
}));
```

## Type Inference

Drizzle ORM provides automatic type inference:

```typescript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
```

## Migrations

### Migration Strategy

Migrations are managed using Drizzle Kit:

```bash
# Generate migration
drizzle-kit generate

# Apply migration
drizzle-kit migrate

# Push schema (development only)
drizzle-kit push
```

### Migration Files

Located in `apps/api/src/infrastructure/database/migrations/`:

- Initial schema creation
- Index creation
- Relationship definitions

## Database Configuration

### Development (SQLite)

```typescript
const db = drizzle(sqlite('dev.db'));
```

### Production (Turso)

```typescript
const db = drizzle(turso({ url: process.env.TURSO_URL, authToken: process.env.TURSO_AUTH_TOKEN }));
```

### Database Factory

`apps/api/src/infrastructure/database/adapters/database.factory.ts`:

```typescript
export class DatabaseFactory {
  static createFromEnv(env: Env) {
    if (env.DATABASE_URL) {
      return new TursoDatabase(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN);
    }
    return new SQLiteDatabase('./dev.db');
  }
}
```

## Query Patterns

### Basic Queries

```typescript
// Select
const user = await db.select().from(users).where(eq(users.id, userId));

// Insert
await db.insert(users).values({ id, email, password, name });

// Update
await db.update(users).set({ name }).where(eq(users.id, userId));

// Delete
await db.delete(users).where(eq(users.id, userId));
```

### Relations

```typescript
// With relations
const userWithImages = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    images: true,
  },
});
```

## Performance Optimization

### Indexing Strategy

- Primary keys on all tables
- Unique constraints on emails
- Foreign key constraints with cascade delete
- Composite indexes for common query patterns

### Query Optimization

- Use prepared statements
- Limit result sets with pagination
- Select only required fields
- Use appropriate indexes

### Connection Pooling

- SQLite: Single connection (file-based)
- Turso: Connection pooling managed by Turso

## Data Integrity

### Constraints

- **Primary Keys**: All tables have UUID primary keys
- **Foreign Keys**: Cascade delete for related records
- **Unique Constraints**: Email uniqueness
- **Not Null**: Required fields enforced

### Validation

- Application-level validation before database operations
- Domain entity validation
- Schema-level constraints as final guard

## Backup and Recovery

### Development (SQLite)

- File-based backup: Copy `dev.db` file
- Point-in-time recovery: Use file snapshots

### Production (Turso)

- Automatic backups managed by Turso
- Point-in-time recovery available
- Geographic replication

## Source Traceability

**Source Folders**:
- `apps/api/src/infrastructure/database/` - Database implementation
- `apps/api/src/infrastructure/database/schema/` - Schema definitions
- `apps/api/src/infrastructure/database/migrations/` - Migration files
- `apps/api/src/infrastructure/database/repositories/` - Repository implementations

**Key Files**:
- `apps/api/src/infrastructure/database/schema/index.ts` - Main schema
- `apps/api/src/infrastructure/database/schema/image.schema.ts` - Image schema
- `apps/api/src/infrastructure/database/adapters/database.factory.ts` - Database factory
- `apps/api/drizzle.config.ts` - Drizzle configuration

**Dependencies**:
- `drizzle-orm` - ORM library
- `better-sqlite3` - SQLite driver
- `@libsql/client` - Turso client

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- `@gv/domain` - Domain entities that map to database tables
