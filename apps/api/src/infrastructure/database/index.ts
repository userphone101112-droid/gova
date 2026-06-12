/**
 * Database Module
 * 
 * Central export point for database-related functionality.
 * This module provides access to the database adapter, schema, and repositories.
 */

export * from './adapters/database.adapter.interface.js';
export * from './adapters/sqlite.adapter.js';
export * from './adapters/turso.adapter.js';
export * from './adapters/database.factory.js';
export * from './repositories/base.repository.js';
export * from './repositories/user.repository.js';
export * from './repositories/product.repository.js';

// Schema exports with explicit names to avoid conflicts
export type { User as UserSchema, Product as ProductSchema } from './schema/index.js';
export type { NewUser, NewProduct } from './schema/index.js';
export { users, products } from './schema/index.js';
