import type { QuotaInfo } from '@/types/quota';
import { formatFullDate } from '@/utils/dateTimeUtils';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { CircularProgress } from './CircularProgress';
import { StatsCard } from './StatsCard';

interface QuotaDisplayProps {
  quota: QuotaInfo;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function QuotaDisplay({ quota, onRefresh, isRefreshing }: QuotaDisplayProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const remaining = quota.totalQuota - quota.usedQuota;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.text}
        />
      }
    >
      <View style={styles.progressContainer}>
        <CircularProgress usedQuota={quota.usedQuota} totalQuota={quota.totalQuota} size={200} />
      </View>

      <View style={styles.statsContainer}>
        <StatsCard
          icon="code-slash"
          label={t('quota.completionsUsed')}
          value={quota.usedQuota}
          color={theme.colors.good}
        />
        <StatsCard
          icon="code-working-outline"
          label={t('quota.remaining')}
          value={remaining}
          color={theme.colors.warning}
        />
        <StatsCard
          icon="stop-circle"
          label={t('quota.totalLimit')}
          value={quota.totalQuota}
          color={theme.colors.critical}
        />
        <View style={styles.resetContainer}>
          <Text style={styles.resetLabel}>{t('quota.resetsAt')}</Text>
          <Text style={styles.resetDate}>{formatFullDate(t, quota.resetDate.getTime())}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  statsContainer: {
    gap: theme.spacing.sm,
  },
  resetContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  resetLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.icon,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.xs,
  },
  resetDate: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.semibold,
  },
}));
