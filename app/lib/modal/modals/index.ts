import { ConfirmationModal } from "./ConfirmationModal";
import { ExampleModal } from "./ExampleModal";
import { ExerciseSuccessModal } from "./ExerciseSuccessModal";
import { ExerciseCompletionModal } from "./ExerciseCompletionModal";
import { LevelMilestoneModal } from "./LevelMilestoneModal";
import { InfoModal } from "./InfoModal";
import { NetworkErrorModal } from "./NetworkErrorModal";
import { SessionExpiredModal } from "./SessionExpiredModal";
import { RateLimitModal } from "./RateLimitModal";
import { SubscriptionModal } from "./SubscriptionModal";
import { SubscriptionSuccessModal } from "./SubscriptionSuccessModal";
import { SubscriptionCheckoutModal } from "./SubscriptionCheckoutModal";

// Export all modals
export {
  ConfirmationModal,
  ExampleModal,
  ExerciseSuccessModal,
  ExerciseCompletionModal,
  LevelMilestoneModal,
  InfoModal,
  NetworkErrorModal,
  SessionExpiredModal,
  RateLimitModal,
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
  "exercise-completion-modal": ExerciseCompletionModal,
  "level-milestone-modal": LevelMilestoneModal,
  "network-error-modal": NetworkErrorModal,
  "session-expired-modal": SessionExpiredModal,
  "rate-limit-modal": RateLimitModal,
  "subscription-modal": SubscriptionModal,
  "subscription-success-modal": SubscriptionSuccessModal,
  "subscription-checkout-modal": SubscriptionCheckoutModal
};
