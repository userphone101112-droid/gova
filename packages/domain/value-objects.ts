// @gv/domain - Value Objects

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

function generateUUID(): string {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  // Math.random fallback for environments without web crypto
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export class UserId {
  private readonly _value: string;

  constructor(value: string) {
    if (!isValidUUID(value)) {
      throw new Error('Invalid user ID format');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }

  toJSON(): string {
    return this._value;
  }

  static generate(): UserId {
    return new UserId(generateUUID());
  }

  static fromJSON(value: string): UserId {
    return new UserId(value);
  }
}

export class ProductId {
  private readonly _value: string;

  constructor(value: string) {
    if (!isValidUUID(value)) {
      throw new Error('Invalid product ID format');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: ProductId): boolean {
    return this._value === other._value;
  }

  toJSON(): string {
    return this._value;
  }

  static generate(): ProductId {
    return new ProductId(generateUUID());
  }

  static fromJSON(value: string): ProductId {
    return new ProductId(value);
  }
}

export class ImageId {
  private readonly _value: string;

  constructor(value: string) {
    if (!isValidUUID(value)) {
      throw new Error('Invalid image ID format');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: ImageId): boolean {
    return this._value === other._value;
  }

  toJSON(): string {
    return this._value;
  }

  static generate(): ImageId {
    return new ImageId(generateUUID());
  }

  static fromJSON(value: string): ImageId {
    return new ImageId(value);
  }
}

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
