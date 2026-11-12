import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useCheckout } from "@stripe/react-stripe-js/checkout";
import { trackEvent } from "@/lib/analytics";
import { hideModal } from "@/lib/modal/store";
import { getStripe } from "@/lib/stripe";
import { PremiumCheckoutModal } from "@/lib/modal/modals/PremiumCheckoutModal";
import { CONNECTION_TIMEOUT_MS } from "@/lib/modal/modals/PremiumCheckoutModal/useStripeConnection";

interface PaymentElementProps {
  onReady?: () => void;
  onChange?: (event: { value: { type: string } }) => void;
  onLoadError?: (event: { error: { message: string } }) => void;
}

const paymentElement: { props: PaymentElementProps } = { props: {} };

jest.mock("@stripe/react-stripe-js/checkout", () => ({
  CheckoutProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PaymentElement: (props: PaymentElementProps) => {
    paymentElement.props = props;
    return null;
  },
  useCheckout: jest.fn()
}));
jest.mock("@/lib/stripe", () => ({ getStripe: jest.fn() }));
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
const RETRY_LABEL = "common.retry";
const CONNECTING = "modals.subscriptionCheckout.connectingToStripe";
const CONNECTION_FAILED = "modals.subscriptionCheckout.connectionFailedTitle";
const mockUseCheckout = useCheckout as jest.Mock;
const mockTrackEvent = trackEvent as jest.Mock;
const mockGetStripe = getStripe as jest.Mock;

function eventsNamed(name: string) {
  return mockTrackEvent.mock.calls.filter(([event]) => event === name).map(([, properties]) => properties);
}

// Renders checkout and lets Stripe.js "load", so the payment form is mounted
async function renderCheckout(props: Partial<React.ComponentProps<typeof PremiumCheckoutModal>> = {}) {
  render(<PremiumCheckoutModal clientSecret="cs" selectedTier="premium" {...props} />);
  await act(async () => {});
}

function readyPaymentElement() {
  act(() => paymentElement.props.onReady?.());
}

function selectPaymentMethod(type: string) {
  act(() => paymentElement.props.onChange?.({ value: { type } }));
}

