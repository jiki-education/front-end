import type { User } from "@/types/auth";

export function createMockUser(overrides?: Partial<User>): User {
  return {
    handle: "test-user",
    email: "test@example.com",
    name: "Test User",
    membership_type: "standard",
    subscription_status: "never_subscribed",
    subscription: null,
    premium_prices: {
      currency: "usd",
      monthly: 999,
      annual: 9900,
      country_code: null
    },
    provider: "email",
    email_confirmed: true,
    ...overrides
  };
}
