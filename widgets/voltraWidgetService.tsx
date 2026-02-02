import { QUERY_KEYS } from '@/hooks/useGitHub';
import { GitHubUser } from '@/services/api';
import i18n from '@/services/i18n';
import { queryClient } from '@/services/queryClient';
import { storage, StorageKeys } from '@/services/storage';
import type { QuotaInfo } from '@/types/quota';
import { formatFullDate } from '@/utils/dateTimeUtils';
import { Platform } from 'react-native';
import { VoltraAndroid } from 'voltra/android';
import {
  clearAndroidWidget,
  updateAndroidWidget,
  type AndroidWidgetVariants,
} from 'voltra/android/client';
import { clearWidget, updateWidget } from 'voltra/client';
import {
  getStatusColor,
  getTheme,
  IOSCopilotWidget,
  IOSCopilotWidgetError,
  prepareWidgetData,
  type WidgetData,
} from './VoltraCopilotWidget';
import { createWidgetStyles } from './widgetStyles';
import { formatPercent } from '@/utils/numberUtils';

const WIDGET_ID = 'copilot_status';
const DEEP_LINK_URL = 'xyz.ilteoood.copilotstatus://';

function getIsDarkMode(): boolean {
  const themePreference = storage.getString(StorageKeys.THEME_PREFERENCE) as
    | 'light'
    | 'dark'
    | 'system'
    | undefined;

  return themePreference !== 'light';
}

function getWidgetData(): { quota: QuotaInfo | null; username: string; lastFetch: number | null } {
  const queryState = queryClient.getQueryState<QuotaInfo>(QUERY_KEYS.COPILOT_QUOTA);
  const githubUser = queryClient.getQueryData<GitHubUser>(QUERY_KEYS.GITHUB_USER);

  return {
    quota: queryState?.data ?? null,
    username: githubUser?.login ?? '',
    lastFetch: queryState?.dataUpdatedAt ?? null,
  };
}

/**
 * Builds iOS widget variants for systemSmall and systemMedium
 */
function buildIOSWidgetVariants(
  quota: QuotaInfo | null,
  username: string,
  lastUpdated: string,
  isDarkMode: boolean
) {
  if (!quota) {
    return IOSCopilotWidgetError(isDarkMode);
  }

  const widgetData = {
    ...prepareWidgetData(quota, username, isDarkMode),
    lastUpdated,
  };

  return IOSCopilotWidget(widgetData, DEEP_LINK_URL);
}

/**
 * Builds Android widget variants with size breakpoints
 * Creates JSX directly to be processed by Voltra's renderer
 */
function buildAndroidWidgetVariants(
  quota: QuotaInfo | null,
  username: string,
  lastUpdated: string,
  isDarkMode: boolean
): AndroidWidgetVariants {
  const theme = getTheme(isDarkMode);
  const styles = createWidgetStyles(theme);

  if (!quota) {
    // Error state widget
    return [
      {
        size: { width: 250, height: 70 },
        content: (
          <VoltraAndroid.Column
            horizontalAlignment="center-horizontally"
            verticalAlignment="center-vertically"
            style={styles.androidContainer}
            deepLinkUrl={DEEP_LINK_URL}
          >
            <VoltraAndroid.Text style={styles.errorText}>
              {i18n.t('widget.signInToView')}
            </VoltraAndroid.Text>
          </VoltraAndroid.Column>
        ),
      },
    ];
  }

  const widgetData: WidgetData = {
    ...prepareWidgetData(quota, username, isDarkMode),
    lastUpdated,
  };

  const statusColor = getStatusColor(widgetData.percentUsed, isDarkMode);
  const remaining = widgetData.totalQuota - widgetData.usedQuota;

  return [
    {
      size: { width: 250, height: 70 },
      content: (
        <VoltraAndroid.Column
          horizontalAlignment="center-horizontally"
          verticalAlignment="center-vertically"
          style={styles.androidContainer}
          deepLinkUrl={DEEP_LINK_URL}
        >
          <VoltraAndroid.Row
            horizontalAlignment="center-horizontally"
            verticalAlignment="center-vertically"
            style={styles.row}
          >
            <VoltraAndroid.Column horizontalAlignment="center-horizontally" style={styles.column}>
              <VoltraAndroid.Text style={{ ...styles.largeValue, color: statusColor }}>
                {formatPercent(widgetData.percentUsed)}
              </VoltraAndroid.Text>
              <VoltraAndroid.Text style={styles.label}>
                {i18n.t('widget.usedLowercase')}
              </VoltraAndroid.Text>
            </VoltraAndroid.Column>
            <VoltraAndroid.Column horizontalAlignment="center-horizontally" style={styles.column}>
              <VoltraAndroid.Text style={{ ...styles.largeValue, color: theme.colors.text }}>
                {widgetData.usedQuota.toLocaleString()}
              </VoltraAndroid.Text>
              <VoltraAndroid.Text style={styles.label}>
                {i18n.t('widget.requestsUsed')}
              </VoltraAndroid.Text>
            </VoltraAndroid.Column>

            <VoltraAndroid.Column horizontalAlignment="center-horizontally" style={styles.column}>
              <VoltraAndroid.Text style={{ ...styles.largeValue, color: theme.colors.good }}>
                {remaining.toLocaleString()}
              </VoltraAndroid.Text>
              <VoltraAndroid.Text style={styles.label}>
                {i18n.t('widget.requestsLeft')}
              </VoltraAndroid.Text>
            </VoltraAndroid.Column>
          </VoltraAndroid.Row>

          <VoltraAndroid.Text style={styles.footerWithMargin}>
            {widgetData.username} - {widgetData.lastUpdated}
          </VoltraAndroid.Text>
        </VoltraAndroid.Column>
      ),
    },
  ];
}

/**
 * Updates the Copilot Status widget with current quota data
 * Uses platform-specific Voltra APIs
 */
export async function updateCopilotWidget(): Promise<void> {
  try {
    const { quota, username, lastFetch } = getWidgetData();
    const lastUpdated = formatFullDate(i18n.t, lastFetch);
    const isDarkMode = getIsDarkMode();

    if (Platform.OS === 'ios') {
      const variants = buildIOSWidgetVariants(quota, username, lastUpdated, isDarkMode);
      await updateWidget(WIDGET_ID, variants, { deepLinkUrl: DEEP_LINK_URL });
    } else if (Platform.OS === 'android') {
      const variants = buildAndroidWidgetVariants(quota, username, lastUpdated, isDarkMode);
      await updateAndroidWidget(WIDGET_ID, variants, { deepLinkUrl: DEEP_LINK_URL });
    }
  } catch {}
}

/**
 * Clears the widget data, showing the sign-in required state
 */
export async function clearCopilotWidget(): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      await clearWidget(WIDGET_ID);
    } else if (Platform.OS === 'android') {
      await clearAndroidWidget(WIDGET_ID);
    }
  } catch {}
}
