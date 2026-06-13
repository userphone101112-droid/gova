// @gv/routes-ssot
// Single Source of Truth for all platform routes

import { z } from 'zod';

// ============================================================================
// ROUTE DEFINITION SCHEMA
// ============================================================================

const routeDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Route ID must be lowercase with hyphens'),
  path: z.string().min(1), // Next.js route path
  page: z.string().min(1), // Reference to @gv/pages-ssot
  feature: z.string().min(1), // Reference to @gv/features-ssot
  params: z.record(z.string(), z.string()).optional(), // Route parameters
  query: z.record(z.string(), z.string()).optional(), // Query parameters
  permissions: z.array(z.string()).default([]), // Required permissions
  public: z.boolean().default(false), // Is publicly accessible
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type RouteDefinition = z.infer<typeof routeDefinitionSchema>;

// ============================================================================
// ROUTE REGISTRY
// ============================================================================

/**
 * Authoritative registry of all platform routes.
 * 
 * This is the Single Source of Truth for route definitions.
 * All route-related code must reference this registry.
 * 
 * To add a new route:
 * 1. Add definition to this registry
 * 2. Run validation: npm run validate:routes
 * 3. Update related pages SSOT
 */
export const routeRegistry: Record<string, RouteDefinition> = {
  home: {
    id: 'home',
    path: '/',
    page: 'home',
    feature: 'users',
    params: undefined,
    query: undefined,
    permissions: [],
    public: true,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  login: {
    id: 'login',
    path: '/login',
    page: 'login',
    feature: 'users',
    params: undefined,
    query: undefined,
    permissions: [],
    public: true,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  register: {
    id: 'register',
    path: '/register',
    page: 'register',
    feature: 'users',
    params: undefined,
    query: undefined,
    permissions: [],
    public: true,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  profile: {
    id: 'profile',
    path: '/profile',
    page: 'profile',
    feature: 'users',
    params: undefined,
    query: undefined,
    permissions: ['user.read'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  settings: {
    id: 'settings',
    path: '/settings',
    page: 'settings',
    feature: 'users',
    params: undefined,
    query: undefined,
    permissions: ['user.read'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'products-list': {
    id: 'products-list',
    path: '/products',
    page: 'products-list',
    feature: 'products',
    params: undefined,
    query: {
      page: 'string',
      limit: 'string',
      sort: 'string',
    },
    permissions: ['product.read'],
    public: true,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'product-details': {
    id: 'product-details',
    path: '/products/[id]',
    page: 'product-details',
    feature: 'products',
    params: {
      id: 'string',
    },
    query: undefined,
    permissions: ['product.read'],
    public: true,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'product-create': {
    id: 'product-create',
    path: '/products/new',
    page: 'product-create',
    feature: 'products',
    params: undefined,
    query: undefined,
    permissions: ['product.write'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  cart: {
    id: 'cart',
    path: '/cart',
    page: 'cart',
    feature: 'cart',
    params: undefined,
    query: undefined,
    permissions: ['cart.read'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  checkout: {
    id: 'checkout',
    path: '/checkout',
    page: 'checkout',
    feature: 'checkout',
    params: undefined,
    query: undefined,
    permissions: ['checkout.write'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'orders-list': {
    id: 'orders-list',
    path: '/orders',
    page: 'orders-list',
    feature: 'orders',
    params: undefined,
    query: {
      page: 'string',
      limit: 'string',
      status: 'string',
    },
    permissions: ['order.read'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'order-details': {
    id: 'order-details',
    path: '/orders/[id]',
    page: 'order-details',
    feature: 'orders',
    params: {
      id: 'string',
    },
    query: undefined,
    permissions: ['order.read'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'merchant-profile': {
    id: 'merchant-profile',
    path: '/merchants/[id]',
    page: 'merchant-profile',
    feature: 'merchants',
    params: {
      id: 'string',
    },
    query: undefined,
    permissions: ['merchant.read'],
    public: true,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'merchant-dashboard': {
    id: 'merchant-dashboard',
    path: '/merchants/dashboard',
    page: 'merchant-dashboard',
    feature: 'merchants',
    params: undefined,
    query: undefined,
    permissions: ['merchant.write'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'admin-dashboard': {
    id: 'admin-dashboard',
    path: '/admin',
    page: 'admin-dashboard',
    feature: 'admin',
    params: undefined,
    query: undefined,
    permissions: ['admin.read'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'seller-dashboard': {
    id: 'seller-dashboard',
    path: '/seller/dashboard',
    page: 'seller-dashboard',
    feature: 'merchants',
    params: undefined,
    query: undefined,
    permissions: ['merchant.write', 'marketplace.read'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T02:00:00.000Z',
    updatedAt: '2026-06-13T02:00:00.000Z',
  },
  notifications: {
    id: 'notifications',
    path: '/notifications',
    page: 'notifications',
    feature: 'notifications',
    params: undefined,
    query: undefined,
    permissions: ['notification.read', 'marketplace.read'],
    public: false,
    version: '1.0.0',
    createdAt: '2026-06-13T02:00:00.000Z',
    updatedAt: '2026-06-13T02:00:00.000Z',
  },
};

// ============================================================================
// ROUTE QUERY HELPERS
// ============================================================================

/**
 * Get a route by ID
 */
export function getRoute(id: string): RouteDefinition | undefined {
  return routeRegistry[id];
}

/**
 * Get a route by path
 */
export function getRouteByPath(path: string): RouteDefinition | undefined {
  return Object.values(routeRegistry).find((r) => r.path === path);
}

/**
 * Get all routes
 */
export function getAllRoutes(): RouteDefinition[] {
  return Object.values(routeRegistry);
}

/**
 * Get routes by feature
 */
export function getRoutesByFeature(featureId: string): RouteDefinition[] {
  return getAllRoutes().filter((r) => r.feature === featureId);
}

/**
 * Get routes by page
 */
export function getRoutesByPage(pageId: string): RouteDefinition[] {
  return getAllRoutes().filter((r) => r.page === pageId);
}

/**
 * Get public routes
 */
export function getPublicRoutes(): RouteDefinition[] {
  return getAllRoutes().filter((r) => r.public);
}

/**
 * Get protected routes
 */
export function getProtectedRoutes(): RouteDefinition[] {
  return getAllRoutes().filter((r) => !r.public);
}

/**
 * Check if a route exists
 */
export function routeExists(id: string): boolean {
  return id in routeRegistry;
}

/**
 * Validate a route definition
 */
export function validateRoute(route: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = routeDefinitionSchema.safeParse(route);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

/**
 * Validate the entire route registry
 */
export function validateRouteRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate each route definition
  for (const [id, route] of Object.entries(routeRegistry)) {
    const validation = validateRoute(route);
    if (!validation.valid) {
      errors.push(`Route "${id}": ${validation.errors?.message}`);
    }

    // Check ID consistency
    if (route.id !== id) {
      errors.push(`Route "${id}": ID mismatch (registry key: ${id}, route.id: ${route.id})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// TYPE-SAFE ROUTE BUILDERS
// ============================================================================

/**
 * Type-safe route builder function
 */
export function buildRoute(routeId: string, params?: Record<string, string>, query?: Record<string, string>): string {
  const route = getRoute(routeId);
  if (!route) {
    throw new Error(`Route "${routeId}" not found in registry`);
  }

  let path = route.path;

  // Replace dynamic parameters
  if (route.params) {
    for (const [key] of Object.entries(route.params)) {
      if (params && params[key]) {
        path = path.replace(`[${key}]`, params[key]);
      } else {
        throw new Error(`Missing required parameter "${key}" for route "${routeId}"`);
      }
    }
  }

  // Add query parameters
  if (query && Object.keys(query).length > 0) {
    const queryString = new URLSearchParams(query).toString();
    path += `?${queryString}`;
  }

  return path;
}

/**
 * Type-safe route helper for common routes
 */
export const routes = {
  home: () => buildRoute('home'),
  login: () => buildRoute('login'),
  register: () => buildRoute('register'),
  profile: () => buildRoute('profile'),
  settings: () => buildRoute('settings'),
  productsList: (query?: { page?: string; limit?: string; sort?: string }) => 
    buildRoute('products-list', undefined, query),
  productDetails: (params: { id: string }) => buildRoute('product-details', params),
  productCreate: () => buildRoute('product-create'),
  cart: () => buildRoute('cart'),
  checkout: () => buildRoute('checkout'),
  ordersList: (query?: { page?: string; limit?: string; status?: string }) => 
    buildRoute('orders-list', undefined, query),
  orderDetails: (params: { id: string }) => buildRoute('order-details', params),
  merchantProfile: (params: { id: string }) => buildRoute('merchant-profile', params),
  merchantDashboard: () => buildRoute('merchant-dashboard'),
  adminDashboard: () => buildRoute('admin-dashboard'),
  sellerDashboard: () => buildRoute('seller-dashboard'),
  notifications: () => buildRoute('notifications'),
};

// ============================================================================
// EXPORTS
// ============================================================================
