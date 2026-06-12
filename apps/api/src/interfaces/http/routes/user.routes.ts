/**
 * User Routes
 *
 * Route definitions for user-related endpoints.
 */

import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller.js';
import { createUserSchema, loginSchema } from '@gv/schemas';

export async function userRoutes(fastify: FastifyInstance, controller: UserController) {
  fastify.post(
    '/users',
    {
      schema: {
        body: createUserSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    controller.create.bind(controller)
  );

  fastify.post(
    '/users/login',
    {
      schema: {
        body: loginSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
              token: { type: 'string' },
            },
          },
        },
      },
    },
    controller.login.bind(controller)
  );
}
