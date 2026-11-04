import type { User } from "@/types/auth";

export function createMockUser(overrides?: Partial<User>): User {
  return {
    handle: "test-user",
    email: "test@example.com",
    name: "Test User",
    avatar_url: null,
    membership_type: "standard",
    lifetime_premium: false,
    can_purchase_premium: true,
    premium_purchase_pending: false,
    subscription_status: "never_subscribed",
    subscription: null,
    premium_prices: {
      currency: "usd",
      lifetime: 2999,
      country_code: null
    },
    provider: "email",
    email_confirmed: true,
    locale: "en",
    locales: ["en"],
    explicit_locale: null,
    ...overrides
  };
}
