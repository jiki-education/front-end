import { render, screen } from "@testing-library/react";
import { LifetimePrice } from "@/components/landing-page/LifetimePrice";
import type { PremiumPrices } from "@/lib/pricing";

// Pin locale to en-US so tests don't depend on the developer's system locale
const _OriginalNumberFormat = Intl.NumberFormat;
jest.spyOn(Intl, "NumberFormat").mockImplementation((_, options) => new _OriginalNumberFormat("en-US", options));

let mockPrices: PremiumPrices | null = null;

jest.mock("@/lib/hooks/useExternalPremiumPrices", () => ({
  useExternalPremiumPrices: () => mockPrices
}));

describe("LifetimePrice", () => {
  beforeEach(() => {
    mockPrices = null;
  });

  it("renders a skeleton placeholder while the price is loading", () => {
    render(<LifetimePrice />);
    const skeleton = screen.getByTestId("lifetime-price-skeleton");
    expect(skeleton).toBeInTheDocument();
    // No possibly-wrong price text is shown before the real price resolves
    expect(skeleton.textContent).toBe("");
  });

  it("renders the resolved price once loaded", () => {
    mockPrices = { currency: "usd", lifetime: 2999, country_code: null };
    render(<LifetimePrice />);
    expect(screen.queryByTestId("lifetime-price-skeleton")).not.toBeInTheDocument();
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
  });
});
