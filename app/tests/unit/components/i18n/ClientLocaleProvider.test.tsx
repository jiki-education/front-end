import { render, screen, waitFor } from "@testing-library/react";
import { ClientLocaleProvider } from "@/components/i18n/ClientLocaleProvider";
import { useAuthStore } from "@/lib/auth/authStore";
import type { User } from "@/types/auth";

// The loader is created at module load, before this file's bindings exist, so the
// factory returns a stable function that looks the mock up lazily on each call.
const mockLoadCatalog = jest.fn();
jest.mock("@/lib/i18n/catalogLoader", () => ({
  createCatalogLoader: () => (locale: string) => mockLoadCatalog(locale)
}));

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

// jsdom neither lets window.location be replaced nor its methods be stubbed, but
// it honours history.pushState for the path, and reports a real navigation
// attempt through console.error ("Not implemented: navigation"). That report is
// the only observable trace location.assign leaves here, so it is what the
// redirect test asserts on.
function setLocation(path: string) {
  window.history.pushState({}, "", path);
}

function navigationAttempts(spy: jest.SpyInstance): number {
  return spy.mock.calls.filter((call) => String(call[0]).includes("navigation")).length;
}

describe("ClientLocaleProvider", () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadCatalog.mockResolvedValue({ hello: "bonjour" });
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false, hasCheckedAuth: false });
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("renders children immediately when the account matches the page locale", () => {
    setLocation("/fr/blog");
    useAuthStore.getState().setUser(user);

    render(
      <ClientLocaleProvider initialLocale="fr" initialMessages={{}}>
        <div data-testid="child" />
      </ClientLocaleProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(mockLoadCatalog).not.toHaveBeenCalled();
    expect(navigationAttempts(consoleError)).toBe(0);
  });

  it("navigates a locale-prefixed page to the account's locale rather than swapping in place", () => {
    // Logged in from the Spanish login page with a French account.
    setLocation("/es-ES/auth/login?return_to=%2Fdashboard");
    useAuthStore.getState().setUser(user);

    render(
      <ClientLocaleProvider initialLocale="es-ES" initialMessages={{}}>
        <div data-testid="child" />
      </ClientLocaleProvider>
    );

    expect(navigationAttempts(consoleError)).toBe(1);
    expect(mockLoadCatalog).not.toHaveBeenCalled();
    // Nothing is painted in the wrong language while the browser navigates.
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("still swaps in place on a naked route, which has no locale-prefixed twin", async () => {
    setLocation("/settings");
    useAuthStore.getState().setUser(user);

    render(
      <ClientLocaleProvider initialLocale="en" initialMessages={{}}>
        <div data-testid="child" />
      </ClientLocaleProvider>
    );

    await waitFor(() => expect(screen.getByTestId("child")).toBeInTheDocument());
    expect(mockLoadCatalog).toHaveBeenCalledWith("fr");
    expect(navigationAttempts(consoleError)).toBe(0);
  });
});
