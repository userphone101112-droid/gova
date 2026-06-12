# Authentication System

## Overview

The authentication system handles user identity verification and session management using JWT (JSON Web Tokens) and bcrypt for password hashing.

## Architecture

### Authentication Flow

1. **Registration**: User creates account with email and password
2. **Password Hashing**: Password is hashed using bcrypt before storage
3. **Login**: User provides credentials for verification
4. **Token Generation**: JWT token generated upon successful authentication
5. **Token Verification**: Token verified on subsequent requests
6. **Session Management**: Token-based stateless authentication

## Components

### Password Hasher

**Location**: `apps/api/src/infrastructure/auth/password-hasher.ts`

**Purpose**: Hash and verify passwords using bcrypt

**Methods**:
- `hash(password: string): Promise<string>` - Hash password
- `verify(password: string, hash: string): Promise<boolean>` - Verify password

**Implementation Details**:
- Uses bcrypt library
- Salt rounds: 10 (configurable)
- Async operations for security

**Security Features**:
- Automatic salt generation
- Slow hashing to prevent brute force
- Constant-time comparison

---

### JWT Service

**Location**: `apps/api/src/infrastructure/auth/jwt.service.ts`

**Purpose**: Generate and verify JWT tokens

**Methods**:
- `generateToken(payload: { userId: string; email: string }): string` - Generate JWT
- `verifyToken(token: string): Promise<{ userId: string; email: string }>` - Verify JWT

**Implementation Details**:
- Uses Fastify JWT plugin
- Secret key from environment
- Token expiration: 24 hours (configurable)

**Token Payload**:
```typescript
{
  userId: string,
  email: string,
  iat: number,  // Issued at
  exp: number   // Expiration
}
```

**Security Features**:
- HS256 algorithm
- Secret key protection
- Automatic expiration
- Signature verification

---

### Auth Adapter

**Location**: `src/adapters/auth.adapter.ts`

**Purpose**: Interface for authentication provider abstraction

**Interface**: `IAuthAdapter`

**Methods**:
- `register(email: string, password: string, name: string): Promise<{ userId: string }>`
- `login(email: string, password: string): Promise<{ userId: string; token: string }>`
- `logout(token: string): Promise<void>`
- `verifyToken(token: string): Promise<{ userId: string }>`
- `refreshToken(token: string): Promise<{ newToken: string }>`
- `resetPassword(email: string): Promise<void>`
- `changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>`

**Implementations**:
- `FirebaseAuthAdapter`: Firebase Authentication (placeholder)
- `CustomAuthAdapter`: Custom authentication (placeholder)

**Status**: Interface defined, implementations are placeholders

---

## Authentication Flow

### Registration

```
Client → POST /users
  ↓
UserController.create()
  ↓
CreateUserUseCase.execute()
  ↓
1. Check if user exists (UserRepository.findByEmail)
2. Generate UserId
3. Create Email value object
4. Hash password (PasswordHasher.hash)
5. Create User entity
6. Persist user (UserRepository.create)
  ↓
Return UserResponseDTO
```

### Login

```
Client → POST /users/login
  ↓
UserController.login()
  ↓
LoginUserUseCase.execute()
  ↓
1. Find user by email (UserRepository.findByEmail)
2. Verify password (PasswordHasher.verify)
3. Generate JWT token (JWTService.generateToken)
  ↓
Return LoginResponseDTO (user + token)
```

### Token Verification

```
Client → Request with Authorization: Bearer <token>
  ↓
Fastify JWT Plugin
  ↓
1. Extract token from header
2. Verify token signature
3. Check token expiration
4. Decode payload
  ↓
Request handler with user context
```

## Security Measures

### Password Security

- **Hashing**: bcrypt with salt rounds
- **No Plain Text**: Passwords never stored in plain text
- **Strong Requirements**: Minimum 8 characters
- **Validation**: Domain-level validation

### Token Security

- **Signed Tokens**: HMAC signature verification
- **Expiration**: Automatic token expiration
- **Secret Key**: Environment variable protection
- **HTTPS Required**: Token transmission over HTTPS only

### Input Validation

- **Email Validation**: Email value object validation
- **Password Validation**: Length and complexity requirements
- **SQL Injection**: Parameterized queries via Drizzle ORM
- **XSS Protection**: Input sanitization

## Configuration

### Environment Variables

```bash
# JWT Secret
JWT_SECRET=your-secret-key

# JWT Expiration (hours)
JWT_EXPIRATION_HOURS=24

# Bcrypt Salt Rounds
BCRYPT_SALT_ROUNDS=10
```

## Error Handling

### Authentication Errors

- **UserAlreadyExistsError**: Email already registered
- **UserNotFoundError**: User not found during login
- **InvalidCredentialsError**: Password verification failed
- **TokenExpiredError**: JWT token expired
- **InvalidTokenError**: JWT token invalid

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: "USER_NOT_FOUND",
    message: "User not found",
    details: {}
  }
}
```

## Frontend Integration

### Auth Store

**Location**: `src/store/slices/auth.slice.ts`

**State**:
- `user`: UserResponseDTO | null
- `token`: string | null
- `isAuthenticated`: boolean
- `isLoading`: boolean

**Actions**:
- `login(credentials: LoginDTO): Promise<void>`
- `register(credentials: CreateUserDTO): Promise<void>`
- `logout(): void`
- `refreshToken(): Promise<void>`

### API Client

**Location**: `src/lib/api-client.ts`

**Features**:
- Automatic token injection
- Token refresh on 401 errors
- Request/response interceptors
- Error handling

## Future Enhancements

### Planned Features

- **Two-Factor Authentication (2FA)**: SMS or authenticator app
- **OAuth Integration**: Google, GitHub, etc.
- **Session Management**: Active session tracking
- **Password Reset**: Email-based password reset
- **Account Lockout**: Failed attempt lockout
- **IP Whitelisting**: Restrict access by IP
- **Device Fingerprinting**: Detect suspicious logins

### Security Improvements

- **Rate Limiting**: Prevent brute force attacks
- **CAPTCHA**: Bot protection
- **Password Strength Meter**: Real-time strength feedback
- **Password History**: Prevent password reuse
- **Audit Logging**: Track authentication events

## Source Traceability

**Source Folders**:
- `apps/api/src/infrastructure/auth/` - Authentication infrastructure
- `src/adapters/auth.adapter.ts` - Auth adapter interface
- `src/store/slices/auth.slice.ts` - Frontend auth state

**Key Files**:
- `apps/api/src/infrastructure/auth/password-hasher.ts` - Password hashing
- `apps/api/src/infrastructure/auth/jwt.service.ts` - JWT service
- `src/adapters/auth.adapter.ts` - Auth adapter interface
- `src/store/slices/auth.slice.ts` - Auth state management

**Dependencies**:
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT implementation
- `@fastify/jwt` - Fastify JWT plugin

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions

**Related Packages**:
- `@gv/domain` - User entity and Email value object
- `@gv/contracts` - Authentication DTOs
