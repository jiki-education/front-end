/**
 * Authentication Store
 * Global state management for authentication using Zustand
 */

import * as authService from "@/lib/auth/service";
import { loginAction, signupAction, googleLoginAction, logoutAction } from "@/lib/auth/actions";
import type { LoginCredentials, PasswordReset, SignupData, User } from "@/types/auth";
import { AuthenticationError } from "@/lib/api/client";
import toast from "react-hot-toast";
import { create } from "zustand";

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
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (data: PasswordReset) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  setNoUser: (error?: string | null) => void;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
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
      const result = await loginAction(credentials);
      if (!result.success || !result.user) {
        throw new Error(result.error || "Login failed");
      }
      get().setUser(result.user);
    } catch (error) {
      get().setNoUser();
      throw error; // Re-throw for component handling
    }
  },

  // Google login action (internal)
  googleLogin: async (credential) => {
    set({ isLoading: true });
    try {
      const result = await googleLoginAction(credential);
      if (!result.success || !result.user) {
        throw new Error(result.error || "Google login failed");
      }
      get().setUser(result.user);
    } catch (error) {
      get().setNoUser();
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
    }
  },

  // Signup action
  signup: async (userData) => {
    set({ isLoading: true });
    try {
      const result = await signupAction(userData);
      if (!result.success || !result.user) {
        throw new Error(result.error || "Signup failed");
      }
      get().setUser(result.user);
    } catch (error) {
      get().setNoUser();
      throw error;
    }
  },

  // Logout action
  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutAction(); // Clears httpOnly cookies
    } finally {
      get().setNoUser(null);
    }
  },

  // Helper methods
  setUser: (user: User) => {
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      hasCheckedAuth: true,
      error: null
    });
  },
  setNoUser: (error?: string | null) => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasCheckedAuth: true
    });
    if (error !== undefined) {
      set({ error: error });
    }
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
      // Fetch fresh user data from server without retries
      // API client automatically handles token refresh on 401
      // useRetries: false prevents infinite hangs on auth errors
      const user = await authService.getCurrentUser(false);
      get().setUser(user);
    } catch (error) {
      // On auth error, just set no user - cookies are httpOnly so can't be cleared client-side
      if (error instanceof AuthenticationError) {
        get().setNoUser("Authentication check failed");
      } else {
        // Other API error (shouldn't happen) - don't clear tokens
        get().setNoUser();
      }
    }
  },

  // Refresh user data from server
  refreshUser: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user });
    } catch (error) {
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
}));
