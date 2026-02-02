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

  return {
    totalQuota: premium_interactions.entitlement,
    remainingQuota: premium_interactions.remaining,
    usedQuota: premium_interactions.entitlement - premium_interactions.remaining,
    remainingPercent: premium_interactions.percent_remaining,
    resetDate: new Date(response.quota_reset_date_utc),
  };
}

export async function fetchCopilotQuota(token: string): Promise<QuotaInfo> {
  const octokit = new Octokit({
    auth: token,
  });

  const { data } = await octokit.request('GET /copilot_internal/user');

  return parseQuotaResponse(data);
}
