// @gv/pages-ssot
// Single Source of Truth for all platform pages

import { z } from 'zod';

// ============================================================================
// PAGE DEFINITION SCHEMA
// ============================================================================

const pageTypeEnum = z.enum([
  'page',
  'layout',
  'loading',
  'error',
  'not-found',
  'template',
]);

export type PageType = z.infer<typeof pageTypeEnum>;

const pageDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Page ID must be lowercase with hyphens'),
  feature: z.string().min(1), // Reference to @gv/features-ssot
  route: z.string().min(1), // Next.js route path
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  type: pageTypeEnum,
  layout: z.string().optional(), // Layout reference
  permissions: z.array(z.string()).default([]), // Required permissions
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
  }).default(() => ({ keywords: [] })),
  translations: z.array(z.string()).default([]), // Translation keys
  contracts: z.array(z.string()).default([]), // Contract references from @gv/contracts
  schemas: z.array(z.string()).default([]), // Schema references from @gv/schemas
  analyticsEvents: z.array(z.string()).default([]), // Analytics events from @gv/analytics-ssot
  documentationRefs: z.array(z.string()).default([]), // Links to documentation
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type PageDefinition = z.infer<typeof pageDefinitionSchema>;

// ============================================================================
// PAGE REGISTRY
// ============================================================================

/**
 * Authoritative registry of all platform pages.
 * 
 * This is the Single Source of Truth for page definitions.
 * All page-related code must reference this registry.
 * 
 * To add a new page:
 * 1. Add definition to this registry
 * 2. Run validation: npm run validate:pages
 * 3. Create the page file in src/app/
 * 4. Update related routes SSOT
 */
