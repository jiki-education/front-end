import { render, screen, waitFor } from "@testing-library/react";
import { ClientAuthGuard } from "@/components/layout/auth/internal/ClientAuthGuard";
import { useAuthStore } from "@/lib/auth/authStore";
import * as authService from "@/lib/auth/service";
import { AuthenticationError } from "@/lib/api/client";
import type { User } from "@/types/auth";

const mockPush = jest.fn();
let mockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname
}));
jest.mock("next-intl", () => ({
  useLocale: () => "en"
}));
jest.mock("@/lib/auth/service");
jest.mock("@/lib/api/errorHandlerStore", () => ({
  setCriticalError: jest.fn(),
  clearCriticalError: jest.fn()
}));

global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as unknown as typeof fetch;

const mockGetCurrentUser = authService.getCurrentUser as jest.MockedFunction<typeof authService.getCurrentUser>;

const user: User = {
  handle: "testuser",
  email: "test@example.com",
  name: "Test User",
  avatar_url: null,
  membership_type: "standard",
  subscription_status: "never_subscribed",
  subscription: null,
  premium_prices: { currency: "usd", monthly: 999, annual: 9900, country_code: null },
  provider: "email",
  email_confirmed: true,
  locale: "en",
  locales: ["en"],
  explicit_locale: null
};

describe("ClientAuthGuard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = "/dashboard";
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false, hasCheckedAuth: false });
  });

  it("renders children for an authenticated user", () => {
    useAuthStore.getState().setUser(user);

    render(
      <ClientAuthGuard>
        <div data-testid="child" />
      </ClientAuthGuard>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("re-asks the API before trusting a stale logged-out store, and renders when it says logged in", async () => {
    // A stale "logged out" while a session exists: the store was set before a
    // login on the previous page, or clobbered by a remount.
    useAuthStore.getState().setNoUser();
    mockGetCurrentUser.mockResolvedValue(user);

    render(
      <ClientAuthGuard>
        <div data-testid="child" />
      </ClientAuthGuard>
    );

    await waitFor(() => expect(screen.getByTestId("child")).toBeInTheDocument());
    expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("bounces /dashboard to the landing page once the API confirms the logout, without asking again", async () => {
    useAuthStore.getState().setNoUser();
    mockGetCurrentUser.mockRejectedValue(new AuthenticationError("Unauthorized"));

    render(
      <ClientAuthGuard>
        <div data-testid="child" />
      </ClientAuthGuard>
    );

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
    expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("sends other protected routes to the login page after the confirmed logout", async () => {
    mockPathname = "/settings";
    useAuthStore.getState().setNoUser();
    mockGetCurrentUser.mockRejectedValue(new AuthenticationError("Unauthorized"));

    render(
      <ClientAuthGuard>
        <div />
      </ClientAuthGuard>
    );

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/auth/login"));
  });
});
