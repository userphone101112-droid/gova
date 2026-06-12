/**
 * Image Routes
 * 
 * Route definitions for image-related endpoints.
 */

import { FastifyInstance } from 'fastify';
import { ImageController } from '../controllers/image.controller';
import { listImagesQuerySchema, getImageParamsSchema, deleteImageParamsSchema } from '../validators/image.validator.js';

export async function imageRoutes(fastify: FastifyInstance, controller: ImageController) {
  // Upload image
  fastify.post('/images/upload', {
    schema: {
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            url: { type: 'string' },
            provider: { type: 'string' },
            providerFileId: { type: 'string' },
            entityType: { type: 'string' },
            entityId: { type: 'string' },
            mimeType: { type: 'string' },
            size: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
  }, controller.upload.bind(controller));

  // Get image by ID
  fastify.get('/images/:id', {
    schema: {
      params: getImageParamsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            url: { type: 'string' },
            provider: { type: 'string' },
            providerFileId: { type: 'string' },
            entityType: { type: 'string' },
            entityId: { type: 'string' },
            mimeType: { type: 'string' },
            size: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
  }, controller.get.bind(controller));

  // List images
  fastify.get('/images', {
    schema: {
      querystring: listImagesQuerySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  url: { type: 'string' },
                  provider: { type: 'string' },
                  providerFileId: { type: 'string' },
                  entityType: { type: 'string' },
                  entityId: { type: 'string' },
                  mimeType: { type: 'string' },
                  size: { type: 'number' },
                  width: { type: 'number' },
                  height: { type: 'number' },
                  createdAt: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
            limit: { type: 'number' },
            offset: { type: 'number' },
            hasMore: { type: 'boolean' },
          },
        },
      },
    },
  }, controller.list.bind(controller));

  // Delete image
  fastify.delete('/images/:id', {
    schema: {
      params: deleteImageParamsSchema,
      response: {
        204: {
          type: 'null',
        },
      },
    },
  }, controller.delete.bind(controller));
}
