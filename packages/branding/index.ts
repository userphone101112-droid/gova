// @gv/branding
export const brandingConfig = {
  defaultBrand: 'gv',
  brands: {
    gv: {
      name: 'Global Ventures',
      logo: '/logo-gv.svg',
      theme: 'default'
    }
  }
};

export function getBrandConfig(brandId: string) {
  return brandingConfig.brands[brandId as keyof typeof brandingConfig.brands] || brandingConfig.brands[brandingConfig.defaultBrand];
}
