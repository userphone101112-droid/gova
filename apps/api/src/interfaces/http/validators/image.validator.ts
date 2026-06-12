/**
 * Image Validators
 * 
 * Zod validators for image-related operations.
 * These are used to validate incoming requests.
 */

import { z } from 'zod';

export const uploadImageSchema = z.object({
  file: z.any(), // File will be validated separately
  fileName: z.string().min(1).max(255),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  entityType: z.enum(['user', 'product', 'post', 'other']),
  entityId: z.string().min(1),
});

export const listImagesQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

export const getImageParamsSchema = z.object({
  id: z.string().uuid(),
});

export const deleteImageParamsSchema = z.object({
  id: z.string().uuid(),
});

export const getEntityImagesParamsSchema = z.object({
  type: z.enum(['user', 'product', 'post', 'other']),
  id: z.string().min(1),
});
