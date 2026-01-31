import { quotaStorage, usernameStorage } from '@/services/storage';
import { clearCopilotWidget } from '@/widgets/voltraWidgetService';
import { create } from 'zustand';

interface QuotaState {
  clearQuota: () => void;
}

export const useQuotaStore = create<QuotaState>()(() => ({
  clearQuota: () => {
    quotaStorage.clearQuotaData();
    usernameStorage.clearUsername();
    clearCopilotWidget().catch(() => {});
  },
}));
