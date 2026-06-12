# Deployment Summary

Quick reference for AI agents to understand the deployment architecture.

## Deployment Platforms

- **Frontend**: Vercel (Next.js optimized)
- **Backend**: Vercel (serverless) or Railway (container-based)
- **Database**: Turso (edge SQLite)
- **Storage**: Cloudflare R2 (object storage)

## CI/CD

- GitHub Actions in `.github/workflows/`
- CI configuration in `.github/workflows/ci.yml`
- Stages: Lint, Type Check, Test, Validate Docs, Build

## Environment Variables

- Template in `.env.example`
- Never commit actual `.env` file
- Configure in deployment platform dashboard

**Key Variables**:
- `DATABASE_URL` - Turso database URL
- `DATABASE_AUTH_TOKEN` - Turso auth token
- `JWT_SECRET` - JWT signing secret
- `STORAGE_PROVIDER` - Cloudflare R2 or Google Drive
- `CLOUDFLARE_R2_*` - Cloudflare R2 credentials

## Build Process

- `npm run build` - Production build
- `npm run start` - Start production server
- Optimized with code splitting, tree shaking, image optimization

## Deploy Key Setup

- Local deploy key for Git operations
- Setup guide: [../../DEPLOY_KEY_SETUP.md](../../DEPLOY_KEY_SETUP.md)
- Scripts: `setup-deploy-key.ps1`, `setup-deploy-key.bat`

## Git Workflow

- Isolated from Windows SSH / Credential Manager
- Uses local deploy key in project directory
- Scripts: `gv.ps1` for git operations
- Commands: `npm run git:setup`, `npm run git:push`, `npm run git:pull`

## Documentation

- Deployment system: [../deployment/deployment-system.md](../deployment/deployment-system.md)
- Deploy key setup: [../deployment/deploy-key-setup.md](../deployment/deploy-key-setup.md)
- CI/CD: [../architecture/cicd.md](../architecture/cicd.md)
