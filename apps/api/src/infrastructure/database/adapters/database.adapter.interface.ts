/**
 * Database Adapter Interface
 * 
 * This interface defines the contract that all database adapters must implement.
 * It provides a unified interface for database operations regardless of the underlying implementation.
 * 
 * This is a critical part of the Hexagonal Architecture - the infrastructure layer depends on this interface,
 * not on concrete implementations like SQLite or Turso.
 */

export interface IDatabaseAdapter {
  /**
   * Establish connection to the database
   */
  connect(): Promise<void>;

  /**
   * Close database connection
   */
  disconnect(): Promise<void>;

  /**
   * Execute a raw SQL query
   * @param sql - SQL query string
   * @param params - Query parameters
   * @returns Query result
   */
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;

  /**
   * Execute a query that returns a single row
   * @param sql - SQL query string
   * @param params - Query parameters
   * @returns Single row or null
   */
  queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null>;

  /**
   * Execute a query that doesn't return data (INSERT, UPDATE, DELETE)
   * @param sql - SQL query string
   * @param params - Query parameters
   * @returns Number of affected rows
   */
  execute(sql: string, params?: unknown[]): Promise<number>;

  /**
   * Begin a transaction
   * @returns Transaction object
   */
  beginTransaction(): Promise<ITransaction>;

  /**
   * Run database migrations
   */
  migrate(): Promise<void>;

  /**
   * Check if connection is active
   */
  isConnected(): boolean;
}

/**
 * Transaction Interface
 * 
 * Defines the contract for database transactions
 */
export interface ITransaction {
  /**
   * Commit the transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback the transaction
   */
  rollback(): Promise<void>;

  /**
   * Execute a query within the transaction
   * @param sql - SQL query string
   * @param params - Query parameters
   * @returns Query result
   */
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;

  /**
   * Execute a query that returns a single row within the transaction
   * @param sql - SQL query string
   * @param params - Query parameters
   * @returns Single row or null
   */
  queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null>;

  /**
   * Execute a query that doesn't return data within the transaction
   * @param sql - SQL query string
   * @param params - Query parameters
   * @returns Number of affected rows
   */
  execute(sql: string, params?: unknown[]): Promise<number>;
}

/**
 * Database Configuration Interface
 * 
 * Defines the configuration options for database adapters
 */
export interface IDatabaseConfig {
  /**
   * Database URL or file path
   */
  url: string;

  /**
   * Authentication token (for Turso)
   */
  authToken?: string;

  /**
   * Maximum number of connections in the pool
   */
  maxConnections?: number;

  /**
   * Connection timeout in milliseconds
   */
  timeout?: number;

  /**
   * Enable query logging
   */
  enableLogging?: boolean;
}
