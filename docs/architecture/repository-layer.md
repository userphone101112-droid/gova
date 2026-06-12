# Repository Layer

## Overview

The repository layer implements the Repository Pattern, providing an abstraction over data access. It follows the Dependency Inversion Principle, depending on interfaces rather than concrete implementations.

## Architecture Pattern

### Repository Pattern

The repository pattern mediates between the domain and data mapping layers, acting like an in-memory domain object collection.

### Benefits

- **Abstraction**: Hides data access complexity
- **Testability**: Easy to mock for testing
- **Separation of Concerns**: Business logic separated from data access
- **Maintainability**: Centralized data access logic

## Repository Interfaces

### IUserRepository

Interface defining user data access operations.

**Location**: `apps/api/src/application/ports/user.repository.port.ts`

**Methods**:
- `findByEmail(email: string): Promise<User | null>` - Find user by email
- `findById(id: string): Promise<User | null>` - Find user by ID
- `create(user: NewUser): Promise<User>` - Create new user
- `update(id: string, user: Partial<User>): Promise<User>` - Update user
- `delete(id: string): Promise<void>` - Delete user

### IImageRepository

Interface defining image data access operations.

**Location**: `apps/api/src/application/ports/image-repository.port.ts`

**Methods**:
- `findById(id: string): Promise<Image | null>` - Find image by ID
- `create(image: Image): Promise<Image>` - Create new image
- `delete(id: string): Promise<void>` - Delete image
- `findByEntity(entityType: string, entityId: string): Promise<Image[]>` - Find images by entity
- `list(params: { limit?: number; offset?: number }): Promise<{ images: Image[]; total: number }>` - List images with pagination

## Repository Implementations

### UserRepository

Implementation of IUserRepository using Drizzle ORM.

**Location**: `apps/api/src/infrastructure/database/repositories/user.repository.ts`

**Implementation Details**:

```typescript
export class UserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    
    return users[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const users = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    
    return users[0] || null;
  }

  async create(user: NewUser): Promise<User> {
    const result = await this.db
      .insert(usersTable)
      .values(user)
      .returning();
    
    return result[0];
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const result = await this.db
      .update(usersTable)
      .set(user)
      .where(eq(usersTable.id, id))
      .returning();
    
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id));
  }
}
```

**Features**:
- Type-safe queries using Drizzle ORM
- Automatic SQL generation
- Connection management
- Error handling

### ImageRepository

Implementation of IImageRepository using Drizzle ORM.

**Location**: `apps/api/src/infrastructure/database/repositories/image.repository.ts`

**Implementation Details**:

```typescript
export class ImageRepository implements IImageRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Image | null> {
    const images = await this.db
      .select()
      .from(imagesTable)
      .where(eq(imagesTable.id, id))
      .limit(1);
    
    return images[0] || null;
  }

  async create(image: Image): Promise<Image> {
    const result = await this.db
      .insert(imagesTable)
      .values(image)
      .returning();
    
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(imagesTable)
      .where(eq(imagesTable.id, id));
  }

  async findByEntity(entityType: string, entityId: string): Promise<Image[]> {
    return await this.db
      .select()
      .from(imagesTable)
      .where(
        and(
          eq(imagesTable.entityType, entityType),
          eq(imagesTable.entityId, entityId)
        )
      );
  }

  async list(params: { limit?: number; offset?: number }): Promise<{
    images: Image[];
    total: number;
  }> {
    const { limit = 50, offset = 0 } = params;
    
    const images = await this.db
      .select()
      .from(imagesTable)
      .limit(limit)
      .offset(offset);
    
    const [{ count }] = await this.db
      .select({ count: count() })
      .from(imagesTable);
    
    return {
      images,
      total: count,
    };
  }
}
```

**Features**:
- Entity-based queries
- Pagination support
- Count queries for total records
- Type-safe operations

## Database Abstraction

### Database Interface

Abstract database interface for different database implementations.

**Location**: `apps/api/src/infrastructure/database/adapters/database.factory.ts`

**Implementations**:
- **SQLiteDatabase**: SQLite implementation for development
- **TursoDatabase**: Turso implementation for production

### Database Factory

Factory pattern for creating database instances based on environment.

```typescript
export class DatabaseFactory {
  static createFromEnv(env: Env): Database {
    if (env.DATABASE_URL) {
      return new TursoDatabase(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN);
    }
    return new SQLiteDatabase('./dev.db');
  }
}
```

## Query Patterns

### Common Patterns

