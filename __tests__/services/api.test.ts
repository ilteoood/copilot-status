import { fetchCopilotQuota, fetchGitHubUser } from '@/services/api';
import type { GitHubCopilotResponse } from '@/types/api';
import { Octokit } from '@octokit/rest';

jest.mock('@/services/storage');

describe('services/api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchGitHubUser', () => {
    it('should fetch authenticated user data', async () => {
      const mockUserData = {
        login: 'testuser',
        id: 123,
        avatar_url: 'https://example.com/avatar.png',
      };

      const mockGetAuthenticated = jest.fn().mockResolvedValue({ data: mockUserData });
      const MockedOctokit = jest.mocked(Octokit);
      MockedOctokit.mockImplementation(
        () =>
          ({
            users: {
              getAuthenticated: mockGetAuthenticated,
            },
          }) as unknown as InstanceType<typeof Octokit>
      );

      const result = await fetchGitHubUser('test-token');

      expect(Octokit).toHaveBeenCalledWith({ auth: 'test-token' });
      expect(mockGetAuthenticated).toHaveBeenCalled();
      expect(result).toEqual(mockUserData);
    });

    it('should throw error if API call fails', async () => {
      const mockError = new Error('API Error');
      const mockGetAuthenticated = jest.fn().mockRejectedValue(mockError);

      const MockedOctokit = jest.mocked(Octokit);
      MockedOctokit.mockImplementation(
        () =>
          ({
            users: {
              getAuthenticated: mockGetAuthenticated,
            },
          }) as unknown as InstanceType<typeof Octokit>
      );

      await expect(fetchGitHubUser('test-token')).rejects.toThrow('API Error');
    });
  });

  describe('fetchCopilotQuota', () => {
    const mockCopilotResponse: GitHubCopilotResponse = {
      username: 'testuser',
      quota_snapshots: {
        premium_interactions: {
          entitlement: 1000,
          remaining: 500,
          percent_remaining: 50,
          overage_count: 0,
        },
      },
      quota_reset_date_utc: '2024-02-01T00:00:00Z',
    };

    it('should fetch and parse copilot quota data', async () => {
      const mockRequest = jest.fn().mockResolvedValue({ data: mockCopilotResponse });

      const MockedOctokit = jest.mocked(Octokit);
      MockedOctokit.mockImplementation(
        () =>
          ({
            request: mockRequest,
          }) as unknown as InstanceType<typeof Octokit>
      );

      const result = await fetchCopilotQuota('test-token');

      expect(Octokit).toHaveBeenCalledWith({ auth: 'test-token' });
      expect(mockRequest).toHaveBeenCalledWith('GET /copilot_internal/user');

      expect(result).toEqual({
        totalQuota: 1000,
        remainingQuota: 500,
        usedQuota: 500,
        remainingPercent: 50,
        resetDate: new Date('2024-02-01T00:00:00Z'),
      });
    });

    it('should calculate used quota correctly', async () => {
      const mockResponse: GitHubCopilotResponse = {
        username: 'testuser',
        quota_snapshots: {
          premium_interactions: {
            entitlement: 2000,
            remaining: 500,
            percent_remaining: 25,
            overage_count: 0,
          },
        },
        quota_reset_date_utc: '2024-02-01T00:00:00Z',
      };

      const mockRequest = jest.fn().mockResolvedValue({ data: mockResponse });

      const MockedOctokit = jest.mocked(Octokit);
      MockedOctokit.mockImplementation(
        () =>
          ({
            request: mockRequest,
          }) as unknown as InstanceType<typeof Octokit>
      );

      const result = await fetchCopilotQuota('test-token');

      expect(result.usedQuota).toBe(1500);
      expect(result.totalQuota).toBe(2000);
      expect(result.remainingQuota).toBe(500);
      expect(result.remainingPercent).toBe(25);
    });

    it('should throw error if API call fails', async () => {
      const mockError = new Error('API Error');
      const mockRequest = jest.fn().mockRejectedValue(mockError);

      const MockedOctokit = jest.mocked(Octokit);
      MockedOctokit.mockImplementation(
        () =>
          ({
            request: mockRequest,
          }) as unknown as InstanceType<typeof Octokit>
      );

      await expect(fetchCopilotQuota('test-token')).rejects.toThrow('API Error');
    });
  });
});
