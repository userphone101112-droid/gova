// @gv/features

export type FeatureFlag =
  | 'ENABLE_CHAT'
  | 'ENABLE_REVIEWS'
  | 'ENABLE_COUPONS'
  | 'ENABLE_NOTIFICATIONS'
  | 'ENABLE_AI_FEATURES';

export interface FeatureConfig {
  flags: Record<FeatureFlag, boolean>;
  overrides?: Record<string, Partial<Record<FeatureFlag, boolean>>>; // User/Tenant overrides
}

export const defaultFeatures: Record<FeatureFlag, boolean> = {
  ENABLE_CHAT: false,
  ENABLE_REVIEWS: true,
  ENABLE_COUPONS: false,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_AI_FEATURES: false,
};

export class FeatureManager {
  private flags: Record<FeatureFlag, boolean>;
  private tenantOverrides: Record<string, Partial<Record<FeatureFlag, boolean>>>;

  constructor(config?: Partial<FeatureConfig>) {
    this.flags = { ...defaultFeatures, ...config?.flags };
    this.tenantOverrides = config?.overrides || {};
  }

  isEnabled(flag: FeatureFlag, tenantId?: string): boolean {
    if (tenantId && this.tenantOverrides[tenantId]?.[flag] !== undefined) {
      return this.tenantOverrides[tenantId]![flag]!;
    }
    return this.flags[flag];
  }

  getAllFlags(tenantId?: string): Record<FeatureFlag, boolean> {
    const activeFlags = { ...this.flags };
    if (tenantId && this.tenantOverrides[tenantId]) {
      Object.assign(activeFlags, this.tenantOverrides[tenantId]);
    }
    return activeFlags;
  }
}

export const features = new FeatureManager();
