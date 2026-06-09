import { render } from "@testing-library/react";
import { PremiumPrice, PremiumDailyPrice } from "@/components/common/PremiumPrice";

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
    const { container } = render(<PremiumPrice interval="monthly" />);
    expect(container.textContent).toBe("");
  });

  it("renders monthly price for cent-based currency", () => {
    mockUser = { premium_prices: { currency: "usd", monthly: 999, annual: 9900, country_code: null } };
    const { container } = render(<PremiumPrice interval="monthly" />);
    expect(container.textContent).toMatch(/9\.99/);
  });

  it("renders annual price for cent-based currency", () => {
    mockUser = { premium_prices: { currency: "usd", monthly: 999, annual: 9900, country_code: null } };
    const { container } = render(<PremiumPrice interval="annual" />);
    expect(container.textContent).toMatch(/99/);
  });

  it("does not divide by 100 for zero-decimal currency", () => {
    mockUser = { premium_prices: { currency: "jpy", monthly: 999, annual: 9900, country_code: null } };
    const { container } = render(<PremiumPrice interval="monthly" />);
    expect(container.textContent).toMatch(/999/);
    expect(container.textContent).not.toMatch(/9\.99/);
  });

  it("divides by 100 for Stripe hundredfold zero-decimal currency (HUF)", () => {
    mockUser = { premium_prices: { currency: "huf", monthly: 149900, annual: 1499000, country_code: "HU" } };
    const { container } = render(<PremiumPrice interval="monthly" />);
    expect(container.textContent).toMatch(/1,499/);
    expect(container.textContent).not.toMatch(/149,900/);
  });

  it("handles uppercase currency from API", () => {
    mockUser = { premium_prices: { currency: "gbp", monthly: 799, annual: 7900, country_code: null } };
    const { container } = render(<PremiumPrice interval="monthly" />);
    expect(container.textContent).toMatch(/7\.99/);
  });

  it("disambiguates SGD with S$ prefix instead of bare $", () => {
    mockUser = { premium_prices: { currency: "sgd", monthly: 599, annual: 5900, country_code: "SG" } };
    const { container } = render(<PremiumPrice interval="monthly" />);
    expect(container.textContent).toMatch(/S\$/);
  });

  it("disambiguates CAD with CA$ prefix instead of bare $", () => {
    mockUser = { premium_prices: { currency: "cad", monthly: 599, annual: 5900, country_code: "CA" } };
    const { container } = render(<PremiumPrice interval="monthly" />);
    expect(container.textContent).toMatch(/CA\$/);
  });

  it("keeps USD as bare $ (no US$ prefix)", () => {
    mockUser = { premium_prices: { currency: "usd", monthly: 599, annual: 5900, country_code: "US" } };
    const { container } = render(<PremiumPrice interval="monthly" />);
    expect(container.textContent).toMatch(/^\$/);
  });
});

describe("PremiumDailyPrice", () => {
  beforeEach(() => {
    mockUser = null;
  });

  it("renders nothing when no user", () => {
    const { container } = render(<PremiumDailyPrice interval="monthly" />);
    expect(container.textContent).toBe("");
  });

  it("calculates daily price from monthly for cent-based currency", () => {
    mockUser = { premium_prices: { currency: "usd", monthly: 999, annual: 9900, country_code: null } };
    const { container } = render(<PremiumDailyPrice interval="monthly" />);
    // $9.99 / 30 = $0.33
    expect(container.textContent).toMatch(/0\.33/);
  });

  it("calculates daily price from annual for cent-based currency", () => {
    mockUser = { premium_prices: { currency: "usd", monthly: 999, annual: 9900, country_code: null } };
    const { container } = render(<PremiumDailyPrice interval="annual" />);
    // $99.00 / 365 = $0.27
    expect(container.textContent).toMatch(/0\.27/);
  });

  it("calculates daily price for zero-decimal currency", () => {
    mockUser = { premium_prices: { currency: "jpy", monthly: 999, annual: 9900, country_code: null } };
    const { container } = render(<PremiumDailyPrice interval="monthly" />);
    // ¥999 / 30 = ¥33
    expect(container.textContent).toMatch(/33/);
    expect(container.textContent).not.toMatch(/0\.33/);
  });

  it("calculates daily price for Stripe hundredfold zero-decimal currency (HUF)", () => {
    mockUser = { premium_prices: { currency: "huf", monthly: 149900, annual: 1499000, country_code: "HU" } };
    const { container } = render(<PremiumDailyPrice interval="monthly" />);
    // Ft 1,499 / 30 ≈ Ft 50 (HUF displays zero-decimal so 49.97 rounds to 50)
    expect(container.textContent).toMatch(/50/);
    expect(container.textContent).not.toMatch(/\./);
  });
});
