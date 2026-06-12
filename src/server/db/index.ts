/**
 * Database Connection
 * 
 * Database connection setup for SQLite with Drizzle ORM.
 * Supports both local SQLite and Turso (SQLite-compatible cloud database).
 */

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { env } from '@/configs/env';
import * as schema from './schema';

let databaseInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!databaseInstance) {
    const sqlite = new Database(env.DATABASE_URL);
    databaseInstance = drizzle(sqlite, { schema });
  }
  return databaseInstance;
}

// For server-side use only
export const database = getDb();
