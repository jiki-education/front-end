/**
 * Unit tests for subscription handlers
 */
import * as subscriptionApi from "@/lib/api/subscriptions";
import * as checkoutUtils from "@/lib/subscriptions/checkout";
import * as handlers from "@/components/settings/subscription/handlers";
import { showSubscriptionCheckout } from "@/lib/modal/app";
import { toastError, toastSuccess } from "@/lib/toast";
import toast from "react-hot-toast";

// Mock the external dependencies
jest.mock("@/lib/api/subscriptions");
jest.mock("@/lib/subscriptions/checkout");
jest.mock("@/lib/modal");
jest.mock("@/lib/modal/app");
jest.mock("@/lib/toast");
jest.mock("react-hot-toast");

const mockSubscriptionApi = subscriptionApi as jest.Mocked<typeof subscriptionApi>;
const mockCheckoutUtils = checkoutUtils as jest.Mocked<typeof checkoutUtils>;
const mockShowSubscriptionCheckout = showSubscriptionCheckout as jest.MockedFunction<typeof showSubscriptionCheckout>;
const mockToastError = toastError as jest.MockedFunction<typeof toastError>;
const mockToastSuccess = toastSuccess as jest.MockedFunction<typeof toastSuccess>;
// Raw react-hot-toast is still used directly for dynamic server error messages.
const mockToast = toast as jest.Mocked<typeof toast>;

describe("Subscription handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("handleSubscribe", () => {
    const mockParams = {
      interval: "monthly" as const,
      userEmail: "test@example.com"
    };

    it("creates checkout session successfully", async () => {
      const mockResponse = { client_secret: "cs_test_123" };
      mockCheckoutUtils.createCheckoutReturnUrl.mockReturnValue(
        "https://example.com/settings?session_id={CHECKOUT_SESSION_ID}"
      );
      mockSubscriptionApi.createCheckoutSession.mockResolvedValue(mockResponse);

      await handlers.handleSubscribe(mockParams);

      expect(mockCheckoutUtils.createCheckoutReturnUrl).toHaveBeenCalledWith("/settings");
      expect(mockSubscriptionApi.createCheckoutSession).toHaveBeenCalledWith(
        "monthly",
        "https://example.com/settings?session_id={CHECKOUT_SESSION_ID}",
        "test@example.com"
      );
      expect(mockShowSubscriptionCheckout).toHaveBeenCalledWith({
        clientSecret: "cs_test_123",
        selectedTier: "premium",
        onCancel: expect.any(Function)
      });
    });

    it("handles checkout session creation failure", async () => {
      const mockError = new Error("Network error");
      mockSubscriptionApi.createCheckoutSession.mockRejectedValue(mockError);

      await expect(handlers.handleSubscribe(mockParams)).rejects.toThrow("Network error");

      expect(mockToastError).toHaveBeenCalledWith("subscription.checkoutSessionFailed");
      expect(console.error).toHaveBeenCalledWith(mockError);
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

    it("handles cancellation failure", async () => {
      const mockRefreshUser = jest.fn();
      const mockError = new Error("Cancellation failed");
      mockSubscriptionApi.cancelSubscription.mockRejectedValue(mockError);

      await handlers.handleCancelSubscription(mockRefreshUser);

      expect(mockToast.error).toHaveBeenCalledWith("Cancellation failed");
      expect(console.error).toHaveBeenCalledWith(mockError);
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
