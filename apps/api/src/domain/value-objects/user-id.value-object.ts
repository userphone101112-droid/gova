/**
 * User ID Value Object
 * 
 * Value object representing a user identifier.
 * Contains validation logic for user ID format.
 */

import { randomUUID } from 'crypto';

export class UserId {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValidUserId(value)) {
      throw new Error('Invalid user ID format');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private isValidUserId(id: string): boolean {
    // UUID v4 format validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }

  toJSON(): string {
    return this._value;
  }

  static generate(): UserId {
    return new UserId(randomUUID());
  }

  static fromJSON(value: string): UserId {
    return new UserId(value);
  }
}
