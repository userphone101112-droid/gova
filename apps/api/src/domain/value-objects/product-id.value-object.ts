/**
 * Product ID Value Object
 * 
 * Value object representing a product identifier.
 * Contains validation logic for product ID format.
 */

import { randomUUID } from 'crypto';

export class ProductId {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValidProductId(value)) {
      throw new Error('Invalid product ID format');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private isValidProductId(id: string): boolean {
    // UUID v4 format validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  equals(other: ProductId): boolean {
    return this._value === other._value;
  }

  toJSON(): string {
    return this._value;
  }

  static generate(): ProductId {
    return new ProductId(randomUUID());
  }

  static fromJSON(value: string): ProductId {
    return new ProductId(value);
  }
}
