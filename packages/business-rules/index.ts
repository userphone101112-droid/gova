// @gv/business-rules

export const BUSINESS_RULES = {
  products: {
    maxImages: 5,
    maxNameLength: 100,
    minNameLength: 3,
    maxDescriptionLength: 2000,
    minDescriptionLength: 10,
    minPrice: 0.01,
  },
  images: {
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024,
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ] as const,
  },
  merchants: {
    maxStoreNameLength: 100,
    minStoreNameLength: 3,
    maxDescriptionLength: 1000,
  },
  orders: {
    maxItemsPerOrder: 50,
    minOrderValue: 1.0, // base currency minimum
  },
  auth: {
    minPasswordLength: 8,
    maxPasswordLength: 100,
  },
} as const;
