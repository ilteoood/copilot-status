import type { QuotaInfo } from '@/types/quota';
import { formatFullDate } from '@/utils/dateTimeUtils';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, View } from 'react-native';
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
        {quota.unlimited ? (
          <StatsCard
            icon="infinite-outline"
            label={t('quota.unlimited')}
            value={'∞'}
            color={theme.colors.tint}
          />
        ) : (
          <>
            <StatsCard
              icon="code-slash"
              label={t('quota.completionsUsed')}
              value={quota.usedQuota}
              color={theme.colors.good}
            />
            <StatsCard
              icon="code-working-outline"
              label={t('quota.remaining')}
              value={quota.remainingQuota}
              color={theme.colors.warning}
            />
            <StatsCard
              icon="stop-circle"
              label={t('quota.totalLimit')}
              value={quota.totalQuota}
              color={theme.colors.critical}
            />
          </>
        )}

        <StatsCard
          icon="calendar-outline"
          label={t('quota.resetsAt')}
          value={formatFullDate(t, quota.resetDate)}
          color={theme.colors.tint}
        />
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
  unlimitedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  unlimitedIcon: {
    fontSize: 120,
    color: theme.colors.tint,
    fontWeight: theme.typography.fontWeights.normal,
  },
  unlimitedText: {
    fontSize: theme.typography.fontSizes['2xl'],
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.semibold,
    marginTop: theme.spacing.md,
  },
}));
