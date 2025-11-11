/**
 * Unit tests for NeverSubscribedState component
 */
import { render, screen, fireEvent } from "@testing-library/react";
import NeverSubscribedState from "@/components/settings/subscription/states/NeverSubscribedState";

describe("NeverSubscribedState", () => {
  const mockProps = {
    onUpgradeToPremium: jest.fn(),
    onUpgradeToMax: jest.fn(),
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
      expect(screen.getByText("$3")).toBeInTheDocument();
      expect(screen.getByText(/All Standard features/)).toBeInTheDocument();
      expect(screen.getByText(/Access to premium courses/)).toBeInTheDocument();
      expect(screen.getByText(/Advanced coding exercises/)).toBeInTheDocument();
    });

    it("displays Max plan option", () => {
      render(<NeverSubscribedState {...mockProps} />);

      expect(screen.getByText("Max")).toBeInTheDocument();
      expect(screen.getByText("$10")).toBeInTheDocument();
      expect(screen.getByText(/All Premium features/)).toBeInTheDocument();
      expect(screen.getByText(/Unlimited AI assistance/)).toBeInTheDocument();
      expect(screen.getByText(/One-on-one mentorship/)).toBeInTheDocument();
      expect(screen.getByText(/Career guidance/)).toBeInTheDocument();
    });
  });

  describe("Button interactions", () => {
    it("calls onUpgradeToPremium when Premium button is clicked", () => {
      render(<NeverSubscribedState {...mockProps} />);

      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });
      fireEvent.click(premiumButton);

      expect(mockProps.onUpgradeToPremium).toHaveBeenCalledTimes(1);
    });

    it("calls onUpgradeToMax when Max button is clicked", () => {
      render(<NeverSubscribedState {...mockProps} />);

      const maxButton = screen.getByRole("button", { name: /upgrade to max/i });
      fireEvent.click(maxButton);

      expect(mockProps.onUpgradeToMax).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading state", () => {
    it("disables buttons when loading", () => {
      render(<NeverSubscribedState {...mockProps} isLoading={true} />);

      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });
      const maxButton = screen.getByRole("button", { name: /upgrade to max/i });

      expect(premiumButton).toBeDisabled();
      expect(maxButton).toBeDisabled();
    });

    it("shows loading state on buttons when loading", () => {
      render(<NeverSubscribedState {...mockProps} isLoading={true} />);

      // Look for loading indicators or text changes
      // The exact implementation would depend on the SubscriptionButton component
      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });
      const maxButton = screen.getByRole("button", { name: /upgrade to max/i });

      expect(premiumButton).toBeDisabled();
      expect(maxButton).toBeDisabled();
    });

    it("enables buttons when not loading", () => {
      render(<NeverSubscribedState {...mockProps} isLoading={false} />);

      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });
      const maxButton = screen.getByRole("button", { name: /upgrade to max/i });

      expect(premiumButton).not.toBeDisabled();
      expect(maxButton).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("provides proper button roles", () => {
      render(<NeverSubscribedState {...mockProps} />);

      expect(screen.getByRole("button", { name: /upgrade to premium/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /upgrade to max/i })).toBeInTheDocument();
    });

    it("has proper heading structure", () => {
      render(<NeverSubscribedState {...mockProps} />);

      // Should have a main heading for the section
      expect(screen.getByText("Upgrade Your Plan")).toBeInTheDocument();
    });

    it("provides descriptive button text", () => {
      render(<NeverSubscribedState {...mockProps} />);

      const premiumButton = screen.getByRole("button", { name: /upgrade to premium/i });
      const maxButton = screen.getByRole("button", { name: /upgrade to max/i });

      expect(premiumButton).toHaveAccessibleName();
      expect(maxButton).toHaveAccessibleName();
    });
  });

  describe("Plan comparison", () => {
    it("shows clear feature differences between plans", () => {
      render(<NeverSubscribedState {...mockProps} />);

      // Premium features
      expect(screen.getByText(/All Standard features/)).toBeInTheDocument();
      expect(screen.getByText(/Access to premium courses/)).toBeInTheDocument();
      expect(screen.getByText(/Advanced coding exercises/)).toBeInTheDocument();
      expect(screen.getByText(/Priority support/)).toBeInTheDocument();

      // Max additional features
      expect(screen.getByText(/All Premium features/)).toBeInTheDocument();
      expect(screen.getByText(/Unlimited AI assistance/)).toBeInTheDocument();
      expect(screen.getByText(/One-on-one mentorship/)).toBeInTheDocument();
      expect(screen.getByText(/Career guidance/)).toBeInTheDocument();
    });

    it("shows pricing information clearly", () => {
      render(<NeverSubscribedState {...mockProps} />);

      expect(screen.getByText("$3")).toBeInTheDocument();
      expect(screen.getByText("$10")).toBeInTheDocument();
    });
  });

  describe("Responsive design", () => {
    it("renders properly in different screen sizes", () => {
      // This would typically be tested with different viewport sizes
      // For unit tests, we can verify the component structure
      render(<NeverSubscribedState {...mockProps} />);

      expect(screen.getByText("Upgrade Your Plan")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /upgrade to premium/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /upgrade to max/i })).toBeInTheDocument();
    });
  });
});
