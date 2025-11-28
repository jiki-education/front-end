import { ConfirmationModal } from "./ConfirmationModal";
import { ExampleModal } from "./ExampleModal";
import { ExerciseSuccessModal } from "./ExerciseSuccessModal";
import { InfoModal } from "./InfoModal";
import { SubscriptionModal } from "./SubscriptionModal";
import { SubscriptionSuccessModal } from "./SubscriptionSuccessModal";
import { SubscriptionCheckoutModal } from "./SubscriptionCheckoutModal";

// Export all modals
export {
  ConfirmationModal,
  ExampleModal,
  ExerciseSuccessModal,
  InfoModal,
  SubscriptionModal,
  SubscriptionSuccessModal,
  SubscriptionCheckoutModal
};

// Available modals registry
export const availableModals = {
  "example-modal": ExampleModal,
  "confirmation-modal": ConfirmationModal,
  "info-modal": InfoModal,
  "exercise-success-modal": ExerciseSuccessModal,
  "subscription-modal": SubscriptionModal,
  "subscription-success-modal": SubscriptionSuccessModal,
  "subscription-checkout-modal": SubscriptionCheckoutModal
};
