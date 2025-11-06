/**
 * Tests for subscriptions API client
 */

import {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
  verifyCheckoutSession
} from "@/lib/api/subscriptions";
import { api } from "@/lib/api/client";

// Mock the API client
jest.mock("@/lib/api/client", () => ({
  api: {
    post: jest.fn(),
    get: jest.fn()
  }
}));

const mockedApiPost = api.post as jest.MockedFunction<typeof api.post>;
const mockedApiGet = api.get as jest.MockedFunction<typeof api.get>;

describe("createCheckoutSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates checkout session with product only", async () => {
    const mockResponse = { data: { client_secret: "cs_test_secret_123" }, status: 200, headers: {} } as any;
    mockedApiPost.mockResolvedValue(mockResponse);

    const result = await createCheckoutSession("premium");

    expect(mockedApiPost).toHaveBeenCalledWith("/internal/subscriptions/checkout_session", {
      product: "premium",
      return_url: undefined
    });
    expect(result).toEqual({ client_secret: "cs_test_secret_123" });
  });

  it("creates checkout session with return URL", async () => {
    const mockResponse = { data: { client_secret: "cs_test_secret_456" }, status: 200, headers: {} } as any;
    mockedApiPost.mockResolvedValue(mockResponse);

    const returnUrl = "https://example.com/subscribe?session_id={CHECKOUT_SESSION_ID}";
    const result = await createCheckoutSession("max", returnUrl);

    expect(mockedApiPost).toHaveBeenCalledWith("/internal/subscriptions/checkout_session", {
      product: "max",
      return_url: returnUrl
    });
    expect(result).toEqual({ client_secret: "cs_test_secret_456" });
  });

  it("propagates API errors", async () => {
    mockedApiPost.mockRejectedValue(new Error("Network error"));

    await expect(createCheckoutSession("premium")).rejects.toThrow("Network error");
  });
});

describe("createPortalSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates portal session successfully", async () => {
    const mockResponse = { data: { url: "https://billing.stripe.com/session/123" }, status: 200, headers: {} } as any;
    mockedApiPost.mockResolvedValue(mockResponse);

    const result = await createPortalSession();

    expect(mockedApiPost).toHaveBeenCalledWith("/internal/subscriptions/portal_session");
    expect(result).toEqual({ url: "https://billing.stripe.com/session/123" });
  });

  it("propagates API errors", async () => {
    mockedApiPost.mockRejectedValue(new Error("No customer found"));

    await expect(createPortalSession()).rejects.toThrow("No customer found");
  });
});

describe("getSubscriptionStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches subscription status successfully", async () => {
    const mockResponse = {
      data: {
        subscription: {
          tier: "premium",
          status: "active",
          current_period_end: "2025-01-01T00:00:00Z",
          payment_failed: false,
          in_grace_period: false,
          grace_period_ends_at: null
        }
      },
      status: 200,
      headers: {}
    } as any;
    mockedApiGet.mockResolvedValue(mockResponse);

    const result = await getSubscriptionStatus();

    expect(mockedApiGet).toHaveBeenCalledWith("/internal/subscriptions/status");
    expect(result).toEqual(mockResponse.data);
  });

  it("handles subscription with grace period", async () => {
    const mockResponse = {
      data: {
        subscription: {
          tier: "max",
          status: "past_due",
          current_period_end: "2025-01-01T00:00:00Z",
          payment_failed: true,
          in_grace_period: true,
          grace_period_ends_at: "2025-01-08T00:00:00Z"
        }
      },
      status: 200,
      headers: {}
    } as any;
    mockedApiGet.mockResolvedValue(mockResponse);

    const result = await getSubscriptionStatus();

    expect(result.subscription.in_grace_period).toBe(true);
    expect(result.subscription.grace_period_ends_at).toBe("2025-01-08T00:00:00Z");
  });

  it("propagates API errors", async () => {
    mockedApiGet.mockRejectedValue(new Error("Unauthorized"));

    await expect(getSubscriptionStatus()).rejects.toThrow("Unauthorized");
  });
});

describe("verifyCheckoutSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("verifies checkout session successfully", async () => {
    const mockResponse = { data: { success: true, status: "complete" }, status: 200, headers: {} } as any;
    mockedApiPost.mockResolvedValue(mockResponse);

    const result = await verifyCheckoutSession("cs_test_123");

    expect(mockedApiPost).toHaveBeenCalledWith("/internal/subscriptions/verify_checkout", {
      session_id: "cs_test_123"
    });
    expect(result).toEqual({ success: true, status: "complete" });
  });

  it("handles verification failure", async () => {
    const mockResponse = { data: { success: false, status: "open" }, status: 200, headers: {} } as any;
    mockedApiPost.mockResolvedValue(mockResponse);

    const result = await verifyCheckoutSession("cs_test_456");

    expect(result).toEqual({ success: false, status: "open" });
  });

  it("propagates API errors", async () => {
    mockedApiPost.mockRejectedValue(new Error("Session not found"));

    await expect(verifyCheckoutSession("cs_test_invalid")).rejects.toThrow("Session not found");
  });
});
