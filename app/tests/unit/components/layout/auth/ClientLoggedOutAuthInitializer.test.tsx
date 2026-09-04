import { render } from "@testing-library/react";
import { ClientLoggedOutAuthInitializer } from "@/components/layout/auth/global/ClientLoggedOutAuthInitializer";
import { useAuthStore } from "@/lib/auth/authStore";
import type { User } from "@/types/auth";

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
  locale: "fr",
  locales: ["fr"],
  explicit_locale: "fr"
};

describe("ClientLoggedOutAuthInitializer", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false, hasCheckedAuth: false });
  });

  it("marks the store logged out on first mount without an API call", () => {
    render(<ClientLoggedOutAuthInitializer />);

    const state = useAuthStore.getState();
    expect(state.hasCheckedAuth).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });

  it("does not overwrite a store that was populated after the page rendered", () => {
    // The page was server-rendered anonymous, then a login succeeded, then the
    // tree remounted (e.g. ClientLocaleProvider swapping catalogs).
    useAuthStore.getState().setUser(user);

    render(<ClientLoggedOutAuthInitializer />);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
  });
});
