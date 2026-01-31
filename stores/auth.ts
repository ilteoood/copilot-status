import { exchangeCodeForToken } from '@/services/auth';
import { clearAuthData, getStoredToken, storeToken } from '@/stores/secureStorage';
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  checkAuth: () => Promise<void>;
  signIn: (code: string, codeVerifier?: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>(set => {
  return {
    isAuthenticated: false,
    isLoading: true,
    error: null,

    checkAuth: async () => {
      set({ isLoading: true, error: null });
      try {
        const token = await getStoredToken();
        set({
          isAuthenticated: token !== null,
          isLoading: false,
        });
      } catch (error) {
        set({
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to check auth',
        });
      }
    },

    signIn: async (code: string, codeVerifier?: string) => {
      set({ isLoading: true, error: null });
      try {
        const token = await exchangeCodeForToken(code, codeVerifier);
        await storeToken(token);
        set({ isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Sign in failed',
        });
        throw error;
      }
    },

    signOut: async () => {
      set({ isLoading: true });
      try {
        await clearAuthData();
        set({
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Sign out failed',
        });
      }
    },

    clearError: () => set({ error: null }),
  };
});
