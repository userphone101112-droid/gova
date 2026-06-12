// @gv/navigation-ssot
// Single Source of Truth for all platform navigation

import { z } from 'zod';

// ============================================================================
// NAVIGATION ITEM DEFINITION SCHEMA
// ============================================================================

const navigationItemTypeEnum = z.enum([
  'link',
  'button',
  'dropdown',
  'divider',
  'header',
]);

export type NavigationItemType = z.infer<typeof navigationItemTypeEnum>;

const navigationItemSchema: z.ZodType<NavigationItem> = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Navigation item ID must be lowercase with hyphens'),
  type: navigationItemTypeEnum,
  label: z.string().min(1),
  translationKey: z.string().min(1), // Reference to @gv/translations
  route: z.string().optional(), // Reference to @gv/routes-ssot
  href: z.string().optional(), // External link
  icon: z.string().optional(), // Icon name
  permissions: z.array(z.string()).default([]), // Required permissions
  feature: z.string().optional(), // Reference to @gv/features-ssot
  children: z.array(z.lazy((): z.ZodType<NavigationItem> => navigationItemSchema)).default([]), // Nested items
  order: z.number().default(0), // Display order
  hidden: z.boolean().default(false), // Is hidden
  badge: z.string().optional(), // Badge text
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type NavigationItem = z.infer<typeof navigationItemSchema>;

// ============================================================================
// NAVIGATION STRUCTURE DEFINITION SCHEMA
// ============================================================================

const navigationStructureSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['sidebar', 'header', 'footer', 'breadcrumbs', 'quick-actions']),
  items: z.array(navigationItemSchema),
  permissions: z.array(z.string()).default([]),
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type NavigationStructure = z.infer<typeof navigationStructureSchema>;

// ============================================================================
// NAVIGATION REGISTRY
// ============================================================================

/**
 * Authoritative registry of all platform navigation structures.
 * 
 * This is the Single Source of Truth for navigation definitions.
 * All navigation-related code must reference this registry.
 * 
 * To add a new navigation item:
 * 1. Add definition to this registry
 * 2. Run validation: npm run validate:navigation
 * 3. Update related routes SSOT
 */
