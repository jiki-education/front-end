/**
 * Unit tests for authStore.checkAuth() error handling
 * Tests network error retry logic and rate limit handling
 */

import { useAuthStore } from "@/lib/auth/authStore";
import * as authService from "@/lib/auth/service";
import { AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";
import { clearAuthCookies } from "@/lib/auth/actions";
import * as errorHandlerStore from "@/lib/api/errorHandlerStore";
import type { User } from "@/types/auth";

// Mock dependencies
jest.mock("@/lib/auth/service");
jest.mock("@/lib/auth/actions", () => ({
  clearAuthCookies: jest.fn()
}));
jest.mock("@/lib/api/errorHandlerStore", () => ({
  setCriticalError: jest.fn(),
  clearCriticalError: jest.fn()
}));

const mockGetCurrentUser = authService.getCurrentUser as jest.MockedFunction<typeof authService.getCurrentUser>;
const mockClearAuthCookies = clearAuthCookies as jest.MockedFunction<typeof clearAuthCookies>;
const mockSetCriticalError = errorHandlerStore.setCriticalError as jest.MockedFunction<
  typeof errorHandlerStore.setCriticalError
>;
const mockClearCriticalError = errorHandlerStore.clearCriticalError as jest.MockedFunction<
  typeof errorHandlerStore.clearCriticalError
>;

describe("authStore.checkAuth", () => {
  const mockUser: User = {
    id: 123,
    handle: "testuser",
    email: "test@example.com",
    name: "Test User",
    created_at: "2023-01-01T00:00:00Z",
    membership_type: "standard",
    subscription_status: "never_subscribed",
    subscription: null
  };

  beforeEach(() => {
    jest.useFakeTimers();
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasCheckedAuth: false
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("sets user on successful auth check", async () => {
    mockGetCurrentUser.mockResolvedValue(mockUser);

    const checkAuthPromise = useAuthStore.getState().checkAuth();
    await checkAuthPromise;

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.hasCheckedAuth).toBe(true);
    expect(mockClearCriticalError).toHaveBeenCalled();
  });

  it("clears cookies and sets logged out on AuthenticationError", async () => {
    mockGetCurrentUser.mockRejectedValue(new AuthenticationError("Unauthorized"));

    await useAuthStore.getState().checkAuth();

    expect(mockClearAuthCookies).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasCheckedAuth).toBe(true);
    expect(state.error).toBe("Authentication check failed");
  });

  it("retries on network error and succeeds when network returns", async () => {
    // First call fails with network error, second succeeds
    mockGetCurrentUser.mockRejectedValueOnce(new NetworkError("Failed to fetch")).mockResolvedValueOnce(mockUser);

    const checkAuthPromise = useAuthStore.getState().checkAuth();

    // Run all timers to let retries complete
    await jest.runAllTimersAsync();

    // Wait for the promise to complete
    await checkAuthPromise;

    // Should have retried and succeeded
    expect(mockGetCurrentUser).toHaveBeenCalledTimes(2);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(mockClearCriticalError).toHaveBeenCalled();
  });

  it("waits and retries on RateLimitError", async () => {
    const retryAfterSeconds = 2;
    // First call fails with rate limit, second succeeds
    mockGetCurrentUser
      .mockRejectedValueOnce(new RateLimitError("Too Many Requests", retryAfterSeconds))
      .mockResolvedValueOnce(mockUser);

    const checkAuthPromise = useAuthStore.getState().checkAuth();

    // Fast-forward past retry-after time
    await jest.advanceTimersByTimeAsync(retryAfterSeconds * 1000);

    await checkAuthPromise;

    // Should have set the rate limit error modal
    expect(mockSetCriticalError).toHaveBeenCalledWith(expect.any(RateLimitError));

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("skips check if already checked", async () => {
    useAuthStore.setState({ hasCheckedAuth: true });

    await useAuthStore.getState().checkAuth();

    expect(mockGetCurrentUser).not.toHaveBeenCalled();
  });

  it("skips check if currently loading", async () => {
    useAuthStore.setState({ isLoading: true });

    await useAuthStore.getState().checkAuth();

    expect(mockGetCurrentUser).not.toHaveBeenCalled();
  });

  it("sets no user on unknown error", async () => {
    mockGetCurrentUser.mockRejectedValue(new Error("Unknown error"));

    await useAuthStore.getState().checkAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasCheckedAuth).toBe(true);
    // Should not clear cookies for unknown errors
    expect(mockClearAuthCookies).not.toHaveBeenCalled();
  });
});
