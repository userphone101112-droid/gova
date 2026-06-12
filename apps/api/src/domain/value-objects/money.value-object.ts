/**
 * Money Value Object
 * 
 * Value object representing monetary values.
 * Contains validation logic for monetary operations.
 */

export class Money {
  private readonly _value: number;

  constructor(value: number) {
    if (!this.isValidMoney(value)) {
      throw new Error('Invalid monetary value');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  private isValidMoney(value: number): boolean {
    return value >= 0 && Number.isFinite(value);
  }

  add(other: Money): Money {
    return new Money(this._value + other._value);
  }

  subtract(other: Money): Money {
    return new Money(this._value - other._value);
  }

  multiply(factor: number): Money {
    return new Money(this._value * factor);
  }

  equals(other: Money): boolean {
    return this._value === other._value;
  }

  isGreaterThan(other: Money): boolean {
    return this._value > other._value;
  }

  isLessThan(other: Money): boolean {
    return this._value < other._value;
  }

  toJSON(): number {
    return this._value;
  }

  static fromJSON(value: number): Money {
    return new Money(value);
  }

  static zero(): Money {
    return new Money(0);
  }
}