**Find by ID**:
```typescript
async findById(id: string): Promise<Entity | null> {
  const results = await this.db
    .select()
    .from(table)
    .where(eq(table.id, id))
    .limit(1);
  
  return results[0] || null;
}
```

**Find by Field**:
```typescript
async findByEmail(email: string): Promise<Entity | null> {
  const results = await this.db
    .select()
    .from(table)
    .where(eq(table.email, email))
    .limit(1);
  
  return results[0] || null;
}
```

**Create**:
```typescript
async create(entity: NewEntity): Promise<Entity> {
  const result = await this.db
    .insert(table)
    .values(entity)
    .returning();
  
  return result[0];
}
```

**Update**:
```typescript
async update(id: string, entity: Partial<Entity>): Promise<Entity> {
  const result = await this.db
    .update(table)
    .set(entity)
    .where(eq(table.id, id))
    .returning();
  
  return result[0];
}
```

**Delete**:
```typescript
async delete(id: string): Promise<void> {
  await this.db
    .delete(table)
    .where(eq(table.id, id));
}
```

**List with Pagination**:
```typescript
async list(params: { limit?: number; offset?: number }): Promise<{
  entities: Entity[];
  total: number;
}> {
  const { limit = 50, offset = 0 } = params;
  
  const entities = await this.db
    .select()
    .from(table)
    .limit(limit)
    .offset(offset);
  
  const [{ count }] = await this.db
    .select({ count: count() })
    .from(table);
  
  return { entities, total: count };
}
```

## Error Handling

### Repository Errors

Repositories handle database errors and convert them to domain errors:

- **NotFoundError**: Entity not found
- **DuplicateError**: Unique constraint violation
- **ValidationError**: Data validation failure
- **DatabaseError**: General database error

### Error Handling Pattern

```typescript
try {
  const result = await this.db.insert(table).values(entity);
  return result;
} catch (error) {
  if (error instanceof UniqueConstraintError) {
    throw new DuplicateError();
  }
  throw new DatabaseError(error.message);
}
```

## Performance Optimization

### Connection Management

- **Connection Pooling**: Managed by database driver
- **Connection Reuse**: Single connection per request
- **Lazy Loading**: Connections established on first use

### Query Optimization

- **Index Usage**: Leverage database indexes
- **Select Only Required Fields**: Avoid SELECT *
- **Limit Results**: Use pagination
- **Prepared Statements**: Automatic with Drizzle ORM

### Caching Strategy

- **Query Caching**: Planned for frequently accessed data
- **Repository-Level Caching**: Cache repository results
- **Invalidation**: Cache invalidation on updates

## Testing

### Mock Repositories

Repositories can be easily mocked for testing:

```typescript
class MockUserRepository implements IUserRepository {
  private users: User[] = [];
  
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }
  
  async create(user: NewUser): Promise<User> {
    const newUser = { ...user, id: generateId() };
    this.users.push(newUser);
    return newUser;
  }
  
  // ... other methods
}
```

### Test Patterns

- Use in-memory databases for integration tests
- Mock repositories for unit tests
- Test repository methods independently
- Test error scenarios

## Future Enhancements

### Planned Features

- **Caching Layer**: Add caching to repositories
- **Soft Delete**: Implement soft delete pattern
- **Audit Trail**: Track data changes
- **Bulk Operations**: Support bulk insert/update/delete
- **Complex Queries**: Support complex query builders
- **Transaction Support**: Add transaction management

### Scalability

- **Read Replicas**: Support read replicas for scaling
- **Sharding**: Support horizontal sharding
- **Connection Pooling**: Advanced connection pool configuration

## Source Traceability

**Source Folders**:
- `apps/api/src/application/ports/` - Repository interfaces
- `apps/api/src/infrastructure/database/repositories/` - Repository implementations
- `apps/api/src/infrastructure/database/adapters/` - Database adapters

**Key Files**:
- `apps/api/src/application/ports/user.repository.port.ts` - User repository interface
- `apps/api/src/application/ports/image-repository.port.ts` - Image repository interface
- `apps/api/src/infrastructure/database/repositories/user.repository.ts` - User repository implementation
- `apps/api/src/infrastructure/database/repositories/image.repository.ts` - Image repository implementation
- `apps/api/src/infrastructure/database/adapters/database.factory.ts` - Database factory

**Dependencies**:
- `drizzle-orm` - ORM library
- `better-sqlite3` - SQLite driver
- `@libsql/client` - Turso client

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- `@gv/domain` - Domain entities that repositories work with
- `@gv/contracts` - DTOs for data transfer
