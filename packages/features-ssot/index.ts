// @gv/features-ssot
// Single Source of Truth for all platform features

import { z } from 'zod';

// ============================================================================
// FEATURE DEFINITION SCHEMA
// ============================================================================

export const featureStatusEnum = z.enum([
  'planned',
  'in_development',
  'in_review',
  'released',
  'deprecated',
  'removed',
]);

export type FeatureStatus = z.infer<typeof featureStatusEnum>;

export const featureDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Feature ID must be lowercase with hyphens'),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  owner: z.string().min(1), // Team or individual responsible
  status: featureStatusEnum,
  permissions: z.array(z.string()).default([]), // Required permissions
  routes: z.array(z.string()).default([]), // Associated routes
  forms: z.array(z.string()).default([]), // Associated forms
  analyticsEvents: z.array(z.string()).default([]), // Tracked analytics events
  documentationRefs: z.array(z.string()).default([]), // Links to documentation
  adrRefs: z.array(z.string()).default([]), // Related ADRs
  dependencies: z.array(z.string()).default([]), // Other features this depends on
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type FeatureDefinition = z.infer<typeof featureDefinitionSchema>;

// ============================================================================
// FEATURE REGISTRY
// ============================================================================

/**
 * Authoritative registry of all platform features.
 * 
 * This is the Single Source of Truth for feature definitions.
 * All feature-related code must reference this registry.
 * 
 * To add a new feature:
 * 1. Add definition to this registry
 * 2. Run validation: npm run validate:features
 * 3. Update related pages, routes, forms SSOTs
 */
