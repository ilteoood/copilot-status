import { queryClient } from '@/services/queryClient';
import { useQuotaStore } from '@/stores/quota';
import { clearCopilotWidget } from '@/widgets/voltraWidgetService';

jest.mock('@/services/queryClient', () => ({
  queryClient: {
    clear: jest.fn(),
  },
}));

describe('stores/quota', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useQuotaStore', () => {
    it('should clear queryClient when clearQuota is called', () => {
      const store = useQuotaStore();
      store.clearQuota();

      expect(queryClient.clear).toHaveBeenCalled();
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
