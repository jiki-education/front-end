/**
 * Tests for SettingsPage component
 */

import SettingsPage from "@/components/settings/SettingsPage";
import { useAuthStore } from "@/lib/auth/authStore";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock dependencies
jest.mock("@/lib/auth/authStore");

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

// Mock the tab components that SettingsPage actually imports
jest.mock("@/components/settings/tabs/AccountTab", () => {
  return function MockAccountTab() {
    return <div data-testid="account-tab">Account Tab</div>;
  };
});

jest.mock("@/components/settings/tabs/SubscriptionTab", () => {
  return function MockSubscriptionTab() {
    return <div data-testid="subscription-tab">Subscription Tab</div>;
  };
});

jest.mock("@/components/settings/tabs/NotificationsTab", () => {
  return function MockNotificationsTab() {
    return <div data-testid="notifications-tab">Notifications Tab</div>;
  };
});

jest.mock("@/components/settings/tabs/DangerTab", () => {
  return function MockDangerTab() {
    return <div data-testid="danger-tab">Danger Tab</div>;
  };
});

describe("SettingsPage", () => {
  const mockUser = {
    email: "test@example.com",
    handle: "testuser",
    name: "Test User",
    membership_type: "standard" as const,
    subscription_status: "never_subscribed" as const,
    subscription: null,
    provider: "email",
    email_confirmed: true
  };

  const mockRefreshUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockReturnValue({
      refreshUser: mockRefreshUser,
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      hasCheckedAuth: true,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuth: jest.fn()
    } as any);
  });

  it("renders settings page with account tab by default", () => {
    render(<SettingsPage />);

    expect(screen.getByTestId("account-tab")).toBeInTheDocument();
  });

  it("renders page header", () => {
    render(<SettingsPage />);

    expect(screen.getByRole("heading", { name: /settings/i })).toBeInTheDocument();
  });

  it("renders all tab buttons", () => {
    render(<SettingsPage />);

    expect(screen.getByRole("button", { name: /account/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscription/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /danger zone/i })).toBeInTheDocument();
  });
});
