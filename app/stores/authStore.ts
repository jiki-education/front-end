/**
 * Authentication Store
 * Global state management for authentication using Zustand
 */

import * as authService from "@/lib/auth/service";
import { hasValidToken, removeAccessToken } from "@/lib/auth/storage";
import type { LoginCredentials, PasswordReset, SignupData, User } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCheckedAuth: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  googleLogin: (code: string) => Promise<void>;
  googleAuth: (code: string) => Promise<void>;
  logout: (logoutService?: () => Promise<void>) => Promise<void>;
  clearAuthState: () => void;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (data: PasswordReset) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasCheckedAuth: false,

      // Login action
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const user = await authService.login(credentials);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            hasCheckedAuth: true
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
          throw error; // Re-throw for component handling
        }
      },

      // Google login action (internal)
      googleLogin: async (credential) => {
        set({ isLoading: true });
        try {
          const user = await authService.googleLogin(credential);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            hasCheckedAuth: true
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
          throw error; // Re-throw for component handling
        }
      },

      // Google authentication with UI feedback
      googleAuth: async (code) => {
        if (!code) {
          toast.error("No authorization code received from Google");
          return;
        }
        try {
          toast.loading("Authenticating with Google...");
          await get().googleLogin(code);
          toast.dismiss();
          const user = get().user;
          toast.success(`Welcome ${user?.name || user?.email}!`);
        } catch (error) {
          toast.dismiss();
          const errorMessage = error instanceof Error ? error.message : "Google authentication failed";
          toast.error(errorMessage);
          console.error("Google OAuth error:", error);
        }
      },

      // Signup action
      signup: async (userData) => {
        set({ isLoading: true });
        try {
          const user = await authService.signup(userData);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            hasCheckedAuth: true
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
          throw error;
        }
      },

      // Logout action
      logout: async (logoutService = authService.logout) => {
        set({ isLoading: true });
        try {
          await logoutService();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Always clear state regardless of API response
          removeAccessToken();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      // Clear authentication state (for internal use)
      clearAuthState: () => {
        removeAccessToken();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },

      // Check authentication status
      checkAuth: async () => {
        const currentState = get();

        // Skip if already checked or currently checking
        if (currentState.hasCheckedAuth || currentState.isLoading) {
          return;
        }

        set({ isLoading: true });

        try {
          // Quick check for token existence and basic validity
          if (!hasValidToken()) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              hasCheckedAuth: true
            });
            return;
          }

          // If we have user data in state, validate the token is still valid
          const currentState = get();
          if (currentState.user && currentState.isAuthenticated) {
            // Validate token using the auth service (now without circular dependency)
            const isValid = await authService.validateToken();
            if (!isValid) {
              // Token is invalid or expired, try to refresh it
              const newToken = await authService.refreshAccessToken();

              if (newToken) {
                // Refresh successful, update state
                set({ isLoading: false, hasCheckedAuth: true });
                return;
              }

              // Refresh failed, clear auth state
              removeAccessToken();
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: "Session expired. Please login again.",
                hasCheckedAuth: true
              });
              return;
            }

            // Token is still valid
            set({ isLoading: false, hasCheckedAuth: true });
            return;
          }

          // If we have a token but no user data, the session is invalid
          // This shouldn't happen in normal flow as user data is persisted
          removeAccessToken();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Invalid session. Please login again.",
            hasCheckedAuth: true
          });
        } catch (error) {
          console.error("Auth check failed:", error);
          // On error, clear auth state for safety
          removeAccessToken();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: "Authentication check failed",
            hasCheckedAuth: true
          });
        }
      },

      // Refresh user data from server
      refreshUser: async () => {
        try {
          const user = await authService.getCurrentUser();
          set({ user });
        } catch (error) {
          console.error("Failed to refresh user:", error);
          throw error;
        }
      },

      // Request password reset
      requestPasswordReset: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authService.requestPasswordReset({ email });
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to send reset email";
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      // Complete password reset
      resetPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(data);
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to reset password";
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      // Resend confirmation instructions
      resendConfirmation: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resendConfirmation(email);
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to resend confirmation email";
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: "auth-storage", // Storage key
      partialize: (state) => ({
        // Only persist user data and authentication state
        // hasCheckedAuth is NOT persisted - it should reset on each app load
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
