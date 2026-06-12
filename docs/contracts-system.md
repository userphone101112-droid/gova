# API Contracts System Documentation

## Overview

`@gv/contracts` is the **single source of truth** for all API request and response shapes. Frontend and Backend must **never** define their own DTO interfaces — they must import from this package.

## Package Contents

```ts
// Generic response wrapper — all API responses use this shape
interface ApiResponse<T> {
  success;
  data?;
  error?;
  message?;
  meta?;
}

// User operations
interface CreateUserDTO {
  email;
  password;
  name;
}
interface LoginDTO {
  email;
  password;
}
interface UserResponseDTO {
  id;
  email;
  name;
  avatar?;
  createdAt;
  updatedAt;
}
interface LoginResponseDTO {
  user: UserResponseDTO;
  token;
}

// Product operations
interface CreateProductDTO {
  name;
  description;
  price;
  stock?;
}
interface ProductResponseDTO {
  id;
  name;
  description;
  price;
  stock;
  userId;
  createdAt;
  updatedAt;
}

// Image operations
interface UploadImageDTO {
  file;
  fileName;
  mimeType;
  entityType;
  entityId;
}
interface ImageResponseDTO {
  id;
  url;
  provider;
  providerFileId;
  entityType;
  entityId;
  mimeType;
  size;
  width?;
  height?;
  createdAt;
}
interface ListImagesResponseDTO {
  images;
  total;
  limit;
  offset;
  hasMore;
}

// Merchants, Orders, Categories (placeholder contracts)
interface MerchantResponseDTO {
  id;
  userId;
  storeName;
  description?;
  createdAt;
  updatedAt;
}
interface OrderResponseDTO {
  id;
  userId;
  items;
  totalAmount;
  status;
  createdAt;
}
interface CategoryResponseDTO {
  id;
  name;
  slug;
  description?;
}
```

## Usage

### Frontend (Next.js)

```ts
import type { UserResponseDTO, CreateUserDTO } from '@gv/contracts';

// In your API client:
const register = async (dto: CreateUserDTO): Promise<ApiResponse<UserResponseDTO>> => { ... }
```

### Backend (Fastify)

```ts
import type { CreateUserDTO, UserResponseDTO } from '@gv/contracts';

// In use-case:
async execute(dto: CreateUserDTO): Promise<UserResponseDTO> { ... }
```

## Key Rule

> **Never** define a DTO locally in the frontend or backend. Always import from `@gv/contracts`. If you need to extend it, extend it in the contracts package itself.
