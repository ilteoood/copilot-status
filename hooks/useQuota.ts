import { useCopilotQuota } from '@/hooks/useGitHub';
import { getPercentRemaining, getQuotaStatus, getRemainingQuota } from '@/types/quota';

export function useQuota() {
  const { data: quota, isLoading, error, isCached, dataUpdatedAt, refetch } = useCopilotQuota();

  const remainingQuota = quota ? getRemainingQuota(quota) : null;
  const percentRemaining = quota ? getPercentRemaining(quota) : null;
  const status = percentRemaining !== null ? getQuotaStatus(percentRemaining) : null;

  return {
    quota,
    remainingQuota,
    percentRemaining,
    status,
    lastFetch: dataUpdatedAt,
    isLoading,
    error: error?.message ?? null,
    isCached,
    fetchQuota: refetch,
  };
}
