/**
 * Base Repository Interface
 * 
 * Defines the contract for all repositories in the application.
 * Provides a consistent interface for data access operations.
 */

export interface IRepository<T, ID = string> {
  /**
   * Find an entity by its ID
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Find all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Find entities matching a filter
   */
  find(filter: Partial<T>): Promise<T[]>;

  /**
   * Find one entity matching a filter
   */
  findOne(filter: Partial<T>): Promise<T | null>;

  /**
   * Create a new entity
   */
  create(entity: Omit<T, 'id'>): Promise<T>;

  /**
   * Update an existing entity
   */
  update(id: ID, entity: Partial<T>): Promise<T>;

  /**
   * Delete an entity by its ID
   */
  delete(id: ID): Promise<void>;

  /**
   * Check if an entity exists
   */
  exists(id: ID): Promise<boolean>;

  /**
   * Count entities matching a filter
   */
  count(filter?: Partial<T>): Promise<number>;
}

/**
 * Base Repository Implementation
 * 
 * Provides a default implementation of the repository interface.
 * Can be extended by specific repositories for custom logic.
 */
export abstract class BaseRepository<T, ID = string> implements IRepository<T, ID> {
  abstract findById(id: ID): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract find(filter: Partial<T>): Promise<T[]>;
  abstract findOne(filter: Partial<T>): Promise<T | null>;
  abstract create(entity: Omit<T, 'id'>): Promise<T>;
  abstract update(id: ID, entity: Partial<T>): Promise<T>;
  abstract delete(id: ID): Promise<void>;
  abstract exists(id: ID): Promise<boolean>;
  abstract count(filter?: Partial<T>): Promise<number>;
}
