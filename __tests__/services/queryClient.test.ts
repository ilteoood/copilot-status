import { queryClient, persistOptions } from '@/services/queryClient';

describe('services/queryClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('queryClient', () => {
    it('should be an instance of QueryClient', () => {
      expect(queryClient).toBeDefined();
      expect(queryClient.getDefaultOptions()).toBeDefined();
    });

    it('should have correct query default options', () => {
      const options = queryClient.getDefaultOptions();

      expect(options.queries?.retry).toBe(2);
      expect(options.queries?.staleTime).toBe(5 * 60 * 1000);
      expect(options.queries?.gcTime).toBe(24 * 60 * 60 * 1000);
      expect(options.queries?.refetchOnWindowFocus).toBe(false);
      expect(options.queries?.refetchOnReconnect).toBe(true);
      expect(options.queries?.refetchOnMount).toBe(true);
      expect(options.queries?.networkMode).toBe('offlineFirst');
    });

    it('should have correct mutation default options', () => {
      const options = queryClient.getDefaultOptions();

      expect(options.mutations?.retry).toBe(1);
      expect(options.mutations?.networkMode).toBe('offlineFirst');
    });

    it('should have correct retryDelay function', () => {
      const options = queryClient.getDefaultOptions();
      const retryDelay = options.queries?.retryDelay as (attemptIndex: number) => number;

      expect(retryDelay).toBeDefined();
      expect(typeof retryDelay).toBe('function');

      // Test retry delays
      expect(retryDelay(0)).toBe(1000); // 1000 * 2^0 = 1000
      expect(retryDelay(1)).toBe(2000); // 1000 * 2^1 = 2000
      expect(retryDelay(2)).toBe(4000); // 1000 * 2^2 = 4000
      expect(retryDelay(10)).toBe(30000); // Should be capped at 30000
    });
  });

  describe('persistOptions', () => {
    it('should have persister defined', () => {
      expect(persistOptions.persister).toBeDefined();
    });
  });
});
