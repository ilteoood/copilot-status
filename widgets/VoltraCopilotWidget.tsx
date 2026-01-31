import i18n from '@/services/i18n';
import { themes, type Theme } from '@/src/styles/unistyles';
import type { QuotaInfo } from '@/types/quota';
import { Voltra } from 'voltra';
import { VoltraAndroid } from 'voltra/android';
import { createWidgetStyles } from './widgetStyles';

export interface WidgetData {
  username: string;
  usedQuota: number;
  totalQuota: number;
  percentUsed: number;
  lastUpdated: string;
  isDarkMode: boolean;
}

export function getTheme(isDarkMode: boolean): Theme {
  return isDarkMode ? themes.dark : themes.light;
}

export function getStatusColor(percentUsed: number, isDarkMode: boolean) {
  const theme = getTheme(isDarkMode);
  if (percentUsed > 90) return theme.colors.critical;
  if (percentUsed >= 75) return theme.colors.warning;
  return theme.colors.good;
}

export function IOSCopilotWidget(data: WidgetData) {
  const theme = getTheme(data.isDarkMode);
  const styles = createWidgetStyles(theme);
  const statusColor = getStatusColor(data.percentUsed, data.isDarkMode);
  const remaining = data.totalQuota - data.usedQuota;

  const smallWidget = (
    <Voltra.VStack spacing={4} alignment="center" style={styles.smallContainer}>
      <Voltra.HStack spacing={16} alignment="center">
        <Voltra.VStack spacing={2} alignment="center">
          <Voltra.Text style={{ ...styles.largeValue, color: statusColor }}>
            {Math.round(data.percentUsed)}%
          </Voltra.Text>
          <Voltra.Text style={styles.label}>{i18n.t('widget.usedLowercase')}</Voltra.Text>
        </Voltra.VStack>

        <Voltra.VStack spacing={2} alignment="center">
          <Voltra.Text style={{ ...styles.mediumValue, color: theme.colors.good }}>
            {remaining.toLocaleString()}
          </Voltra.Text>
          <Voltra.Text style={styles.label}>{i18n.t('widget.requestsLeft')}</Voltra.Text>
        </Voltra.VStack>
      </Voltra.HStack>

      <Voltra.Text style={styles.smallFooter}>{data.username}</Voltra.Text>
    </Voltra.VStack>
  );

  const mediumWidget = (
    <Voltra.VStack spacing={8} alignment="center" style={styles.container}>
      <Voltra.HStack spacing={16} alignment="center">
        <Voltra.VStack spacing={2} alignment="center">
          <Voltra.Text style={{ ...styles.largeValue, color: statusColor }}>
            {Math.round(data.percentUsed)}%
          </Voltra.Text>
          <Voltra.Text style={styles.label}>{i18n.t('widget.usedLowercase')}</Voltra.Text>
        </Voltra.VStack>

        <Voltra.VStack spacing={2} alignment="center">
          <Voltra.Text style={{ ...styles.largeValue, color: theme.colors.text }}>
            {data.usedQuota.toLocaleString()}
          </Voltra.Text>
          <Voltra.Text style={styles.label}>{i18n.t('widget.requestsUsed')}</Voltra.Text>
        </Voltra.VStack>

        <Voltra.VStack spacing={2} alignment="center">
          <Voltra.Text style={{ ...styles.mediumValue, color: theme.colors.good }}>
            {remaining.toLocaleString()}
          </Voltra.Text>
          <Voltra.Text style={styles.label}>{i18n.t('widget.requestsLeft')}</Voltra.Text>
        </Voltra.VStack>
      </Voltra.HStack>

      <Voltra.Text style={styles.footer}>
        {data.username} - {data.lastUpdated}
      </Voltra.Text>
    </Voltra.VStack>
  );

  return {
    systemSmall: smallWidget,
    systemMedium: mediumWidget,
  };
}

