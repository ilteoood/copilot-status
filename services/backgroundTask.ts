import { QUERY_KEYS } from '@/hooks/useGitHub';
import { queryClient } from '@/services/queryClient';
import { getStoredToken } from '@/stores/secureStorage';
import { updateCopilotWidgetWithData } from '@/widgets/voltraWidgetService';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { fetchCopilotQuota } from './api';
import { backgroundFetchStorage, quotaStorage, type BackgroundFetchInterval } from './storage';

export const BACKGROUND_TASK_NAME = 'copilot-quota-background-task';

export const BACKGROUND_FETCH_INTERVALS: BackgroundFetchInterval[] = [0, 5, 15, 30, 60];

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const token = await getStoredToken();
    if (!token) {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }

    const quota = await fetchCopilotQuota(token);
    const now = Date.now();

    // Update query cache
    queryClient.setQueryData(QUERY_KEYS.COPILOT_QUOTA, quota);

    // Store quota data for widget access
    quotaStorage.setQuotaData(JSON.stringify(quota));
    quotaStorage.setLastFetch(now);

    // Update widget with fresh data
    await updateCopilotWidgetWithData(quota, now);

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundTaskAsync(
  interval?: BackgroundFetchInterval
): Promise<void> {
  const fetchInterval = interval ?? backgroundFetchStorage.getInterval();

  // If interval is 0 (never), unregister the task
  if (fetchInterval === 0) {
    await unregisterBackgroundTaskAsync();
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);

  // Unregister first if already registered to apply new interval
  if (isRegistered) {
    await BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_NAME);
  }

  // minimumInterval is in minutes for expo-background-task
  await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
    minimumInterval: fetchInterval,
  });
}

export async function unregisterBackgroundTaskAsync(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);

  if (!isRegistered) {
    return;
  }

  await BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_NAME);
}

export async function updateBackgroundTaskInterval(
  interval: BackgroundFetchInterval
): Promise<void> {
  backgroundFetchStorage.setInterval(interval);
  await registerBackgroundTaskAsync(interval);
}

export async function getBackgroundTaskStatusAsync(): Promise<{
  status: BackgroundTask.BackgroundTaskStatus | null;
  isRegistered: boolean;
}> {
  const status = await BackgroundTask.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);

  return { status, isRegistered };
}

export function isBackgroundTaskAvailable(
  status: BackgroundTask.BackgroundTaskStatus | null
): boolean {
  return status === BackgroundTask.BackgroundTaskStatus.Available;
}
