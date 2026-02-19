import { render } from "@testing-library/react";
import { PremiumPrice, PremiumDailyPrice } from "@/components/common/PremiumPrice";

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

  it("handles uppercase currency from API", () => {
    mockUser = { premium_prices: { currency: "gbp", monthly: 799, annual: 7900, country_code: null } };
    const { container } = render(<PremiumPrice interval="monthly" />);
    expect(container.textContent).toMatch(/7\.99/);
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
});
