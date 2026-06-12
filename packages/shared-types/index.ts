// @gv/shared-types

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

export type AsyncResult<T, E = Error> = Promise<
  { data: T; error: null } | { data: null; error: E }
>;

export type SortOrder = 'asc' | 'desc';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export type ThemeType = 'light' | 'dark' | 'system';
