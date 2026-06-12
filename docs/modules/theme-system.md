# Theme System

## Overview

The `@gv/theme` package is the **single source of truth (SSOT)** for all visual design tokens across the entire platform. It provides a comprehensive theming system with light/dark modes, CSS variable generation, and TypeScript type safety.

## Architecture

### Package Structure

```
packages/theme/
├── index.ts      → TypeScript tokens (ThemeTokens, lightTheme, darkTheme, generateCssVariables)
└── theme.css     → CSS custom properties consumed by Next.js via globals.css
```

### Design Philosophy

- **Single Source of Truth**: All design tokens defined in one place
- **Type Safety**: TypeScript interfaces for compile-time validation
- **CSS Variables**: Runtime theming via CSS custom properties
- **Dark Mode**: Built-in dark theme support
- **Extensibility**: Easy to add new themes or customize existing ones

## Token System

### ThemeTokens Interface

**Location**: `packages/theme/index.ts`

**Structure**:
```typescript
export interface ThemeTokens {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
    success: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  typography: {
    fontFamily: {
      sans: string;
      mono: string;
    };
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modalBackdrop: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
}
```

## Predefined Themes

### Light Theme

**Purpose**: Default light mode theme

**Color Palette**:
- Background: `#ffffff`
- Foreground: `#171717`
- Primary: `#3b82f6` (blue)
- Secondary: `#64748b` (slate)
- Accent: `#8b5cf6` (purple)
- Destructive: `#ef4444` (red)
- Success: `#22c55e` (green)
- Warning: `#f59e0b` (amber)
- Info: `#3b82f6` (blue)

**Spacing Scale**:
- xs: `0.25rem` (4px)
- sm: `0.5rem` (8px)
- md: `1rem` (16px)
- lg: `1.5rem` (24px)
- xl: `2rem` (32px)
- 2xl: `3rem` (48px)
- 3xl: `4rem` (64px)

**Typography**:
- Sans: Geist Sans, system-ui, sans-serif
- Mono: Geist Mono, ui-monospace, monospace

**Border Radius**:
- sm: `0.25rem`
- md: `0.375rem`
- lg: `0.5rem`
- xl: `0.75rem`
- 2xl: `1rem`
- full: `9999px`

**Shadows**:
- sm: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- md: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- lg: `0 10px 15px -3px rgb(0 0 0 / 0.1)`
- xl: `0 20px 25px -5px rgb(0 0 0 / 0.1)`

**Transitions**:
- Fast: `150ms ease-in-out`
- Normal: `300ms ease-in-out`
- Slow: `500ms ease-in-out`

**Z-Index Scale**:
- Dropdown: 1000
- Sticky: 1020
- Fixed: 1030
- Modal Backdrop: 1040
- Modal: 1050
- Popover: 1060
- Tooltip: 1070

---

### Dark Theme

**Purpose**: Dark mode theme

**Color Palette**:
- Background: `#0a0a0a`
- Foreground: `#ededed`
- Primary: `#60a5fa` (lighter blue)
- Secondary: `#94a3b8` (lighter slate)
- Accent: `#a78bfa` (lighter purple)
- Destructive: `#f87171` (lighter red)
- Success, Warning, Info: Adjusted for dark mode

**Inheritance**: Extends light theme, overrides colors only

---

## API Reference

### getThemeTokens

**Signature**: `getThemeTokens(theme: keyof typeof themes = 'light'): ThemeTokens`

**Purpose**: Get theme tokens by name

**Example**:
```typescript
const lightTokens = getThemeTokens('light');
const darkTokens = getThemeTokens('dark');
```

---

### generateCssVariables

**Signature**: `generateCssVariables(theme: ThemeTokens): Record<string, string>`

**Purpose**: Convert theme tokens to CSS custom properties

**Output**:
```typescript
{
  '--background': '#ffffff',
  '--foreground': '#171717',
  '--primary': '#3b82f6',
  // ... all other tokens
}
```

**Example**:
```typescript
const cssVars = generateCssVariables(lightTheme);
// Apply to document
Object.entries(cssVars).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});
```

---

### themes Object

**Structure**:
```typescript
export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
```

**Purpose**: Registry of all available themes

---

## Usage Patterns

### In Next.js

**CSS Import**:
```css
/* src/app/globals.css */
@import 'tailwindcss';
@import '../../packages/theme/theme.css';
```

