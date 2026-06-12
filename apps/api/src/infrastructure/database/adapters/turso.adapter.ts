/**
 * Turso Database Adapter
 * 
 * Implementation of the database adapter interface for Turso (libSQL).
 * This adapter is used for production with a remote Turso database.
 * 
 * This implementation uses the libSQL client for remote database operations,
 * which is suitable for production environments with distributed databases.
 */

import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import {
  IDatabaseAdapter,
  IDatabaseConfig,
  ITransaction,
} from './database.adapter.interface.js';

export class TursoAdapter implements IDatabaseAdapter {
  private client: ReturnType<typeof createClient> | null = null;
  private config: IDatabaseConfig;

  constructor(config: IDatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.client) {
      return;
    }

    this.client = createClient({
      url: this.config.url,
      authToken: this.config.authToken,
    });

    // Test connection
    await this.client.execute('SELECT 1');
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      this.client.close();
      this.client = null;
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
    if (!this.client) {
      throw new Error('Database not connected');
    }

    const result = await this.client.execute({
      sql,
      args: this.serializeParams(params) as never,
    });

    return result.rows as T[];
  }

  async queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
    if (!this.client) {
      throw new Error('Database not connected');
    }

    const result = await this.client.execute({
      sql,
      args: this.serializeParams(params) as never,
    });

    return result.rows.length > 0 ? (result.rows[0] as T) : null;
  }

  async execute(sql: string, params: unknown[] = []): Promise<number> {
    if (!this.client) {
      throw new Error('Database not connected');
    }

    const result = await this.client.execute({
      sql,
      args: this.serializeParams(params) as never,
    });

    return result.rowsAffected;
  }

  async beginTransaction(): Promise<ITransaction> {
    if (!this.client) {
      throw new Error('Database not connected');
    }

    // Turso/libSQL doesn't support traditional transactions in the same way
    // We'll use a transaction-like pattern with the client
    await this.client.execute('BEGIN TRANSACTION');

    return {
      commit: async () => {
        if (this.client) {
          await this.client.execute('COMMIT');
        }
      },
      rollback: async () => {
        if (this.client) {
          await this.client.execute('ROLLBACK');
        }
      },
      query: async <T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> => {
        if (!this.client) {
          throw new Error('Database not connected');
        }
        const result = await this.client.execute({
          sql,
          args: this.serializeParams(params) as never,
        });
        return result.rows as T[];
      },
      queryOne: async <T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> => {
        if (!this.client) {
          throw new Error('Database not connected');
        }
        const result = await this.client.execute({
          sql,
          args: this.serializeParams(params) as never,
        });
        return result.rows.length > 0 ? (result.rows[0] as T) : null;
      },
      execute: async (sql: string, params: unknown[] = []): Promise<number> => {
        if (!this.client) {
          throw new Error('Database not connected');
        }
        const result = await this.client.execute({
          sql,
          args: this.serializeParams(params) as never,
        });
        return result.rowsAffected;
      },
    };
  }

  async migrate(): Promise<void> {
    if (!this.client) {
      throw new Error('Database not connected');
    }

    try {
      const drizzleDb = drizzle({ client: this.client });
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const migrationsFolder = path.resolve(__dirname, '../migrations');

      await migrate(drizzleDb, { migrationsFolder });
      console.log('Turso migrations run successfully');
    } catch (error) {
      console.error('Turso migrations failed:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.client !== null;
  }
}
