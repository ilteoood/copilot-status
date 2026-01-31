import { exchangeCodeForToken } from '@/services/auth';
import { GITHUB_OAUTH_CONFIG } from '@/constants/api';
import Constants from 'expo-constants';

global.fetch = jest.fn();

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        githubClientId: 'test-client-id',
        githubClientSecret: 'test-client-secret',
      },
    },
  },
}));

describe('services/auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange code for access token successfully', async () => {
      const mockResponse = {
        access_token: 'test-access-token',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await exchangeCodeForToken('test-code');

      expect(global.fetch).toHaveBeenCalledWith(
        GITHUB_OAUTH_CONFIG.tokenEndpoint,
        expect.objectContaining({
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('test-code'),
        })
      );

      expect(result).toBe('test-access-token');
    });

    it('should include code verifier when provided', async () => {
      const mockResponse = {
        access_token: 'test-access-token',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      await exchangeCodeForToken('test-code', 'test-verifier');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.code_verifier).toBe('test-verifier');
    });

    it('should include client credentials and redirect URI', async () => {
      const mockResponse = {
        access_token: 'test-access-token',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      await exchangeCodeForToken('test-code');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.client_id).toBeDefined();
      expect(body.client_secret).toBeDefined();
      expect(body.code).toBe('test-code');
      expect(body.redirect_uri).toBe('http://localhost:19000');
    });

    it('should throw error when API returns error', async () => {
      const mockErrorResponse = {
        error: 'invalid_grant',
        error_description: 'The code is invalid',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockErrorResponse),
      });

      await expect(exchangeCodeForToken('invalid-code')).rejects.toThrow(
        'The code is invalid'
      );
    });

    it('should throw error with error code if no description provided', async () => {
      const mockErrorResponse = {
        error: 'invalid_grant',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockErrorResponse),
      });

      await expect(exchangeCodeForToken('invalid-code')).rejects.toThrow('invalid_grant');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(exchangeCodeForToken('test-code')).rejects.toThrow('Network error');
    });
  });
});
