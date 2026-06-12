/**
 * Environment Configuration
 * 
 * Type-safe environment variable validation using Zod.
 * This is the single source of truth for all environment variables.
 */

import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default(4000),

  // Database
  DATABASE_PROVIDER: z.enum(['sqlite', 'turso']).default('sqlite'),
  DATABASE_URL: z.string().min(1).default('file:./dev.db'),
  TURSO_AUTH_TOKEN: z.string().min(1).optional(),

  // Security
  JWT_SECRET: z.string().min(32).default('your-secret-key-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Logging
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // Image Storage
  IMAGE_STORAGE_PROVIDER: z.enum(['cloudflare', 'google_drive']).default('cloudflare'),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1).optional(),
  CLOUDFLARE_API_KEY: z.string().min(1).optional(),
  CLOUDFLARE_BUCKET_NAME: z.string().min(1).optional(),
  CLOUDFLARE_PUBLIC_URL: z.string().min(1).optional(),
  GOOGLE_DRIVE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_DRIVE_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_DRIVE_REFRESH_TOKEN: z.string().min(1).optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((err) => `${err.path.join('.')} (${err.message})`)
        .join(', ');
      throw new Error(
        `Invalid environment configuration: ${missingVars}\nPlease check your .env file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
