'use client';

import { CachedBanner } from '@/components/CachedBanner';
import { QuotaValues } from '@/components/QuotaValues';
import { useCopilotQuota } from '@/hooks/useGitHub';
import type { QuotaType } from '@/types/quota';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface QuotaScreenProps {
  quotaType: QuotaType;
}

export function QuotaDisplay({ quotaType }: QuotaScreenProps) {
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
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t('dashboard.title')}</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <CachedBanner lastFetch={lastFetch} visible={isCached} />
      </View>

      <View style={styles.content}>
        <QuotaValues quota={quotas[quotaType]} onRefresh={refetch} isRefreshing={isFetching} />
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes['5xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  settingsButton: {
    padding: theme.spacing.sm,
  },
  content: {
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
