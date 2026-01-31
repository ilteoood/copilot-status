import { Octokit } from '@octokit/rest';
import { fetchGitHubUser, fetchCopilotQuota } from '@/services/api';
import { quotaStorage } from '@/services/storage';
import { updateCopilotWidgetWithData } from '@/widgets/voltraWidgetService';
import type { GitHubCopilotResponse } from '@/types/api';

jest.mock('@/services/storage');
jest.mock('@/widgets/voltraWidgetService');

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
      (Octokit as jest.MockedClass<typeof Octokit>).mockImplementation(
        () =>
          ({
            users: {
              getAuthenticated: mockGetAuthenticated,
            },
          }) as any
      );

      const result = await fetchGitHubUser('test-token');

      expect(Octokit).toHaveBeenCalledWith({ auth: 'test-token' });
      expect(mockGetAuthenticated).toHaveBeenCalled();
      expect(result).toEqual(mockUserData);
    });

    it('should throw error if API call fails', async () => {
      const mockError = new Error('API Error');
      const mockGetAuthenticated = jest.fn().mockRejectedValue(mockError);
      
      (Octokit as jest.MockedClass<typeof Octokit>).mockImplementation(
        () =>
          ({
            users: {
              getAuthenticated: mockGetAuthenticated,
            },
          }) as any
      );

      await expect(fetchGitHubUser('test-token')).rejects.toThrow('API Error');
    });
  });

  describe('fetchCopilotQuota', () => {
    const mockCopilotResponse: GitHubCopilotResponse = {
      quota_snapshots: {
        premium_interactions: {
          entitlement: 1000,
          percent_remaining: 50,
          overage_count: 0,
        },
      },
      quota_reset_date_utc: '2024-02-01T00:00:00Z',
    };

    it('should fetch and parse copilot quota data', async () => {
      const mockRequest = jest.fn().mockResolvedValue({ data: mockCopilotResponse });
      
      (Octokit as jest.MockedClass<typeof Octokit>).mockImplementation(
        () =>
          ({
            request: mockRequest,
          }) as any
      );

      const mockNow = 1234567890000;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      const result = await fetchCopilotQuota('test-token');

      expect(Octokit).toHaveBeenCalledWith({ auth: 'test-token' });
      expect(mockRequest).toHaveBeenCalledWith('GET /copilot_internal/user');
      
      expect(result).toEqual({
        totalQuota: 1000,
        usedQuota: 500,
        resetDate: new Date('2024-02-01T00:00:00Z'),
        hasOverage: false,
        overageCount: 0,
      });

      expect(quotaStorage.setQuotaData).toHaveBeenCalledWith(JSON.stringify(result));
      expect(quotaStorage.setLastFetch).toHaveBeenCalledWith(mockNow);
      expect(updateCopilotWidgetWithData).toHaveBeenCalledWith(result, mockNow);

      jest.restoreAllMocks();
    });

    it('should calculate used quota correctly', async () => {
      const mockResponse: GitHubCopilotResponse = {
        quota_snapshots: {
          premium_interactions: {
            entitlement: 2000,
            percent_remaining: 25,
            overage_count: 0,
          },
        },
        quota_reset_date_utc: '2024-02-01T00:00:00Z',
      };

      const mockRequest = jest.fn().mockResolvedValue({ data: mockResponse });
      
      (Octokit as jest.MockedClass<typeof Octokit>).mockImplementation(
        () =>
          ({
            request: mockRequest,
          }) as any
      );

      const result = await fetchCopilotQuota('test-token');

      // 2000 * (1 - 25/100) = 2000 * 0.75 = 1500
      expect(result.usedQuota).toBe(1500);
      expect(result.totalQuota).toBe(2000);
    });

    it('should handle overage correctly', async () => {
      const mockResponse: GitHubCopilotResponse = {
        quota_snapshots: {
          premium_interactions: {
            entitlement: 1000,
            percent_remaining: 0,
            overage_count: 50,
          },
        },
        quota_reset_date_utc: '2024-02-01T00:00:00Z',
      };

      const mockRequest = jest.fn().mockResolvedValue({ data: mockResponse });
      
      (Octokit as jest.MockedClass<typeof Octokit>).mockImplementation(
        () =>
          ({
            request: mockRequest,
          }) as any
      );

      const result = await fetchCopilotQuota('test-token');

      expect(result.hasOverage).toBe(true);
      expect(result.overageCount).toBe(50);
    });

    it('should handle widget update failure gracefully', async () => {
      const mockRequest = jest.fn().mockResolvedValue({ data: mockCopilotResponse });
      
      (Octokit as jest.MockedClass<typeof Octokit>).mockImplementation(
        () =>
          ({
            request: mockRequest,
          }) as any
      );

      (updateCopilotWidgetWithData as jest.Mock).mockRejectedValue(
        new Error('Widget error')
      );

      // Should not throw even if widget update fails
      await expect(fetchCopilotQuota('test-token')).resolves.toBeDefined();
    });

    it('should throw error if API call fails', async () => {
      const mockError = new Error('API Error');
      const mockRequest = jest.fn().mockRejectedValue(mockError);
      
      (Octokit as jest.MockedClass<typeof Octokit>).mockImplementation(
        () =>
          ({
            request: mockRequest,
          }) as any
      );

      await expect(fetchCopilotQuota('test-token')).rejects.toThrow('API Error');
    });
  });
});
