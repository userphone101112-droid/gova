/**
 * Product Repository
 * 
 * Repository implementation for Product entity.
 * This repository handles all database operations related to products.
 */

import { BaseRepository } from './base.repository.js';
import { IDatabaseAdapter } from '../adapters/database.adapter.interface.js';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductRepository extends BaseRepository<Product, string> {
  constructor(db: IDatabaseAdapter) {
    super(db, 'products');
  }

  /**
   * Find products by user ID
   * @param userId - User ID
   * @returns Array of products
   */
  async findByUserId(userId: string): Promise<Product[]> {
    return this.findWhere({ userId });
  }

  /**
   * Find products in stock
   * @returns Array of products with stock > 0
   */
  async findInStock(): Promise<Product[]> {
    const sql = `SELECT * FROM ${this.tableName} WHERE stock > 0`;
    return this.db.query<Product>(sql);
  }

  /**
   * Update product stock
   * @param id - Product ID
   * @param quantity - Quantity to add/subtract
   * @returns Updated product
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    const sql = `UPDATE ${this.tableName} SET stock = stock + ? WHERE id = ?`;
    await this.db.execute(sql, [quantity, id]);
    return (await this.findById(id)) as Product;
  }
}
