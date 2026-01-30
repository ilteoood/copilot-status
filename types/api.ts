// GitHub Copilot API response structure
export interface GitHubCopilotResponse {
  username: string;
  quota_reset_date_utc: string;
  quota_snapshots: {
    premium_interactions: {
      entitlement: number;
      percent_remaining: number;
      overage_count: number;
    };
  };
}
