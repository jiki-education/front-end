/**
 * Unit tests for auth hooks to prevent race conditions during authentication
 */

import { useRequireAuth, useAuth } from "@/lib/auth/hooks";
import { useAuthStore } from "@/stores/authStore";
import { renderHook, waitFor } from "@testing-library/react";

// Mock Next.js router
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn()
};

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => mockRouter)
}));

// Mock the auth store
jest.mock("@/stores/authStore", () => ({
  useAuthStore: jest.fn()
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe("Auth Hooks - Race Condition Prevention", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  describe("useRequireAuth", () => {
    it("should not redirect during initial auth loading", () => {
      // Simulate the initial loading state during page refresh
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        hasCheckedAuth: false,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      const { result } = renderHook(() => useRequireAuth());

      // During loading, no redirect should occur
      expect(mockPush).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isReady).toBe(false);
    });

    it("should not redirect when hasCheckedAuth is false even if not loading", () => {
      // Simulate auth store after loading but before auth check completion
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        hasCheckedAuth: false, // Key: auth check hasn't completed
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      const { result } = renderHook(() => useRequireAuth());

      // Should not redirect until hasCheckedAuth is true
      expect(mockPush).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isReady).toBe(false);
    });

    it("should redirect unauthenticated users only after auth check completes", async () => {
      // Start with auth checking state
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        hasCheckedAuth: false,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      const { result, rerender } = renderHook(() => useRequireAuth());

      // Initially should not redirect
      expect(mockPush).not.toHaveBeenCalled();

      // Simulate auth check completion with unauthenticated result
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        hasCheckedAuth: true, // Auth check completed
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      rerender();

      // Now should redirect to login
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/auth/login");
      });

      expect(result.current.isReady).toBe(true); // Ready because auth check completed
    });

    it("should not redirect authenticated users after auth check completes", async () => {
      // Start with auth checking state
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        hasCheckedAuth: false,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      const { result, rerender } = renderHook(() => useRequireAuth());

      // Initially should not redirect
      expect(mockPush).not.toHaveBeenCalled();

      // Simulate auth check completion with authenticated result
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        hasCheckedAuth: true, // Auth check completed
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      rerender();

      // Should not redirect anywhere
      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      expect(mockPush).not.toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should redirect authenticated users to dashboard when redirectIfAuthenticated is true", async () => {
      // Simulate completed auth check with authenticated user
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        hasCheckedAuth: true,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      const { result } = renderHook(() => useRequireAuth({ redirectIfAuthenticated: true }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should use custom redirect URL when provided", async () => {
      // Simulate completed auth check with unauthenticated user
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        hasCheckedAuth: true,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      const { result } = renderHook(() => useRequireAuth({ redirectTo: "/custom-login" }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/custom-login");
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should call callbacks when authentication state is determined", async () => {
      const onAuthenticated = jest.fn();
      const onUnauthenticated = jest.fn();

      // Start with checking state
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        hasCheckedAuth: false,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      const { rerender } = renderHook(() =>
        useRequireAuth({
          onAuthenticated,
          onUnauthenticated,
          redirectTo: "/login"
        })
      );

      // Complete auth check with unauthenticated result
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        hasCheckedAuth: true,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      rerender();

      await waitFor(() => {
        expect(onUnauthenticated).toHaveBeenCalledTimes(1);
      });

      expect(onAuthenticated).not.toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  describe("useAuth", () => {
    it("should include hasCheckedAuth in return value", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        hasCheckedAuth: true,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        user: { id: "1", email: "test@example.com", name: "Test User" },
        hasCheckedAuth: true,
        isReady: true
      });
    });

    it("should return isReady false when hasCheckedAuth is false", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        hasCheckedAuth: false, // Not ready yet
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isReady).toBe(false);
      expect(result.current.hasCheckedAuth).toBe(false);
    });
  });

  describe("Race Condition Prevention - Critical Path Test", () => {
    it("should prevent redirect loop on page refresh for authenticated users", async () => {
      // This test simulates the exact scenario that was causing the bug:
      // 1. Page refresh triggers AuthProvider.checkAuth()
      // 2. useRequireAuth sees isAuthenticated: false during loading
      // 3. Race condition: redirect happens before auth check completes

      let authStoreState = {
        isAuthenticated: false,
        isLoading: true,
        user: null,
        hasCheckedAuth: false,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        checkAuth: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        error: null
      };

      mockUseAuthStore.mockImplementation(() => authStoreState);

      const { result, rerender } = renderHook(() => useRequireAuth());

      // Step 1: Initial render during page refresh - auth is loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isReady).toBe(false);
      expect(mockPush).not.toHaveBeenCalled(); // Critical: no redirect yet

      // Step 2: Auth loading completes but hasCheckedAuth is still false
      // This is the critical moment where the race condition could occur
      authStoreState = {
        ...authStoreState,
        isLoading: false,
        hasCheckedAuth: false // Still checking
      };
      rerender();

      expect(result.current.isLoading).toBe(true); // Still loading from hook perspective
      expect(result.current.isReady).toBe(false);
      expect(mockPush).not.toHaveBeenCalled(); // Critical: still no redirect

      // Step 3: Auth check completes and user is authenticated
      authStoreState = {
        ...authStoreState,
        isAuthenticated: true,
        user: { id: "1", email: "test@example.com", name: "Test User" } as any,
        hasCheckedAuth: true // Auth check finally complete
      };
      rerender();

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(mockPush).not.toHaveBeenCalled(); // Success: authenticated user stays on page

      // Verify final state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toEqual({ id: "1", email: "test@example.com", name: "Test User" });
    });
  });
});
