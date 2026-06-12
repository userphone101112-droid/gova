# Localization & Translation System

## Overview

The localization system provides comprehensive internationalization (i18n) support through two coordinated packages:

- **`@gv/translations`** → SSOT for all UI text (dictionary keys + values)
- **`@gv/localization`** → SSOT for locale detection, persistence, and RTL/LTR direction

## Architecture

### Package Structure

```
packages/
├── translations/
│   └── index.ts      → Translation dictionaries and type-safe lookup
└── localization/
    └── index.ts      → Locale detection, RTL/LTR, persistence
```

### Design Philosophy

- **Single Source of Truth**: All translations in one place
- **Type Safety**: TypeScript interfaces for translation keys
- **RTL Support**: Automatic right-to-left language support
- **Persistence**: User language preference saved
- **Validation**: Automated validation of translation completeness

## Translation System (`@gv/translations`)

### Dictionary Structure

**Location**: `packages/translations/index.ts`

**Structure**:
```typescript
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

### Translation Categories

**Common**: General UI text (welcome, login, logout, etc.)
**Validation**: Form validation messages
**Auth**: Authentication-related text
**Products**: Product management text
**Images**: Image management text

### Type-Safe Key Lookup

**Import**:
```typescript
import { getTranslation, Language } from '@gv/translations';
```

**Usage**:
```typescript
const t = (key: TranslationKey) => getTranslation(language as Language, key);

// Examples:
t('common.welcome'); // 'Welcome' | 'مرحباً'
t('products.addProduct'); // 'Add Product' | 'إضافة منتج'
t('validation.emailInvalid'); // 'Invalid email' | 'البريد الإلكتروني غير صالح'
```

**Type Safety**: TypeScript auto-completes valid keys and rejects invalid ones at compile time.

### Supported Languages

**Current Languages**:
- `en`: English
- `ar`: Arabic

**Language Type**:
```typescript
type Language = 'en' | 'ar';
```

### Adding a New Language

1. Add entry to `dictionaries` in `packages/translations/index.ts`
2. Add entry to `supportedLanguages` in `packages/localization/index.ts`
3. Run `npm run validate:ssot` to verify all keys are synced
4. Add RTL support if needed

---

## Localization System (`@gv/localization`)

### Locale Detection

**Functions**:
```typescript
import { getDirection, isRtl, supportedLanguages, LANGUAGE_STORAGE_KEY } from '@gv/localization';

getDirection('ar'); // 'rtl'
getDirection('en'); // 'ltr'
isRtl('ar'); // true
isRtl('en'); // false
```

### Supported Languages

**Array**:
```typescript
export const supportedLanguages = ['en', 'ar'] as const;
```

### Language Detection Priority

1. User preference (localStorage)
2. Browser language
3. Default language (en)

### Persistence

**Storage Key**: `LANGUAGE_STORAGE_KEY = 'gv-lang-pref'`

**Usage**:
```typescript
// Save preference
localStorage.setItem(LANGUAGE_STORAGE_KEY, 'ar');

// Load preference
const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
```

---

## RTL Support

### RTL in React

**Direction Attribute**:
```tsx
import { getDirection } from '@gv/localization';

function App({ language }: { language: Language }) {
  const dir = getDirection(language);

  return (
    <div dir={dir} className="...">
      {/* content auto-mirrors in RTL */}
    </div>
  );
}
```

### CSS Mirroring

**Logical Properties**:
```css
/* Use logical properties for RTL support */
.my-component {
  padding-inline-start: var(--spacing-md);  /* padding-left in LTR, padding-right in RTL */
  padding-inline-end: var(--spacing-md);    /* padding-right in LTR, padding-left in RTL */
  margin-inline-start: var(--spacing-sm);
  margin-inline-end: var(--spacing-sm);
  border-inline-start: 1px solid var(--border);
  border-inline-end: 1px solid var(--border);
}
```

### Tailwind RTL Support

**Configuration** (planned):
```javascript
// tailwind.config.ts
module.exports = {
  plugins: [
    require('tailwindcss-rtl'),
  ],
};
```

**Usage**:
```jsx
<div className="ms-4 me-4">
  {/* margin-start in LTR, margin-end in RTL */}
</div>
```

---

## Integration Patterns

### React Context Provider

**Provider** (planned):
```typescript
import { Language } from '@gv/translations';
import { LANGUAGE_STORAGE_KEY } from '@gv/localization';

interface TranslationContext {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export function TranslationProvider({ children }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = (key: string) => getTranslation(language, key);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}
```

### Custom Hook

**Hook** (planned):
```typescript
function useTranslation() {
  const context = useContext(TranslationContext);
  return context;
}

// Usage
function MyComponent() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => setLanguage('ar')}>العربية</button>
    </div>
  );
}
```

---

## Validation

### SSOT Validator

**Command**:
```bash
npm run validate:ssot
```

**Checks**:
- All English keys exist in Arabic and vice versa
- No orphaned translation keys
- No missing business-rules constants
- Type safety of translation keys

### Validation Script

**Location**: `packages/shared/scripts/validate-ssot.ts`

**Purpose**: Ensures translation completeness across all languages

---

## Best Practices

### Translation Keys

- **Dot Notation**: Use `category.key` format
- **Descriptive Names**: Use clear, descriptive key names
- **Consistent Naming**: Follow naming conventions
- **Avoid Hardcoding**: Never hardcode text in components

### Translation Values

- **Context**: Provide context for translators
- **Variables**: Support interpolation (planned)
- **Plurals**: Handle plural forms (planned)
- **Gender**: Handle gender forms (planned)

### Performance

- **Lazy Loading**: Load translations on demand (planned)
- **Caching**: Cache translation dictionaries
- **Minification**: Minify translation bundles
- **Tree Shaking**: Remove unused translations

---

## Future Enhancements

### Planned Features

- **More Languages**: Add Spanish, French, German, etc.
- **Interpolation**: Support variable interpolation
- **Pluralization**: Handle plural forms
- **Date/Time Formatting**: Locale-aware formatting
- **Number Formatting**: Locale-aware number formatting
- **Currency Formatting**: Locale-aware currency formatting
- **Translation Management UI**: Admin interface for translations
- **Auto-Translation**: Integration with translation APIs
- **Translation Memory**: Reuse translations across projects

---

## Source Traceability

**Source Folders**:
- `packages/translations/` - Translation package
- `packages/localization/` - Localization package

**Key Files**:
- `packages/translations/index.ts` - Translation dictionaries
- `packages/localization/index.ts` - Locale utilities

**Dependencies**:
- None (pure TypeScript)

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- None (standalone packages)

**Usage In**:
- Frontend components (planned)
- UI store (planned)
