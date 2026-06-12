/**
 * User Repository
 * 
 * Repository implementation for User entity.
 * This repository handles all database operations related to users.
 */

import { BaseRepository } from './base.repository.js';
import { IDatabaseAdapter } from '../adapters/database.adapter.interface.js';
import { IUserRepository, UserPersistence } from '@/application/ports/user.repository.port.js';

export class UserRepository extends BaseRepository<UserPersistence, string> implements IUserRepository {
  constructor(db: IDatabaseAdapter) {
    super(db, 'users');
  }

  /**
   * Find a user by email
   * @param email - User email
   * @returns User or null if not found
   */
  async findByEmail(email: string): Promise<UserPersistence | null> {
    return this.findOne({ email });
  }

  /**
   * Check if a user exists by email
   * @param email - User email
   * @returns True if exists, false otherwise
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}
