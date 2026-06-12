/**
 * User Entity
 * 
 * Pure domain entity representing a user in the system.
 * This entity contains only business logic and has no dependencies on external systems.
 */

import { Email } from '../value-objects/email.value-object';
import { UserId } from '../value-objects/user-id.value-object';

export class User {
  private _id: UserId;
  private _email: Email;
  private _name: string;
  private _password: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: UserId,
    email: Email,
    name: string,
    password: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._email = email;
    this._name = name;
    this._password = password;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    if (name.length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  updatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    this._password = password;
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id.value,
      email: this._email.value,
      name: this._name,
      password: this._password,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(json: {
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      new UserId(json.id),
      new Email(json.email),
      json.name,
      json.password,
      json.createdAt,
      json.updatedAt
    );
  }
}
