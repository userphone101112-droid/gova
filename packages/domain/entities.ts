// @gv/domain - Entities

import { UserId, Email, ProductId, Money } from './value-objects';

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
    createdAt: Date | string;
    updatedAt: Date | string;
  }): User {
    return new User(
      new UserId(json.id),
      new Email(json.email),
      json.name,
      json.password,
      typeof json.createdAt === 'string' ? new Date(json.createdAt) : json.createdAt,
      typeof json.updatedAt === 'string' ? new Date(json.updatedAt) : json.updatedAt
    );
  }
}

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
    createdAt: Date | string;
    updatedAt: Date | string;
  }): Product {
    return new Product(
      new ProductId(json.id),
      json.name,
      json.description,
      new Money(json.price),
      json.stock,
      json.userId,
      typeof json.createdAt === 'string' ? new Date(json.createdAt) : json.createdAt,
      typeof json.updatedAt === 'string' ? new Date(json.updatedAt) : json.updatedAt
    );
  }
}

export type ImageProvider = 'cloudflare' | 'google_drive' | 's3' | 'minio';
export type EntityType = 'user' | 'product' | 'post' | 'other' | 'merchant';

export class Image {
  private _id: string;
  private _url: string;
  private _provider: ImageProvider;
  private _providerFileId: string;
  private _entityType: EntityType;
  private _entityId: string;
  private _mimeType: string;
  private _size: number;
  private _width: number | undefined;
  private _height: number | undefined;
  private _createdAt: Date;

  constructor(
    url: string,
    provider: ImageProvider,
    providerFileId: string,
    entityType: EntityType,
    entityId: string,
    mimeType: string,
    size: number,
    width?: number,
    height?: number,
    id?: string,
    createdAt: Date = new Date()
  ) {
    // Generate UUID manually or use provided id
    this._id =
      id ||
      (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : Math.random().toString(36).substring(2));
    this._url = url;
    this._provider = provider;
    this._providerFileId = providerFileId;
    this._entityType = entityType;
    this._entityId = entityId;
    this._mimeType = mimeType;
    this._size = size;
    this._width = width;
    this._height = height;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id;
  }

  get url(): string {
    return this._url;
  }

  get provider(): ImageProvider {
    return this._provider;
  }

  get providerFileId(): string {
    return this._providerFileId;
  }

  get entityType(): EntityType {
    return this._entityType;
  }

  get entityId(): string {
    return this._entityId;
  }

  get mimeType(): string {
    return this._mimeType;
  }

  get size(): number {
    return this._size;
  }

  get width(): number | undefined {
    return this._width;
  }

  get height(): number | undefined {
    return this._height;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  isAssociatedWith(entityType: EntityType, entityId: string): boolean {
    return this._entityType === entityType && this._entityId === entityId;
  }

  isValidMimeType(): boolean {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    return validMimeTypes.includes(this._mimeType);
  }

  isValidSize(maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return this._size <= maxSizeBytes;
  }

  toJSON() {
    return {
      id: this._id,
      url: this._url,
      provider: this._provider,
      providerFileId: this._providerFileId,
      entityType: this._entityType,
      entityId: this._entityId,
      mimeType: this._mimeType,
      size: this._size,
      width: this._width,
      height: this._height,
      createdAt: this._createdAt,
    };
  }

  static fromJSON(json: {
    id: string;
    url: string;
    provider: ImageProvider;
    providerFileId: string;
    entityType: EntityType;
    entityId: string;
    mimeType: string;
    size: number;
    width?: number;
    height?: number;
    createdAt: Date | string;
  }): Image {
    return new Image(
      json.url,
      json.provider,
      json.providerFileId,
      json.entityType,
      json.entityId,
      json.mimeType,
      json.size,
      json.width,
      json.height,
      json.id,
      typeof json.createdAt === 'string' ? new Date(json.createdAt) : json.createdAt
    );
  }
}

// --- Placeholder Entities for Merchant, Order, Category ---
export interface Merchant {
  id: string;
  userId: string;
  storeName: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}
