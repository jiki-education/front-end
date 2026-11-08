import { render } from "@testing-library/react";
import { PremiumPrice } from "@/components/common/PremiumPrice";

// Pin locale to en-US so tests don't depend on the developer's system locale
const _OriginalNumberFormat = Intl.NumberFormat;
jest.spyOn(Intl, "NumberFormat").mockImplementation((_, options) => new _OriginalNumberFormat("en-US", options));

let mockUser: any = null;

jest.mock("@/lib/auth/authStore", () => ({
  useAuthStore: (selector: (s: any) => unknown) => selector({ user: mockUser })
}));

describe("PremiumPrice", () => {
  beforeEach(() => {
    mockUser = null;
  });

  it("renders nothing when no user", () => {
    const { container } = render(<PremiumPrice />);
    expect(container.textContent).toBe("");
  });

  it("renders the lifetime price for cent-based currency", () => {
    mockUser = { premium_prices: { currency: "usd", lifetime: 999, country_code: null } };
    const { container } = render(<PremiumPrice />);
    expect(container.textContent).toMatch(/9\.99/);
  });

  it("does not divide by 100 for zero-decimal currency", () => {
    mockUser = { premium_prices: { currency: "jpy", lifetime: 999, country_code: null } };
    const { container } = render(<PremiumPrice />);
    expect(container.textContent).toMatch(/999/);
    expect(container.textContent).not.toMatch(/9\.99/);
  });

  it("divides by 100 for Stripe hundredfold zero-decimal currency (HUF)", () => {
    mockUser = { premium_prices: { currency: "huf", lifetime: 149900, country_code: "HU" } };
    const { container } = render(<PremiumPrice />);
    expect(container.textContent).toMatch(/1,499/);
    expect(container.textContent).not.toMatch(/149,900/);
  });

  it("divides by 100 for a currency Intl reports as zero-decimal (RSD)", () => {
    mockUser = { premium_prices: { currency: "rsd", lifetime: 39900, country_code: "RS" } };
    const { container } = render(<PremiumPrice />);
    expect(container.textContent).toMatch(/399/);
    expect(container.textContent).not.toMatch(/39,900/);
  });

  it("handles uppercase currency from API", () => {
    mockUser = { premium_prices: { currency: "gbp", lifetime: 799, country_code: null } };
    const { container } = render(<PremiumPrice />);
    expect(container.textContent).toMatch(/7\.99/);
  });

  it("disambiguates SGD with S$ prefix instead of bare $", () => {
    mockUser = { premium_prices: { currency: "sgd", lifetime: 599, country_code: "SG" } };
    const { container } = render(<PremiumPrice />);
    expect(container.textContent).toMatch(/S\$/);
  });

  it("disambiguates CAD with CA$ prefix instead of bare $", () => {
    mockUser = { premium_prices: { currency: "cad", lifetime: 599, country_code: "CA" } };
    const { container } = render(<PremiumPrice />);
    expect(container.textContent).toMatch(/CA\$/);
  });

  it("keeps USD as bare $ (no US$ prefix)", () => {
    mockUser = { premium_prices: { currency: "usd", lifetime: 599, country_code: "US" } };
    const { container } = render(<PremiumPrice />);
    expect(container.textContent).toMatch(/^\$/);
  });
});
