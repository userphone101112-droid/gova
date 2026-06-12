# Validation Layer

## Overview

The validation layer ensures data integrity and security by validating input at multiple levels: domain entities, API contracts, and request validation. It uses Zod for schema validation and domain value objects for business rule enforcement.

## Architecture

### Validation Layers

```
Request → API Validation → Domain Validation → Database
  ↓           ↓                  ↓              ↓
Client   Zod Schemas    Value Objects   Constraints
```

### Benefits

- **Early Rejection**: Fail fast on invalid input
- **Type Safety**: Compile-time type checking
- **Business Rules**: Domain-level validation
- **Security**: Prevent injection attacks
- **User Experience**: Clear error messages

## Domain Validation

### Value Objects

Value objects provide domain-level validation:

#### Email

**Location**: `packages/domain/value-objects.ts`

**Validation**:
- Email format regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Automatic lowercasing
- Throws error on invalid format

**Example**:
```typescript
const email = new Email('user@example.com'); // Valid
const invalid = new Email('invalid'); // Throws Error
```

---

#### UserId

**Validation**:
- UUID v4 format regex
- Throws error on invalid format

**Example**:
```typescript
const userId = new UserId('123e4567-e89b-12d3-a456-426614174000'); // Valid
const invalid = new UserId('not-a-uuid'); // Throws Error
```

---

#### Money

**Validation**:
- Must be >= 0
- Must be finite
- Throws error on invalid value

**Example**:
```typescript
const money = new Money(100); // Valid
const invalid = new Money(-10); // Throws Error
```

---

### Entity Validation

Entities enforce business rules:

#### User

**Validation Rules**:
- Name: Min 2 characters
- Password: Min 8 characters
- Email: Valid format (via Email value object)

**Methods**:
```typescript
user.updateName('John'); // Valid
user.updateName('J'); // Throws Error

user.updatePassword('securePassword123'); // Valid
user.updatePassword('short'); // Throws Error
```

---

#### Product

**Validation Rules**:
- Name: Min 3 characters
- Description: Min 10 characters
- Price: Must be > 0
- Stock: Cannot be negative

**Methods**:
```typescript
product.updateName('Product Name'); // Valid
product.updateName('AB'); // Throws Error

product.updatePrice(new Money(100)); // Valid
product.updatePrice(new Money(0)); // Throws Error
```

---

#### Image

**Validation Rules**:
- MIME type: Must be valid image type
- Size: Must not exceed max size

**Methods**:
```typescript
image.isValidMimeType(); // Returns boolean
image.isValidSize(10); // Returns boolean (max size in MB)
```

---

## API Validation

### Zod Schemas

**Location**: `packages/schemas/` (planned), `apps/api/src/interfaces/http/validators/`

#### User Schemas

**createUserSchema**:
```typescript
{
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
}
```

**loginSchema**:
```typescript
{
  email: z.string().email(),
  password: z.string()
}
```

---

#### Image Schemas

**Location**: `apps/api/src/interfaces/http/validators/image.validator.ts`

**uploadImageSchema**:
```typescript
{
  file: z.any(),
  fileName: z.string(),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  entityType: z.enum(['user', 'product', 'post', 'other']),
  entityId: z.string()
}
```

**getImageParamsSchema**:
```typescript
{
  id: z.string().uuid()
}
```

**deleteImageParamsSchema**:
```typescript
{
  id: z.string().uuid()
}
```

**listImagesQuerySchema**:
```typescript
{
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional()
}
```

---

## Request Validation

### Fastify Schema Validation

Fastify integrates Zod schemas for request validation:

#### Example: User Routes

**Location**: `apps/api/src/interfaces/http/routes/user.routes.ts`

```typescript
fastify.post('/users', {
  schema: {
    body: createUserSchema,
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' }
        }
      }
    }
  }
}, controller.create.bind(controller));
```

---

### Validation Flow

```
Request → Fastify Schema Validation → Controller → Use Case → Domain Validation
  ↓              ↓                        ↓          ↓              ↓
Raw Data    Zod Schema              DTO      Business Rules  Value Objects
```

---

## Error Handling

### Validation Errors

#### Domain Errors