**TypeScript Import**:
```typescript
import { lightTheme, darkTheme, getThemeTokens, generateCssVariables } from '@gv/theme';
```

---

### Theme Switching

**Using UI Store**:
```typescript
import { useUIStore } from '@/store';

function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'dark' : 'light'}
    </button>
  );
}
```

---

### Using Tokens in Components

**CSS Variables**:
```css
.my-component {
  background: var(--background);
  color: var(--foreground);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

**Tailwind Integration**:
```css
/* tailwind.config.ts */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        // ... map all theme colors
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        // ... map all spacing tokens
      }
    }
  }
}
```

---

## Custom Themes

### Creating Custom Themes

**Example: Brand Theme**:
```typescript
export const brandTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#FF6B35', // Brand orange
    secondary: '#004E89', // Brand blue
  },
  spacing: {
    ...lightTheme.spacing,
    md: '1.25rem', // Custom spacing
  },
};
```

**Register Theme**:
```typescript
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  brand: brandTheme, // Add custom theme
};
```

---

### Tenant-Specific Themes

**Multi-Tenant Support**:
```typescript
export const createTenantTheme = (brandColor: string): ThemeTokens => ({
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: brandColor,
  },
});

// Usage
const tenantATheme = createTenantTheme('#FF0000');
const tenantBTheme = createTenantTheme('#00FF00');
```

---

## CSS Variables

### Variable Naming Convention

**Pattern**: `--{category}-{name}`

**Examples**:
- `--background`
- `--spacing-md`
- `--radius-lg`
- `--transition-fast`

### Variable Scope

- **Global**: Applied to `:root` or `html`
- **Theme-Specific**: Applied via `.light` or `.dark` class
- **Component-Specific**: Scoped to component (planned)

---

## Dark Mode Implementation

### Automatic Detection

**OS Preference**:
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme variables */
  }
}
```

### Manual Control

**Class-Based**:
```css
html.dark {
  /* Dark theme variables */
}
```

**JavaScript Control**:
```typescript
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('dark');
```

---

## Best Practices

### Token Usage

- **Use CSS Variables**: Prefer CSS variables over hardcoded values
- **Semantic Names**: Use semantic token names (primary, secondary) not literal colors (blue, red)
- **Consistent Spacing**: Use spacing tokens instead of arbitrary values
- **Type Safety**: Use TypeScript interfaces for token access

### Theme Customization

- **Extend, Don't Replace**: Extend base themes rather than creating from scratch
- **Maintain Contrast**: Ensure sufficient contrast ratios for accessibility
- **Test Both Modes**: Always test in both light and dark modes
- **Document Changes**: Document any theme changes in changelog

---

## Accessibility

### Color Contrast

- **WCAG AA**: Minimum 4.5:1 contrast ratio
- **WCAG AAA**: Minimum 7:1 contrast ratio
- **Testing**: Use contrast checker tools

### Reduced Motion

**Support** (planned):
```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance

### CSS Variable Performance

- **Fast**: CSS variables are performant for theming
- **No Repaint**: Changing variables doesn't trigger full repaint
- **GPU Accelerated**: Transitions use GPU acceleration

### Bundle Size

- **Minimal**: Only includes used tokens
- **Tree-Shaking**: Unused tokens can be tree-shaken
- **CSS-Only**: No JavaScript runtime overhead

---

## Future Enhancements

### Planned Features

- **Custom Theme Builder**: UI for creating custom themes
- **Theme Presets**: Pre-built theme collections
- **Dynamic Theming**: Runtime theme generation
- **Component Themes**: Component-specific theme overrides
- **Animation Tokens**: Animation duration and easing tokens
- **Grid Tokens**: Grid layout tokens

---

## Source Traceability

**Source Folders**:
- `packages/theme/` - Theme package

**Key Files**:
- `packages/theme/index.ts` - Theme tokens and utilities
- `packages/theme/theme.css` - CSS variables (planned)

**Dependencies**:
- None (pure TypeScript)

**Related ADRs**:
- ADR-0001: Initial Architecture Decisions
- ADR-0003: SSOT Architecture Implementation

**Related Packages**:
- None (standalone theme package)

**Usage In**:
- `src/app/globals.css` - Global styles
- `src/store/slices/ui.slice.ts` - UI state management
