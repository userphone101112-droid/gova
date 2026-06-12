/**
 * Base Repository Implementation
 * 
 * Provides a default implementation of the repository interface.
 * Handles key mapping between camelCase (JS/TS) and snake_case (SQL DB) automatically.
 */

import { IDatabaseAdapter } from '../adapters/database.adapter.interface.js';

export interface IRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  findWhere(criteria: Record<string, unknown>): Promise<T[]>;
  findOne(criteria: Record<string, unknown>): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
  count(criteria?: Record<string, unknown>): Promise<number>;
  exists(id: ID): Promise<boolean>;
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function mapObjectKeys(obj: any, mapFn: (key: string) => string): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => mapObjectKeys(item, mapFn));
  }
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Date) {
      result[mapFn(key)] = value;
    } else if (typeof value === 'object' && value !== null) {
      result[mapFn(key)] = mapObjectKeys(value, mapFn);
    } else {
      result[mapFn(key)] = value;
    }
  }
  return result;
}

export abstract class BaseRepository<T, ID> implements IRepository<T, ID> {
  protected db: IDatabaseAdapter;
  protected tableName: string;

  constructor(db: IDatabaseAdapter, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  async findById(id: ID): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const result = await this.db.queryOne<any>(sql, [id]);
    return result ? mapObjectKeys(result, snakeToCamel) : null;
  }

  async findAll(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName}`;
    const results = await this.db.query<any>(sql);
    return results.map(row => mapObjectKeys(row, snakeToCamel));
  }

  async findWhere(criteria: Record<string, unknown>): Promise<T[]> {
    const snakeCriteria = mapObjectKeys(criteria, camelToSnake);
    const keys = Object.keys(snakeCriteria);
    const values = Object.values(snakeCriteria);
    const whereClause = keys.map((key) => `${key} = ?`).join(' AND ');
    const sql = `SELECT * FROM ${this.tableName} WHERE ${whereClause}`;
    const results = await this.db.query<any>(sql, values);
    return results.map(row => mapObjectKeys(row, snakeToCamel));
  }

  async findOne(criteria: Record<string, unknown>): Promise<T | null> {
    const snakeCriteria = mapObjectKeys(criteria, camelToSnake);
    const keys = Object.keys(snakeCriteria);
    const values = Object.values(snakeCriteria);
    const whereClause = keys.map((key) => `${key} = ?`).join(' AND ');
    const sql = `SELECT * FROM ${this.tableName} WHERE ${whereClause} LIMIT 1`;
    const result = await this.db.queryOne<any>(sql, values);
    return result ? mapObjectKeys(result, snakeToCamel) : null;
  }

  async create(entity: T): Promise<T> {
    const snakeEntity = mapObjectKeys(entity, camelToSnake);
    const keys = Object.keys(snakeEntity);
    const values = Object.values(snakeEntity);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    
    await this.db.execute(sql, values);
    
    // If id is not in the input entity, get the last inserted ID
    if (!(entity as any).id) {
      const lastId = await this.db.queryOne<{ id: ID }>('SELECT last_insert_rowid() as id');
      return { ...(entity as any), id: lastId?.id } as T;
    }
    
    return entity;
  }

  async update(id: ID, entity: Partial<T>): Promise<T> {
    const snakeEntity = mapObjectKeys(entity, camelToSnake);
    const keys = Object.keys(snakeEntity);
    const values = Object.values(snakeEntity);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    
    await this.db.execute(sql, [...values, id]);
    
    return (await this.findById(id)) as T;
  }

  async delete(id: ID): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.db.execute(sql, [id]);
    return result > 0;
  }

  async count(criteria?: Record<string, unknown>): Promise<number> {
    if (criteria) {
      const snakeCriteria = mapObjectKeys(criteria, camelToSnake);
      const keys = Object.keys(snakeCriteria);
      const values = Object.values(snakeCriteria);
      const whereClause = keys.map((key) => `${key} = ?`).join(' AND ');
      const sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE ${whereClause}`;
      const result = await this.db.queryOne<{ count: number }>(sql, values);
      return result?.count ?? 0;
    }
    
    const sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const result = await this.db.queryOne<{ count: number }>(sql);
    return result?.count ?? 0;
  }

  async exists(id: ID): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }
}
