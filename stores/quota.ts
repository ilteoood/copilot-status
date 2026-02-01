import { quotaStorage, usernameStorage } from '@/services/storage';
import { clearCopilotWidget } from '@/widgets/voltraWidgetService';

export const useQuotaStore = () => ({
  clearQuota: () => {
    quotaStorage.clearQuotaData();
    usernameStorage.clearUsername();
    clearCopilotWidget().catch(() => {});
  },
});
