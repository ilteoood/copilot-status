// Voltra-based widget components and services
export {
  getStatusColor,
  getTheme,
  IOSCopilotWidget,
  IOSCopilotWidgetError,
  IOSCopilotWidgetLoading,
  prepareWidgetData,
  type WidgetData
} from './VoltraCopilotWidget';

export {
  clearCopilotWidget,
  updateCopilotWidget,
  updateCopilotWidgetWithData
} from './voltraWidgetService';

// Re-export background task utilities for widget data refresh
export {
  BACKGROUND_FETCH_INTERVALS,
  BACKGROUND_TASK_NAME,
  getBackgroundTaskStatusAsync,
  isBackgroundTaskAvailable,
  registerBackgroundTaskAsync,
  unregisterBackgroundTaskAsync,
  updateBackgroundTaskInterval
} from '../services/backgroundTask';
