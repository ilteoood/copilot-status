import { CachedBanner } from '@/components/CachedBanner';
import { QuotaDisplay } from '@/components/QuotaDisplay';
import { useCopilotQuota } from '@/hooks/useGitHub';
import type { QuotaType } from '@/types/quota';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const QUOTA_TYPES: QuotaType[] = ['premium_interactions', 'chat', 'completions'];

export default function DashboardScreen() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const {
    data: quotas,
    dataUpdatedAt: lastFetch,
    isFetching,
    error,
    isCached,
    refetch,
  } = useCopilotQuota();
  const [currentPage, setCurrentPage] = useState(0);

  if (isFetching && !quotas) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.tint} />
        <Text style={styles.loadingText}>{t('dashboard.loadingQuota')}</Text>
      </View>
    );
  }

  if (error?.message && !quotas) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>{t('dashboard.unableToLoad')}</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  if (!quotas) {
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

      <View style={styles.tabsContainer}>
        {QUOTA_TYPES.map((type, index) => (
          <Pressable
            key={type}
            style={[styles.tab, currentPage === index && styles.activeTab]}
            onPress={() => setCurrentPage(index)}
          >
            <Text style={[styles.tabText, currentPage === index && styles.activeTabText]}>
              {t(`quota.types.${type}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      <PagerView
        style={styles.pagerView}
        key={currentPage}
        initialPage={currentPage}
        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
      >
        {QUOTA_TYPES.map(type => (
          <View key={type} style={styles.page}>
            <QuotaDisplay quota={quotas[type]} onRefresh={refetch} isRefreshing={isFetching} />
          </View>
        ))}
      </PagerView>
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.tint,
  },
  tabText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.icon,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
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
