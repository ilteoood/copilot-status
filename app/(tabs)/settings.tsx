import { RadioButton } from '@/components/RadioButton';
import { useGitHubUser } from '@/hooks/useGitHub';
import { BACKGROUND_FETCH_INTERVALS, updateBackgroundTaskInterval } from '@/services/backgroundTask';
import { backgroundFetchStorage, themeStorage, type BackgroundFetchInterval, type ThemePreference } from '@/services/storage';
import { useAuthStore } from '@/stores/auth';
import { useQuotaStore } from '@/stores/quota';
import { updateCopilotWidget } from '@/widgets/voltraWidgetService';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { StyleSheet, UnistylesRuntime, useUnistyles } from 'react-native-unistyles';

export default function SettingsScreen() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const { signOut } = useAuthStore();
  const { clearQuota } = useQuotaStore();
  const { data: user } = useGitHubUser();
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const [themePreference, setThemePreference] = useState<ThemePreference>(() => themeStorage.getThemePreference());
  const [fetchInterval, setFetchInterval] = useState<BackgroundFetchInterval>(() => backgroundFetchStorage.getInterval());

  const handleThemeChange = async (newTheme: ThemePreference) => {
    setThemePreference(newTheme);
    themeStorage.setThemePreference(newTheme);

    if (newTheme === 'system') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(newTheme);
    }

    updateCopilotWidget()
  };

  const handleFetchIntervalChange = async (interval: BackgroundFetchInterval) => {
    setFetchInterval(interval);
    await updateBackgroundTaskInterval(interval);
  };

  const getIntervalIcon = (interval: BackgroundFetchInterval): 'timer-outline' | 'pause-circle-outline' => {
    return interval === 0 ? 'pause-circle-outline' : 'timer-outline';
  };

  const handleSignOut = () => {
    Alert.alert(
      t('settings.signOutConfirmTitle'),
      t('settings.signOutConfirmMessage'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('settings.signOut'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            clearQuota();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const avatarUrl = user?.login ? `https://github.com/${user.login}.png` : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.userCard}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={32} color={theme.colors.icon} />
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user?.name ?? user?.login ?? t('common.unknown')}</Text>
            <Text style={styles.userSubtitle}>{t('settings.signedInAs', { username: user?.login ?? t('common.unknown') })}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
        <View style={styles.sectionContent}>
          <RadioButton value="light" i18nPrefix="settings" selected={themePreference === 'light'} onSelect={handleThemeChange} icon='sunny-outline'  />
          <View style={styles.separator} />
          <RadioButton value="dark" i18nPrefix="settings" selected={themePreference === 'dark'} onSelect={handleThemeChange} icon='moon-outline' />
          <View style={styles.separator} />
          <RadioButton value="system" i18nPrefix="settings" selected={themePreference === 'system'} onSelect={handleThemeChange} icon='phone-portrait-outline' />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.backgroundFetch')}</Text>
        <View style={styles.sectionContent}>
          {BACKGROUND_FETCH_INTERVALS.map((interval, index) => (
            <React.Fragment key={interval}>
              {index > 0 && <View style={styles.separator} />}
              <RadioButton
                value={interval}
                i18nPrefix="settings.interval"
                selected={fetchInterval === interval}
                onSelect={handleFetchIntervalChange}
                icon={getIntervalIcon(interval)}
                />
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.actions')}</Text>
        <View style={styles.sectionContent}>
          <TouchableOpacity style={styles.row} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={theme.colors.critical} />
            <Text style={[styles.rowText, styles.destructiveText]}>{t('settings.signOut')}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        <View style={styles.sectionContent}>
          <View style={styles.row}>
            <Ionicons name="information-circle-outline" size={22} color={theme.colors.text} />
            <Text style={styles.rowText}>{t('settings.appName')}</Text>
            <Text style={styles.rowValue}>{t('common.appName')}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Ionicons name="code-outline" size={22} color={theme.colors.text} />
            <Text style={styles.rowText}>{t('settings.version')}</Text>
            <Text style={styles.rowValue}>{appVersion}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    paddingBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes['5xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.icon,
    marginBottom: theme.spacing.xs,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: theme.spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: '#FFFFFF1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
  },
  rowText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  username: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.icon,
  },
  rowValue: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.icon,
  },
  destructiveText: {
    color: theme.colors.critical,
  },
  separator: {
    height: 1,
    backgroundColor: '#FFFFFF14',
    marginLeft: 50,
  },
}));
