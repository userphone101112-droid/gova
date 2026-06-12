// @gv/config

import { z } from 'zod';

// --- Frontend Environment Variable Schema ---
export const frontendEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('Global Ventures'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  API_TIMEOUT: z.coerce.number().min(1000).default(30000),
  DATABASE_URL: z.string().min(1).default('file:./dev.db'),
  NEXT_PUBLIC_ENABLE_ERROR_REPORTING: z.coerce.boolean().default(true),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// --- Backend Environment Variable Schema ---
export const backendEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(4000),
  DATABASE_PROVIDER: z.enum(['sqlite', 'turso']).default('sqlite'),
  DATABASE_URL: z.string().min(1).default('file:./dev.db'),
  TURSO_AUTH_TOKEN: z.string().optional(),
  JWT_SECRET: z.string().min(32).default('your-secret-key-change-in-production-long-key-32'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  IMAGE_STORAGE_PROVIDER: z
    .enum(['cloudflare', 'google_drive', 's3', 'minio', 'local'])
    .default('local'),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_API_KEY: z.string().optional(),
  CLOUDFLARE_BUCKET_NAME: z.string().optional(),
  CLOUDFLARE_PUBLIC_URL: z.string().optional(),
  GOOGLE_DRIVE_CLIENT_ID: z.string().optional(),
  GOOGLE_DRIVE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_DRIVE_REFRESH_TOKEN: z.string().optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),
});

export type FrontendEnv = z.infer<typeof frontendEnvSchema>;
export type BackendEnv = z.infer<typeof backendEnvSchema>;

export function loadFrontendConfig(envObj: Record<string, unknown> = process.env): FrontendEnv {
  try {
    return frontendEnvSchema.parse(envObj);
  } catch (error) {
    handleConfigError('Frontend', error);
  }
}

export function loadBackendConfig(envObj: Record<string, unknown> = process.env): BackendEnv {
  try {
    return backendEnvSchema.parse(envObj);
  } catch (error) {
    handleConfigError('Backend', error);
  }
}

function handleConfigError(context: string, error: unknown): never {
  if (error instanceof z.ZodError) {
    const missingVars = error.issues
      .map((err) => `${err.path.join('.')} (${err.message})`)
      .join(', ');
    throw new Error(
      `Invalid ${context} environment configuration: ${missingVars}\nPlease check your .env file.`
    );
  }
  throw error;
}
