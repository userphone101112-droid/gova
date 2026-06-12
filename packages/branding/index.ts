// @gv/branding

export interface BrandConfig {
  id: string;
  appName: string;
  logoUrl: string;
  faviconUrl: string;
  companyName: string;
  description: string;
  primaryColor?: string;
  supportEmail: string;
}

export const brands: Record<string, BrandConfig> = {
  gv: {
    id: 'gv',
    appName: 'Global Ventures',
    logoUrl: '/logo-gv.svg',
    faviconUrl: '/favicon.ico',
    companyName: 'Global Ventures Ltd.',
    description: 'The Unified Business Portal',
    supportEmail: 'support@globalventures.com',
  },
  brandA: {
    id: 'brandA',
    appName: 'Bazaar Hub',
    logoUrl: '/logo-bazaar.svg',
    faviconUrl: '/favicon-bazaar.ico',
    companyName: 'Bazaar Network Inc.',
    description: 'Local E-Commerce Redefined',
    primaryColor: '#ef4444', // Red accent
    supportEmail: 'support@bazaarhub.com',
  },
  brandB: {
    id: 'brandB',
    appName: 'Suez Connect',
    logoUrl: '/logo-suez.svg',
    faviconUrl: '/favicon-suez.ico',
    companyName: 'Suez Suez Corp',
    description: 'Premium Maritime & Port Services Logistics',
    primaryColor: '#059669', // Emerald accent
    supportEmail: 'info@suezconnect.com',
  },
};

export const defaultBrand = brands.gv!;

export function getBrandConfig(brandId?: string): BrandConfig {
  if (!brandId || !brands[brandId]) {
    return defaultBrand;
  }
  return brands[brandId]!;
}
