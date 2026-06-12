// @gv/contracts

// --- Generic API Structure Contracts ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: unknown;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
}

// --- User DTO Contracts ---
export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserDTO {
  name?: string;
  password?: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: UserResponseDTO;
  token: string;
}

// --- Product DTO Contracts ---
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock?: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// --- Image DTO Contracts ---
export interface UploadImageDTO {
  file: unknown; // Browser File or Node Buffer
  fileName: string;
  mimeType: string;
  entityType: string;
  entityId: string;
}

export interface ImageResponseDTO {
  id: string;
  url: string;
  provider: string;
  providerFileId: string;
  entityType: string;
  entityId: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string | Date;
}

export interface ListImagesQueryDTO {
  limit?: number;
  offset?: number;
}

export interface ListImagesResponseDTO {
  images: ImageResponseDTO[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// --- Merchant, Order, Category DTO Placeholder Contracts ---
export interface MerchantResponseDTO {
  id: string;
  userId: string;
  storeName: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface OrderItemDTO {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderResponseDTO {
  id: string;
  userId: string;
  items: OrderItemDTO[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string | Date;
}
