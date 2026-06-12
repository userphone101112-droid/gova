/**
 * Database Factory
 * 
 * This factory is responsible for creating the appropriate database adapter
 * based on the environment configuration. It hides the implementation details
 * from the rest of the application, ensuring that no domain or application
 * code knows which database is being used.
 * 
 * This is a critical part of the Hexagonal Architecture - the infrastructure
 * layer depends on abstractions, not concrete implementations.
 */

import {
  IDatabaseAdapter,
  IDatabaseConfig,
} from './database.adapter.interface.js';
import { SQLiteAdapter } from './sqlite.adapter.js';
import { TursoAdapter } from './turso.adapter.js';

export type DatabaseProvider = 'sqlite' | 'turso';

export class DatabaseFactory {
  /**
   * Create a database adapter based on the provider
   * @param provider - Database provider (sqlite or turso)
   * @param config - Database configuration
   * @returns Database adapter instance
   */
  static createAdapter(
    provider: DatabaseProvider,
    config: IDatabaseConfig
  ): IDatabaseAdapter {
    switch (provider) {
      case 'sqlite':
        return new SQLiteAdapter(config);
      case 'turso':
        return new TursoAdapter(config);
      default:
        throw new Error(`Unsupported database provider: ${provider}`);
    }
  }

  /**
   * Create a database adapter from environment variables
   * @param env - Environment variables object
   * @returns Database adapter instance
   */
  static createFromEnv(env: {
    DATABASE_PROVIDER: string;
    DATABASE_URL: string;
    TURSO_AUTH_TOKEN?: string;
    DATABASE_MAX_CONNECTIONS?: string;
    DATABASE_TIMEOUT?: string;
    DATABASE_ENABLE_LOGGING?: string;
  }): IDatabaseAdapter {
    const provider = env.DATABASE_PROVIDER as DatabaseProvider;

    const config: IDatabaseConfig = {
      url: env.DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
      maxConnections: env.DATABASE_MAX_CONNECTIONS
        ? parseInt(env.DATABASE_MAX_CONNECTIONS, 10)
        : undefined,
      timeout: env.DATABASE_TIMEOUT
        ? parseInt(env.DATABASE_TIMEOUT, 10)
        : undefined,
      enableLogging: env.DATABASE_ENABLE_LOGGING === 'true',
    };

    return this.createAdapter(provider, config);
  }
}
