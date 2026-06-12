/**
 * User Created Event
 * 
 * Domain event emitted when a user is created.
 * This is a pure domain event with no external dependencies.
 */

import { UserId } from '../value-objects/user-id.value-object.js';

export class UserCreatedEvent {
  readonly userId: UserId;
  readonly email: string;
  readonly name: string;
  readonly occurredAt: Date;

  constructor(userId: UserId, email: string, name: string) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.occurredAt = new Date();
  }

  toJSON() {
    return {
      userId: this.userId.value,
      email: this.email,
      name: this.name,
      occurredAt: this.occurredAt,
    };
  }
}
