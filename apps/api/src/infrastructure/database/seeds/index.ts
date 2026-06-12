/**
 * Database Seed Script
 * 
 * Feeds the database with initial development data.
 */

import { DatabaseFactory } from '../adapters/database.factory.js';
import { env } from '../../../config/env.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { PasswordHasher } from '../../auth/password-hasher.js';
import { randomUUID } from 'crypto';

async function seed() {
  console.log('Starting database seeding...');
  const db = DatabaseFactory.createFromEnv(env);

  try {
    await db.connect();

    // Clear tables
    console.log('Clearing existing data...');
    await db.execute('DELETE FROM products');
    await db.execute('DELETE FROM users');
    await db.execute('DELETE FROM images');

    const userRepository = new UserRepository(db);
    const productRepository = new ProductRepository(db);
    const passwordHasher = new PasswordHasher();

    // Create users
    console.log('Seeding users...');
    const hashedAdminPassword = await passwordHasher.hash('admin123');
    const hashedUserPassword = await passwordHasher.hash('user1234');

    const adminId = randomUUID();
    await userRepository.create({
      id: adminId,
      email: 'admin@gova.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const customerId = randomUUID();
    await userRepository.create({
      id: customerId,
      email: 'customer@gova.com',
      password: hashedUserPassword,
      name: 'Regular Customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Seeding products...');
    await productRepository.create({
      id: randomUUID(),
      name: 'Premium Leather Boots',
      description: 'Handcrafted boots made with genuine full-grain leather.',
      price: 12000,
      stock: 15,
      userId: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await productRepository.create({
      id: randomUUID(),
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
      price: 25000,
      stock: 8,
      userId: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await productRepository.create({
      id: randomUUID(),
      name: 'Ergonomic Office Chair',
      description: 'Fully adjustable mesh chair designed for optimal lumbar support.',
      price: 18000,
      stock: 20,
      userId: customerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await db.disconnect();
  }
}

seed();
