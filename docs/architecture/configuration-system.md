# Configuration System

## Overview

The configuration system manages application settings across different environments (development, staging, production) using environment variables and configuration files.

## Architecture

### Configuration Sources

1. **Environment Variables**: Runtime configuration
2. **Configuration Files**: Static configuration
3. **Default Values**: Fallback configuration

### Configuration Hierarchy

```
Environment Variables → Configuration Files → Default Values
```

## Environment Variables

### Application Configuration

**Location**: `.env.example`

**Variables**:
```bash
# Application
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DATABASE_URL=file:./dev.db
DATABASE_AUTH_TOKEN=

# Turso (Production)
TURSO_URL=
TURSO_AUTH_TOKEN=

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION_HOURS=24

# Storage
STORAGE_PROVIDER=cloudflare

# Cloudflare R2
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=

# Google Drive
GOOGLE_DRIVE_CLIENT_ID=
GOOGLE_DRIVE_CLIENT_SECRET=
GOOGLE_DRIVE_REFRESH_TOKEN=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# CORS
CORS_ORIGIN=*
```

---

## Configuration Files

### Backend Configuration

**Location**: `apps/api/src/config/env.ts`

**Purpose**: Environment variable validation and loading

**Implementation**:
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().optional(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  JWT_SECRET: z.string().min(32),
  STORAGE_PROVIDER: z.enum(['cloudflare', 'google_drive', 's3']).default('cloudflare'),
  // ... other variables
});

export const env = envSchema.parse(process.env);
```

### Frontend Configuration

**Location**: `src/configs/env.ts`

**Purpose**: Frontend environment configuration

**Implementation**:
```typescript
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
};
```

---

## Configuration Validation

### Zod Schema Validation

**Purpose**: Ensure environment variables are valid at startup

**Benefits**:
- **Early Failure**: Fail fast on invalid configuration
- **Type Safety**: TypeScript types from schema
- **Documentation**: Schema serves as documentation
- **Validation**: Automatic validation of required fields

### Validation Rules

- **Required Fields**: Mark required fields in schema
- **Type Checking**: Enforce correct types
- **Default Values**: Provide sensible defaults
- **Enum Values**: Restrict to allowed values

---

## Environment-Specific Configuration

### Development

**Database**: SQLite file database
**Storage**: Local or mock storage
**Logging**: Verbose logging
**CORS**: Permissive CORS

### Staging

**Database**: Turso (edge database)
**Storage**: Cloudflare R2
**Logging**: Info level
**CORS**: Restricted to staging domain

### Production

**Database**: Turso (edge database)
**Storage**: Cloudflare R2
**Logging**: Error level only
**CORS**: Restricted to production domain
**Security**: Strict security headers

---

## Configuration Access Patterns

### Backend Access

**Import**:
```typescript
import { env } from './config/env';
```

**Usage**:
```typescript
const db = DatabaseFactory.createFromEnv(env);
const storageProvider = StorageFactory.createProvider(env);
```

### Frontend Access

**Import**:
```typescript
import { config } from '@/configs/env';
```

**Usage**:
```typescript
const response = await fetch(`${config.apiUrl}/users`);
```

---

## Security

### Sensitive Data

**Rules**:
- Never commit `.env` files
- Use `.env.example` as template
- Rotate secrets regularly
- Use secret management services (planned)

### Secret Management

**Current**: Environment variables
**Planned**: AWS Secrets Manager, HashiCorp Vault

### Encryption

**At Rest**: Database encryption (Turso)
**In Transit**: HTTPS/TLS
**Secrets**: Environment variables (OS-level protection)

---

## Configuration Best Practices

### Naming Conventions

- **Uppercase**: Use uppercase for environment variables
- **Underscores**: Use underscores for multi-word names
- **Prefixes**: Use prefixes for grouping (e.g., `DATABASE_`, `JWT_`)

### Documentation

- **Example File**: Maintain `.env.example`
- **Comments**: Document each variable
- **Types**: Document expected types

### Validation

- **Schema Validation**: Validate at startup
- **Type Safety**: Use TypeScript types
- **Defaults**: Provide sensible defaults

---

## Source Traceability

**Source Folders**:
- `apps/api/src/config/` - Backend configuration
- `src/configs/` - Frontend configuration

**Key Files**:
- `apps/api/src/config/env.ts` - Backend environment configuration
- `src/configs/env.ts` - Frontend environment configuration
- `.env.example` - Environment variable template

**Dependencies**:
- `zod` - Schema validation

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions

**Related Packages**:
- None (configuration is app-specific)

**Usage In**:
- `apps/api/src/app.ts` - Application initialization
- `src/lib/api-client.ts` - API client configuration
