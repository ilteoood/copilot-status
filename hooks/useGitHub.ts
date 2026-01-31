import { fetchCopilotQuota, fetchGitHubUser, type GitHubUser } from '@/services/api';
import { usernameStorage } from '@/services/storage';
import { getStoredToken } from '@/stores/secureStorage';
import type { QuotaInfo } from '@/types/quota';
import { useQuery } from '@tanstack/react-query';

export const QUERY_KEYS = {
  GITHUB_USER: ['github', 'user'],
  COPILOT_QUOTA: ['github', 'copilot', 'quota'],
} as const;

export function useGitHubUser() {
  return useQuery<GitHubUser>({
    queryKey: QUERY_KEYS.GITHUB_USER,
    queryFn: async () => {
      const token = await getStoredToken();
      if (!token) throw new Error('Not authenticated');
      const user = await fetchGitHubUser(token);
      usernameStorage.setUsername(user.login);
      return user;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCopilotQuota() {
  const query = useQuery<QuotaInfo>({
    queryKey: QUERY_KEYS.COPILOT_QUOTA,
    queryFn: async () => {
      const token = await getStoredToken();
      if (!token) throw new Error('Not authenticated');

      return fetchCopilotQuota(token);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    ...query,
    isCached: query.isStale && !!query.data,
  };
}