export const featureRegistry: Record<string, FeatureDefinition> = {
  users: {
    id: 'users',
    name: 'Users',
    description: 'User management, authentication, and profile features',
    owner: 'Platform Team',
    status: 'released',
    permissions: ['user.read', 'user.write', 'user.delete'],
    routes: ['/login', '/register', '/profile', '/settings'],
    forms: ['login-form', 'register-form', 'profile-form'],
    analyticsEvents: ['user.login', 'user.register', 'user.profile.update'],
    documentationRefs: ['/docs/modules/users.md'],
    adrRefs: ['ADR-0001'],
    dependencies: [],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  products: {
    id: 'products',
    name: 'Products',
    description: 'Product catalog, management, and search features',
    owner: 'Product Team',
    status: 'released',
    permissions: ['product.read', 'product.write', 'product.delete'],
    routes: ['/products', '/products/[id]', '/products/new'],
    forms: ['product-form', 'product-search-form'],
    analyticsEvents: ['product.view', 'product.search', 'product.create'],
    documentationRefs: ['/docs/modules/products.md'],
    adrRefs: [],
    dependencies: ['users'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  merchants: {
    id: 'merchants',
    name: 'Merchants',
    description: 'Merchant store management and profile features',
    owner: 'Commerce Team',
    status: 'in_development',
    permissions: ['merchant.read', 'merchant.write', 'merchant.delete'],
    routes: ['/merchants', '/merchants/[id]', '/merchants/dashboard'],
    forms: ['merchant-form', 'merchant-onboarding-form'],
    analyticsEvents: ['merchant.view', 'merchant.register'],
    documentationRefs: ['/docs/modules/merchants.md'],
    adrRefs: [],
    dependencies: ['users', 'products'],
    version: '0.5.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  orders: {
    id: 'orders',
    name: 'Orders',
    description: 'Order management, checkout, and payment features',
    owner: 'Commerce Team',
    status: 'in_development',
    permissions: ['order.read', 'order.write', 'order.delete'],
    routes: ['/orders', '/orders/[id]', '/checkout'],
    forms: ['checkout-form', 'order-form'],
    analyticsEvents: ['order.create', 'order.complete', 'checkout.start'],
    documentationRefs: ['/docs/modules/orders.md'],
    adrRefs: [],
    dependencies: ['users', 'products', 'merchants'],
    version: '0.3.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  cart: {
    id: 'cart',
    name: 'Cart',
    description: 'Shopping cart and cart management features',
    owner: 'Commerce Team',
    status: 'planned',
    permissions: ['cart.read', 'cart.write', 'cart.delete'],
    routes: ['/cart'],
    forms: ['cart-form'],
    analyticsEvents: ['cart.add', 'cart.remove', 'cart.checkout'],
    documentationRefs: ['/docs/modules/cart.md'],
    adrRefs: [],
    dependencies: ['products'],
    version: '0.1.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  checkout: {
    id: 'checkout',
    name: 'Checkout',
    description: 'Checkout flow and payment processing',
    owner: 'Commerce Team',
    status: 'planned',
    permissions: ['checkout.read', 'checkout.write'],
    routes: ['/checkout', '/checkout/success', '/checkout/cancel'],
    forms: ['checkout-form', 'payment-form'],
    analyticsEvents: ['checkout.start', 'checkout.complete', 'checkout.abandon'],
    documentationRefs: ['/docs/modules/checkout.md'],
    adrRefs: [],
    dependencies: ['cart', 'orders', 'users'],
    version: '0.1.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  chat: {
    id: 'chat',
    name: 'Chat',
    description: 'Real-time messaging and chat features',
    owner: 'Communication Team',
    status: 'planned',
    permissions: ['chat.read', 'chat.write'],
    routes: ['/chat', '/chat/[id]'],
    forms: ['message-form'],
    analyticsEvents: ['message.send', 'message.receive'],
    documentationRefs: ['/docs/modules/chat.md'],
    adrRefs: [],
    dependencies: ['users'],
    version: '0.1.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  notifications: {
    id: 'notifications',
    name: 'Notifications',
    description: 'Push notifications and in-app alerts',
    owner: 'Platform Team',
    status: 'in_development',
    permissions: ['notification.read', 'notification.write'],
    routes: ['/notifications'],
    forms: ['notification-preferences-form'],
    analyticsEvents: ['notification.send', 'notification.open'],
    documentationRefs: ['/docs/modules/notifications.md'],
    adrRefs: [],
    dependencies: ['users'],
    version: '0.5.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  reviews: {
    id: 'reviews',
    name: 'Reviews',
    description: 'Product and merchant reviews',
    owner: 'Content Team',
    status: 'released',
    permissions: ['review.read', 'review.write', 'review.delete'],
    routes: ['/reviews', '/products/[id]/reviews'],
    forms: ['review-form'],
    analyticsEvents: ['review.submit', 'review.view'],
    documentationRefs: ['/docs/modules/reviews.md'],
    adrRefs: [],
    dependencies: ['users', 'products'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  images: {
    id: 'images',
    name: 'Images',
    description: 'Image upload, storage, and management',
    owner: 'Platform Team',
    status: 'released',
    permissions: ['image.read', 'image.write', 'image.delete'],
    routes: ['/images', '/images/upload'],
    forms: ['image-upload-form'],
    analyticsEvents: ['image.upload', 'image.view'],
    documentationRefs: ['/docs/modules/images.md'],
    adrRefs: [],
    dependencies: ['users'],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Admin dashboard and management tools',
    owner: 'Platform Team',
    status: 'in_development',
    permissions: ['admin.read', 'admin.write', 'admin.delete'],
    routes: ['/admin', '/admin/users', '/admin/products', '/admin/analytics'],
    forms: ['admin-user-form', 'admin-product-form'],
    analyticsEvents: ['admin.login', 'admin.action'],
    documentationRefs: ['/docs/modules/admin.md'],
    adrRefs: [],
    dependencies: ['users', 'products', 'orders'],
    version: '0.5.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  'marketplace-navigation': {
    id: 'marketplace-navigation',
    name: 'Marketplace Navigation',
    description: 'Dynamic role-based navigation system for marketplace with buyer, seller, and admin roles',
    owner: 'Commerce Team',
    status: 'in_development',
    permissions: ['marketplace.read'],
    routes: ['/home', '/cart', '/seller/dashboard', '/admin/dashboard', '/notifications', '/profile'],
    forms: [],
    analyticsEvents: ['navigation.click', 'navigation.view'],
    documentationRefs: ['/docs/modules/marketplace-navigation.md'],
    adrRefs: [],
    dependencies: ['users', 'products', 'merchants', 'orders', 'notifications'],
    version: '0.1.0',
    createdAt: '2026-06-13T01:10:00.000Z',
    updatedAt: '2026-06-13T01:10:00.000Z',
  },
};

// ============================================================================
// FEATURE QUERY HELPERS
// ============================================================================

/**
 * Get a feature by ID
 */
export function getFeature(id: string): FeatureDefinition | undefined {
  return featureRegistry[id];
}

/**
 * Get all features
 */
export function getAllFeatures(): FeatureDefinition[] {
  return Object.values(featureRegistry);
}

/**
 * Get features by status
 */
export function getFeaturesByStatus(status: FeatureStatus): FeatureDefinition[] {
  return getAllFeatures().filter((f) => f.status === status);
}

/**
 * Get features by owner
 */
export function getFeaturesByOwner(owner: string): FeatureDefinition[] {
  return getAllFeatures().filter((f) => f.owner === owner);
}

/**
 * Get features that depend on a given feature
 */
export function getFeatureDependents(featureId: string): FeatureDefinition[] {
  return getAllFeatures().filter((f) => f.dependencies.includes(featureId));
}

/**
 * Check if a feature exists
 */
export function featureExists(id: string): boolean {
  return id in featureRegistry;
}

/**
 * Validate a feature definition
 */
export function validateFeature(feature: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = featureDefinitionSchema.safeParse(feature);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

/**
 * Validate the entire feature registry
 */
export function validateFeatureRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate each feature definition
  for (const [id, feature] of Object.entries(featureRegistry)) {
    const validation = validateFeature(feature);
    if (!validation.valid) {
      errors.push(`Feature "${id}": ${validation.errors?.message}`);
    }

    // Check ID consistency
    if (feature.id !== id) {
      errors.push(`Feature "${id}": ID mismatch (registry key: ${id}, feature.id: ${feature.id})`);
    }

    // Check dependency existence
    for (const dep of feature.dependencies) {
      if (!featureExists(dep)) {
        errors.push(`Feature "${id}": Dependency "${dep}" does not exist in registry`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// FEATURE FLAG INTEGRATION
// ============================================================================

/**
 * Map feature IDs to feature flags for runtime toggle
 * This integrates with the existing @gv/features package
 */
export const featureFlagMapping: Record<string, string> = {
  chat: 'ENABLE_CHAT',
  reviews: 'ENABLE_REVIEWS',
  notifications: 'ENABLE_NOTIFICATIONS',
  // Add more mappings as needed
};

/**
 * Check if a feature is enabled via feature flag
 */
export function isFeatureEnabled(featureId: string, flagManager?: { isEnabled: (flag: string) => boolean }): boolean {
  const flagName = featureFlagMapping[featureId];
  if (!flagName) {
    // If no flag mapping, assume enabled for features without flags
    return true;
  }
  return flagManager?.isEnabled(flagName) ?? true;
}

// ============================================================================
// EXPORTS
// ============================================================================
