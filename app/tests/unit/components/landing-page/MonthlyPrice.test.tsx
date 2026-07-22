import { render, screen } from "@testing-library/react";
import { MonthlyPrice } from "@/components/landing-page/MonthlyPrice";
import type { PremiumPrices } from "@/lib/pricing";

// Pin locale to en-US so tests don't depend on the developer's system locale
const _OriginalNumberFormat = Intl.NumberFormat;
jest.spyOn(Intl, "NumberFormat").mockImplementation((_, options) => new _OriginalNumberFormat("en-US", options));

let mockPrices: PremiumPrices | null = null;

jest.mock("@/lib/hooks/useExternalPremiumPrices", () => ({
  useExternalPremiumPrices: () => mockPrices
}));

describe("MonthlyPrice", () => {
  beforeEach(() => {
    mockPrices = null;
  });

  it("renders a skeleton placeholder while the price is loading", () => {
    render(<MonthlyPrice />);
    const skeleton = screen.getByTestId("monthly-price-skeleton");
    expect(skeleton).toBeInTheDocument();
    // No possibly-wrong price text is shown before the real price resolves
    expect(skeleton.textContent).toBe("");
  });

  it("renders the resolved price once loaded", () => {
    mockPrices = { currency: "usd", monthly: 999, annual: 9900, country_code: null };
    render(<MonthlyPrice />);
    expect(screen.queryByTestId("monthly-price-skeleton")).not.toBeInTheDocument();
    expect(screen.getByText(/9\.99/)).toBeInTheDocument();
  });
});
