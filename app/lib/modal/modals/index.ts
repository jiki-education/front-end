import { ConfirmationModal } from "./ConfirmationModal";
import { ExampleModal } from "./ExampleModal";
import { ExerciseSuccessModal } from "./ExerciseSuccessModal";
import { InfoModal } from "./InfoModal";
import { NetworkErrorModal } from "./NetworkErrorModal";
import { SessionExpiredModal } from "./SessionExpiredModal";
import { RateLimitModal } from "./RateLimitModal";

// Export all modals
export {
  ConfirmationModal,
  ExampleModal,
  ExerciseSuccessModal,
  InfoModal,
  NetworkErrorModal,
  SessionExpiredModal,
  RateLimitModal
};

// Available modals registry
export const availableModals = {
  "example-modal": ExampleModal,
  "confirmation-modal": ConfirmationModal,
  "info-modal": InfoModal,
  "exercise-success-modal": ExerciseSuccessModal,
  "network-error-modal": NetworkErrorModal,
  "session-expired-modal": SessionExpiredModal,
  "rate-limit-modal": RateLimitModal
};
