// @gv/analytics-ssot
// Single Source of Truth for all platform analytics events

import { z } from 'zod';

// ============================================================================
// ANALYTICS EVENT DEFINITION SCHEMA
// ============================================================================

export const analyticsEventSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-:]+$/, 'Event ID must be lowercase with hyphens and colons'),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['page', 'click', 'checkout', 'merchant', 'user', 'product', 'order', 'cart']),
  page: z.string().optional(), // Reference to @gv/pages-ssot
  feature: z.string().min(1), // Reference to @gv/features-ssot
  properties: z.record(z.string(), z.string()).optional(), // Event properties
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

// ============================================================================
// ANALYTICS EVENT REGISTRY
// ============================================================================

/**
 * Authoritative registry of all platform analytics events.
 * 
 * This is the Single Source of Truth for analytics event definitions.
 * All analytics-related code must reference this registry.
 * 
 * To add a new analytics event:
 * 1. Add definition to this registry
 * 2. Run validation: npm run validate:analytics
 * 3. Update related pages SSOT
 */
export const analyticsEventRegistry: Record<string, AnalyticsEvent> = {
  'page:view:home': {
    id: 'page:view:home',
    name: 'Home Page View',
    description: 'User viewed the home page',
    category: 'page',
    page: 'home',
    feature: 'users',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:login': {
    id: 'page:view:login',
    name: 'Login Page View',
    description: 'User viewed the login page',
    category: 'page',
    page: 'login',
    feature: 'users',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:register': {
    id: 'page:view:register',
    name: 'Register Page View',
    description: 'User viewed the registration page',
    category: 'page',
    page: 'register',
    feature: 'users',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:profile': {
    id: 'page:view:profile',
    name: 'Profile Page View',
    description: 'User viewed their profile page',
    category: 'page',
    page: 'profile',
    feature: 'users',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:products': {
    id: 'page:view:products',
    name: 'Products Page View',
    description: 'User viewed the products listing page',
    category: 'page',
    page: 'products-list',
    feature: 'products',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:product': {
    id: 'page:view:product',
    name: 'Product Detail Page View',
    description: 'User viewed a product detail page',
    category: 'page',
    page: 'product-details',
    feature: 'products',
    properties: {
      productId: 'string',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:cart': {
    id: 'page:view:cart',
    name: 'Cart Page View',
    description: 'User viewed the shopping cart page',
    category: 'page',
    page: 'cart',
    feature: 'cart',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:checkout': {
    id: 'page:view:checkout',
    name: 'Checkout Page View',
    description: 'User viewed the checkout page',
    category: 'page',
    page: 'checkout',
    feature: 'checkout',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:orders': {
    id: 'page:view:orders',
    name: 'Orders Page View',
    description: 'User viewed the orders page',
    category: 'page',
    page: 'orders-list',
    feature: 'orders',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:merchant': {
    id: 'page:view:merchant',
    name: 'Merchant Profile Page View',
    description: 'User viewed a merchant profile page',
    category: 'page',
    page: 'merchant-profile',
    feature: 'merchants',
    properties: {
      merchantId: 'string',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'page:view:admin': {
    id: 'page:view:admin',
    name: 'Admin Dashboard Page View',
    description: 'User viewed the admin dashboard',
    category: 'page',
    page: 'admin-dashboard',
    feature: 'admin',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'user:login': {
    id: 'user:login',
    name: 'User Login',
    description: 'User successfully logged in',
    category: 'user',
    feature: 'users',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'user:register': {
    id: 'user:register',
    name: 'User Registration',
    description: 'User successfully registered',
    category: 'user',
    feature: 'users',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'product:search': {
    id: 'product:search',
    name: 'Product Search',
    description: 'User searched for products',
    category: 'product',
    feature: 'products',
    properties: {
      query: 'string',
      results: 'number',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'product:view': {
    id: 'product:view',
    name: 'Product View',
    description: 'User viewed a product',
    category: 'product',
    feature: 'products',
    properties: {
      productId: 'string',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'product:create': {
    id: 'product:create',
    name: 'Product Creation',
    description: 'User created a new product',
    category: 'product',
    feature: 'products',
    properties: {
      productId: 'string',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'cart:view': {
    id: 'cart:view',
    name: 'Cart View',
    description: 'User viewed their cart',
    category: 'cart',
    feature: 'cart',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'cart:add': {
    id: 'cart:add',
    name: 'Add to Cart',
    description: 'User added an item to cart',
    category: 'cart',
    feature: 'cart',
    properties: {
      productId: 'string',
      quantity: 'number',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'cart:remove': {
    id: 'cart:remove',
    name: 'Remove from Cart',
    description: 'User removed an item from cart',
    category: 'cart',
    feature: 'cart',
    properties: {
      productId: 'string',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'checkout:start': {
    id: 'checkout:start',
    name: 'Checkout Start',
    description: 'User started the checkout process',
    category: 'checkout',
    feature: 'checkout',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'checkout:complete': {
    id: 'checkout:complete',
    name: 'Checkout Complete',
    description: 'User completed the checkout process',
    category: 'checkout',
    feature: 'checkout',
    properties: {
      orderId: 'string',
      amount: 'number',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'checkout:failed': {
    id: 'checkout:failed',
    name: 'Checkout Failed',
    description: 'User failed to complete checkout',
    category: 'checkout',
    feature: 'checkout',
    properties: {
      reason: 'string',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'merchant:view': {
    id: 'merchant:view',
    name: 'Merchant View',
    description: 'User viewed a merchant profile',
    category: 'merchant',
    feature: 'merchants',
    properties: {
      merchantId: 'string',
    },
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'admin:login': {
    id: 'admin:login',
    name: 'Admin Login',
    description: 'Admin user logged in',
    category: 'user',
    feature: 'admin',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// ANALYTICS EVENT QUERY HELPERS
// ============================================================================

/**
 * Get an analytics event by ID
 */
export function getAnalyticsEvent(id: string): AnalyticsEvent | undefined {
  return analyticsEventRegistry[id];
}

/**
 * Get all analytics events
 */
export function getAllAnalyticsEvents(): AnalyticsEvent[] {
  return Object.values(analyticsEventRegistry);
}

/**
 * Get analytics events by category
 */
export function getAnalyticsEventsByCategory(category: 'page' | 'click' | 'checkout' | 'merchant' | 'user' | 'product' | 'order' | 'cart'): AnalyticsEvent[] {
  return getAllAnalyticsEvents().filter((e) => e.category === category);
}

/**
 * Get analytics events by feature
 */
export function getAnalyticsEventsByFeature(featureId: string): AnalyticsEvent[] {
  return getAllAnalyticsEvents().filter((e) => e.feature === featureId);
}

/**
 * Get analytics events by page
 */
export function getAnalyticsEventsByPage(pageId: string): AnalyticsEvent[] {
  return getAllAnalyticsEvents().filter((e) => e.page === pageId);
}

/**
 * Check if an analytics event exists
 */
export function analyticsEventExists(id: string): boolean {
  return id in analyticsEventRegistry;
}

/**
 * Validate an analytics event definition
 */
export function validateAnalyticsEvent(event: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = analyticsEventSchema.safeParse(event);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

/**
 * Validate the entire analytics event registry
 */
export function validateAnalyticsEventRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate each analytics event definition
  for (const [id, event] of Object.entries(analyticsEventRegistry)) {
    const validation = validateAnalyticsEvent(event);
    if (!validation.valid) {
      errors.push(`Analytics event "${id}": ${validation.errors?.message}`);
    }

    // Check ID consistency
    if (event.id !== id) {
      errors.push(`Analytics event "${id}": ID mismatch (registry key: ${id}, event.id: ${event.id})`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================
