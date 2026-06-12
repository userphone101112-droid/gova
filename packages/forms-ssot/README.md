# @gv/forms-ssot

Single Source of Truth for all platform forms.

## Purpose

This package serves as the authoritative registry for every form in the GV platform. No form should exist without being registered in this SSOT.

## Form Definition

Every form must include:

- **id**: Unique identifier (lowercase with hyphens)
- **name**: Human-readable form name
- **description**: Detailed form description
- **page**: Reference to @gv/pages-ssot
- **feature**: Reference to @gv/features-ssot
- **schema**: Reference to @gv/schemas
- **dto**: Reference to @gv/contracts (optional)
- **permissions**: Required permissions
- **translations**: Translation keys
- **fields**: Form field definitions
- **submitAction**: API endpoint or action (optional)
- **version**: Semantic version
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

## Form Field Definition

Each form field must include:

- **name**: Field name
- **label**: Display label
- **type**: Field type (text, email, password, number, select, checkbox, radio, textarea, date, file)
- **required**: Is required
- **validation**: Zod validation rule (optional)
- **translationKey**: Translation key

## Usage

```typescript
import { getForm, getFormByPage } from '@gv/forms-ssot';

// Get a specific form
const loginForm = getForm('login');

// Get form by page
const profileForm = getFormByPage('profile');
```

## Validation

Run validation:

```bash
npm run validate
```

Or from root:

```bash
npm run validate:forms
```

## Adding a New Form

1. Add the form definition to `formRegistry` in `index.ts`
2. Run validation: `npm run validate`
3. Update related schemas SSOT
4. Commit with descriptive message

## Integration

This package integrates with:
- `@gv/pages-ssot` - Forms reference pages
- `@gv/features-ssot` - Forms reference features
- `@gv/schemas` - Forms use validation schemas
- `@gv/contracts` - Forms use DTOs
- `@gv/permissions-ssot` - Forms require permissions
- `@gv/translations` - Forms use translations
