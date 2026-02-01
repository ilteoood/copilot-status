import { createMMKV, type MMKV } from 'react-native-mmkv';

export const StorageKeys = {
  THEME_PREFERENCE: 'theme_preference',
} as const;

export const storage: MMKV = createMMKV({
  id: 'copilot-status-storage',
});

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
