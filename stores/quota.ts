import { queryClient } from '@/services/queryClient';
import { clearCopilotWidget } from '@/widgets/voltraWidgetService';

export const useQuotaStore = () => ({
  clearQuota: () => {
    queryClient.clear();
    clearCopilotWidget();
  },
});
