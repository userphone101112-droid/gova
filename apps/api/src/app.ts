/**
 * Application
 * 
 * Main Fastify application setup.
 */

import Fastify from 'fastify';
import { env } from './config/env.js';
import fastifyPlugins from './interfaces/http/plugins/fastify.plugins.js';
import { UserController } from './interfaces/http/controllers/user.controller.js';
import { ImageController } from './interfaces/http/controllers/image.controller.js';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case.js';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case.js';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case.js';
import { DeleteImageUseCase } from './application/use-cases/delete-image.use-case.js';
import { GetImageUseCase } from './application/use-cases/get-image.use-case.js';
import { ListImagesUseCase } from './application/use-cases/list-images.use-case.js';
import { UserRepository } from './infrastructure/database/repositories/user.repository.js';
import { ImageRepository } from './infrastructure/database/repositories/image.repository.js';
import { PasswordHasher } from './infrastructure/auth/password-hasher.js';
import { JWTService } from './infrastructure/auth/jwt.service.js';
import { DatabaseFactory } from './infrastructure/database/adapters/database.factory.js';
import { StorageFactory } from './infrastructure/storage/storage.factory.js';
import { userRoutes } from './interfaces/http/routes/user.routes.js';
import { imageRoutes } from './interfaces/http/routes/image.routes.js';

export async function createApp() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(fastifyPlugins);

  // Initialize database
  const db = DatabaseFactory.createFromEnv(env);
  await db.connect();
  await db.migrate();

  // Initialize repositories
  const userRepository = new UserRepository(db);
  const imageRepository = new ImageRepository(db);

  // Initialize services
  const passwordHasher = new PasswordHasher();
  const storageProvider = StorageFactory.createProvider();
  const jwtService = new JWTService(fastify.jwt);

  // Initialize use cases
  const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
  const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, jwtService);
  const uploadImageUseCase = new UploadImageUseCase(storageProvider, imageRepository);
  const deleteImageUseCase = new DeleteImageUseCase(storageProvider, imageRepository);
  const getImageUseCase = new GetImageUseCase(imageRepository);
  const listImagesUseCase = new ListImagesUseCase(imageRepository);

  // Initialize controllers
  const userController = new UserController(createUserUseCase, loginUserUseCase);
  const imageController = new ImageController(uploadImageUseCase, deleteImageUseCase, getImageUseCase, listImagesUseCase);

  // Register routes
  await fastify.register(async (fastifyInstance) => {
    await userRoutes(fastifyInstance, userController);
    await imageRoutes(fastifyInstance, imageController);
  });

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Ready check endpoint
  fastify.get('/ready', async () => {
    const isDbConnected = db.isConnected();
    return { status: isDbConnected ? 'ready' : 'not ready', database: isDbConnected };
  });

  return fastify;
}
