/**
 * Unit tests for NeverSubscribedState component
 */
import { render, screen, fireEvent } from "@testing-library/react";
import NeverSubscribedState from "@/components/settings/subscription/states/NeverSubscribedState";

// Mock the auth store so PremiumPrice can render
jest.mock("@/lib/auth/authStore", () => {
  const state = {
    user: {
      premium_prices: { currency: "usd", monthly: 999, annual: 9900, country_code: null }
    }
  };
  return {
    useAuthStore: (selector: (s: typeof state) => unknown) => selector(state)
  };
});

describe("NeverSubscribedState", () => {
  const mockProps = {
    onUpgradeToPremium: jest.fn(),
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the component correctly", () => {
      render(<NeverSubscribedState {...mockProps} />);

      expect(screen.getByText("Upgrade Your Plan")).toBeInTheDocument();
      expect(
        screen.getByText("Unlock advanced features and enhanced learning experiences with our premium plans.")
      ).toBeInTheDocument();
    });

    it("displays Premium plan option", () => {
      render(<NeverSubscribedState {...mockProps} />);

      expect(screen.getByText("Premium")).toBeInTheDocument();
      expect(screen.getByText(/All Free features/)).toBeInTheDocument();
      expect(screen.getByText(/Unlimited AI help/)).toBeInTheDocument();
      expect(screen.getByText(/Access to all exercises/)).toBeInTheDocument();
      expect(screen.getByText(/Certificates/)).toBeInTheDocument();
      expect(screen.getByText(/Ad-free experience/)).toBeInTheDocument();
    });

    // Max tier has been removed - only Premium tier now
  });

  describe("Button interactions", () => {
    it("calls onUpgradeToPremium when Premium button is clicked", () => {
      render(<NeverSubscribedState {...mockProps} />);

      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });
      fireEvent.click(premiumButton);

      expect(mockProps.onUpgradeToPremium).toHaveBeenCalledTimes(1);
    });

    // Max tier has been removed - only Premium tier now
  });

  describe("Loading state", () => {
    it("disables button when loading", () => {
      render(<NeverSubscribedState {...mockProps} isLoading={true} />);

      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });

      expect(premiumButton).toBeDisabled();
    });

    it("shows loading state on button when loading", () => {
      render(<NeverSubscribedState {...mockProps} isLoading={true} />);

      // Look for loading indicators or text changes
      // The exact implementation would depend on the SubscriptionButton component
      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });

      expect(premiumButton).toBeDisabled();
    });

    it("enables button when not loading", () => {
      render(<NeverSubscribedState {...mockProps} isLoading={false} />);

      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });

      expect(premiumButton).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("provides proper button role", () => {
      render(<NeverSubscribedState {...mockProps} />);

      expect(screen.getByRole("button", { name: /upgrade to premium/i })).toBeInTheDocument();
    });

    it("has proper heading structure", () => {
      render(<NeverSubscribedState {...mockProps} />);

      // Should have a main heading for the section
      expect(screen.getByText("Upgrade Your Plan")).toBeInTheDocument();
    });

    it("provides descriptive button text", () => {
      render(<NeverSubscribedState {...mockProps} />);

      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });

      expect(premiumButton).toHaveAccessibleName();
    });
  });

  describe("Plan comparison", () => {
    it("shows Premium plan features", () => {
      render(<NeverSubscribedState {...mockProps} />);

      // Premium features
      expect(screen.getByText(/All Free features/)).toBeInTheDocument();
      expect(screen.getByText(/Unlimited AI help/)).toBeInTheDocument();
      expect(screen.getByText(/Access to all exercises/)).toBeInTheDocument();
      expect(screen.getByText(/Certificates/)).toBeInTheDocument();
      expect(screen.getByText(/Ad-free experience/)).toBeInTheDocument();
    });

    it("shows pricing information clearly", () => {
      render(<NeverSubscribedState {...mockProps} />);

      expect(screen.getByText("/month")).toBeInTheDocument();
    });
  });

  describe("Responsive design", () => {
    it("renders properly in different screen sizes", () => {
      // This would typically be tested with different viewport sizes
      // For unit tests, we can verify the component structure
      render(<NeverSubscribedState {...mockProps} />);

      expect(screen.getByText("Upgrade Your Plan")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /upgrade to premium/i })).toBeInTheDocument();
    });
  });
});
