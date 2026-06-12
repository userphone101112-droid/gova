/**
 * Image ID Value Object
 * 
 * Value object representing an image identifier.
 * Contains validation logic for image ID format.
 */

import { randomUUID } from 'crypto';

export class ImageId {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValidImageId(value)) {
      throw new Error('Invalid image ID format');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private isValidImageId(id: string): boolean {
    // UUID v4 format validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  equals(other: ImageId): boolean {
    return this._value === other._value;
  }

  toJSON(): string {
    return this._value;
  }

  static generate(): ImageId {
    return new ImageId(randomUUID());
  }

  static fromJSON(value: string): ImageId {
    return new ImageId(value);
  }
}