export const navigationRegistry: Record<string, NavigationStructure> = {
  sidebar: {
    id: 'sidebar',
    name: 'Main Sidebar',
    type: 'sidebar',
    items: [
      {
        id: 'sidebar-home',
        type: 'link',
        label: 'Home',
        translationKey: 'common.home',
        route: 'home',
        icon: 'home',
        permissions: [],
        children: [],
        order: 1,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'sidebar-products',
        type: 'link',
        label: 'Products',
        translationKey: 'products.title',
        route: 'products-list',
        icon: 'package',
        permissions: ['product.read'],
        feature: 'products',
        children: [],
        order: 2,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'sidebar-cart',
        type: 'link',
        label: 'Cart',
        translationKey: 'cart.title',
        route: 'cart',
        icon: 'shopping-cart',
        permissions: ['cart.read'],
        feature: 'cart',
        children: [],
        order: 3,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'sidebar-orders',
        type: 'link',
        label: 'Orders',
        translationKey: 'orders.title',
        route: 'orders-list',
        icon: 'clipboard-list',
        permissions: ['order.read'],
        feature: 'orders',
        children: [],
        order: 4,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'sidebar-profile',
        type: 'link',
        label: 'Profile',
        translationKey: 'common.profile',
        route: 'profile',
        icon: 'user',
        permissions: ['user.read'],
        feature: 'users',
        children: [],
        order: 5,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'sidebar-settings',
        type: 'link',
        label: 'Settings',
        translationKey: 'common.settings',
        route: 'settings',
        icon: 'settings',
        permissions: ['user.read'],
        feature: 'users',
        children: [],
        order: 6,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
    ],
    permissions: [],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  header: {
    id: 'header',
    name: 'Main Header',
    type: 'header',
    items: [
      {
        id: 'header-home',
        type: 'link',
        label: 'Home',
        translationKey: 'common.home',
        route: 'home',
        permissions: [],
        children: [],
        order: 1,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'header-products',
        type: 'link',
        label: 'Products',
        translationKey: 'products.title',
        route: 'products-list',
        permissions: ['product.read'],
        children: [],
        order: 2,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'header-merchants',
        type: 'link',
        label: 'Merchants',
        translationKey: 'merchants.title',
        route: 'merchant-dashboard',
        permissions: ['merchant.read'],
        children: [],
        order: 3,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'header-login',
        type: 'button',
        label: 'Login',
        translationKey: 'common.login',
        route: 'login',
        permissions: [],
        children: [],
        order: 100,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
    ],
    permissions: [],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  footer: {
    id: 'footer',
    name: 'Main Footer',
    type: 'footer',
    items: [
      {
        id: 'footer-home',
        type: 'link',
        label: 'Home',
        translationKey: 'common.home',
        route: 'home',
        permissions: [],
        children: [],
        order: 1,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'footer-about',
        type: 'link',
        label: 'About',
        translationKey: 'common.about',
        href: '/about',
        permissions: [],
        children: [],
        order: 2,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'footer-terms',
        type: 'link',
        label: 'Terms',
        translationKey: 'common.terms',
        href: '/terms',
        permissions: [],
        children: [],
        order: 3,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'footer-privacy',
        type: 'link',
        label: 'Privacy',
        translationKey: 'common.privacy',
        href: '/privacy',
        permissions: [],
        children: [],
        order: 4,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
    ],
    permissions: [],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  breadcrumbs: {
    id: 'breadcrumbs',
    name: 'Breadcrumbs',
    type: 'breadcrumbs',
    items: [
      {
        id: 'breadcrumb-home',
        type: 'link',
        label: 'Home',
        translationKey: 'common.home',
        route: 'home',
        permissions: [],
        children: [],
        order: 1,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
    ],
    permissions: [],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  quickActions: {
    id: 'quick-actions',
    name: 'Quick Actions',
    type: 'quick-actions',
    items: [
      {
        id: 'quick-add-product',
        type: 'button',
        label: 'Add Product',
        translationKey: 'products.addProduct',
        route: 'product-create',
        icon: 'plus',
        permissions: ['product.write'],
        feature: 'products',
        children: [],
        order: 1,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
      {
        id: 'quick-checkout',
        type: 'button',
        label: 'Checkout',
        translationKey: 'checkout.title',
        route: 'checkout',
        icon: 'shopping-cart',
        permissions: ['checkout.write'],
        feature: 'checkout',
        children: [],
        order: 2,
        hidden: false,
        version: '1.0.0',
        createdAt: '2026-06-13T00:00:00.000Z',
        updatedAt: '2026-06-13T00:00:00.000Z',
      },
    ],
    permissions: [],
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// NAVIGATION QUERY HELPERS
// ============================================================================

/**
 * Get a navigation structure by ID
 */
export function getNavigation(id: string): NavigationStructure | undefined {
  return navigationRegistry[id];
}

/**
 * Get all navigation structures
 */
export function getAllNavigation(): NavigationStructure[] {
  return Object.values(navigationRegistry);
}

/**
 * Get navigation by type
 */
export function getNavigationByType(type: 'sidebar' | 'header' | 'footer' | 'breadcrumbs' | 'quick-actions'): NavigationStructure | undefined {
  return getAllNavigation().find((n) => n.type === type);
}

/**
 * Get navigation items for a user based on permissions
 */
export function getNavigationItemsForUser(navigationId: string, userPermissions: string[]): NavigationItem[] {
  const navigation = getNavigation(navigationId);
  if (!navigation) return [];

  return navigation.items
    .filter((item) => {
      // Check if user has all required permissions
      if (item.permissions.length === 0) return true;
      return item.permissions.every((perm: string) => userPermissions.includes(perm));
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Check if a navigation structure exists
 */
export function navigationExists(id: string): boolean {
  return id in navigationRegistry;
}

/**
 * Validate a navigation structure
 */
export function validateNavigation(navigation: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = navigationStructureSchema.safeParse(navigation);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

/**
 * Validate the entire navigation registry
 */
export function validateNavigationRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate each navigation structure
  for (const [id, navigation] of Object.entries(navigationRegistry)) {
    const validation = validateNavigation(navigation);
    if (!validation.valid) {
      errors.push(`Navigation "${id}": ${validation.errors?.message}`);
    }

    // Check ID consistency
    if (navigation.id !== id) {
      errors.push(`Navigation "${id}": ID mismatch (registry key: ${id}, navigation.id: ${navigation.id})`);
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
