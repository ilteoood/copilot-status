import i18n from '@/services/i18n';
import { quotaStorage, storage, StorageKeys, usernameStorage } from '@/services/storage';
import type { QuotaInfo } from '@/types/quota';
import { formatFullDate, formatTime } from '@/utils/dateTimeUtils';
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

const WIDGET_ID = 'copilot_status';
const DEEP_LINK_URL = 'xyz.ilteoood.copilotstatus://';

function getIsDarkMode(): boolean {
  const themePreference = storage.getString(StorageKeys.THEME_PREFERENCE) as
    | 'light'
    | 'dark'
    | 'system'
    | undefined;

  // For widgets, default to dark if system or undefined
  if (themePreference === 'light') {
    return false;
  }
  return true;
}

function getWidgetData(): { quota: QuotaInfo | null; username: string; lastFetch: number | null } {
  const quotaDataStr = quotaStorage.getQuotaData();
  const lastFetch = quotaStorage.getLastFetch();
  const username = usernameStorage.getUsername() ?? '';

  try {
    const quota = quotaDataStr ? (JSON.parse(quotaDataStr) as QuotaInfo) : null;
    return { quota, username, lastFetch };
  } catch {
    return { quota: null, username, lastFetch: null };
  }
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
                {Math.round(widgetData.percentUsed)}%
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
    const lastUpdated = formatTime(i18n.t, lastFetch);
    const isDarkMode = getIsDarkMode();

    if (Platform.OS === 'ios') {
      const variants = buildIOSWidgetVariants(quota, username, lastUpdated, isDarkMode);
      await updateWidget(WIDGET_ID, variants, {
        deepLinkUrl: DEEP_LINK_URL,
      });
    } else if (Platform.OS === 'android') {
      const variants = buildAndroidWidgetVariants(quota, username, lastUpdated, isDarkMode);
      await updateAndroidWidget(WIDGET_ID, variants, {
        deepLinkUrl: DEEP_LINK_URL,
      });
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

/**
 * Updates widget with new quota data directly
 * Used when quota data is already available (e.g., after API fetch)
 */
export async function updateCopilotWidgetWithData(
  quota: QuotaInfo,
  lastFetch: number
): Promise<void> {
  try {
    const lastUpdated = formatFullDate(i18n.t, lastFetch);
    const isDarkMode = getIsDarkMode();
    const username = usernameStorage.getUsername() ?? '';

    if (Platform.OS === 'ios') {
      const variants = buildIOSWidgetVariants(quota, username, lastUpdated, isDarkMode);
      await updateWidget(WIDGET_ID, variants, {
        deepLinkUrl: DEEP_LINK_URL,
      });
    } else if (Platform.OS === 'android') {
      const variants = buildAndroidWidgetVariants(quota, username, lastUpdated, isDarkMode);
      await updateAndroidWidget(WIDGET_ID, variants, {
        deepLinkUrl: DEEP_LINK_URL,
      });
    }
  } catch (error) {
    console.error('[VoltraWidget] Failed to update widget with data:', error);
  }
}
