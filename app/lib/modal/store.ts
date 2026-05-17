import { create } from "zustand";
import type { ModalTrigger } from "@/lib/analytics";
import type { MembershipTier } from "@/lib/pricing";
import confirmationStyles from "@/app/styles/components/confirmation-modal.module.css";
import paymentProcessingStyles from "./modals/PaymentProcessingModal.module.css";
import premiumUpgradeStyles from "./modals/PremiumUpgradeModal/PremiumUpgradeModal.module.css";
import subscriptionCheckoutStyles from "./modals/SubscriptionCheckoutModal.module.css";
import welcomeToPremiumStyles from "./modals/WelcomeToPremiumModal.module.css";
import walkthroughConfirmStyles from "./modals/WalkthroughConfirmModal.module.css";

interface ModalState {
  isOpen: boolean;
  modalName: string | null;
  modalProps: Record<string, any>;
  overlayClassName?: string;
  modalClassName?: string;
}

interface ModalActions {
  showModal: (name: string, props?: Record<string, any>, overlayClassName?: string, modalClassName?: string) => void;
  hideModal: () => void;
}

type ModalStore = ModalState & ModalActions;

// Create the global modal store
const useModalStore = create<ModalStore>((set) => ({
  // Initial state
  isOpen: false,
  modalName: null,
  modalProps: {},
  overlayClassName: undefined,
  modalClassName: undefined,

  // Actions
  showModal: (name, props = {}, overlayClassName, modalClassName) =>
    set({
      isOpen: true,
      modalName: name,
      modalProps: props,
      overlayClassName,
      modalClassName
    }),

  hideModal: () =>
    set({
      isOpen: false,
      modalName: null,
      modalProps: {},
      overlayClassName: undefined,
      modalClassName: undefined
    })
}));

// Export the hook for React components
export { useModalStore };

// Export convenience functions that can be called from anywhere
export const showModal = (
  name: string,
  props?: Record<string, any>,
  overlayClassName?: string,
  modalClassName?: string
) => {
  useModalStore.getState().showModal(name, props, overlayClassName, modalClassName);
};

export const hideModal = () => {
  useModalStore.getState().hideModal();
};

// Convenience function for confirmation modals
export const showConfirmation = (props: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "danger";
}) => {
  showModal("confirmation-modal", props, undefined, confirmationStyles.modal);
};

// Convenience function for info modals
export const showInfo = (props: { title?: string; content: string | React.ReactNode; buttonText?: string }) => {
  showModal("info-modal", props);
};

// Convenience function for subscription modals
export const showSubscriptionModal = (props: {
  triggerContext?: "chat-gate" | "feature-gate" | "general" | "settings";
  suggestedTier?: "premium" | "max";
  headline?: string;
  description?: string;
  featuresContext?: {
    feature: string;
    benefits: string[];
  };
  onSuccess?: (tier: MembershipTier) => void;
  onCancel?: () => void;
}) => {
  showModal("subscription-modal", props);
};

// Convenience function for subscription success modals
export const showSubscriptionSuccess = (props: {
  tier: MembershipTier;
  triggerContext?: string;
  nextSteps?: {
    title: string;
    description: string;
    action?: () => void;
    buttonText?: string;
  };
  onClose?: () => void;
}) => {
  showModal("subscription-success-modal", props);
};

// Convenience function for subscription checkout modal
export const showSubscriptionCheckout = (props: {
  clientSecret: string;
  selectedTier: MembershipTier;
  onCancel?: () => void;
  onSuccess?: () => void;
}) => {
  showModal("subscription-checkout-modal", props, undefined, subscriptionCheckoutStyles.modal);
};

// Convenience function for payment processing modal
export const showPaymentProcessing = (props?: { onClose?: () => void }) => {
  showModal("payment-processing-modal", props ?? {}, undefined, paymentProcessingStyles.modal);
};

// Convenience function for the brief "confirming with Stripe" state shown
// the moment a checkout return is detected, before verifyCheckoutSession resolves.
export const showPaymentConfirming = () => {
  showModal("payment-confirming-modal", {}, undefined, paymentProcessingStyles.modal);
};

// Convenience function shown when checkout verification itself errors
// (network/server failure), distinct from a successful "unpaid" response.
export const showPaymentVerificationFailed = (props?: { onClose?: () => void }) => {
  showModal("payment-verification-failed-modal", props ?? {}, undefined, paymentProcessingStyles.modal);
};

// Convenience function for welcome to premium modal
export const showWelcomeToPremium = (props?: { onClose?: () => void }) => {
  showModal("welcome-to-premium-modal", props ?? {}, undefined, welcomeToPremiumStyles.modal);
};

// Convenience function for the premium upgrade modal. The `trigger` arg is
// typed as `ModalTrigger`, a closed union of allowed values — keep that type
// the single source of truth so the `premium_modal_shown` funnel data stays
// consistent (new triggers must be added to the type before use).
export const showPremiumUpgradeModal = (
  trigger: ModalTrigger,
  options?: {
    contextType?: string;
    contextId?: string | number;
    onSuccess?: () => void;
    onCancel?: () => void;
  }
) => {
  showModal(
    "premium-upgrade-modal",
    { trigger, ...options },
    premiumUpgradeStyles.premiumModalOverlay,
    premiumUpgradeStyles.premiumModalWidth
  );
};

// Convenience function for video walkthrough modal
export const showVideoWalkthrough = (props: { playbackId: string; lessonSlug: string }) => {
  showModal("video-walkthrough-modal", props);
};

// Convenience function for walkthrough confirmation modal
export const showWalkthroughConfirm = (props: { onConfirm?: () => void }) => {
  showModal("walkthrough-confirm-modal", props, undefined, walkthroughConfirmStyles.modal);
};
