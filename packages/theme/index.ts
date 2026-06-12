// @gv/theme
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

export const lightTheme: ThemeTokens = {
  colors: {
    background: '#ffffff',
    foreground: '#171717',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#64748b',
    secondaryForeground: '#ffffff',
    accent: '#8b5cf6',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
      mono: 'var(--font-geist-mono), ui-monospace, monospace',
    },
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export const darkTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#0a0a0a',
    foreground: '#ededed',
    primary: '#60a5fa',
    primaryForeground: '#ffffff',
    secondary: '#94a3b8',
    secondaryForeground: '#ffffff',
    accent: '#a78bfa',
    accentForeground: '#ffffff',
    destructive: '#f87171',
    destructiveForeground: '#ffffff',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    border: '#334155',
    input: '#334155',
    ring: '#60a5fa',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export function getThemeTokens(theme: keyof typeof themes = 'light'): ThemeTokens {
  return themes[theme];
}

export function generateCssVariables(theme: ThemeTokens): Record<string, string> {
  return {
    '--background': theme.colors.background,
    '--foreground': theme.colors.foreground,
    '--primary': theme.colors.primary,
    '--primary-foreground': theme.colors.primaryForeground,
    '--secondary': theme.colors.secondary,
    '--secondary-foreground': theme.colors.secondaryForeground,
    '--accent': theme.colors.accent,
    '--accent-foreground': theme.colors.accentForeground,
    '--destructive': theme.colors.destructive,
    '--destructive-foreground': theme.colors.destructiveForeground,
    '--muted': theme.colors.muted,
    '--muted-foreground': theme.colors.mutedForeground,
    '--border': theme.colors.border,
    '--input': theme.colors.input,
    '--ring': theme.colors.ring,
    '--success': theme.colors.success,
    '--warning': theme.colors.warning,
    '--info': theme.colors.info,

    '--spacing-xs': theme.spacing.xs,
    '--spacing-sm': theme.spacing.sm,
    '--spacing-md': theme.spacing.md,
    '--spacing-lg': theme.spacing.lg,
    '--spacing-xl': theme.spacing.xl,
    '--spacing-2xl': theme.spacing['2xl'],
    '--spacing-3xl': theme.spacing['3xl'],

    '--font-sans': theme.typography.fontFamily.sans,
    '--font-mono': theme.typography.fontFamily.mono,

    '--radius-sm': theme.radius.sm,
    '--radius-md': theme.radius.md,
    '--radius-lg': theme.radius.lg,
    '--radius-xl': theme.radius.xl,
    '--radius-2xl': theme.radius['2xl'],
    '--radius-full': theme.radius.full,

    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--shadow-lg': theme.shadows.lg,
    '--shadow-xl': theme.shadows.xl,

    '--transition-fast': theme.transitions.fast,
    '--transition-normal': theme.transitions.normal,
    '--transition-slow': theme.transitions.slow,

    '--z-dropdown': String(theme.zIndex.dropdown),
    '--z-sticky': String(theme.zIndex.sticky),
    '--z-fixed': String(theme.zIndex.fixed),
    '--z-modal-backdrop': String(theme.zIndex.modalBackdrop),
    '--z-modal': String(theme.zIndex.modal),
    '--z-popover': String(theme.zIndex.popover),
    '--z-tooltip': String(theme.zIndex.tooltip),
  };
}
