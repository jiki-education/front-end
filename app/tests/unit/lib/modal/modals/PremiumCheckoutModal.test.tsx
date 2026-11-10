import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useCheckout } from "@stripe/react-stripe-js/checkout";
import { trackEvent } from "@/lib/analytics";
import { hideModal } from "@/lib/modal/store";
import { PremiumCheckoutModal } from "@/lib/modal/modals/PremiumCheckoutModal";

jest.mock("@stripe/react-stripe-js/checkout", () => ({
  CheckoutProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PaymentElement: () => null,
  useCheckout: jest.fn()
}));
jest.mock("@/lib/stripe", () => ({ stripePromise: null }));
jest.mock("@/lib/analytics", () => ({
  ...jest.requireActual<Record<string, unknown>>("@/lib/analytics"),
  trackEvent: jest.fn()
}));
jest.mock("@/lib/modal/store", () => ({ hideModal: jest.fn() }));
jest.mock("@/components/common/PremiumPrice", () => ({ PremiumPrice: () => null }));
jest.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    const t = (key: string) => `${namespace}.${key}`;
    return Object.assign(t, { rich: t });
  }
}));

const CLOSE_LABEL = "common.closeButton.label";
const mockUseCheckout = useCheckout as jest.Mock;
const mockTrackEvent = trackEvent as jest.Mock;

describe("PremiumCheckoutModal funnel events", () => {
  let confirm: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    confirm = jest.fn();
    mockUseCheckout.mockReturnValue({ type: "success", checkout: { canConfirm: true, confirm } });
  });

  it("tracks checkout_closed with the trigger when the modal is closed", () => {
    const onCancel = jest.fn();
    render(
      <PremiumCheckoutModal
        clientSecret="cs"
        selectedTier="premium"
        trigger="challenges_page_locked_challenge"
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: CLOSE_LABEL }));

    expect(mockTrackEvent).toHaveBeenCalledWith("checkout_closed", { trigger: "challenges_page_locked_challenge" });
    expect(hideModal).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it("leaves out a missing trigger", () => {
    render(<PremiumCheckoutModal clientSecret="cs" selectedTier="premium" />);

    fireEvent.click(screen.getByRole("button", { name: CLOSE_LABEL }));

    expect(mockTrackEvent).toHaveBeenCalledWith("checkout_closed", {});
  });

  it("tracks checkout_submitted when the form is submitted", async () => {
    confirm.mockReturnValue(new Promise(() => {}));
    render(<PremiumCheckoutModal clientSecret="cs" selectedTier="premium" trigger="nav_upgrade_button" />);

    fireEvent.submit(screen.getByRole("form"));

    expect(mockTrackEvent).toHaveBeenCalledWith("checkout_submitted", { trigger: "nav_upgrade_button" });
    await waitFor(() => expect(confirm).toHaveBeenCalled());
    expect(mockTrackEvent).not.toHaveBeenCalledWith("checkout_failed", expect.anything());
  });

  it("tracks checkout_failed with the decline code when a payment is declined", async () => {
    confirm.mockResolvedValue({
      type: "error",
      error: { message: "Declined", code: "paymentFailed", paymentFailed: { declineCode: "insufficient_funds" } }
    });
    render(<PremiumCheckoutModal clientSecret="cs" selectedTier="premium" trigger="nav_upgrade_button" />);

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() =>
      expect(mockTrackEvent).toHaveBeenCalledWith("checkout_failed", {
        trigger: "nav_upgrade_button",
        error_code: "paymentFailed",
        decline_code: "insufficient_funds"
      })
    );
  });

  it("records a confirm error without a code as other", async () => {
    confirm.mockResolvedValue({ type: "error", error: { message: "Incomplete", code: null } });
    render(<PremiumCheckoutModal clientSecret="cs" selectedTier="premium" />);

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => expect(mockTrackEvent).toHaveBeenCalledWith("checkout_failed", { error_code: "other" }));
  });

  it("records a thrown confirm as an exception", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    confirm.mockRejectedValue(new Error("boom"));
    render(<PremiumCheckoutModal clientSecret="cs" selectedTier="premium" />);

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => expect(mockTrackEvent).toHaveBeenCalledWith("checkout_failed", { error_code: "exception" }));
  });
});
