import { createMMKV, type MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const StorageKeys = {
  QUOTA_DATA: 'quota_data',
  LAST_FETCH: 'last_fetch',
  SYNC_STATUS: 'sync_status',
  THEME_PREFERENCE: 'theme_preference',
  USERNAME: 'username',
  BACKGROUND_FETCH_INTERVAL: 'background_fetch_interval',
} as const;

export const storage: MMKV = createMMKV({
  id: 'copilot-status-storage',
});

export const zustandStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown): void => {
    storage.set(name, JSON.stringify(value));
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const quotaStorage = {
  getQuotaData: (): string | null => {
    const value = storage.getString(StorageKeys.QUOTA_DATA);
    return value ?? null;
  },
  setQuotaData: (data: string): void => {
    storage.set(StorageKeys.QUOTA_DATA, data);
  },
  clearQuotaData: (): void => {
    storage.remove(StorageKeys.QUOTA_DATA);
  },
  getLastFetch: (): number | null => {
    const value = storage.getNumber(StorageKeys.LAST_FETCH);
    return value ?? null;
  },
  setLastFetch: (timestamp: number): void => {
    storage.set(StorageKeys.LAST_FETCH, timestamp);
  },
  clearAll: (): void => {
    storage.clearAll();
  },
};

export const usernameStorage = {
  getUsername: (): string | null => {
    return storage.getString(StorageKeys.USERNAME) ?? null;
  },
  setUsername: (username: string): void => {
    storage.set(StorageKeys.USERNAME, username);
  },
  clearUsername: (): void => {
    storage.remove(StorageKeys.USERNAME);
  },
};

export const themeStorage = {
  getThemePreference: (): ThemePreference => {
    const value = storage.getString(StorageKeys.THEME_PREFERENCE) as ThemePreference | null;
    return value ?? 'system';
  },
  setThemePreference: (theme: ThemePreference): void => {
    storage.set(StorageKeys.THEME_PREFERENCE, theme);
  },
};

export type BackgroundFetchInterval = 0 | 5 | 15 | 30 | 60;

export type ThemePreference = 'light' | 'dark' | 'system';

export const backgroundFetchStorage = {
  getInterval: (): BackgroundFetchInterval => {
    const value = storage.getString(StorageKeys.BACKGROUND_FETCH_INTERVAL);
    const numValue = value ? parseInt(value, 10) : null;
    return (numValue ?? 15) as BackgroundFetchInterval;
  },
  setInterval: (interval: BackgroundFetchInterval): void => {
    storage.set(StorageKeys.BACKGROUND_FETCH_INTERVAL, String(interval));
  },
};

export const platformStorage: StateStorage = zustandStorage;
