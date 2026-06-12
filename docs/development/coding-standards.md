# Coding Standards

## General Principles

### 1. Code Quality

- **Write clean, readable code**: Code should be self-documenting
- **Follow DRY principle**: Don't Repeat Yourself
- **Keep functions small**: Functions should do one thing well
- **Use meaningful names**: Variable and function names should be descriptive
- **Avoid deep nesting**: Keep nesting to 3 levels maximum
- **Prefer composition over inheritance**: Use composition for code reuse

### 2. TypeScript Usage

- **Use strict mode**: All TypeScript strict options are enabled
- **Type everything**: Avoid `any` type
- **Use interfaces for shapes**: Use interfaces for object shapes
- **Use type aliases for unions**: Use type aliases for union types
- **Prefer const over let**: Use const when possible
- **Use type inference**: Let TypeScript infer types when obvious

### 3. React Best Practices

- **Use functional components**: Prefer functional components with hooks
- **Use Server Components by default**: Use Server Components unless you need interactivity
- **Use 'use client' directive**: Only when necessary for client-side features
- **Avoid prop drilling**: Use context or state management for deep prop passing
- **Keep components small**: Components should be focused and reusable
- **Use proper key props**: Use stable, unique keys for lists

### 4. File Organization

- **One export per file**: Prefer one main export per file
- **Group related exports**: Use barrel files (index.ts) for related exports
- **Use absolute imports**: Use path aliases (@/...) for imports
- **Keep files focused**: Each file should have a single responsibility
- **Organize by feature**: Group files by feature rather than type

## Naming Conventions

### Files and Directories

- **Use kebab-case**: `user-profile.tsx`, `api-client.ts`
- **Be descriptive**: File names should describe their content
- **Use lowercase**: Directory names should be lowercase

### Variables and Functions

- **Use camelCase**: `userName`, `getUserById`
- **Be descriptive**: Names should describe what they do
- **Avoid abbreviations**: Use full words unless widely known
- **Use boolean prefixes**: `isValid`, `hasPermission`, `canEdit`

### Constants

- **Use UPPER_SNAKE_CASE**: `API_BASE_URL`, `MAX_RETRY_COUNT`
- **Group related constants**: Group constants in objects or enums
- **Use descriptive names**: Names should describe the constant's purpose

### Types and Interfaces

- **Use PascalCase**: `UserProfile`, `ApiResponse`
- **Use 'I' prefix for interfaces**: `IUserRepository`, `IAuthService`
- **Use 'T' prefix for type parameters**: `TData`, `TResponse`

### Components

- **Use PascalCase**: `UserProfile`, `Button`
- **Be descriptive**: Component names should describe what they render
- **Use 'Page' suffix for pages**: `HomePage`, `AboutPage`

## Code Structure

### Function Structure

```typescript
// 1. Import statements
import { dependency } from '@/lib/dependency';

// 2. Type definitions
interface MyType {
  property: string;
}

// 3. Constants
const CONSTANT_VALUE = 'value';

// 4. Main function
export function myFunction(param: string): string {
  // Function body
  return param;
}

// 5. Helper functions (if needed)
function helper(value: string): string {
  return value;
}
```

### Component Structure

```typescript
'use client'; // Only if needed

// 1. Import statements
import { useState } from 'react';

// 2. Type definitions
interface Props {
  title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState('');

  // 5. Event handlers
  const handleClick = () => {
    // Handle click
  };

  // 6. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 7. Render
  return <div>{title}</div>;
}
```

## Best Practices

### Error Handling

- **Use try-catch for async operations**: Always handle potential errors
- **Provide meaningful error messages**: Error messages should be helpful
- **Log errors appropriately**: Use the logger utility for consistent logging
- **Throw custom errors**: Create custom error types for specific scenarios

```typescript
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', error);
  throw new Error('Operation failed');
}
```

### Async/Await

- **Prefer async/await over promises**: Use async/await for readability
- **Handle errors properly**: Always handle errors in async functions
- **Avoid callback hell**: Use async/await instead of nested callbacks

```typescript
// Good
async function fetchData() {
  try {
    const data = await apiClient.get('/data');
    return data;
  } catch (error) {
    logger.error('Failed to fetch data', error);
    throw error;
  }
}

// Bad
function fetchData() {
  return apiClient
    .get('/data')
    .then((data) => data)
    .catch((error) => {
      logger.error('Failed to fetch data', error);
      throw error;
    });
}
```

### State Management

- **Use Zustand for global state**: Use Zustand for application-wide state
- **Use React state for local state**: Use useState for component-local state
- **Keep state minimal**: Only store what's necessary
- **Normalize state**: Use normalized data structures for complex state

