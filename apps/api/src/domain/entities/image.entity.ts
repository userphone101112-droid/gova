/**
 * Image Entity
 * 
 * Pure domain entity representing an image in the system.
 * This entity contains only business logic and has no dependencies on external systems.
 */

import { randomUUID } from 'crypto';

export type ImageProvider = 'cloudflare' | 'google_drive';
export type EntityType = 'user' | 'product' | 'post' | 'other';

export class Image {
  private _id: string;
  private _url: string;
  private _provider: ImageProvider;
  private _providerFileId: string;
  private _entityType: EntityType;
  private _entityId: string;
  private _mimeType: string;
  private _size: number;
  private _width?: number;
  private _height?: number;
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
    id: string = randomUUID(),
    createdAt: Date = new Date()
  ) {
    this._id = id;
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
    const validMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];
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
    createdAt: Date;
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
      json.createdAt
    );
  }
}
