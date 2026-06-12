/**
 * Error Handler Middleware
 * 
 * Global error handler for Fastify server.
 * Converts domain and application errors to HTTP responses.
 */

import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ApplicationError } from '@/shared';
import { DomainError } from '@/domain';
import { logger } from '@/infrastructure';

export async function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error(error);

  // Handle application errors
  if (error instanceof ApplicationError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  // Handle domain errors
  if (error instanceof DomainError) {
    return reply.status(400).send({
      error: {
        code: 'DOMAIN_ERROR',
        message: error.message,
      },
    });
  }

  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.validation,
      },
    });
  }

  // Handle unknown errors
  return reply.status(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
