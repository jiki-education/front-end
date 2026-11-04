/**
 * Tests for the Premium purchases API client
 */

import { createPurchaseCheckoutSession, verifyPurchaseCheckout } from "@/lib/api/premiumPurchases";
import { ApiError, CheckoutIncompleteError, api } from "@/lib/api/client";

// Mock only api.post; keep the real error classes so instanceof checks and
// CheckoutIncompleteError construction in verifyPurchaseCheckout still work.
jest.mock("@/lib/api/client", () => {
  const actual = jest.requireActual("@/lib/api/client");
  return { ...actual, api: { post: jest.fn() } };
});

const mockedApiPost = api.post as jest.MockedFunction<typeof api.post>;

describe("createPurchaseCheckoutSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("posts the return URL and returns the client secret", async () => {
    mockedApiPost.mockResolvedValue({ data: { client_secret: "cs_test_secret_123" }, status: 200, headers: {} } as any);

    const returnUrl = "https://example.com/settings?checkout_session_id={CHECKOUT_SESSION_ID}";
    const result = await createPurchaseCheckoutSession(returnUrl);

    expect(mockedApiPost).toHaveBeenCalledWith("/internal/premium_purchases/checkout_session", {
      return_url: returnUrl
    });
    expect(result).toEqual({ client_secret: "cs_test_secret_123" });
  });

  it("propagates API errors", async () => {
    mockedApiPost.mockRejectedValue(new Error("Network error"));

    await expect(createPurchaseCheckoutSession("https://example.com")).rejects.toThrow("Network error");
  });
});

describe("verifyPurchaseCheckout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("verifies a paid purchase", async () => {
    mockedApiPost.mockResolvedValue({
      data: { success: true, payment_state: "paid" },
      status: 200,
      headers: {}
    } as any);

    const result = await verifyPurchaseCheckout("cs_test_123");

    expect(mockedApiPost).toHaveBeenCalledWith("/internal/premium_purchases/verify_checkout", {
      session_id: "cs_test_123"
    });
    expect(result).toEqual({ success: true, payment_state: "paid" });
  });

  it("returns a purchase that is still processing", async () => {
    mockedApiPost.mockResolvedValue({
      data: { success: true, payment_state: "processing" },
      status: 200,
      headers: {}
    } as any);

    const result = await verifyPurchaseCheckout("cs_test_456");

    expect(result.payment_state).toBe("processing");
  });

  it("throws CheckoutIncompleteError carrying the decline code for an incomplete payment", async () => {
    mockedApiPost.mockRejectedValue(
      new ApiError(422, "Unprocessable Entity", {
        error: { type: "checkout_payment_incomplete", decline_code: "insufficient_funds", currency: "gbp" }
      })
    );

    const error = await verifyPurchaseCheckout("cs_test_decline").catch((e) => e);
    expect(error).toBeInstanceOf(CheckoutIncompleteError);
    expect(error.declineCode).toBe("insufficient_funds");
  });

  it("defaults the decline code to null when the API omits it", async () => {
    mockedApiPost.mockRejectedValue(
      new ApiError(422, "Unprocessable Entity", { error: { type: "checkout_payment_incomplete" } })
    );

    const error = await verifyPurchaseCheckout("cs_test_decline").catch((e) => e);
    expect(error).toBeInstanceOf(CheckoutIncompleteError);
    expect(error.declineCode).toBeNull();
  });

  it("rethrows a plain ApiError for a genuine invalid session", async () => {
    mockedApiPost.mockRejectedValue(new ApiError(422, "Unprocessable Entity", { error: { type: "invalid_session" } }));

    const error = await verifyPurchaseCheckout("cs_test_invalid").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).not.toBeInstanceOf(CheckoutIncompleteError);
  });
});
