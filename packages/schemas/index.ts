// @gv/schemas

import { z } from 'zod';

// --- User Schemas ---
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
});

// --- Product Schemas ---
export const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters long'),
  description: z.string().min(10, 'Product description must be at least 10 characters long'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative').default(0),
});

export const updateProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters long').optional(),
  description: z
    .string()
    .min(10, 'Product description must be at least 10 characters long')
    .optional(),
  price: z.coerce.number().positive('Price must be greater than 0').optional(),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative').optional(),
});

// --- Image Schemas ---
export const uploadImageSchema = z.object({
  file: z.any().optional(), // Handled separately (Buffer/Stream check)
  fileName: z.string().min(1).max(255),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  entityType: z.enum(['user', 'product', 'post', 'other', 'merchant']),
  entityId: z.string().min(1),
});

export const listImagesQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

export const getImageParamsSchema = z.object({
  id: z.string().uuid('Invalid image ID format'),
});

export const deleteImageParamsSchema = z.object({
  id: z.string().uuid('Invalid image ID format'),
});

export const getEntityImagesParamsSchema = z.object({
  type: z.enum(['user', 'product', 'post', 'other', 'merchant']),
  id: z.string().min(1),
});

// --- Merchant/Order Placeholders ---
export const createMerchantSchema = z.object({
  storeName: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
});

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});
