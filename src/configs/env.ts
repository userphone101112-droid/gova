import { z } from 'zod';

/**
 * Environment Variable Schema
 * 
 * This schema validates all environment variables at runtime.
 * If any required variable is missing or invalid, the application will fail to start.
 */
const envSchema = z.object({
  // Application Configuration
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('My App'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Firebase Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1).optional(),

  // Database Configuration
  DATABASE_URL: z.string().min(1).default('file:./dev.db'),
  TURSO_DATABASE_URL: z.string().url().optional(),
  TURSO_AUTH_TOKEN: z.string().min(1).optional(),

  // API Configuration
  API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  API_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000)).default(30000),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .default(false),
  NEXT_PUBLIC_ENABLE_ERROR_REPORTING: z
    .string()
    .transform((val) => val === 'true')
    .default(true),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validate and parse environment variables
 * 
 * This function will throw an error if any required environment variable is missing or invalid.
 */
function validateEnv() {
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

/**
 * Export validated environment variables
 * 
 * This is the single source of truth for all environment variables in the application.
 * Import this file instead of using process.env directly.
 */
export const env = validateEnv();

/**
 * Type-safe environment variables
 * 
 * Use this type for type checking environment variables.
 */
export type Env = z.infer<typeof envSchema>;
