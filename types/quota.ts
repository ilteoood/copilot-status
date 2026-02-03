export type QuotaStatus = 'good' | 'warning' | 'critical';

export type QuotaType = 'premium_interactions' | 'chat' | 'completions';

export interface QuotaInfo {
  type: QuotaType;
  totalQuota: number;
  remainingQuota: number;
  usedQuota: number;
  remainingPercent: number;
  resetDate: Date;
  unlimited: boolean;
}

export interface AllQuotas {
  premium_interactions: QuotaInfo;
  chat: QuotaInfo;
  completions: QuotaInfo;
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
