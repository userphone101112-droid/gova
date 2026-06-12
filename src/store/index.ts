/**
 * Store Index
 * 
 * Central export point for all Zustand stores.
 * This file exports all store slices and combined stores.
 */

export { useAuthStore } from './slices/auth.slice';
export { useUIStore } from './slices/ui.slice';
export { useDataStore } from './slices/data.slice';
export type { AuthState, UIState, DataState } from './types';
