# Marketplace Navigation System

> **Source**: `docs/modules/marketplace-navigation.md`
> **Status**: In Development
> **Feature ID**: marketplace-navigation
> **Gate ID**: GATE-2026-0001
> **Last Updated**: 2026-06-13

---

## Overview

The Marketplace Navigation System is a dynamic, role-based navigation system that provides different navigation experiences for buyers, sellers, and administrators in the GV Platform marketplace.

---

## Purpose

To provide a unified, role-aware navigation system that adapts to the user's role and permissions, ensuring each user sees only the navigation items relevant to their role and access level.

---

## Design Specifications

### Global Settings

- **showNavbar**: `true`
- **navbarMode**: `sticky` (mobile default)
- **theme**: `dynamic` (light/dark support)

### Navigation Items

| ID | Label | Icon | Route | Visibility | Roles | Order | Badge |
|----|-------|------|-------|------------|-------|-------|-------|
| home | Home | home-icon | /home | all | buyer, seller, admin | 1 | - |
| cart | Cart | shopping-cart | /cart | all | buyer | 2 | 3 |
| dashboard | Dashboard | layout-dashboard | /seller/dashboard | all | seller | 2 | - |
| admin-panel | Admin | shield-check | /admin/dashboard | all | admin | 2 | - |
| notifications | Notifications | bell | /notifications | all | buyer, seller, admin | 3 | 12 |
| profile | Profile | user | /profile | all | buyer, seller, admin | 4 | - |

### Role-Specific Flows

#### Buyer Flow
- **Focus**: Discovery, search, cart, and orders
- **Navigation Items**: Home, Cart, Notifications, Profile
- **Key Features**: Product browsing, cart management, order tracking

#### Seller Flow
- **Focus**: Inventory management, orders, and performance analytics
- **Navigation Items**: Home, Dashboard, Notifications, Profile
- **Key Features**: Product management, order fulfillment, analytics

#### Admin Flow
- **Focus**: System-wide oversight, user management, and reporting
- **Navigation Items**: Home, Admin Panel, Notifications, Profile
- **Key Features**: User management, system monitoring, reporting

---

## Technical Implementation

### SSOT Updates

#### Navigation SSOT
- Add marketplace navigation structure to `@gv/navigation-ssot`
- Include role-based visibility rules
- Add badge support for cart and notifications

#### Routes SSOT
- Add marketplace routes:
  - `/home` - Marketplace home
  - `/cart` - Shopping cart
  - `/seller/dashboard` - Seller dashboard
  - `/admin/dashboard` - Admin dashboard
  - `/notifications` - Notifications center
  - `/profile` - User profile

#### Pages SSOT
- Add marketplace pages:
  - `marketplace-home` - Home page
  - `marketplace-cart` - Cart page
  - `seller-dashboard` - Seller dashboard
  - `admin-dashboard` - Admin dashboard
  - `notifications-center` - Notifications page
  - `user-profile` - Profile page

#### Permissions SSOT
- Add marketplace permissions:
  - `marketplace.read` - Read marketplace data
  - `marketplace.write` - Write marketplace data
- Add/update roles:
  - `buyer` - Buyer role with cart and order permissions
  - `seller` - Seller role with dashboard and product management permissions
  - `admin` - Admin role with full system access

#### Translations SSOT
- Add translation keys:
  - `marketplace.home`
  - `marketplace.cart`
  - `marketplace.dashboard`
  - `marketplace.admin`
  - `marketplace.notifications`
  - `marketplace.profile`

### Component Structure

```
src/components/marketplace/
├── navigation/
│   ├── MarketplaceNavigation.tsx
│   ├── NavigationItem.tsx
│   ├── NavigationBadge.tsx
│   └── index.ts
├── layouts/
│   ├── BuyerLayout.tsx
│   ├── SellerLayout.tsx
│   └── AdminLayout.tsx
└── hooks/
    ├── useMarketplaceNavigation.ts
    └── useRoleBasedNavigation.ts
```

---

## Dependencies

- `@gv/features-ssot` - Feature registration
- `@gv/navigation-ssot` - Navigation definitions
- `@gv/routes-ssot` - Route definitions
- `@gv/pages-ssot` - Page definitions
- `@gv/permissions-ssot` - Permission definitions
- `@gv/translations` - Translation keys
- `@gv/analytics-ssot` - Analytics events

---

## Analytics Events

- `navigation.click` - Navigation item clicked
- `navigation.view` - Navigation viewed
- `marketplace.view` - Marketplace page viewed
- `cart.view` - Cart page viewed
- `dashboard.view` - Dashboard page viewed

---

## Security Considerations

- All navigation items respect user permissions
- Role-based access control enforced at component level
- No navigation item is shown without proper authorization
- Badge counts are filtered by user permissions

---

## Performance Considerations

- Navigation items are memoized to prevent unnecessary re-renders
- Badge counts are cached and updated via WebSocket
- Role-based navigation is computed once on mount
- Lazy loading of navigation components

---

## Testing Strategy

### Unit Tests
- Test navigation item rendering
- Test role-based visibility
- Test badge display logic
- Test navigation click handlers

### Integration Tests
- Test navigation with authentication
- Test navigation with permission changes
- Test navigation across role switches

### E2E Tests
- Test buyer navigation flow
- Test seller navigation flow
- Test admin navigation flow

---

## Migration Strategy

1. Update SSOT packages (navigation, routes, pages, permissions, translations)
2. Create navigation components
3. Create role-based layouts
4. Update existing pages to use new navigation
5. Test each role's navigation flow
6. Deploy to staging environment
7. Monitor analytics and user feedback
8. Deploy to production

---

## Rollback Plan

If issues arise:
1. Revert navigation component changes
2. Restore previous SSOT definitions
3. Disable feature flag `ENABLE_MARKETPLACE_NAVIGATION`
4. Monitor system stability

---

## Success Criteria

- ✅ All three roles (buyer, seller, admin) have distinct navigation
- ✅ Navigation items respect user permissions
- ✅ Badge counts display correctly
- ✅ Theme switching works (light/dark)
- ✅ Mobile navigation is responsive
- ✅ Analytics events are tracked
- ✅ No performance degradation

---

## Open Questions

- Should navigation be server-side rendered or client-side rendered?
- How often should badge counts be refreshed?
- Should navigation items be customizable per user?

---

## References

- **Gate ID**: GATE-2026-0001
- **Design Source**: Stitch Dynamic Marketplace Navigation System
- **Related ADRs**: None
- **Related Features**: users, products, merchants, orders, notifications

---

**Document Version**: 1.0.0
**Created**: 2026-06-13
**Last Updated**: 2026-06-13
**Status**: In Development
