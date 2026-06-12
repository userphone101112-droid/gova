/**
 * Product Entity
 * 
 * Pure domain entity representing a product in the system.
 * This entity contains only business logic and has no dependencies on external systems.
 */

import { ProductId } from '../value-objects/product-id.value-object';
import { Money } from '../value-objects/money.value-object';

export class Product {
  private _id: ProductId;
  private _name: string;
  private _description: string;
  private _price: Money;
  private _stock: number;
  private _userId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: ProductId,
    name: string,
    description: string,
    price: Money,
    stock: number,
    userId: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._stock = stock;
    this._userId = userId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): ProductId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): Money {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    if (name.length < 3) {
      throw new Error('Product name must be at least 3 characters long');
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    if (description.length < 10) {
      throw new Error('Product description must be at least 10 characters long');
    }
    this._description = description;
    this._updatedAt = new Date();
  }

  updatePrice(price: Money): void {
    if (price.value <= 0) {
      throw new Error('Product price must be greater than 0');
    }
    this._price = price;
    this._updatedAt = new Date();
  }

  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    this._stock += quantity;
    this._updatedAt = new Date();
  }

  removeStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (this._stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this._stock -= quantity;
    this._updatedAt = new Date();
  }

  isInStock(): boolean {
    return this._stock > 0;
  }

  toJSON() {
    return {
      id: this._id.value,
      name: this._name,
      description: this._description,
      price: this._price.value,
      stock: this._stock,
      userId: this._userId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromJSON(json: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return new Product(
      new ProductId(json.id),
      json.name,
      json.description,
      new Money(json.price),
      json.stock,
      json.userId,
      json.createdAt,
      json.updatedAt
    );
  }
}
