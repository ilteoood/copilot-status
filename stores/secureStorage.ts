import * as SecureStore from 'expo-secure-store';

const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: 'github_access_token',
  USER_LOGIN: 'github_user_login',
} as const;

export async function storeToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN, token);
}

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
}

export async function storeUserLogin(login: string): Promise<void> {
  await SecureStore.setItemAsync(SECURE_STORE_KEYS.USER_LOGIN, login);
}

export async function getStoredUserLogin(): Promise<string | null> {
  return SecureStore.getItemAsync(SECURE_STORE_KEYS.USER_LOGIN);
}

export async function clearAuthData(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER_LOGIN);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getStoredToken();
  return token !== null;
}