export function IOSCopilotWidgetLoading(isDarkMode: boolean) {
  const theme = getTheme(isDarkMode);
  const styles = createWidgetStyles(theme);

  const loadingWidget = (
    <Voltra.VStack alignment="center" style={styles.container}>
      <Voltra.Text style={styles.loadingText}>{i18n.t('widget.loading')}</Voltra.Text>
    </Voltra.VStack>
  );

  return {
    systemSmall: loadingWidget,
    systemMedium: loadingWidget,
  };
}

export function IOSCopilotWidgetError(isDarkMode: boolean) {
  const theme = getTheme(isDarkMode);
  const styles = createWidgetStyles(theme);

  const errorWidget = (
    <Voltra.VStack alignment="center" style={styles.container}>
      <Voltra.Text style={styles.errorText}>{i18n.t('widget.signInToView')}</Voltra.Text>
    </Voltra.VStack>
  );

  return {
    systemSmall: errorWidget,
    systemMedium: errorWidget,
  };
}

/**
 * Android Copilot Widget - uses VoltraAndroid components
 * Maps to Jetpack Compose Glance on Android (Column, Row, Text)
 */
export function AndroidCopilotWidget(data: WidgetData) {
  const theme = getTheme(data.isDarkMode);
  const styles = createWidgetStyles(theme);
  const statusColor = getStatusColor(data.percentUsed, data.isDarkMode);
  const remaining = data.totalQuota - data.usedQuota;

  return (
    <VoltraAndroid.Column
      horizontalAlignment="center-horizontally"
      verticalAlignment="center-vertically"
      style={styles.androidContainer}
    >
      <VoltraAndroid.Row
        horizontalAlignment="center-horizontally"
        verticalAlignment="center-vertically"
        style={styles.row}
      >
        <VoltraAndroid.Column horizontalAlignment="center-horizontally" style={styles.column}>
          <VoltraAndroid.Text style={{ ...styles.largeValue, color: statusColor }}>
            {Math.round(data.percentUsed)}%
          </VoltraAndroid.Text>
          <VoltraAndroid.Text style={styles.label}>
            {i18n.t('widget.usedLowercase')}
          </VoltraAndroid.Text>
        </VoltraAndroid.Column>

        <VoltraAndroid.Column horizontalAlignment="center-horizontally" style={styles.column}>
          <VoltraAndroid.Text style={{ ...styles.largeValue, color: theme.colors.text }}>
            {data.usedQuota.toLocaleString()}
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
        {data.username} - {data.lastUpdated}
      </VoltraAndroid.Text>
    </VoltraAndroid.Column>
  );
}

export function AndroidCopilotWidgetLoading(isDarkMode: boolean) {
  const theme = getTheme(isDarkMode);
  const styles = createWidgetStyles(theme);

  return (
    <VoltraAndroid.Column
      horizontalAlignment="center-horizontally"
      verticalAlignment="center-vertically"
      style={styles.androidContainer}
    >
      <VoltraAndroid.Text style={styles.loadingText}>{i18n.t('widget.loading')}</VoltraAndroid.Text>
    </VoltraAndroid.Column>
  );
}

export function AndroidCopilotWidgetError(isDarkMode: boolean) {
  const theme = getTheme(isDarkMode);
  const styles = createWidgetStyles(theme);

  return (
    <VoltraAndroid.Column
      horizontalAlignment="center-horizontally"
      verticalAlignment="center-vertically"
      style={styles.androidContainer}
    >
      <VoltraAndroid.Text style={styles.errorText}>
        {i18n.t('widget.signInToView')}
      </VoltraAndroid.Text>
    </VoltraAndroid.Column>
  );
}

export function prepareWidgetData(
  quota: QuotaInfo,
  username: string,
  isDarkMode: boolean
): WidgetData {
  const percentUsed = quota.totalQuota > 0 ? (quota.usedQuota / quota.totalQuota) * 100 : 0;
  const lastUpdated = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    username,
    usedQuota: quota.usedQuota,
    totalQuota: quota.totalQuota,
    percentUsed,
    lastUpdated,
    isDarkMode,
  };
}
