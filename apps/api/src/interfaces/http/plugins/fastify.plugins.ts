/**
 * Fastify Plugins
 * 
 * Configuration for Fastify plugins.
 */

import fp from 'fastify-plugin';
import { env } from '@/config/env.js';

export default fp(async (fastify) => {
  // Register CORS
  await fastify.register(import('@fastify/cors'), {
    origin: true,
  });

  // Register Helmet for security headers
  await fastify.register(import('@fastify/helmet'), {
    contentSecurityPolicy: false,
  });

  // Register Rate Limiting
  await fastify.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

  // Register JWT
  await fastify.register(import('@fastify/jwt'), {
    secret: env.JWT_SECRET,
  });

  // Register Multipart for file uploads
  await fastify.register(import('@fastify/multipart'), {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  // Set Zod schema validator compiler
  fastify.setValidatorCompiler(({ schema }: any) => {
    return (data: any) => {
      if (schema && typeof schema.safeParse === 'function') {
        const result = schema.safeParse(data);
        if (result.success) {
          return { value: result.data };
        }
        return { error: result.error };
      }
      return { value: data };
    };
  });

  // Register global error handler
  fastify.setErrorHandler(async (error: unknown, request, reply) => {
    const { errorHandler } = await import('../middlewares/error-handler.middleware.js');
    return errorHandler(error as any, request, reply);
  });
});