- **InvalidEmailError**: Email format invalid
- **InvalidUserIdError**: User ID format invalid
- **InvalidMoneyError**: Monetary value invalid
- **UserAlreadyExistsError**: Duplicate email
- **InvalidCredentialsError**: Wrong password

#### API Errors

- **ValidationError**: Request validation failed
- **InvalidImageTypeError**: Unsupported image type
- **ImageSizeExceededError**: File too large

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    details: {
      field: "email",
      issue: "Invalid email format"
    }
  }
}
```

---

## Business Rules Validation

### Business Rules Package

**Location**: `packages/business-rules/index.ts`

#### Product Rules

```typescript
products: {
  maxImages: 5,
  maxNameLength: 100,
  minNameLength: 3,
  maxDescriptionLength: 2000,
  minDescriptionLength: 10,
  minPrice: 0.01
}
```

#### Image Rules

```typescript
images: {
  maxSizeMB: 5,
  maxSizeBytes: 5 * 1024 * 1024,
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
}
```

#### Auth Rules

```typescript
auth: {
  minPasswordLength: 8,
  maxPasswordLength: 100
}
```

---

### Using Business Rules

```typescript
import { BUSINESS_RULES } from '@gv/business-rules';

// Validate product name
if (name.length > BUSINESS_RULES.products.maxNameLength) {
  throw new Error('Name too long');
}

// Validate image size
if (file.size > BUSINESS_RULES.images.maxSizeBytes) {
  throw new ImageSizeExceededError(file.size, BUSINESS_RULES.images.maxSizeBytes);
}
```

---

## Frontend Validation

### React Hook Form + Zod

**Location**: Frontend forms (planned)

**Example**:
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
```

---

### Client-Side Validation

- **Email**: Real-time email format validation
- **Password**: Strength meter
- **File**: Size and type validation before upload
- **Required Fields**: Visual indicators

---

## Security Validation

### Input Sanitization

- **SQL Injection**: Parameterized queries via Drizzle ORM
- **XSS**: Content sanitization (planned)
- **CSRF**: Token protection (planned)
- **File Upload**: Content validation, not just extension

### File Validation

- **MIME Type**: Check actual file content
- **File Size**: Enforce size limits
- **File Content**: Scan for malicious content (planned)
- **File Extension**: Validate against allowed types

---

## Custom Validators

### Planned Validators

- **Strong Password**: Complexity requirements
- **Unique Email**: Check availability
- **Slug Validation**: URL-friendly strings
- **Phone Number**: Format validation
- **URL Validation**: Valid URL format

### Example: Strong Password

```typescript
const strongPasswordSchema = z.string()
  .min(8)
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');
```

---

## Validation Middleware

### Request Validation Middleware

**Location**: `apps/api/src/interfaces/http/middlewares/` (planned)

```typescript
export function validateBody(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request.body);
    
    if (!result.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: result.error.format()
        }
      });
    }
    
    request.body = result.data;
  };
}
```

---

## Testing Validation

### Unit Tests

- Test value object validation
- Test entity validation
- Test schema validation
- Test error messages

### Integration Tests

- Test API validation
- Test validation error responses
- Test business rule enforcement

---

## Performance

### Validation Optimization

- **Early Exit**: Fail fast on first error
- **Lazy Validation**: Validate only when needed
- **Caching**: Cache validation results (planned)
- **Async Validation**: Parallel validation (planned)

---

## Source Traceability

**Source Folders**:
- `packages/domain/value-objects.ts` - Domain value objects
- `packages/domain/entities.ts` - Domain entities
- `packages/business-rules/index.ts` - Business rules
- `apps/api/src/interfaces/http/validators/` - API validators
- `apps/api/src/interfaces/http/routes/` - Route schemas

**Key Files**:
- `packages/domain/value-objects.ts` - Value objects
- `packages/domain/entities.ts` - Entity validation
- `packages/business-rules/index.ts` - Business rules
- `apps/api/src/interfaces/http/validators/image.validator.ts` - Image validators

**Dependencies**:
- `zod` - Schema validation
- `@gv/business-rules` - Business rules

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions

**Related Packages**:
- `@gv/domain` - Domain validation
- `@gv/business-rules` - Business rules
- `@gv/schemas` - Shared schemas
