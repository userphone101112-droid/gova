# Localization & Translation System Documentation

## Overview

Two packages work together to provide full localization support:

- **`@gv/translations`** → SSOT for all UI text (dictionary keys + values)
- **`@gv/localization`** → SSOT for locale detection, persistence, and RTL/LTR direction

## Translation System (`@gv/translations`)

### Dictionary Structure

```ts
dictionaries = {
  en: {
    common: { welcome, login, logout, ... },
    validation: { emailInvalid, passwordTooShort, ... },
    auth: { unauthorized, sessionExpired, ... },
    products: { name, price, addProduct, ... },
    images: { uploadImage, uploadSuccess, ... }
  },
  ar: { /* identical keys, Arabic values */ }
}
```

### Type-Safe Key Lookup

```ts
import { getTranslation, Language } from '@gv/translations';

const t = (key: TranslationKey) => getTranslation(language as Language, key);

// Usage:
t('common.welcome'); // 'Welcome' | 'مرحباً'
t('products.addProduct'); // 'Add Product' | 'إضافة منتج'
```

TypeScript will auto-complete all valid keys and reject invalid ones at compile time.

### Adding a New Language

1. Add entry to `dictionaries` in `packages/translations/index.ts`
2. Add entry to `supportedLanguages` in `packages/localization/index.ts`
3. Run `npm run validate:ssot` to verify all keys are synced

## Localization System (`@gv/localization`)

```ts
import { getDirection, isRtl, supportedLanguages, LANGUAGE_STORAGE_KEY } from '@gv/localization';

getDirection('ar'); // 'rtl'
getDirection('en'); // 'ltr'
isRtl('ar'); // true
```

### RTL Support in React

```tsx
const dir = getDirection(language);

return (
  <div dir={dir} className="...">
    {/* content auto-mirrors in RTL */}
  </div>
);
```

### Persistence

Use `LANGUAGE_STORAGE_KEY` constant (`'gv-lang-pref'`) as the key for `localStorage` so it's consistent everywhere.

## SSOT Validator

```bash
npm run validate:ssot
```

Checks:

- All English keys exist in Arabic and vice versa
- No orphaned translation keys
- No missing business-rules constants
