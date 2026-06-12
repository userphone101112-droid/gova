# Development Guide

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun
- Git

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gv
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize Git hooks**

   ```bash
   npm run prepare
   ```

5. **Run database migrations** (if using database)
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

## Development Workflow

### Starting Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:3000` with Turbopack for faster builds.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality Checks

```bash
# Run TypeScript type checking
npm run typecheck

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `.next` directory.

### Running Production Server

```bash
npm run start
```

## Project Structure Guide

### Adding a New Feature

1. **Create feature directory**

   ```
   src/features/your-feature/
   ├── components/
   ├── hooks/
   ├── services/
   ├── types/
   └── index.ts
   ```

2. **Create feature components**
   - Place UI components in `components/`
   - Place custom hooks in `hooks/`
   - Place business logic in `services/`
   - Place TypeScript types in `types/`

3. **Export from index.ts**
   ```typescript
   export * from './components';
   export * from './hooks';
   export * from './services';
   export * from './types';
   ```

### Adding a New Page

1. **Create page in app directory**

   ```
   src/app/your-page/
   ├── page.tsx
   ├── layout.tsx (optional)
   └── loading.tsx (optional)
   ```

2. **Use Server Components by default**

   ```typescript
   export default function YourPage() {
     return <div>Your page content</div>;
   }
   ```

3. **Add 'use client' only when needed**

   ```typescript
   'use client';

   export default function YourInteractivePage() {
     const [state, setState] = useState();
     // Interactive component
   }
   ```

### Adding a New API Route

1. **Create API route in app/api directory**

   ```
   src/app/api/your-endpoint/
   ├── route.ts
   ```

2. **Implement route handler**

   ```typescript
   import { NextResponse } from 'next/server';

   export async function GET() {
     return NextResponse.json({ data: 'Hello' });
   }
   ```

### Adding a New Component

1. **Determine component type**
   - UI component: Place in `src/components/ui/`
   - Form component: Place in `src/components/forms/`
   - Layout component: Place in `src/components/layouts/`
   - Shared component: Place in `src/components/shared/`

2. **Create component file**

   ```typescript
   export function YourComponent({ prop }: Props) {
     return <div>{prop}</div>;
   }
   ```

3. **Add TypeScript types**
   ```typescript
   interface Props {
     prop: string;
   }
   ```

### Adding a New Service

1. **Create service in services directory**

   ```
   src/services/your-service.ts
   ```

2. **Implement service interface**

   ```typescript
   import { BaseService } from './base.service';

   export class YourService extends BaseService<YourEntity, string> {
     async getById(id: string): Promise<YourEntity> {
       // Implementation
     }
   }
   ```

### Adding a New Repository

1. **Create repository in repositories directory**

   ```
   src/repositories/your-repository.ts
   ```

2. **Implement repository interface**

   ```typescript
   import { BaseRepository } from './base.repository';

   export class YourRepository extends BaseRepository<YourEntity, string> {
     async findById(id: string): Promise<YourEntity | null> {
       // Implementation
     }
   }
   ```

### Adding a New Adapter

1. **Create adapter in adapters directory**

   ```
   src/adapters/your-adapter.ts
   ```

2. **Implement adapter interface**
   ```typescript
   export class YourAdapter implements IYourAdapter {
     async initialize(config: Config): Promise<void> {
       // Implementation
     }
   }
   ```

## Common Tasks

### Adding Environment Variables

1. **Add to .env.example**

   ```bash
   YOUR_VARIABLE=value
   ```

2. **Add to env.ts schema**

   ```typescript
   YOUR_VARIABLE: z.string().min(1),
   ```

3. **Use in code**
   ```typescript
   import { env } from '@/configs/env';
   const value = env.YOUR_VARIABLE;
   ```

### Adding a New Store

1. **Create store slice in store/slices**

   ```
   src/store/slices/your-slice.ts
   ```

2. **Implement store**

   ```typescript
   import { create } from 'zustand';

   export const useYourStore = create<YourState>((set) => ({
     // State and actions
   }));
   ```

3. **Export from store/index.ts**
   ```typescript
   export { useYourStore } from './slices/your-slice';
   ```

### Adding Database Schema

1. **Add schema to server/db/schema.ts**

   ```typescript
   export const yourTable = sqliteTable('your_table', {
     id: text('id').primaryKey(),
     // Other fields
   });
   ```

2. **Generate migration**

   ```bash
   npx drizzle-kit generate
   ```

3. **Run migration**
   ```bash
   npx drizzle-kit migrate
   ```

### Adding Validation Schema

1. **Create schema in validations directory**

   ```
   src/validations/your-validation.ts
   ```

2. **Define Zod schema**

   ```typescript
   import { z } from 'zod';

   export const yourSchema = z.object({
     field: z.string().min(1),
   });
   ```

3. **Use in forms**
   ```typescript
   import { yourSchema } from '@/validations/your-validation';
   ```

## Debugging

### Using the Logger

```typescript
import { logger } from '@/lib/logger';

logger.debug('Debug message', { context: 'value' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

### Using Error Boundaries

```typescript
import { ErrorBoundary } from '@/components/shared/error-boundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Debugging TypeScript Errors

1. **Run type check**

   ```bash
   npm run typecheck
   ```

2. **Check tsconfig.json** for path aliases and strict mode settings

3. **Use VSCode TypeScript tools** for inline error checking

### Debugging Build Errors

1. **Clear Next.js cache**

   ```bash
   rm -rf .next
   ```

2. **Rebuild**

   ```bash
   npm run build
   ```

3. **Check Next.js logs** for detailed error information

## Performance Optimization

### Code Splitting

```typescript
// Dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

### Memoization

```typescript
import { useMemo, useCallback } from 'react';

const memoizedValue = useMemo(() => expensiveCalculation(data), [data]);
const memoizedCallback = useCallback(() => doSomething(dependency), [dependency]);
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
/>
```

## Deployment

### Deploying to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "feat: your feature"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to Vercel dashboard
   - Import repository
   - Configure environment variables
   - Deploy

### Deploying to Other Platforms

The workspace is compatible with:

- Netlify
- AWS Amplify
- Railway
- Digital Ocean
- Self-hosted

## Troubleshooting

### Common Issues

**Issue: Module not found**

- Solution: Check TypeScript path aliases in tsconfig.json
- Solution: Restart TypeScript server in VSCode

**Issue: Environment variables not working**

- Solution: Check .env file is in root directory
- Solution: Restart development server

**Issue: Build fails**

- Solution: Clear .next directory and rebuild
- Solution: Check for TypeScript errors with `npm run typecheck`

**Issue: Tests failing**

- Solution: Check Jest configuration
- Solution: Ensure test environment is properly set up

### Getting Help

- Check documentation in `src/docs/`
- Check Next.js documentation
- Check library documentation
- Create an issue on GitHub

## Best Practices

### Before Committing

1. **Run tests**

   ```bash
   npm test
   ```

2. **Run type check**

   ```bash
   npm run typecheck
   ```

3. **Run lint**

   ```bash
   npm run lint
   ```

4. **Format code**
   ```bash
   npm run format
   ```

### Code Review Checklist

- [ ] Code follows coding standards
- [ ] Code is properly tested
- [ ] Code is documented
- [ ] Code is performant
- [ ] Code is secure
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No TODO comments without issues

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
