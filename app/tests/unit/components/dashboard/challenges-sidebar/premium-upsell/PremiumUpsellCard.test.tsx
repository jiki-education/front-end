import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  PREMIUM_UPSELL_VARIANTS,
  PremiumUpsellCard,
  type PremiumUpsellVariant
} from "@/components/dashboard/challenges-sidebar/ui/premium-upsell/PremiumUpsellCard";
import { createMockUser } from "@/tests/mocks/user";

let mockUser = createMockUser();

jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: (selector: (state: { user: unknown }) => unknown) => selector({ user: mockUser })
}));

const CARD_VARIANTS: PremiumUpsellVariant[] = ["accelerate", "testimonials", "neverGetStuck"];

describe("PremiumUpsellCard", () => {
  beforeEach(() => {
    mockUser = createMockUser();
    localStorage.clear();
  });

  it("shows the next card in the rotation on each visit", () => {
    const headings = [
      "Accelerate your learning!",
      "Join the Premium team",
      "Never get stuck again",
      "New Challenges Await!"
    ];

    for (const heading of [...headings, headings[0]]) {
      const { unmount } = render(<PremiumUpsellCard onUpgradeClick={jest.fn()} />);
      expect(document.body).toHaveTextContent(heading);
      unmount();
    }
  });

  it("keeps the same card while the page stays open", () => {
    const { rerender } = render(<PremiumUpsellCard onUpgradeClick={jest.fn()} />);
    rerender(<PremiumUpsellCard onUpgradeClick={jest.fn()} />);

    expect(document.body).toHaveTextContent("Accelerate your learning!");
  });

  it.each(CARD_VARIANTS)("calls onUpgradeClick from the %s card's button", (variant) => {
    const Card = PREMIUM_UPSELL_VARIANTS[variant];
    const onUpgradeClick = jest.fn();
    render(<Card onUpgradeClick={onUpgradeClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Upgrade to Premium" }));

    expect(onUpgradeClick).toHaveBeenCalledTimes(1);
  });

  it.each(CARD_VARIANTS)("swaps the %s card's button for a note while a purchase is pending", (variant) => {
    mockUser = createMockUser({ premium_purchase_pending: true });
    const Card = PREMIUM_UPSELL_VARIANTS[variant];
    render(<Card onUpgradeClick={jest.fn()} />);

    expect(screen.queryByRole("button", { name: "Upgrade to Premium" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/still being processed/);
  });

  describe("testimonials card", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.matchMedia = jest.fn().mockReturnValue({ matches: false });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("moves on to the next quote every few seconds", () => {
      const Card = PREMIUM_UPSELL_VARIANTS.testimonials;
      render(<Card onUpgradeClick={jest.fn()} />);

      expect(screen.getByRole("button", { name: "Show testimonial 1" })).toHaveAttribute("aria-current", "true");
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(screen.getByRole("button", { name: "Show testimonial 2" })).toHaveAttribute("aria-current", "true");
    });

    it("jumps to a quote when its dot is clicked", () => {
      const Card = PREMIUM_UPSELL_VARIANTS.testimonials;
      render(<Card onUpgradeClick={jest.fn()} />);

      fireEvent.click(screen.getByRole("button", { name: "Show testimonial 4" }));

      expect(screen.getByRole("button", { name: "Show testimonial 4" })).toHaveAttribute("aria-current", "true");
    });
  });
});

describe("PremiumUpsellCard trigger", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("passes the shown variant's trigger to onUpgradeClick", () => {
    const onUpgradeClick = jest.fn();
    render(<PremiumUpsellCard onUpgradeClick={onUpgradeClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Upgrade to Premium" }));

    expect(onUpgradeClick).toHaveBeenCalledWith("dashboard_sidebar_accelerate");
  });
});
