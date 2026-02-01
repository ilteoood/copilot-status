import type { GitHubCopilotResponse } from '@/types/api';
import type { QuotaInfo } from '@/types/quota';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';

export type GitHubUser = RestEndpointMethodTypes['users']['getAuthenticated']['response']['data'];

export async function fetchGitHubUser(token: string): Promise<GitHubUser> {
  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.users.getAuthenticated();
  return data;
}

function parseQuotaResponse(response: GitHubCopilotResponse): QuotaInfo {
  const { premium_interactions } = response.quota_snapshots;
  const totalQuota = premium_interactions.entitlement;
  const percentRemaining = premium_interactions.percent_remaining;
  const usedQuota = totalQuota * (1 - percentRemaining / 100);

  return {
    totalQuota,
    usedQuota,
    resetDate: new Date(response.quota_reset_date_utc),
    hasOverage: premium_interactions.overage_count > 0,
    overageCount: premium_interactions.overage_count,
  };
}

export async function fetchCopilotQuota(token: string): Promise<QuotaInfo> {
  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.request('GET /copilot_internal/user');

  return parseQuotaResponse(data);
}