### API Calls

- **Use the apiClient**: Use the centralized apiClient for HTTP requests
- **Handle errors centrally**: Let the apiClient handle common error scenarios
- **Use React Query for caching**: Use TanStack Query for data fetching and caching
- **Type API responses**: Use the shared API contract types

### Styling

- **Use Tailwind CSS**: Use Tailwind for styling
- **Use design tokens**: Use the defined CSS variables for consistency
- **Avoid inline styles**: Use Tailwind classes instead of inline styles
- **Use responsive utilities**: Use Tailwind's responsive utilities

## Testing

### Unit Tests

- **Test behavior, not implementation**: Test what the code does, not how
- **Use descriptive test names**: Test names should describe what is being tested
- **Arrange-Act-Assert pattern**: Structure tests using AAA pattern
- **Mock external dependencies**: Mock external services and APIs

```typescript
describe('UserService', () => {
  it('should return user by id', async () => {
    // Arrange
    const userId = '123';
    const expectedUser = { id: userId, name: 'John' };

    // Act
    const user = await userService.getById(userId);

    // Assert
    expect(user).toEqual(expectedUser);
  });
});
```

### Component Tests

- **Test user interactions**: Test how users interact with components
- **Test edge cases**: Test boundary conditions and error states
- **Use Testing Library**: Use React Testing Library for component testing
- **Avoid testing implementation details**: Test what users see and do

## Performance

### Optimization

- **Use React.memo**: Memoize components that re-render unnecessarily
- **Use useMemo**: Memoize expensive calculations
- **Use useCallback**: Memoize callback functions
- **Lazy load heavy components**: Use dynamic imports for heavy components

```typescript
// Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Memoization
const memoizedValue = useMemo(() => expensiveCalculation(data), [data]);

// Callback memoization
const handleClick = useCallback(() => {
  doSomething(dependency);
}, [dependency]);
```

### Bundle Size

- **Analyze bundle size**: Use bundle analysis tools to identify large bundles
- **Code split strategically**: Split code at route and feature boundaries
- **Avoid large dependencies**: Be mindful of adding large dependencies
- **Use tree shaking**: Ensure unused code is eliminated

## Security

### Input Validation

- **Validate all inputs**: Use Zod schemas for input validation
- **Sanitize user input**: Sanitize HTML and user-provided content
- **Use parameterized queries**: Use Drizzle ORM to prevent SQL injection
- **Validate on server**: Always validate on the server, not just client

### Authentication

- **Use secure token storage**: Store tokens securely (httpOnly cookies)
- **Implement token refresh**: Refresh tokens before they expire
- **Check permissions**: Verify user permissions for sensitive operations
- **Log out properly**: Clear tokens and session data on logout

## Documentation

### Code Comments

- **Comment why, not what**: Explain why code is written a certain way
- **Keep comments up to date**: Update comments when code changes
- **Avoid obvious comments**: Don't comment self-explanatory code
- **Use JSDoc for public APIs**: Document public functions and classes

```typescript
/**
 * Fetches user data from the API
 * @param userId - The user's ID
 * @returns The user data
 * @throws Error if user not found
 */
async function getUser(userId: string): Promise<User> {
  // Implementation
}
```

### README and Documentation

- **Keep README updated**: Update README when adding features
- **Document APIs**: Document API endpoints and contracts
- **Document setup steps**: Include clear setup instructions
- **Provide examples**: Include usage examples in documentation

## Git Workflow

### Commit Messages

- **Use conventional commits**: Use conventional commit message format
- **Be descriptive**: Commit messages should describe what and why
- **Keep commits focused**: Each commit should do one thing
- **Use present tense**: Use present tense for commit messages

```
feat: add user authentication
fix: resolve login issue
docs: update API documentation
refactor: improve error handling
```

### Branch Naming

- **Use descriptive names**: Branch names should describe the feature or fix
- **Use kebab-case**: Use kebab-case for branch names
- **Include issue number**: Include issue number if applicable

```
feature/user-authentication
fix/login-bug-123
refactor/error-handling
```

## Code Review

### Review Checklist

- [ ] Code follows coding standards
- [ ] Code is properly tested
- [ ] Code is documented
- [ ] Code is performant
- [ ] Code is secure
- [ ] Code is accessible
- [ ] Code is responsive
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No TODO comments without issues

### Review Guidelines

- **Be constructive**: Provide helpful, constructive feedback
- **Focus on code, not person**: Review the code, not the author
- **Explain reasoning**: Explain why changes are needed
- **Suggest improvements**: Suggest better approaches when appropriate
