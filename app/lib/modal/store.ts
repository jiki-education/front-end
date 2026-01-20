import { create } from "zustand";
import type { MembershipTier } from "@/lib/pricing";

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
  showModal("confirmation-modal", props);
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
  showModal("subscription-checkout-modal", props);
};
