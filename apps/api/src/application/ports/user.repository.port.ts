/**
 * User Repository Port
 * 
 * Interface for user repository operations.
 * This is a port in the Hexagonal Architecture pattern.
 */

export interface UserPersistence {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRepository {
  findById(id: string): Promise<UserPersistence | null>;
  findByEmail(email: string): Promise<UserPersistence | null>;
  existsByEmail(email: string): Promise<boolean>;
  create(user: UserPersistence): Promise<UserPersistence>;
  update(id: string, user: Partial<UserPersistence>): Promise<UserPersistence>;
  delete(id: string): Promise<boolean>;
}
