import * as SecureStore from 'expo-secure-store';
import {
  storeToken,
  getStoredToken,
  storeUserLogin,
  getStoredUserLogin,
  clearAuthData,
  isAuthenticated,
} from '@/stores/secureStorage';

describe('stores/secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeToken', () => {
    it('should store token in secure store', async () => {
      await storeToken('test-token');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'github_access_token',
        'test-token'
      );
    });
  });

  describe('getStoredToken', () => {
    it('should retrieve token from secure store', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('stored-token');

      const result = await getStoredToken();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('github_access_token');
      expect(result).toBe('stored-token');
    });

    it('should return null if no token stored', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await getStoredToken();

      expect(result).toBeNull();
    });
  });

  describe('storeUserLogin', () => {
    it('should store user login in secure store', async () => {
      await storeUserLogin('testuser');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'github_user_login',
        'testuser'
      );
    });
  });

  describe('getStoredUserLogin', () => {
    it('should retrieve user login from secure store', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('storeduser');

      const result = await getStoredUserLogin();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('github_user_login');
      expect(result).toBe('storeduser');
    });

    it('should return null if no user login stored', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await getStoredUserLogin();

      expect(result).toBeNull();
    });
  });

  describe('clearAuthData', () => {
    it('should clear both token and user login', async () => {
      await clearAuthData();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('github_access_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('github_user_login');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('stored-token');

      const result = await isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if no token exists', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
