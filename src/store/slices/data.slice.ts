/**
 * Data Store Slice
 * 
 * Manages application data state and loading/error states.
 */

import { create } from 'zustand';
import type { DataState } from '../types';

interface DataActions {
  setData: (key: string, value: unknown) => void;
  removeData: (key: string) => void;
  clearData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type DataStore = DataState & DataActions;

export const useDataStore = create<DataStore>()((set) => ({
  data: {},
  isLoading: false,
  error: null,

  setData: (key, value) =>
    set((state) => ({
      data: { ...state.data, [key]: value },
      error: null,
    })),

  removeData: (key) =>
    set((state) => {
      const newData = { ...state.data };
      delete newData[key];
      return { data: newData };
    }),

  clearData: () => set({ data: {}, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
