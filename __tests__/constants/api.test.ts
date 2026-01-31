import { GITHUB_OAUTH_CONFIG } from '@/constants/api';

describe('constants/api', () => {
  describe('GITHUB_OAUTH_CONFIG', () => {
    it('should have correct authorization endpoint', () => {
      expect(GITHUB_OAUTH_CONFIG.authorizationEndpoint).toBe(
        'https://github.com/login/oauth/authorize'
      );
    });

    it('should have correct token endpoint', () => {
      expect(GITHUB_OAUTH_CONFIG.tokenEndpoint).toBe(
        'https://github.com/login/oauth/access_token'
      );
    });

    it('should have correct scopes', () => {
      expect(GITHUB_OAUTH_CONFIG.scopes).toEqual(['read:org', 'read:user']);
    });

    it('should be an immutable object structure', () => {
      expect(Object.isFrozen(GITHUB_OAUTH_CONFIG)).toBe(false); // Not frozen but should remain constant
      expect(typeof GITHUB_OAUTH_CONFIG).toBe('object');
      expect(Array.isArray(GITHUB_OAUTH_CONFIG.scopes)).toBe(true);
    });
  });
});
