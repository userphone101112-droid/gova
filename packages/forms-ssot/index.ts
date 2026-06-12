// @gv/forms-ssot
// Single Source of Truth for all platform forms

import { z } from 'zod';

// ============================================================================
// FORM DEFINITION SCHEMA
// ============================================================================

export const formDefinitionSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Form ID must be lowercase with hyphens'),
  name: z.string().min(1),
  description: z.string().min(1),
  page: z.string().min(1), // Reference to @gv/pages-ssot
  feature: z.string().min(1), // Reference to @gv/features-ssot
  schema: z.string().min(1), // Reference to @gv/schemas
  dto: z.string().optional(), // Reference to @gv/contracts
  permissions: z.array(z.string()).default([]), // Required permissions
  translations: z.array(z.string()).default([]), // Translation keys
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'email', 'password', 'number', 'select', 'checkbox', 'radio', 'textarea', 'date', 'file']),
    required: z.boolean().default(false),
    validation: z.string().optional(), // Zod validation rule
    translationKey: z.string(),
  })).default([]),
  submitAction: z.string().optional(), // API endpoint or action
  version: z.string().default('1.0.0'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type FormDefinition = z.infer<typeof formDefinitionSchema>;

// ============================================================================
// FORM REGISTRY
// ============================================================================

/**
 * Authoritative registry of all platform forms.
 * 
 * This is the Single Source of Truth for form definitions.
 * All form-related code must reference this registry.
 * 
 * To add a new form:
 * 1. Add definition to this registry
 * 2. Run validation: npm run validate:forms
 * 3. Update related schemas SSOT
 */
export const formRegistry: Record<string, FormDefinition> = {
  login: {
    id: 'login',
    name: 'Login Form',
    description: 'User authentication form',
    page: 'login',
    feature: 'users',
    schema: 'loginSchema',
    dto: 'LoginDTO',
    permissions: [],
    translations: ['common.login', 'common.email', 'common.password'],
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        translationKey: 'common.email',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        translationKey: 'common.password',
      },
    ],
    submitAction: '/api/auth/login',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  register: {
    id: 'register',
    name: 'Registration Form',
    description: 'User registration form',
    page: 'register',
    feature: 'users',
    schema: 'createUserSchema',
    dto: 'CreateUserDTO',
    permissions: [],
    translations: ['common.register', 'common.name', 'common.email', 'common.password'],
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        validation: 'min(2)',
        translationKey: 'common.name',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        translationKey: 'common.email',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        validation: 'min(8)',
        translationKey: 'common.password',
      },
    ],
    submitAction: '/api/auth/register',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  profileUpdate: {
    id: 'profile-update',
    name: 'Profile Update Form',
    description: 'User profile update form',
    page: 'profile',
    feature: 'users',
    schema: 'updateUserSchema',
    dto: 'UpdateUserDTO',
    permissions: ['user.write'],
    translations: ['common.profile', 'common.name', 'common.email'],
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        translationKey: 'common.name',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        translationKey: 'common.email',
      },
    ],
    submitAction: '/api/users/profile',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  productCreate: {
    id: 'product-create',
    name: 'Product Creation Form',
    description: 'Create a new product',
    page: 'product-create',
    feature: 'products',
    schema: 'createProductSchema',
    dto: 'CreateProductDTO',
    permissions: ['product.write'],
    translations: ['products.addProduct', 'products.name', 'products.description', 'products.price', 'products.stock'],
    fields: [
      {
        name: 'name',
        label: 'Product Name',
        type: 'text',
        required: true,
        validation: 'min(3)',
        translationKey: 'products.name',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
        validation: 'min(10)',
        translationKey: 'products.description',
      },
      {
        name: 'price',
        label: 'Price',
        type: 'number',
        required: true,
        validation: 'positive()',
        translationKey: 'products.price',
      },
      {
        name: 'stock',
        label: 'Stock',
        type: 'number',
        required: false,
        validation: 'nonnegative()',
        translationKey: 'products.stock',
      },
    ],
    submitAction: '/api/products',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
  merchantCreate: {
    id: 'merchant-create',
    name: 'Merchant Creation Form',
    description: 'Create a new merchant',
    page: 'merchant-dashboard',
    feature: 'merchants',
    schema: 'createMerchantSchema',
    dto: 'CreateMerchantDTO',
    permissions: ['merchant.write'],
    translations: ['merchants.create', 'merchants.name', 'merchants.email'],
    fields: [
      {
        name: 'name',
        label: 'Merchant Name',
        type: 'text',
        required: true,
        translationKey: 'merchants.name',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        translationKey: 'merchants.email',
      },
    ],
    submitAction: '/api/merchants',
    version: '1.0.0',
    createdAt: '2026-06-13T00:00:00.000Z',
    updatedAt: '2026-06-13T00:00:00.000Z',
  },
};

// ============================================================================
// FORM QUERY HELPERS
// ============================================================================

/**
 * Get a form by ID
 */
export function getForm(id: string): FormDefinition | undefined {
  return formRegistry[id];
}

/**
 * Get a form by page
 */
export function getFormByPage(pageId: string): FormDefinition | undefined {
  return Object.values(formRegistry).find((f) => f.page === pageId);
}

/**
 * Get all forms
 */
export function getAllForms(): FormDefinition[] {
  return Object.values(formRegistry);
}

/**
 * Get forms by feature
 */
export function getFormsByFeature(featureId: string): FormDefinition[] {
  return getAllForms().filter((f) => f.feature === featureId);
}

/**
 * Get forms by permission
 */
export function getFormsByPermission(permission: string): FormDefinition[] {
  return getAllForms().filter((f) => f.permissions.includes(permission));
}

/**
 * Check if a form exists
 */
export function formExists(id: string): boolean {
  return id in formRegistry;
}

/**
 * Validate a form definition
 */
export function validateForm(form: unknown): {
  valid: boolean;
  errors: z.ZodError | null;
} {
  const result = formDefinitionSchema.safeParse(form);
  return {
    valid: result.success,
    errors: result.success ? null : result.error,
  };
}

/**
 * Validate the entire form registry
 */
export function validateFormRegistry(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate each form definition
  for (const [id, form] of Object.entries(formRegistry)) {
    const validation = validateForm(form);
    if (!validation.valid) {
      errors.push(`Form "${id}": ${validation.errors?.message}`);
    }

    // Check ID consistency
    if (form.id !== id) {
      errors.push(`Form "${id}": ID mismatch (registry key: ${id}, form.id: ${form.id})`);
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
