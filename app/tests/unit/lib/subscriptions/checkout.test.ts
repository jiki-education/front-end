/**
 * Tests for checkout utilities
 */

import { createCheckoutReturnUrl } from "@/lib/subscriptions/checkout";

describe("createCheckoutReturnUrl", () => {
  it("creates URL with checkout_return flag and checkout_session_id placeholder", () => {
    const url = createCheckoutReturnUrl("/subscribe", "https://example.com");
    expect(url).toBe("https://example.com/subscribe?checkout_return=true&checkout_session_id={CHECKOUT_SESSION_ID}");
  });

  it("handles pathname with leading slash", () => {
    const url = createCheckoutReturnUrl("/dev/stripe-test", "https://example.com");
    expect(url).toBe(
      "https://example.com/dev/stripe-test?checkout_return=true&checkout_session_id={CHECKOUT_SESSION_ID}"
    );
  });

  it("handles pathname without leading slash", () => {
    const url = createCheckoutReturnUrl("subscribe", "https://example.com");
    expect(url).toBe("https://example.com/subscribe?checkout_return=true&checkout_session_id={CHECKOUT_SESSION_ID}");
  });

  it("preserves origin with port", () => {
    const url = createCheckoutReturnUrl("/subscribe", "http://localhost:3071");
    expect(url).toBe("http://localhost:3071/subscribe?checkout_return=true&checkout_session_id={CHECKOUT_SESSION_ID}");
  });

  it("handles nested paths", () => {
    const url = createCheckoutReturnUrl("/account/subscription", "https://example.com");
    expect(url).toBe(
      "https://example.com/account/subscription?checkout_return=true&checkout_session_id={CHECKOUT_SESSION_ID}"
    );
  });
});
