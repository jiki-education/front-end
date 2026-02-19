/**
 * Unit tests for authStore logout method
 */

import { useAuthStore } from "@/lib/auth/authStore";
import type { User } from "@/types/auth";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn()
  }
}));

describe("AuthStore - Logout", () => {
  const mockUser: User = {
    handle: "testuser",
    email: "test@example.com",
    name: "Test User",
    membership_type: "standard",
    subscription_status: "never_subscribed",
    subscription: null,
    premium_prices: { currency: "usd", monthly: 999, annual: 9900, country_code: null },
    provider: "email",
    email_confirmed: true
  };

  beforeEach(() => {
    // Start with authenticated state
    useAuthStore.setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      hasCheckedAuth: true
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  it("should successfully logout and return success", async () => {
    mockFetch.mockResolvedValue({ ok: true });

    const { logout } = useAuthStore.getState();
    const result = await logout();

    expect(result).toEqual({ success: true });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("should keep user logged in on network error but return failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { logout } = useAuthStore.getState();
    const result = await logout();

    expect(result).toEqual({ success: false, error: "network" });

    // User state should NOT be cleared - server session may still be active
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it("should set loading state during logout", async () => {
    let resolvePromise: (value: { ok: boolean }) => void;
    const fetchPromise = new Promise<{ ok: boolean }>((resolve) => {
      resolvePromise = resolve;
    });
    mockFetch.mockReturnValue(fetchPromise);

    const { logout } = useAuthStore.getState();
    const logoutPromise = logout();

    // Check loading state is set
    expect(useAuthStore.getState().isLoading).toBe(true);

    // Resolve the promise
    resolvePromise!({ ok: true });
    await logoutPromise;

    // Check loading state is cleared
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("should clear loading state after network error while keeping user logged in", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { logout } = useAuthStore.getState();
    await logout();

    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should call fetch with correct parameters", async () => {
    mockFetch.mockResolvedValue({ ok: true });

    const { logout } = useAuthStore.getState();
    await logout();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/logout"),
      expect.objectContaining({
        method: "DELETE",
        credentials: "include"
      })
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
