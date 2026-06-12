/**
 * SQLite Database Adapter
 * 
 * Implementation of the database adapter interface for SQLite.
 * This adapter is used for local development with a local SQLite file.
 * 
 * This implementation uses better-sqlite3 for synchronous database operations,
 * which is suitable for local development and testing.
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import {
  IDatabaseAdapter,
  IDatabaseConfig,
  ITransaction,
} from './database.adapter.interface.js';

export class SQLiteAdapter implements IDatabaseAdapter {
  private db: Database.Database | null = null;
  private config: IDatabaseConfig;

  constructor(config: IDatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.db) {
      return;
    }

    let dbPath = this.config.url;
    if (dbPath.startsWith('file:')) {
      dbPath = dbPath.slice(5);
    }

    this.db = new Database(dbPath);

    // Enable WAL mode for better concurrency
    this.db.pragma('journal_mode = WAL');

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');

    if (this.config.enableLogging) {
      this.db.function('log', (sql: string) => {
        console.log('[SQLite]', sql);
      });
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  private serializeParams(params: unknown[] = []): unknown[] {
    return params.map(param => {
      if (param instanceof Date) {
        return param.getTime();
      }
      return param;
    });
  }

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    const statement = this.db.prepare(sql);
    const result = statement.all(...this.serializeParams(params));
    return result as T[];
  }

  async queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    const statement = this.db.prepare(sql);
    const result = statement.get(...this.serializeParams(params));
    return result ? (result as T) : null;
  }

  async execute(sql: string, params: unknown[] = []): Promise<number> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    const statement = this.db.prepare(sql);
    const result = statement.run(...this.serializeParams(params));
    return result.changes;
  }

  async beginTransaction(): Promise<ITransaction> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    this.db.exec('BEGIN TRANSACTION');

    return {
      commit: async () => {
        if (this.db) {
          this.db.exec('COMMIT');
        }
      },
      rollback: async () => {
        if (this.db) {
          this.db.exec('ROLLBACK');
        }
      },
      query: async <T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> => {
        if (!this.db) {
          throw new Error('Database not connected');
        }
        const statement = this.db.prepare(sql);
        const result = statement.all(...this.serializeParams(params));
        return result as T[];
      },
      queryOne: async <T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> => {
        if (!this.db) {
          throw new Error('Database not connected');
        }
        const statement = this.db.prepare(sql);
        const result = statement.get(...this.serializeParams(params));
        return result ? (result as T) : null;
      },
      execute: async (sql: string, params: unknown[] = []): Promise<number> => {
        if (!this.db) {
          throw new Error('Database not connected');
        }
        const statement = this.db.prepare(sql);
        const result = statement.run(...this.serializeParams(params));
        return result.changes;
      },
    };
  }

  async migrate(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    try {
      const drizzleDb = drizzle(this.db);
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const migrationsFolder = path.resolve(__dirname, '../migrations');

      await migrate(drizzleDb, { migrationsFolder });
      console.log('SQLite migrations run successfully');
    } catch (error) {
      console.error('SQLite migrations failed:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.db !== null;
  }
}
