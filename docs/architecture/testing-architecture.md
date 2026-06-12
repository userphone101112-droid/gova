# Testing Architecture

## Overview

The testing architecture uses Jest as the primary testing framework with React Testing Library for component testing. The setup is configured for Next.js with TypeScript support, jsdom environment, and comprehensive mocking capabilities.

## Architecture

### Testing Framework

**Framework**: Jest
**Environment**: jsdom (browser-like environment)
**TypeScript**: ts-jest transformer
**React**: React Testing Library

### Test Structure

```
src/
├── __tests__/          # Test files
│   └── *.test.{js,jsx,ts,tsx}
├── *.spec.{js,jsx,ts,tsx}  # Spec files
```

---

## Configuration

### Jest Configuration

**Location**: `jest.config.js`

**Configuration**:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
}

module.exports = createJestConfig(customJestConfig)
```

---

### Jest Setup

**Location**: `jest.setup.js`

**Purpose**: Global test setup and mocks

**Setup**:
```javascript
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_APP_NAME = 'Test App'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NODE_ENV = 'test'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
}
```

---

## Test Types

### Unit Tests

**Purpose**: Test individual functions and classes in isolation

**Location**: `src/**/__tests__/` or `src/**/*.spec.ts`

**Example**:
```typescript
describe('Email value object', () => {
  it('should create valid email', () => {
    const email = new Email('test@example.com');
    expect(email.value).toBe('test@example.com');
  });

  it('should throw error for invalid email', () => {
    expect(() => new Email('invalid')).toThrow();
  });
});
```

---

### Integration Tests

**Purpose**: Test multiple components working together

**Location**: `src/**/__tests__/integration/`

**Example**:
```typescript
describe('User registration flow', () => {
  it('should register user and return token', async () => {
    const dto = { email: 'test@example.com', password: 'password123', name: 'Test' };
    const result = await createUserUseCase.execute(dto);
    expect(result.token).toBeDefined();
  });
});
```

---

### Component Tests

**Purpose**: Test React components

**Location**: `src/**/__tests__/components/`

**Example**:
```typescript
import { render, screen } from '@testing-library/react'
import Button from '@/components/Button'

describe('Button', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

---

## Testing Patterns

### AAA Pattern

**Arrange-Act-Assert**:
```typescript
it('should update user name', () => {
  // Arrange
  const user = new User('id', 'email', 'old-name', 'hash');
  
  // Act
  user.updateName('new-name');
  
  // Assert
  expect(user.name).toBe('new-name');
});
```

---

### Mocking

**Function Mocking**:
```typescript
const mockRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

mockRepository.findByEmail.mockResolvedValue(null);
```

**Module Mocking**:
```typescript
jest.mock('@gv/storage', () => ({
  upload: jest.fn(),
}));
```

---

## Coverage

### Coverage Configuration

**Collect Coverage From**:
- `src/**/*.{js,jsx,ts,tsx}`
- Excludes: `.d.ts`, `.stories`, `__tests__`

### Coverage Goals

**Target**: 80%+ coverage
- Lines: 80%
- Branches: 75%
- Functions: 80%
- Statements: 80%

### Coverage Report

**Generate Coverage**:
```bash
npm test -- --coverage
```

**Output**: `coverage/` directory

---

## Test Execution

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test path/to/test.test.ts
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

---

## Best Practices

### Test Organization

- **Descriptive Names**: Use clear test names
- **Single Responsibility**: One assertion per test
- **Arrange-Act-Assert**: Follow AAA pattern
- **Independent Tests**: Tests should not depend on each other

### Test Quality

- **Test Behavior, Not Implementation**: Test what, not how
- **Avoid Test Duplication**: Use helper functions
- **Mock External Dependencies**: Mock databases, APIs
- **Test Edge Cases**: Test boundary conditions

### Test Maintenance

- **Keep Tests Fast**: Use mocks for slow operations
- **Update Tests with Code**: Keep tests in sync
- **Review Test Failures**: Investigate failures promptly
- **Refactor Tests**: Keep tests maintainable

---

## Future Enhancements

### Planned Features

- **E2E Tests**: Playwright for end-to-end testing
- **Visual Regression**: Chromatic for visual testing
- **Performance Tests**: Performance regression testing
- **API Tests**: Supertest for API testing
- **Contract Tests**: Pact for contract testing
- **Mutation Testing**: Stryker for mutation testing

---

## Source Traceability

**Source Folders**:
- `src/**/__tests__/` - Test files
- `apps/api/src/tests/` - Backend tests (planned)

**Key Files**:
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Global test setup
- `package.json` - Test scripts

**Dependencies**:
- `jest` - Testing framework
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Jest DOM matchers
- `ts-jest` - TypeScript preprocessor

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions

**Related Packages**:
- None (testing is app-specific)

**Usage In**:
- CI/CD pipeline
- Local development
