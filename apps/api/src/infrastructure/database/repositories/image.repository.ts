/**
 * Image Repository
 * 
 * Repository implementation for image data access.
 * This repository implements the IImageRepository port interface
 * and extends the BaseRepository for database abstraction.
 */

import { BaseRepository } from './base.repository.js';
import { IImageRepository } from '@/application/ports/image-repository.port.js';
import { Image, ImageProvider, EntityType } from '@/domain/index.js';
import { IDatabaseAdapter } from '../adapters/database.adapter.interface.js';

export interface ImageDBRow {
  id: string;
  url: string;
  provider: string;
  providerFileId: string;
  entityType: string;
  entityId: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: string | number | Date;
}

export class ImageRepository extends BaseRepository<any, string> implements IImageRepository {
  constructor(db: IDatabaseAdapter) {
    super(db, 'images');
  }

  private toDomain(row: ImageDBRow): Image {
    return Image.fromJSON({
      id: row.id,
      url: row.url,
      provider: row.provider as ImageProvider,
      providerFileId: row.providerFileId,
      entityType: row.entityType as EntityType,
      entityId: row.entityId,
      mimeType: row.mimeType,
      size: row.size,
      width: row.width ?? undefined,
      height: row.height ?? undefined,
      createdAt: new Date(row.createdAt),
    });
  }

  private toPersistence(image: Image): ImageDBRow {
    const json = image.toJSON();
    return {
      id: json.id,
      url: json.url,
      provider: json.provider,
      providerFileId: json.providerFileId,
      entityType: json.entityType,
      entityId: json.entityId,
      mimeType: json.mimeType,
      size: json.size,
      width: json.width ?? null,
      height: json.height ?? null,
      createdAt: json.createdAt instanceof Date ? json.createdAt.toISOString() : new Date(json.createdAt).toISOString(),
    };
  }

  async findById(id: string): Promise<Image | null> {
    const result = await super.findById(id);
    if (!result) {
      return null;
    }
    return this.toDomain(result);
  }

  async findByEntity(entityType: EntityType, entityId: string): Promise<Image[]> {
    const results = await this.findWhere({
      entityType: entityType,
      entityId: entityId,
    });
    return results.map((result) => this.toDomain(result));
  }

  async findByProviderFileId(providerFileId: string, provider: ImageProvider): Promise<Image | null> {
    const result = await this.findOne({
      providerFileId: providerFileId,
      provider: provider,
    });
    if (!result) {
      return null;
    }
    return this.toDomain(result);
  }

  async create(image: Image): Promise<Image> {
    const dbRow = this.toPersistence(image);
    await super.create(dbRow);
    return image;
  }

  async deleteByEntity(entityType: EntityType, entityId: string): Promise<number> {
    return this.db.execute(
      `DELETE FROM ${this.tableName} WHERE entity_type = ? AND entity_id = ?`,
      [entityType, entityId]
    );
  }

  async list(limit: number, offset: number): Promise<Image[]> {
    const sql = `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`;
    const results = await this.db.query<any>(sql, [limit, offset]);
    
    const mapped = results.map(row => {
      const result: any = {};
      for (const [key, value] of Object.entries(row)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelKey] = value;
      }
      return result;
    });

    return mapped.map((result) => this.toDomain(result));
  }

  async count(): Promise<number> {
    return super.count();
  }
}
