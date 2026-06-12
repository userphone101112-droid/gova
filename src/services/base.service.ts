/**
 * Base Service Interface
 * 
 * Defines the contract for all services in the application.
 * Services contain business logic and orchestrate data access through repositories.
 */

export interface IService<T, ID = string> {
  /**
   * Get an entity by its ID
   */
  getById(id: ID): Promise<T>;

  /**
   * Get all entities
   */
  getAll(): Promise<T[]>;

  /**
   * Get entities matching a filter
   */
  getMany(filter: Partial<T>): Promise<T[]>;

  /**
   * Get one entity matching a filter
   */
  getOne(filter: Partial<T>): Promise<T>;

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
   * Validate entity data before creation or update
   */
  validate(entity: Partial<T>): Promise<boolean>;
}

/**
 * Base Service Implementation
 * 
 * Provides a default implementation of the service interface.
 * Can be extended by specific services for custom business logic.
 */
export abstract class BaseService<T, ID = string> implements IService<T, ID> {
  abstract getById(id: ID): Promise<T>;
  abstract getAll(): Promise<T[]>;
  abstract getMany(filter: Partial<T>): Promise<T[]>;
  abstract getOne(filter: Partial<T>): Promise<T>;
  abstract create(entity: Omit<T, 'id'>): Promise<T>;
  abstract update(id: ID, entity: Partial<T>): Promise<T>;
  abstract delete(id: ID): Promise<void>;
  abstract validate(entity: Partial<T>): Promise<boolean>;
}
