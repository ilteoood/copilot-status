import { registerBackgroundTaskAsync } from '@/services/backgroundTask';
import '@/services/i18n';
import { persistOptions, queryClient } from '@/services/queryClient';
import { ThemePreference, themeStorage } from '@/services/storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack, router, useRootNavigationState, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

import { useAuthStore } from '@/stores/auth';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function useProtectedRoute() {
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      registerBackgroundTaskAsync().catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!navigationState?.key || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading, navigationState?.key]);

  return { isLoading };
}

const statusBarColor: Record<ThemePreference, 'light' | 'dark' | 'auto'> = {
  light: 'light',
  dark: 'dark',
  system: 'auto'
}

export default function RootLayout() {
  const { isLoading } = useProtectedRoute();

  useEffect(() => {
    const storedTheme = themeStorage.getThemePreference();
    if (storedTheme === 'system') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(storedTheme);
    }
  }, []);

  const navigationTheme = UnistylesRuntime.themeName === 'dark' ? DarkTheme : DefaultTheme;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      <ThemeProvider value={navigationTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style={statusBarColor[UnistylesRuntime.themeName ?? 'system']} />
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create(theme => ({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
}));
