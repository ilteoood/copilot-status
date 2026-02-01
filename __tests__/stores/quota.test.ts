import { quotaStorage, usernameStorage } from '@/services/storage';
import { useQuotaStore } from '@/stores/quota';
import { clearCopilotWidget } from '@/widgets/voltraWidgetService';

jest.mock('@/services/storage', () => ({
  quotaStorage: {
    clearQuotaData: jest.fn(),
  },
  usernameStorage: {
    clearUsername: jest.fn(),
  },
}));

jest.mock('@/widgets/voltraWidgetService', () => ({
  clearCopilotWidget: jest.fn(() => Promise.resolve()),
}));

describe('stores/quota', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useQuotaStore', () => {
    it('should have clearQuota method', () => {
      const store = useQuotaStore();
      expect(store.clearQuota).toBeDefined();
      expect(typeof store.clearQuota).toBe('function');
    });

    it('should clear quota data when clearQuota is called', () => {
      const store = useQuotaStore();
      store.clearQuota();

      expect(quotaStorage.clearQuotaData).toHaveBeenCalled();
    });

    it('should clear username when clearQuota is called', () => {
      const store = useQuotaStore();
      store.clearQuota();

      expect(usernameStorage.clearUsername).toHaveBeenCalled();
    });

    it('should clear copilot widget when clearQuota is called', () => {
      const store = useQuotaStore();
      store.clearQuota();

      expect(clearCopilotWidget).toHaveBeenCalled();
    });

    it('should handle widget clear failure gracefully', () => {
      (clearCopilotWidget as jest.Mock).mockRejectedValue(new Error('Widget error'));

      const store = useQuotaStore();

      expect(() => store.clearQuota()).not.toThrow();
    });
  });
});
