/**
 * User Domain Service
 * 
 * Domain service containing business logic that doesn't naturally fit within a single entity.
 * This service operates only on domain entities and value objects.
 */

import { User } from '../entities/user.entity.js';
import { Email } from '../value-objects/email.value-object.js';

export class UserDomainService {
  /**
   * Validate if a user can be created with the given data
   * @param email - User email
   * @param name - User name
   * @param password - User password
   * @returns Validation result
   */
  validateUserCreation(email: string, name: string, password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    try {
      new Email(email);
    } catch (error) {
      errors.push('Invalid email format');
    }

    if (name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if two users are the same
   * @param user1 - First user
   * @param user2 - Second user
   * @returns True if users are the same
   */
  areUsersEqual(user1: User, user2: User): boolean {
    return user1.id.equals(user2.id);
  }

  /**
   * Check if a user can update their email
   * @param user - User to update
   * @param newEmail - New email
   * @returns Validation result
   */
  canUpdateEmail(user: User, newEmail: string): {
    valid: boolean;
    error?: string;
  } {
    try {
      const email = new Email(newEmail);
      if (user.email.equals(email)) {
        return { valid: false, error: 'New email is the same as current email' };
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid email format' };
    }
  }
}