export const pageRegistry: Record<string, PageDefinition> = {
  home: {
    id: 'home',
    feature: 'users',
    route: '/',
    title: 'Home',
    description: 'Landing page and home screen',
    type: 'page',
    permissions: [],
    seo: {
      title: 'GV Platform - Home',
      description: 'Welcome to the GV Platform',
      keywords: [],
    },
    translations: ['common.welcome'],
    contracts: [],
    schemas: [],
    analyticsEvents: ['page.view.home'],
    documentationRefs: ['/docs/pages/home.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  login: {
    id: 'login',
    feature: 'users',
    route: '/login',
    title: 'Login',
    description: 'User authentication page',
    type: 'page',
    permissions: [],
    seo: {
      title: 'GV Platform - Login',
      description: 'Sign in to your account',
      keywords: [],
    },
    translations: ['common.login'],
    contracts: ['LoginDTO', 'LoginResponseDTO'],
    schemas: ['loginSchema'],
    analyticsEvents: ['page.view.login', 'user.login'],
    documentationRefs: ['/docs/pages/login.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  register: {
    id: 'register',
    feature: 'users',
    route: '/register',
    title: 'Register',
    description: 'User registration page',
    type: 'page',
    permissions: [],
    seo: {
      title: 'GV Platform - Register',
      description: 'Create a new account',
      keywords: [],
    },
    translations: ['common.register'],
    contracts: ['CreateUserDTO', 'UserResponseDTO'],
    schemas: ['createUserSchema'],
    analyticsEvents: ['page.view.register', 'user.register'],
    documentationRefs: ['/docs/pages/register.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  profile: {
    id: 'profile',
    feature: 'users',
    route: '/profile',
    title: 'Profile',
    description: 'User profile management page',
    type: 'page',
    permissions: ['user.read'],
    seo: {
      title: 'GV Platform - Profile',
      description: 'Manage your profile',
      keywords: [],
    },
    translations: ['common.profile'],
    contracts: ['UpdateUserDTO', 'UserResponseDTO'],
    schemas: ['updateUserSchema'],
    analyticsEvents: ['page.view.profile', 'user.profile.update'],
    documentationRefs: ['/docs/pages/profile.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  settings: {
    id: 'settings',
    feature: 'users',
    route: '/settings',
    title: 'Settings',
    description: 'User settings page',
    type: 'page',
    permissions: ['user.read'],
    seo: {
      title: 'GV Platform - Settings',
      description: 'Manage your settings',
      keywords: [],
    },
    translations: ['common.settings'],
    contracts: ['UpdateUserDTO'],
    schemas: ['updateUserSchema'],
    analyticsEvents: ['page.view.settings'],
    documentationRefs: ['/docs/pages/settings.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  productsList: {
    id: 'products-list',
    feature: 'products',
    route: '/products',
    title: 'Products',
    description: 'Product catalog listing page',
    type: 'page',
    permissions: ['product.read'],
    seo: {
      title: 'GV Platform - Products',
      description: 'Browse our product catalog',
      keywords: [],
    },
    translations: ['products.list'],
    contracts: ['ProductResponseDTO'],
    schemas: [],
    analyticsEvents: ['page.view.products', 'product.search'],
    documentationRefs: ['/docs/pages/products.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  productDetails: {
    id: 'product-details',
    feature: 'products',
    route: '/products/[id]',
    title: 'Product Details',
    description: 'Individual product detail page',
    type: 'page',
    permissions: ['product.read'],
    seo: {
      title: 'GV Platform - Product Details',
      description: 'View product details',
      keywords: [],
    },
    translations: ['products.details'],
    contracts: ['ProductResponseDTO'],
    schemas: [],
    analyticsEvents: ['page.view.product', 'product.view'],
    documentationRefs: ['/docs/pages/product-details.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  productCreate: {
    id: 'product-create',
    feature: 'products',
    route: '/products/new',
    title: 'Create Product',
    description: 'Create a new product',
    type: 'page',
    permissions: ['product.write'],
    seo: {
      title: 'GV Platform - Create Product',
      description: 'Add a new product',
      keywords: [],
    },
    translations: ['products.addProduct'],
    contracts: ['CreateProductDTO', 'ProductResponseDTO'],
    schemas: ['createProductSchema'],
    analyticsEvents: ['page.view.product-create', 'product.create'],
    documentationRefs: ['/docs/pages/product-create.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  cart: {
    id: 'cart',
    feature: 'cart',
    route: '/cart',
    title: 'Cart',
    description: 'Shopping cart page',
    type: 'page',
    permissions: ['cart.read'],
    seo: {
      title: 'GV Platform - Cart',
      description: 'View your shopping cart',
      keywords: [],
    },
    translations: ['cart.title'],
    contracts: [],
    schemas: [],
    analyticsEvents: ['page.view.cart', 'cart.view'],
    documentationRefs: ['/docs/pages/cart.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  checkout: {
    id: 'checkout',
    feature: 'checkout',
    route: '/checkout',
    title: 'Checkout',
    description: 'Checkout process page',
    type: 'page',
    permissions: ['checkout.write'],
    seo: {
      title: 'GV Platform - Checkout',
      description: 'Complete your purchase',
      keywords: [],
    },
    translations: ['checkout.title'],
    contracts: ['OrderResponseDTO'],
    schemas: ['createOrderSchema'],
    analyticsEvents: ['page.view.checkout', 'checkout.start'],
    documentationRefs: ['/docs/pages/checkout.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  ordersList: {
    id: 'orders-list',
    feature: 'orders',
    route: '/orders',
    title: 'Orders',
    description: 'Order history page',
    type: 'page',
    permissions: ['order.read'],
    seo: {
      title: 'GV Platform - Orders',
      description: 'View your order history',
      keywords: [],
    },
    translations: ['orders.title'],
    contracts: ['OrderResponseDTO'],
    schemas: [],
    analyticsEvents: ['page.view.orders'],
    documentationRefs: ['/docs/pages/orders.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  orderDetails: {
    id: 'order-details',
    feature: 'orders',
    route: '/orders/[id]',
    title: 'Order Details',
    description: 'Individual order detail page',
    type: 'page',
    permissions: ['order.read'],
    seo: {
      title: 'GV Platform - Order Details',
      description: 'View order details',
      keywords: [],
    },
    translations: ['orders.details'],
    contracts: ['OrderResponseDTO'],
    schemas: [],
    analyticsEvents: ['page.view.order-details'],
    documentationRefs: ['/docs/pages/order-details.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  merchantProfile: {
    id: 'merchant-profile',
    feature: 'merchants',
    route: '/merchants/[id]',
    title: 'Merchant Profile',
    description: 'Merchant profile page',
    type: 'page',
    permissions: ['merchant.read'],
    seo: {
      title: 'GV Platform - Merchant Profile',
      description: 'View merchant information',
      keywords: [],
    },
    translations: ['merchants.profile'],
    contracts: ['MerchantResponseDTO'],
    schemas: [],
    analyticsEvents: ['page.view.merchant', 'merchant.view'],
    documentationRefs: ['/docs/pages/merchant-profile.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  merchantDashboard: {
    id: 'merchant-dashboard',
    feature: 'merchants',
    route: '/merchants/dashboard',
    title: 'Merchant Dashboard',
    description: 'Merchant management dashboard',
    type: 'page',
    permissions: ['merchant.write'],
    seo: {
      title: 'GV Platform - Merchant Dashboard',
      description: 'Manage your store',
      keywords: [],
    },
    translations: ['merchants.dashboard'],
    contracts: ['MerchantResponseDTO'],
    schemas: ['createMerchantSchema'],
    analyticsEvents: ['page.view.merchant-dashboard'],
    documentationRefs: ['/docs/pages/merchant-dashboard.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  adminDashboard: {
    id: 'admin-dashboard',
    feature: 'admin',
    route: '/admin',
    title: 'Admin Dashboard',
    description: 'Admin management dashboard',
    type: 'page',
    permissions: ['admin.read'],
    seo: {
      title: 'GV Platform - Admin',
      description: 'Platform administration',
      keywords: [],
    },
    translations: ['admin.title'],
    contracts: [],
    schemas: [],
    analyticsEvents: ['page.view.admin', 'admin.login'],
    documentationRefs: ['/docs/pages/admin.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  rootLayout: {
    id: 'root-layout',
    feature: 'users',
    route: '/',
    title: 'Root Layout',
    description: 'Root layout for the entire application',
    type: 'layout',
    permissions: [],
    seo: {
      keywords: [],
    },
    translations: [],
    contracts: [],
    schemas: [],
    analyticsEvents: [],
    documentationRefs: ['/docs/pages/root-layout.md'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// PAGE QUERY HELPERS
// ============================================================================

/**
 * Get a page by ID
 */
export function getPage(id: string): PageDefinition | undefined {
  return pageRegistry[id];
}

/**
 * Get a page by route
 */
export function getPageByRoute(route: string): PageDefinition | undefined {
  return Object.values(pageRegistry).find((p) => p.route === route);
}

/**
 * Get all pages
 */
export function getAllPages(): PageDefinition[] {
  return Object.values(pageRegistry);
}

/**
 * Get pages by feature
 */
export function getPagesByFeature(featureId: string): PageDefinition[] {
  return getAllPages().filter((p) => p.feature === featureId);
}

/**
 * Get pages by type
 */
export function getPagesByType(type: PageType): PageDefinition[] {
  return getAllPages().filter((p) => p.type === type);
}

/**
 * Get pages requiring specific permission
 */
export function getPagesByPermission(permission: string): PageDefinition[] {
  return getAllPages().filter((p) => p.permissions.includes(permission));
}

/**
 * Check if a page exists
 */
export function pageExists(id: string): boolean {
  return id in pageRegistry;
}

/**
 * Validate a page definition
 */
export function validatePage(page: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = pageDefinitionSchema.safeParse(page);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

/**
 * Validate the entire page registry
 */
export function validatePageRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate each page definition
  for (const [id, page] of Object.entries(pageRegistry)) {
    const validation = validatePage(page);
    if (!validation.valid) {
      errors.push(`Page "${id}": ${validation.errors?.message}`);
    }

    // Check ID consistency
    if (page.id !== id) {
      errors.push(`Page "${id}": ID mismatch (registry key: ${id}, page.id: ${page.id})`);
    }

    // Check feature existence (would need to import from features-ssot)
    // This is a placeholder for cross-SSOT validation
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================
