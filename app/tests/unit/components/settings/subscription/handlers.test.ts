/**
 * Unit tests for subscription handlers
 */
import * as subscriptionApi from "@/lib/api/subscriptions";
import * as purchaseApi from "@/lib/api/premiumPurchases";
import * as checkoutUtils from "@/lib/subscriptions/checkout";
import * as handlers from "@/components/settings/subscription/handlers";
import { showPremiumCheckout } from "@/lib/modal/app";
import { toastError, toastSuccess } from "@/lib/toast";
import { toastApiError } from "@/lib/api/apiErrors";
import { ApiError } from "@/lib/api/client";

// Mock the external dependencies
jest.mock("@/lib/api/subscriptions");
jest.mock("@/lib/api/premiumPurchases");
jest.mock("@/lib/subscriptions/checkout");
jest.mock("@/lib/modal");
jest.mock("@/lib/modal/app");
jest.mock("@/lib/toast");
jest.mock("@/lib/api/apiErrors");
jest.mock("react-hot-toast");

const mockSubscriptionApi = subscriptionApi as jest.Mocked<typeof subscriptionApi>;
const mockPurchaseApi = purchaseApi as jest.Mocked<typeof purchaseApi>;
const mockCheckoutUtils = checkoutUtils as jest.Mocked<typeof checkoutUtils>;
const mockShowPremiumCheckout = showPremiumCheckout as jest.MockedFunction<typeof showPremiumCheckout>;
const mockToastError = toastError as jest.MockedFunction<typeof toastError>;
const mockToastSuccess = toastSuccess as jest.MockedFunction<typeof toastSuccess>;
const mockToastApiError = toastApiError as jest.MockedFunction<typeof toastApiError>;

