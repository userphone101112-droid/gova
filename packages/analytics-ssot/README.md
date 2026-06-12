# @gv/analytics-ssot

Single Source of Truth for all platform analytics events.

## Purpose

This package serves as the authoritative registry for every analytics event in the GV platform. No analytics event should exist without being registered in this SSOT.

## Analytics Event Definition

Every analytics event must include:

- **id**: Unique identifier (lowercase with hyphens and colons, e.g., `page:view:home`)
- **name**: Human-readable event name
- **description**: Detailed event description
- **category**: Event category (page, click, checkout, merchant, user, product, order, cart)
- **page**: Reference to @gv/pages-ssot (optional)
- **feature**: Reference to @gv/features-ssot
- **properties**: Event properties (optional)
- **version**: Semantic version
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Usage

```typescript
import { getAnalyticsEvent, getAnalyticsEventsByCategory } from '@gv/analytics-ssot';

// Get a specific analytics event
const homePageView = getAnalyticsEvent('page:view:home');

// Get events by category
const pageViews = getAnalyticsEventsByCategory('page');
```

## Validation

Run validation:

```bash
npm run validate
```

Or from root:

```bash
npm run validate:analytics
```

## Adding a New Analytics Event

1. Add the analytics event definition to `analyticsEventRegistry` in `index.ts`
2. Run validation: `npm run validate`
3. Update related pages SSOT
4. Commit with descriptive message

## Event Categories

- **page**: Page view events
- **click**: Click events
- **checkout**: Checkout-related events
- **merchant**: Merchant-related events
- **user**: User-related events
- **product**: Product-related events
- **order**: Order-related events
- **cart**: Cart-related events

## Integration

This package integrates with:
- `@gv/pages-ssot` - Events reference pages
- `@gv/features-ssot` - Events reference features
