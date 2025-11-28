import { ConfirmationModal } from "./ConfirmationModal";
import { ExampleModal } from "./ExampleModal";
import { ExerciseSuccessModal } from "./ExerciseSuccessModal";
import { ExerciseCompletionModal } from "./ExerciseCompletionModal";
import { InfoModal } from "./InfoModal";

// Export all modals
export { ConfirmationModal, ExampleModal, ExerciseSuccessModal, ExerciseCompletionModal, InfoModal };

// Available modals registry
export const availableModals = {
  "example-modal": ExampleModal,
  "confirmation-modal": ConfirmationModal,
  "info-modal": InfoModal,
  "exercise-success-modal": ExerciseSuccessModal,
  "exercise-completion-modal": ExerciseCompletionModal
};
