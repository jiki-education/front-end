/**
 * Tests for subscriptions API client
 */

import { createCheckoutSession, createPortalSession, verifyCheckoutSession } from "@/lib/api/subscriptions";
import { ApiError, CheckoutIncompleteError, api } from "@/lib/api/client";

// Mock only api.post; keep the real error classes so instanceof checks and
// CheckoutIncompleteError construction in verifyCheckoutSession still work.
jest.mock("@/lib/api/client", () => {
  const actual = jest.requireActual("@/lib/api/client");
  return { ...actual, api: { post: jest.fn() } };
});

const mockedApiPost = api.post as jest.MockedFunction<typeof api.post>;

describe("createCheckoutSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates checkout session with interval only", async () => {
    const mockResponse = { data: { client_secret: "cs_test_secret_123" }, status: 200, headers: {} } as any;
    mockedApiPost.mockResolvedValue(mockResponse);

    const result = await createCheckoutSession("monthly");

    expect(mockedApiPost).toHaveBeenCalledWith("/internal/subscriptions/checkout_session", {
      interval: "monthly",
      return_url: undefined,
      customer_email: undefined
    });
    expect(result).toEqual({ client_secret: "cs_test_secret_123" });
  });

  it("creates checkout session with return URL", async () => {
    const mockResponse = { data: { client_secret: "cs_test_secret_456" }, status: 200, headers: {} } as any;
    mockedApiPost.mockResolvedValue(mockResponse);

    const returnUrl = "https://example.com/subscribe?session_id={CHECKOUT_SESSION_ID}";
    const result = await createCheckoutSession("annual", returnUrl);

    expect(mockedApiPost).toHaveBeenCalledWith("/internal/subscriptions/checkout_session", {
      interval: "annual",
      return_url: returnUrl,
      customer_email: undefined
    });
    expect(result).toEqual({ client_secret: "cs_test_secret_456" });
  });

  it("propagates API errors", async () => {
    mockedApiPost.mockRejectedValue(new Error("Network error"));

    await expect(createCheckoutSession("monthly")).rejects.toThrow("Network error");
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

  it("throws CheckoutIncompleteError carrying the decline reason and interval for an incomplete payment", async () => {
    mockedApiPost.mockRejectedValue(
      new ApiError(422, "Unprocessable Entity", {
        error: {
          type: "checkout_payment_incomplete",
          message: "Your payment wasn't completed. Please try again.",
          decline_reason: "Your card has insufficient funds.",
          interval: "monthly"
        }
      })
    );

    const error = await verifyCheckoutSession("cs_test_decline").catch((e) => e);
    expect(error).toBeInstanceOf(CheckoutIncompleteError);
    expect(error.declineReason).toBe("Your card has insufficient funds.");
    expect(error.interval).toBe("monthly");
  });

  it("defaults the interval to annual and the reason to null when the API omits them", async () => {
    mockedApiPost.mockRejectedValue(
      new ApiError(422, "Unprocessable Entity", { error: { type: "checkout_payment_incomplete" } })
    );

    const error = await verifyCheckoutSession("cs_test_decline").catch((e) => e);
    expect(error).toBeInstanceOf(CheckoutIncompleteError);
    expect(error.declineReason).toBeNull();
    expect(error.interval).toBe("annual");
  });

  it("rethrows a plain ApiError (not CheckoutIncompleteError) for a genuine invalid session", async () => {
    mockedApiPost.mockRejectedValue(
      new ApiError(422, "Unprocessable Entity", { error: { type: "invalid_session", message: "Invalid session" } })
    );

    const error = await verifyCheckoutSession("cs_test_invalid").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).not.toBeInstanceOf(CheckoutIncompleteError);
  });
});
