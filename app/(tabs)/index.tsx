import { CachedBanner } from '@/components/CachedBanner';
import { QuotaDisplay } from '@/components/QuotaDisplay';
import { useQuota } from '@/hooks/useQuota';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export default function DashboardScreen() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { quota, lastFetch, isFetching, error, isCached, fetchQuota } = useQuota();

  if (isFetching && !quota) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
        <Text style={styles.loadingText}>{t('dashboard.loadingQuota')}</Text>
      </View>
    );
  }

  if (error && !quota) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>{t('dashboard.unableToLoad')}</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!quota) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t('dashboard.noDataAvailable')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('dashboard.title')}</Text>
        <CachedBanner lastFetch={lastFetch} visible={isCached} />
      </View>
      <QuotaDisplay quota={quota} onRefresh={fetchQuota} isRefreshing={isFetching} />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes['5xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.icon,
  },
  errorTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.icon,
    textAlign: 'center',
  },
}));
