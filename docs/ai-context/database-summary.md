# Database Summary

Quick reference for AI agents to understand the database architecture.

## ORM

Drizzle ORM with TypeScript support

## Databases

- **Development**: SQLite file database (`dev.db`)
- **Production**: Turso (SQLite-compatible edge database)

## Schema Location

`apps/api/src/infrastructure/database/schema/`

**Files**:
- `index.ts` - Main schema (users, products tables)
- `image.schema.ts` - Images table

## Tables

### users
- `id` (text, primary key)
- `email` (text, unique, not null)
- `password` (text, not null)
- `name` (text, not null)
- `created_at` (integer timestamp, not null)
- `updated_at` (integer timestamp, not null)

### products
- `id` (text, primary key)
- `name` (text, not null)
- `description` (text, not null)
- `price` (integer, not null)
- `stock` (integer, default 0)
- `user_id` (text, foreign key to users.id, cascade delete)
- `created_at` (integer timestamp, not null)
- `updated_at` (integer timestamp, not null)

### images
- `id` (text, primary key)
- `url` (text, not null)
- `provider` (text, not null)
- `provider_file_id` (text, not null)
- `entity_type` (text, not null)
- `entity_id` (text, not null)
- `mime_type` (text, not null)
- `size` (integer, not null)
- `width` (integer, optional)
- `height` (integer, optional)
- `created_at` (integer timestamp, not null)

## Configuration

`drizzle.config.ts` - Drizzle configuration for migrations and queries

## Migrations

- Migration files managed by Drizzle
- Migration reports in `docs/reports/migrations/`
- Changelog in `docs/changelogs/database.md`

## Key Patterns

- Schema-first approach with TypeScript types
- Type-safe queries with Drizzle
- Relation definitions with foreign keys
- Indexes and constraints for performance
- Cascade delete for related records

## Documentation

- Database layer: [../architecture/database-layer.md](../architecture/database-layer.md)
- Repository layer: [../architecture/repository-layer.md](../architecture/repository-layer.md)
