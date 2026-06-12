// @gv/auth

export type UserRole = 'ADMIN' | 'MERCHANT' | 'CUSTOMER' | 'MODERATOR';

export type UserPermission =
  | 'products.create'
  | 'products.update'
  | 'products.delete'
  | 'products.view'
  | 'orders.manage'
  | 'orders.view'
  | 'merchants.manage'
  | 'users.manage';

// Strict Role to Permissions Mapping
export const rolePermissions: Record<UserRole, UserPermission[]> = {
  ADMIN: [
    'products.create',
    'products.update',
    'products.delete',
    'products.view',
    'orders.manage',
    'orders.view',
    'merchants.manage',
    'users.manage',
  ],
  MODERATOR: [
    'products.view',
    'products.delete', // can moderate products
    'orders.view',
    'orders.manage',
    'users.manage',
  ],
  MERCHANT: [
    'products.create',
    'products.update',
    'products.delete',
    'products.view',
    'orders.view',
    'orders.manage', // manage merchant's own orders
  ],
  CUSTOMER: [
    'products.view',
    'orders.view', // view customer's own orders
  ],
};

export function hasPermission(role: UserRole, permission: UserPermission): boolean {
  const permissions = rolePermissions[role];
  return !!permissions?.includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: UserPermission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: UserPermission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}
