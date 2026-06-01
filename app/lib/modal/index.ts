// Export the provider component
export { GlobalModalProvider } from "./GlobalModalProvider";

// Export the modal functions for global usage
export {
  hideModal,
  showConfirmation,
  showInfo,
  showModal,
  showSubscriptionCheckout,
  showSubscriptionModal,
  showSubscriptionSuccess,
  showPaymentProcessing,
  showPaymentConfirming,
  showPaymentVerificationFailed,
  showPremiumUpgradeModal,
  showWelcomeToPremium,
  useModalStore
} from "./store";

// Export modal types if needed
export type { availableModals } from "./modals";
