/**
 * Store Types
 *
 * TypeScript types for all store slices.
 */

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: Notification[];
}

export interface DataState {
  data: Record<string, unknown>;
  isLoading: boolean;
  error: string | null;
}

import type { UserResponseDTO } from '@gv/contracts';

export type User = UserResponseDTO;

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}
