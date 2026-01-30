export type QuotaStatus = 'good' | 'warning' | 'critical';

export interface QuotaInfo {
  totalQuota: number;
  usedQuota: number;
  resetDate: Date;
  hasOverage: boolean;
  overageCount: number;
}

// Computed properties helper
export function getQuotaStatus(percentRemaining: number): QuotaStatus {
  if (percentRemaining > 50) return 'good';
  if (percentRemaining > 20) return 'warning';
  return 'critical';
}

export function getRemainingQuota(quota: QuotaInfo): number {
  return quota.totalQuota - quota.usedQuota;
}

export function getPercentRemaining(quota: QuotaInfo): number {
  if (quota.totalQuota === 0) return 0;
  return ((quota.totalQuota - quota.usedQuota) / quota.totalQuota) * 100;
}
