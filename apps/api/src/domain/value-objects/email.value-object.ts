/**
 * Email Value Object
 * 
 * Value object representing an email address.
 * Contains validation logic for email format.
 */

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email format');
    }
    this._value = value.toLowerCase();
  }

  get value(): string {
    return this._value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toJSON(): string {
    return this._value;
  }

  static fromJSON(value: string): Email {
    return new Email(value);
  }
}