describe("PremiumCheckoutModal", () => {
  let confirm: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    paymentElement.props = {};
    confirm = jest.fn();
    mockGetStripe.mockResolvedValue({});
    mockUseCheckout.mockReturnValue({ type: "success", checkout: { canConfirm: true, confirm } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe("checkout_closed", () => {
    it("tracks the trigger, stage and seconds open, then calls onCancel", async () => {
      const onCancel = jest.fn();
      await renderCheckout({ trigger: "challenges_page_locked_challenge", onCancel });
      readyPaymentElement();

      fireEvent.click(screen.getByRole("button", { name: CLOSE_LABEL }));

      expect(mockTrackEvent).toHaveBeenCalledWith("checkout_closed", {
        trigger: "challenges_page_locked_challenge",
        stage: "form",
        seconds_open: 0
      });
      expect(hideModal).toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });

    it("leaves out a missing trigger", async () => {
      await renderCheckout();
      readyPaymentElement();

      fireEvent.click(screen.getByRole("button", { name: CLOSE_LABEL }));

      expect(eventsNamed("checkout_closed")).toEqual([{ stage: "form", seconds_open: 0 }]);
    });

    it("records the loading stage when the payment form never became ready", () => {
      mockGetStripe.mockReturnValue(new Promise(() => {}));
      render(<PremiumCheckoutModal clientSecret="cs" selectedTier="premium" trigger="nav_upgrade_button" />);

      fireEvent.click(screen.getByRole("button", { name: CLOSE_LABEL }));

      expect(eventsNamed("checkout_closed")).toEqual([
        { trigger: "nav_upgrade_button", stage: "loading", seconds_open: 0 }
      ]);
    });

    it("records the selected payment method and the after_failure stage after a failed payment", async () => {
      confirm.mockResolvedValue({ type: "error", error: { message: "Cancelled", code: null } });
      await renderCheckout();
      readyPaymentElement();
      selectPaymentMethod("wechat_pay");

      fireEvent.submit(screen.getByRole("form"));
      await waitFor(() => expect(eventsNamed("checkout_failed")).toHaveLength(1));
      fireEvent.click(screen.getByRole("button", { name: CLOSE_LABEL }));

      expect(eventsNamed("checkout_closed")).toEqual([
        { payment_method: "wechat_pay", stage: "after_failure", seconds_open: 0 }
      ]);
    });

    it("counts a previous attempt's failure as after_failure", async () => {
      await renderCheckout({ priorError: "Your card was declined." });
      readyPaymentElement();

      fireEvent.click(screen.getByRole("button", { name: CLOSE_LABEL }));

      expect(eventsNamed("checkout_closed")).toEqual([{ stage: "after_failure", seconds_open: 0 }]);
    });

    it("measures how long the modal was open", async () => {
      const now = jest.spyOn(performance, "now").mockReturnValue(1_000);
      await renderCheckout();
      now.mockReturnValue(13_600);

      fireEvent.click(screen.getByRole("button", { name: CLOSE_LABEL }));

      expect(eventsNamed("checkout_closed")).toEqual([{ stage: "loading", seconds_open: 13 }]);
    });
  });

  describe("checkout_loaded", () => {
    it("tracks the time from opening to the Payment Element being ready", async () => {
      const now = jest.spyOn(performance, "now").mockReturnValue(1_000);
      await renderCheckout({ trigger: "nav_upgrade_button" });
      now.mockReturnValue(3_250);

      readyPaymentElement();

      expect(eventsNamed("checkout_loaded")).toEqual([{ trigger: "nav_upgrade_button", load_ms: 2_250, attempt: 1 }]);
    });

    it("shows a spinner until Stripe.js has loaded", () => {
      mockGetStripe.mockReturnValue(new Promise(() => {}));
      render(<PremiumCheckoutModal clientSecret="cs" selectedTier="premium" />);

      expect(screen.getByText(CONNECTING)).toBeInTheDocument();
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
    });
  });

  describe("load failures", () => {
    it("offers a retry when Stripe.js fails to load, and loads it again on retry", async () => {
      mockGetStripe.mockRejectedValueOnce(new Error("Failed to load Stripe.js"));
      await renderCheckout({ trigger: "nav_upgrade_button" });

      expect(screen.getByText(CONNECTION_FAILED)).toBeInTheDocument();
      expect(eventsNamed("checkout_load_error")).toEqual([
        { trigger: "nav_upgrade_button", source: "stripe_js", attempt: 1, error_message: "Failed to load Stripe.js" }
      ]);

      fireEvent.click(screen.getByRole("button", { name: RETRY_LABEL }));
      await act(async () => {});

      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(mockGetStripe).toHaveBeenCalledTimes(2);
      readyPaymentElement();
      expect(eventsNamed("checkout_loaded")).toEqual([
        { trigger: "nav_upgrade_button", load_ms: expect.any(Number), attempt: 2 }
      ]);
    });

    it("offers a retry when Stripe can't start the checkout session", async () => {
      mockUseCheckout.mockReturnValue({ type: "error", error: { message: "Session expired" } });
      await renderCheckout();

      expect(screen.getByText(CONNECTION_FAILED)).toBeInTheDocument();
      expect(eventsNamed("checkout_load_error")).toEqual([
        { source: "checkout", attempt: 1, error_message: "Session expired" }
      ]);

      mockUseCheckout.mockReturnValue({ type: "success", checkout: { canConfirm: true, confirm } });
      fireEvent.click(screen.getByRole("button", { name: RETRY_LABEL }));
      await act(async () => {});

      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    it("offers a retry when the Payment Element fails to load", async () => {
      await renderCheckout();

      act(() => paymentElement.props.onLoadError?.({ error: { message: "Element failed" } }));

      expect(screen.getByText(CONNECTION_FAILED)).toBeInTheDocument();
      expect(eventsNamed("checkout_load_error")).toEqual([
        { source: "payment_element", attempt: 1, error_message: "Element failed" }
      ]);
    });

    it("offers a retry when the payment form takes too long to load", () => {
      jest.useFakeTimers();
      mockGetStripe.mockReturnValue(new Promise(() => {}));
      render(<PremiumCheckoutModal clientSecret="cs" selectedTier="premium" />);

      act(() => jest.advanceTimersByTime(CONNECTION_TIMEOUT_MS - 1));
      expect(screen.queryByText(CONNECTION_FAILED)).not.toBeInTheDocument();

      act(() => jest.advanceTimersByTime(1));
      expect(screen.getByText(CONNECTION_FAILED)).toBeInTheDocument();
      expect(eventsNamed("checkout_load_error")).toEqual([{ source: "timeout", attempt: 1 }]);
    });

    it("doesn't time out once the payment form is ready", async () => {
      jest.useFakeTimers();
      await renderCheckout();
      readyPaymentElement();

      act(() => jest.advanceTimersByTime(CONNECTION_TIMEOUT_MS));

      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(eventsNamed("checkout_load_error")).toEqual([]);
    });
  });

  describe("payment attempts", () => {
    it("tracks checkout_submitted with the selected payment method", async () => {
      confirm.mockReturnValue(new Promise(() => {}));
      await renderCheckout({ trigger: "nav_upgrade_button" });
      selectPaymentMethod("card");

      fireEvent.submit(screen.getByRole("form"));

      expect(eventsNamed("checkout_submitted")).toEqual([{ trigger: "nav_upgrade_button", payment_method: "card" }]);
      await waitFor(() => expect(confirm).toHaveBeenCalled());
      expect(eventsNamed("checkout_failed")).toEqual([]);
    });

    it("tracks a declined payment and shows Stripe's decline message", async () => {
      confirm.mockResolvedValue({
        type: "error",
        error: {
          type: "card_error",
          message: "Your card has insufficient funds.",
          code: "paymentFailed",
          paymentFailed: { declineCode: "insufficient_funds" }
        }
      });
      await renderCheckout({ trigger: "nav_upgrade_button" });
      selectPaymentMethod("card");

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() =>
        expect(eventsNamed("checkout_failed")).toEqual([
          {
            trigger: "nav_upgrade_button",
            payment_method: "card",
            error_code: "paymentFailed",
            decline_code: "insufficient_funds",
            error_type: "card_error",
            error_message: "Your card has insufficient funds."
          }
        ])
      );
      expect(screen.getByText("modals.subscriptionCheckout.paymentFailedTitle")).toBeInTheDocument();
      expect(screen.getByText("Your card has insufficient funds.")).toBeInTheDocument();
    });

    it("shows a calm notice and keeps the form ready when a payment ends without a decline code", async () => {
      confirm.mockResolvedValue({ type: "error", error: { message: "The payment was cancelled.", code: null } });
      await renderCheckout();
      selectPaymentMethod("alipay");

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() =>
        expect(eventsNamed("checkout_failed")).toEqual([
          { payment_method: "alipay", error_code: "other", error_message: "The payment was cancelled." }
        ])
      );
      expect(screen.getByText("modals.subscriptionCheckout.notCompletedTitle")).toBeInTheDocument();
      expect(screen.getByText("modals.subscriptionCheckout.notCompletedMessage")).toBeInTheDocument();
      expect(screen.queryByText("modals.subscriptionCheckout.paymentFailedTitle")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /modals\.subscriptionCheckout\.pay/ })).toBeEnabled();
    });

    it("caps long error messages", async () => {
      confirm.mockResolvedValue({ type: "error", error: { message: "x".repeat(500), code: null } });
      await renderCheckout();

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() => expect(eventsNamed("checkout_failed")).toHaveLength(1));
      expect(eventsNamed("checkout_failed")[0].error_message).toHaveLength(200);
    });

    it("records a thrown confirm as an exception", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      confirm.mockRejectedValue(new Error("boom"));
      await renderCheckout();

      fireEvent.submit(screen.getByRole("form"));

      await waitFor(() =>
        expect(eventsNamed("checkout_failed")).toEqual([{ error_code: "exception", error_message: "boom" }])
      );
      expect(screen.getByText("modals.subscriptionCheckout.unexpectedError")).toBeInTheDocument();
    });
  });
});
