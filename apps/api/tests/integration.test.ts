import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app.js';
import { DatabaseFactory } from '../src/infrastructure/database/adapters/database.factory.js';
import { env } from '../src/config/env.js';

describe('Integration Tests', () => {
  let app: any;
  let db: any;

  beforeAll(async () => {
    app = await createApp();
    db = DatabaseFactory.createFromEnv(env);
    await db.connect();
  });

  afterAll(async () => {
    await app.close();
    await db.disconnect();
  });

  describe('Health check', () => {
    it('should return 200 OK', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toHaveProperty('status', 'ok');
    });

    it('should return ready status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/ready',
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toHaveProperty('status', 'ready');
    });
  });

  describe('Authentication and User routes', () => {
    const email = `test-${Date.now()}@example.com`;
    const password = 'testpassword123';
    const name = 'Test User';

    it('should register a new user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: { email, password, name },
      });
      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.email).toBe(email);
      expect(body.name).toBe(name);
    });

    it('should login and return a JWT token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users/login',
        payload: { email, password },
      });
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('token');
      expect(body.user.email).toBe(email);
    });
  });
});
