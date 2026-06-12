# Deployment System

## Overview

The deployment system manages application deployment across environments (development, staging, production) using modern deployment strategies and infrastructure as code.

## Deployment Strategy

### Deployment Platforms

**Frontend**: Vercel (Next.js optimized)
**Backend**: Vercel (serverless functions) or Railway (container-based)
**Database**: Turso (edge SQLite)
**Storage**: Cloudflare R2 (object storage)

### Deployment Pipeline

```
Git Push → CI/CD → Build → Test → Deploy
```

---

## Environments

### Development

**Purpose**: Local development

**Database**: SQLite file (`dev.db`)
**Storage**: Local or mock storage
**URL**: `http://localhost:3000`

**Setup**:
```bash
npm install
npm run dev
```

---

### Staging

**Purpose**: Pre-production testing

**Database**: Turso (edge database)
**Storage**: Cloudflare R2
**URL**: `https://staging.example.com`

**Deployment**: Manual trigger or on push to `staging` branch

---

### Production

**Purpose**: Live production environment

**Database**: Turso (edge database)
**Storage**: Cloudflare R2
**URL**: `https://example.com`

**Deployment**: Automatic on push to `main` branch

---

## Frontend Deployment

### Vercel Configuration

**Location**: `vercel.json` (planned)

**Configuration**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

### Environment Variables

**Vercel Dashboard**:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NODE_ENV`: `production`

### Build Process

1. Install dependencies
2. Run build command
3. Optimize images
4. Generate static pages
5. Deploy to edge network

---

## Backend Deployment

### Option 1: Vercel Serverless

**Configuration**:
```json
{
  "functions": {
    "apps/api/src/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

**Benefits**:
- Serverless scaling
- Edge deployment
- Automatic HTTPS
- Zero configuration

---

### Option 2: Railway (Container)

**Configuration**: `Dockerfile` (planned)

**Benefits**:
- Full control
- Long-running processes
- Custom dependencies
- Better for background jobs

---

## Database Deployment

### Turso Configuration

**Location**: Turso Dashboard

**Setup**:
1. Create Turso database
2. Get database URL and auth token
3. Set environment variables
4. Run migrations

**Environment Variables**:
```bash
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

### Migrations

**Run Migrations**:
```bash
npm run db:migrate
```

**Migration Strategy**:
- Automatic on deployment
- Rollback support
- Migration tracking

---

## Storage Deployment

### Cloudflare R2 Configuration

**Setup**:
1. Create R2 bucket
2. Get account ID and access keys
3. Set environment variables
4. Configure CORS policy

**Environment Variables**:
```bash
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET=your-bucket-name
```

### CDN Configuration

**Cloudflare CDN**:
- Automatic with R2
- Global edge network
- Zero egress fees
- DDoS protection

---

## Deploy Key Setup

### SSH Deploy Keys

**Location**: `DEPLOY_KEY_SETUP.md`

**Purpose**: Automated deployment via SSH

**Setup**:
1. Generate SSH key pair
2. Add public key to deployment server
3. Configure deployment script
4. Test deployment

**Scripts**:
- `setup-deploy-key.bat` - Windows setup
- `setup-deploy-key.ps1` - PowerShell setup

---

## CI/CD Integration

### GitHub Actions

**Location**: `.github/workflows/ci.yml`

**Stages**:
1. **Lint**: Code linting
2. **Test**: Run tests
3. **Build**: Build application
4. **Deploy**: Deploy to environment

**Triggers**:
- Push to `main` → Deploy to production
- Push to `staging` → Deploy to staging
- Pull request → Run tests only

---

## Monitoring

### Application Monitoring

**Planned**:
- **Error Tracking**: Sentry
- **Performance Monitoring**: Vercel Analytics
- **Uptime Monitoring**: UptimeRobot
- **Log Aggregation**: Logtail

### Health Checks

**Endpoints**:
- `GET /health` - Application health
- `GET /ready` - Readiness check

**Monitoring**:
- Automated health checks
- Alert on failures
- Dashboard visibility

---

## Security

### Deployment Security

**Best Practices**:
- **Secrets Management**: Environment variables only
- **HTTPS Only**: Force HTTPS in production
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Rate Limiting**: API rate limiting
- **Input Validation**: Comprehensive validation

### Secrets Management

**Current**: Environment variables
**Planned**: AWS Secrets Manager, HashiCorp Vault

---

## Rollback Strategy

### Rollback Process

**Vercel**:
- Automatic rollback on failure
- Manual rollback via dashboard
- Instant rollback to previous deployment

**Database**:
- Migration rollback support
- Database backups (Turso automatic)
- Point-in-time recovery

---

## Source Traceability

**Source Folders**:
- `.github/workflows/` - CI/CD workflows
- `DEPLOY_KEY_SETUP.md` - Deploy key setup guide

**Key Files**:
- `.github/workflows/ci.yml` - CI/CD pipeline
- `DEPLOY_KEY_SETUP.md` - Deploy key setup
- `setup-deploy-key.bat` - Windows setup script
- `setup-deploy-key.ps1` - PowerShell setup script

**Dependencies**:
- Vercel CLI (deployment)
- Turso CLI (database)

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions

**Related Packages**:
- None (deployment is infrastructure-specific)

**Usage In**:
- CI/CD pipeline
- Manual deployment scripts
