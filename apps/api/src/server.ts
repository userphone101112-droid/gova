/**
 * Server
 * 
 * Server entry point.
 */

import { createApp } from './app.js';
import { env } from './config/env.js';

async function start() {
  try {
    const app = await createApp();
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${env.PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
