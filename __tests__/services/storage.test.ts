import { 
  zustandStorage, 
  quotaStorage, 
  usernameStorage, 
  themeStorage 
} from '@/services/storage';
import { StorageKeys } from '@/services/storage';

const mockStorage = global.mockStorageInstance;

describe('services/storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('zustandStorage', () => {
    it('should get item and parse JSON', () => {
      const testData = { value: 'test' };
      mockStorage.getString.mockReturnValue(JSON.stringify(testData));

      const result = zustandStorage.getItem('test-key');
      
      expect(mockStorage.getString).toHaveBeenCalledWith('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null if item does not exist', () => {
      mockStorage.getString.mockReturnValue(undefined);

      const result = zustandStorage.getItem('test-key');
      
      expect(result).toBeNull();
    });

    it('should set item with JSON stringification', () => {
      const testData = { value: 'test' };
      
      zustandStorage.setItem('test-key', testData);
      
      expect(mockStorage.set).toHaveBeenCalledWith('test-key', JSON.stringify(testData));
    });

    it('should remove item', () => {
      zustandStorage.removeItem('test-key');
      
      expect(mockStorage.remove).toHaveBeenCalledWith('test-key');
    });
  });

  describe('quotaStorage', () => {
    it('should get quota data', () => {
      const testData = '{"test": "data"}';
      mockStorage.getString.mockReturnValue(testData);

      const result = quotaStorage.getQuotaData();
      
      expect(mockStorage.getString).toHaveBeenCalledWith(StorageKeys.QUOTA_DATA);
      expect(result).toBe(testData);
    });

    it('should return null if quota data does not exist', () => {
      mockStorage.getString.mockReturnValue(undefined);

      const result = quotaStorage.getQuotaData();
      
      expect(result).toBeNull();
    });

    it('should set quota data', () => {
      const testData = '{"test": "data"}';
      
      quotaStorage.setQuotaData(testData);
      
      expect(mockStorage.set).toHaveBeenCalledWith(StorageKeys.QUOTA_DATA, testData);
    });

    it('should clear quota data', () => {
      quotaStorage.clearQuotaData();
      
      expect(mockStorage.remove).toHaveBeenCalledWith(StorageKeys.QUOTA_DATA);
    });

    it('should get last fetch timestamp', () => {
      const timestamp = 1234567890;
      mockStorage.getNumber.mockReturnValue(timestamp);

      const result = quotaStorage.getLastFetch();
      
      expect(mockStorage.getNumber).toHaveBeenCalledWith(StorageKeys.LAST_FETCH);
      expect(result).toBe(timestamp);
    });

    it('should return null if last fetch does not exist', () => {
      mockStorage.getNumber.mockReturnValue(undefined);

      const result = quotaStorage.getLastFetch();
      
      expect(result).toBeNull();
    });

    it('should set last fetch timestamp', () => {
      const timestamp = 1234567890;
      
      quotaStorage.setLastFetch(timestamp);
      
      expect(mockStorage.set).toHaveBeenCalledWith(StorageKeys.LAST_FETCH, timestamp);
    });

    it('should clear all data', () => {
      quotaStorage.clearAll();
      
      expect(mockStorage.clearAll).toHaveBeenCalled();
    });
  });

  describe('usernameStorage', () => {
    it('should get username', () => {
      const username = 'testuser';
      mockStorage.getString.mockReturnValue(username);

      const result = usernameStorage.getUsername();
      
      expect(mockStorage.getString).toHaveBeenCalledWith(StorageKeys.USERNAME);
      expect(result).toBe(username);
    });

    it('should return null if username does not exist', () => {
      mockStorage.getString.mockReturnValue(undefined);

      const result = usernameStorage.getUsername();
      
      expect(result).toBeNull();
    });

    it('should set username', () => {
      const username = 'testuser';
      
      usernameStorage.setUsername(username);
      
      expect(mockStorage.set).toHaveBeenCalledWith(StorageKeys.USERNAME, username);
    });

    it('should clear username', () => {
      usernameStorage.clearUsername();
      
      expect(mockStorage.remove).toHaveBeenCalledWith(StorageKeys.USERNAME);
    });
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
