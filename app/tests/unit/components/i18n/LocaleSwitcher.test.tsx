import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher/LocaleSwitcher";
import { settingsApi } from "@/lib/api/settings";
import { useAuthStore } from "@/lib/auth/authStore";
import { createMockUser } from "@/tests/mocks/user";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/lib/api/settings", () => ({
  settingsApi: { updateLocale: jest.fn() }
}));

const mockUpdateLocale = settingsApi.updateLocale as jest.MockedFunction<typeof settingsApi.updateLocale>;

function setUser(user: ReturnType<typeof createMockUser> | null) {
  useAuthStore.setState({ user, isAuthenticated: user !== null });
}

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateLocale.mockResolvedValue({} as Awaited<ReturnType<typeof settingsApi.updateLocale>>);
  });

  // Unmount before resetting the store, so the reset can't re-render a live
  // component outside act().
  afterEach(() => {
    cleanup();
    act(() => setUser(null));
  });

  it("renders nothing for a logged-out user", () => {
    setUser(null);
    const { container } = render(<LocaleSwitcher />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the explicit locale as the current selection", () => {
    setUser(createMockUser({ explicit_locale: "hu", locales: ["fr"] }));
    render(<LocaleSwitcher />);
    expect(screen.getByRole("combobox")).toHaveValue("hu");
  });

  it("falls back to the auto option and names the browser locale when no explicit choice exists", () => {
    setUser(createMockUser({ explicit_locale: null, locales: ["fr"] }));
    render(<LocaleSwitcher />);
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(screen.getByRole("option", { name: /Auto \(fr\)/ })).toBeInTheDocument();
  });

  it("PATCHes the chosen locale and updates the store so the UI swaps", async () => {
    setUser(createMockUser({ explicit_locale: null, locales: ["fr"], locale: "en" }));
    render(<LocaleSwitcher />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "hu" } });

    await waitFor(() => expect(mockUpdateLocale).toHaveBeenCalledWith("hu"));
    await waitFor(() => {
      expect(useAuthStore.getState().user?.explicit_locale).toBe("hu");
    });
  });

  it("surfaces a failed change without altering the stored locale", async () => {
    setUser(createMockUser({ explicit_locale: null, locale: "en" }));
    mockUpdateLocale.mockRejectedValue(new Error("Locale is not supported"));
    render(<LocaleSwitcher />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "hu" } });

    expect(await screen.findByText("Locale is not supported")).toBeInTheDocument();
    expect(useAuthStore.getState().user?.explicit_locale).toBeNull();
  });
});
