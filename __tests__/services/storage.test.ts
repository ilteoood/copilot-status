import { StorageKeys, themeStorage } from '@/services/storage';

interface MockStorage {
  getString: jest.Mock;
  getNumber: jest.Mock;
  set: jest.Mock;
  remove: jest.Mock;
  clearAll: jest.Mock;
}

declare global {
  var mockStorageInstance: MockStorage;
}

const mockStorage = global.mockStorageInstance;

describe('services/storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('themeStorage', () => {
    it('should get theme preference', () => {
      const theme = 'dark';
      mockStorage.getString.mockReturnValue(theme);

      const result = themeStorage.getThemePreference();

      expect(mockStorage.getString).toHaveBeenCalledWith(StorageKeys.THEME_PREFERENCE);
      expect(result).toBe(theme);
    });

    it('should return "system" as default if theme preference does not exist', () => {
      mockStorage.getString.mockReturnValue(null);

      const result = themeStorage.getThemePreference();

      expect(result).toBe('system');
    });

    it('should set theme preference', () => {
      const theme = 'light';

      themeStorage.setThemePreference(theme);

      expect(mockStorage.set).toHaveBeenCalledWith(StorageKeys.THEME_PREFERENCE, theme);
    });
  });
});
