/**
 * Unit tests for subscription handlers
 */
import * as subscriptionApi from "@/lib/api/subscriptions";
import * as checkoutUtils from "@/lib/subscriptions/checkout";
import * as handlers from "@/components/settings/subscription/handlers";
import { showModal } from "@/lib/modal";
import toast from "react-hot-toast";

// Mock the external dependencies
jest.mock("@/lib/api/subscriptions");
jest.mock("@/lib/subscriptions/checkout");
jest.mock("@/lib/modal");
jest.mock("react-hot-toast");

const mockSubscriptionApi = subscriptionApi as jest.Mocked<typeof subscriptionApi>;
const mockCheckoutUtils = checkoutUtils as jest.Mocked<typeof checkoutUtils>;
const mockShowModal = showModal as jest.MockedFunction<typeof showModal>;
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
      tier: "premium" as const,
      userEmail: "test@example.com",
      returnPath: "/settings"
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
        "premium",
        "https://example.com/settings?session_id={CHECKOUT_SESSION_ID}",
        "test@example.com"
      );
      expect(mockShowModal).toHaveBeenCalledWith("subscription-checkout-modal", {
        clientSecret: "cs_test_123",
        selectedTier: "premium",
        onCancel: expect.any(Function)
      });
    });

    it("handles checkout session creation failure", async () => {
      const mockError = new Error("Network error");
      mockSubscriptionApi.createCheckoutSession.mockRejectedValue(mockError);

      await handlers.handleSubscribe(mockParams);

      expect(mockToast.error).toHaveBeenCalledWith("Failed to create checkout session");
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

      expect(mockToast.error).toHaveBeenCalledWith("Failed to open customer portal");
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });

  describe("handleUpgradeToPremium", () => {
    it("upgrades to Premium successfully", async () => {
      const mockRefreshUser = jest.fn().mockResolvedValue(undefined);
      mockSubscriptionApi.updateSubscription.mockResolvedValue({
        success: true,
        tier: "premium",
        effective_at: "2024-01-01T00:00:00Z",
        subscription_valid_until: "2024-12-31T23:59:59Z"
      });

      await handlers.handleUpgradeToPremium(mockRefreshUser);

      expect(mockSubscriptionApi.updateSubscription).toHaveBeenCalledWith("premium");
      expect(mockToast.success).toHaveBeenCalledWith("Successfully upgraded to Premium!");
      expect(mockRefreshUser).toHaveBeenCalled();
    });

    it("handles upgrade failure", async () => {
      const mockRefreshUser = jest.fn();
      const mockError = new Error("Upgrade failed");
      mockSubscriptionApi.updateSubscription.mockRejectedValue(mockError);

      await handlers.handleUpgradeToPremium(mockRefreshUser);

      expect(mockToast.error).toHaveBeenCalledWith("Upgrade failed");
      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(mockRefreshUser).not.toHaveBeenCalled();
    });

    it("handles generic error objects", async () => {
      const mockRefreshUser = jest.fn();
      const mockError = { message: "Generic error" };
      mockSubscriptionApi.updateSubscription.mockRejectedValue(mockError);

      await handlers.handleUpgradeToPremium(mockRefreshUser);

      expect(mockToast.error).toHaveBeenCalledWith("Failed to upgrade subscription");
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
      expect(mockToast.success).toHaveBeenCalledWith(
        expect.stringContaining("Subscription canceled. You'll keep access until")
      );
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
      expect(mockToast.success).toHaveBeenCalledWith("Subscription reactivated!");
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

      expect(mockToast.error).toHaveBeenCalledWith("Failed to open customer portal");
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });

  describe("Error message handling", () => {
    it("uses error message when Error object is provided", async () => {
      const mockRefreshUser = jest.fn();
      const mockError = new Error("Custom error message");
      mockSubscriptionApi.updateSubscription.mockRejectedValue(mockError);

      await handlers.handleUpgradeToPremium(mockRefreshUser);

      expect(mockToast.error).toHaveBeenCalledWith("Custom error message");
    });

    it("uses generic message when non-Error object is thrown", async () => {
      const mockRefreshUser = jest.fn();
      const mockError = "String error";
      mockSubscriptionApi.updateSubscription.mockRejectedValue(mockError);

      await handlers.handleUpgradeToPremium(mockRefreshUser);

      expect(mockToast.error).toHaveBeenCalledWith("Failed to upgrade subscription");
    });

    it("uses generic message when error has no message property", async () => {
      const mockRefreshUser = jest.fn();
      const mockError = { code: "UNKNOWN" };
      mockSubscriptionApi.updateSubscription.mockRejectedValue(mockError);

      await handlers.handleUpgradeToPremium(mockRefreshUser);

      expect(mockToast.error).toHaveBeenCalledWith("Failed to upgrade subscription");
    });
  });
});
