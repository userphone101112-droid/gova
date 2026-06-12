// @gv/design-system - Shared UI Components

import * as React from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to merge class names safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Button Component ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            // Primary variant uses --primary and --primary-foreground CSS variables
            'bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-95 active:scale-95':
              variant === 'primary',
            'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:brightness-95 active:scale-95':
              variant === 'secondary',
            'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:brightness-95 active:scale-95':
              variant === 'destructive',
            'border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] active:scale-95':
              variant === 'outline',
            'bg-transparent hover:bg-[var(--muted)] active:scale-95': variant === 'ghost',

            // Sizes
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2 text-base': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// --- Input Component ---
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// --- Card Component ---
export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow-sm)] p-6',
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';
