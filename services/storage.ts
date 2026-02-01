import { createMMKV, type MMKV } from 'react-native-mmkv';

export const StorageKeys = {
  QUOTA_DATA: 'quota_data',
  LAST_FETCH: 'last_fetch',
  SYNC_STATUS: 'sync_status',
  THEME_PREFERENCE: 'theme_preference',
  USERNAME: 'username',
} as const;

export const storage: MMKV = createMMKV({
  id: 'copilot-status-storage',
});

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

export type ThemePreference = 'light' | 'dark' | 'system';
