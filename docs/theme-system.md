# Theme System Documentation

## Overview

The `@gv/theme` package is the **single source of truth** for all visual design tokens across the entire platform.

## Architecture

```
packages/theme/
├── index.ts      → TypeScript tokens (ThemeTokens, lightTheme, darkTheme, generateCssVariables)
└── theme.css     → CSS custom properties consumed by Next.js via globals.css
```

## Token Categories

| Category      | Tokens                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colors        | `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--destructive`, `--muted`, `--border`, `--success`, `--warning`, `--info` |
| Spacing       | `--spacing-xs` through `--spacing-3xl`                                                                                                             |
| Typography    | `--font-sans`, `--font-mono`                                                                                                                       |
| Border Radius | `--radius-sm` through `--radius-full`                                                                                                              |
| Shadows       | `--shadow-sm` through `--shadow-xl`                                                                                                                |
| Transitions   | `--transition-fast`, `--transition-normal`, `--transition-slow`                                                                                    |
| Z-Index       | `--z-dropdown` through `--z-tooltip`                                                                                                               |

## Usage in Next.js

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import '../../packages/theme/theme.css';
```

## Usage in TypeScript

```ts
import { lightTheme, darkTheme, getThemeTokens, generateCssVariables } from '@gv/theme';

// Get current theme tokens
const tokens = getThemeTokens('dark');

// Generate CSS variables
const cssVars = generateCssVariables(tokens);
```

## Dark Mode

Dark mode is automatically applied via:

- `@media (prefers-color-scheme: dark)` — OS-level preference
- `.dark` class on `<html>` — controlled programmatically by `useUIStore.setTheme('dark')`

## Multi-Brand / Tenant Themes

Extend `themes` in `packages/theme/index.ts`:

```ts
export const tenantXTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#custom-hex',
  },
};
```
