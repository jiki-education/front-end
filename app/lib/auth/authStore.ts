/**
 * Authentication Store
 * Global state management for authentication using Zustand
 */

import * as authService from "@/lib/auth/service";
import { getApiUrl } from "@/lib/api/config";
import type { LoginCredentials, PasswordReset, SignupData, User } from "@/types/auth";
import { AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";
import { setCriticalError, clearCriticalError } from "@/lib/api/errorHandlerStore";
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
  logout: () => Promise<{ success: boolean; error?: "network" }>;
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

  // Login action - calls Rails directly
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await fetch(getApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user: credentials })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.error?.message || "Login failed";
        // Throw AuthenticationError for 401 so forms can detect invalid credentials
        if (response.status === 401) {
          throw new AuthenticationError(message, errorData);
        }
        throw new Error(message);
      }

      const data = await response.json();
      if (!data.user) {
        throw new Error("Invalid response from server");
      }

      get().setUser(data.user);
    } catch (error) {
      get().setNoUser();
      throw error;
    }
  },

  // Google login action - calls Rails directly
  googleLogin: async (code) => {
    set({ isLoading: true });
    try {
      const response = await fetch(getApiUrl("/auth/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.error?.message || "Google login failed";
        if (response.status === 401) {
          throw new AuthenticationError(message, errorData);
        }
        throw new Error(message);
      }

      const data = await response.json();
      if (!data.user) {
        throw new Error("Invalid response from server");
      }

      get().setUser(data.user);
    } catch (error) {
      get().setNoUser();
      throw error;
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

  // Signup action - calls Rails directly
  signup: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await fetch(getApiUrl("/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user: userData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.error?.message || "Signup failed";
        if (response.status === 401) {
          throw new AuthenticationError(message, errorData);
        }
        throw new Error(message);
      }

      const data = await response.json();
      if (!data.user) {
        throw new Error("Invalid response from server");
      }

      get().setUser(data.user);
    } catch (error) {
      get().setNoUser();
      throw error;
    }
  },

  // Logout action - calls Rails directly
  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch(getApiUrl("/auth/logout"), {
        method: "DELETE",
        credentials: "include"
      });
      get().setNoUser(null);
      return { success: true };
    } catch {
      // Network error - couldn't reach server, keep user logged in locally
      set({ isLoading: false });
      return { success: false, error: "network" };
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
  // Handles network errors and rate limiting with retry logic matching the API client
  checkAuth: async () => {
    const currentState = get();

    // Skip if already checked or currently checking
    if (currentState.hasCheckedAuth || currentState.isLoading) {
      return;
    }

    set({ isLoading: true });

    // Retry configuration matching API client
    const INITIAL_RETRY_DELAY_MS = 50;
    const MAX_RETRY_DELAY_MS = 5000;
    const SHOW_MODAL_AFTER_MS = 1000;
    const startTime = Date.now();
    let attempt = 0;

    while (true) {
      try {
        // Fetch fresh user data from server without retries
        // useRetries: false prevents infinite hangs on auth errors
        const user = await authService.getCurrentUser(false);
        clearCriticalError();
        get().setUser(user);
        return;
      } catch (error) {
        // Auth error - session invalid, clear cookie and set logged out
        if (error instanceof AuthenticationError) {
          // Clear the session cookie by calling logout endpoint
          // Don't catch errors - let network errors bubble up to global error handler
          await fetch(getApiUrl("/auth/logout"), {
            method: "DELETE",
            credentials: "include"
          });
          get().setNoUser("Authentication check failed");
          return;
        }

        // Rate limit error - show modal, wait specified time, retry
        if (error instanceof RateLimitError) {
          setCriticalError(error);
          await new Promise((resolve) => setTimeout(resolve, error.retryAfterSeconds * 1000));
          attempt = 0; // Reset attempt counter
          continue;
        }

        // Network error - show modal and retry with backoff
        if (error instanceof NetworkError) {
          const elapsedTime = Date.now() - startTime;
          if (elapsedTime >= SHOW_MODAL_AFTER_MS) {
            setCriticalError(new NetworkError("Connection lost"));
          }
          const delay = Math.min(INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt), MAX_RETRY_DELAY_MS);
          await new Promise((resolve) => setTimeout(resolve, delay));
          attempt++;
          continue;
        }

        // Other error - give up
        get().setNoUser();
        return;
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