describe("Subscription handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("handlePurchasePremium", () => {
    it("creates a purchase checkout session and opens checkout", async () => {
      const mockResponse = { client_secret: "cs_test_123" };
      mockCheckoutUtils.createCheckoutReturnUrl.mockReturnValue(
        "https://example.com/settings?session_id={CHECKOUT_SESSION_ID}"
      );
      mockPurchaseApi.createPurchaseCheckoutSession.mockResolvedValue(mockResponse);

      await handlers.handlePurchasePremium();

      expect(mockCheckoutUtils.createCheckoutReturnUrl).toHaveBeenCalledWith("/settings");
      expect(mockPurchaseApi.createPurchaseCheckoutSession).toHaveBeenCalledWith(
        "https://example.com/settings?session_id={CHECKOUT_SESSION_ID}",
        "upgrade_cta_settings"
      );
      expect(mockShowPremiumCheckout).toHaveBeenCalledWith({
        clientSecret: "cs_test_123",
        selectedTier: "premium",
        trigger: "upgrade_cta_settings",
        priorError: undefined,
        onCancel: undefined,
        backdrop: undefined
      });
    });

    it("passes onCancel to the checkout modal so the caller can reopen its own modal", async () => {
      mockPurchaseApi.createPurchaseCheckoutSession.mockResolvedValue({ client_secret: "cs_test_123" });
      const onCancel = jest.fn();

      await handlers.handlePurchasePremium({ onCancel });

      expect(mockShowPremiumCheckout).toHaveBeenCalledWith(expect.objectContaining({ onCancel }));
    });

    it("shows the generic failure for an unexpected error", async () => {
      const mockError = new Error("Network error");
      mockPurchaseApi.createPurchaseCheckoutSession.mockRejectedValue(mockError);

      await expect(handlers.handlePurchasePremium()).rejects.toThrow("Network error");

      expect(mockToastError).toHaveBeenCalledWith("subscription.checkoutSessionFailed");
      expect(mockToastApiError).not.toHaveBeenCalled();
    });

    it.each(["already_premium", "purchase_pending"])("shows the API's own copy for %s", async (type) => {
      const mockError = new ApiError(400, "Bad Request", { error: { type } });
      mockPurchaseApi.createPurchaseCheckoutSession.mockRejectedValue(mockError);

      await expect(handlers.handlePurchasePremium()).rejects.toBe(mockError);

      expect(mockToastApiError).toHaveBeenCalledWith(mockError, "subscriptions");
      expect(mockToastError).not.toHaveBeenCalled();
    });
  });

  describe("handleOpenPortal", () => {
    it("opens customer portal successfully", async () => {
      const mockResponse = { url: "https://billing.stripe.com/session/123" };
      mockSubscriptionApi.createPortalSession.mockResolvedValue(mockResponse);

      await handlers.handleOpenPortal();

      expect(mockSubscriptionApi.createPortalSession).toHaveBeenCalled();
      // Note: Can't easily test window.location.href assignment in jsdom
    });

    it("handles portal opening failure", async () => {
      const mockError = new Error("Portal error");
      mockSubscriptionApi.createPortalSession.mockRejectedValue(mockError);

      await handlers.handleOpenPortal();

      expect(mockToastError).toHaveBeenCalledWith("subscription.portalFailed");
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });

  describe("handleCancelSubscription", () => {
    it("cancels subscription successfully", async () => {
      const mockRefreshUser = jest.fn().mockResolvedValue(undefined);
      const mockResponse = {
        success: true,
        cancels_at: "2024-12-31T23:59:59Z"
      };
      mockSubscriptionApi.cancelSubscription.mockResolvedValue(mockResponse);

      await handlers.handleCancelSubscription(mockRefreshUser);

      expect(mockSubscriptionApi.cancelSubscription).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith("subscription.canceled", { date: expect.any(String) });
      expect(mockRefreshUser).toHaveBeenCalled();
    });

    it("handles cancellation failure with no API error type", async () => {
      const mockRefreshUser = jest.fn();
      const mockError = new Error("Cancellation failed");
      mockSubscriptionApi.cancelSubscription.mockRejectedValue(mockError);

      await handlers.handleCancelSubscription(mockRefreshUser);

      expect(mockToastError).toHaveBeenCalledWith("subscription.cancelFailed");
      expect(console.error).toHaveBeenCalledWith(mockError);
    });

    it("shows copy for the type when the API sent one", async () => {
      const mockRefreshUser = jest.fn();
      const mockError = new ApiError(422, "Unprocessable Entity", { error: { type: "not_cancelling" } });
      mockSubscriptionApi.cancelSubscription.mockRejectedValue(mockError);

      await handlers.handleCancelSubscription(mockRefreshUser);

      expect(mockToastApiError).toHaveBeenCalledWith(mockError, "subscriptions");
      expect(mockToastError).not.toHaveBeenCalled();
    });
  });

  describe("handleReactivateSubscription", () => {
    it("reactivates subscription successfully", async () => {
      const mockRefreshUser = jest.fn().mockResolvedValue(undefined);
      mockSubscriptionApi.reactivateSubscription.mockResolvedValue({
        success: true,
        subscription_valid_until: "2024-12-31T23:59:59Z"
      });

      await handlers.handleReactivateSubscription(mockRefreshUser);

      expect(mockSubscriptionApi.reactivateSubscription).toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith("subscription.reactivated");
      expect(mockRefreshUser).toHaveBeenCalled();
    });
  });

  describe("handleRetryPayment", () => {
    it("opens portal for payment retry", async () => {
      const mockRefreshUser = jest.fn();
      const mockResponse = { url: "https://billing.stripe.com/session/retry" };
      mockSubscriptionApi.createPortalSession.mockResolvedValue(mockResponse);

      await handlers.handleRetryPayment(mockRefreshUser);

      expect(mockSubscriptionApi.createPortalSession).toHaveBeenCalled();
      // Note: Can't easily test window.location.href assignment in jsdom
      // Note: refreshUser is not called because user will be redirected
    });

    it("handles retry payment failure", async () => {
      const mockRefreshUser = jest.fn();
      const mockError = new Error("Portal error");
      mockSubscriptionApi.createPortalSession.mockRejectedValue(mockError);

      await handlers.handleRetryPayment(mockRefreshUser);

      expect(mockToastError).toHaveBeenCalledWith("subscription.portalFailed");
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });
});
