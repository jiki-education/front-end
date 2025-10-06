import { ConfirmationModal } from "./ConfirmationModal";
import { ExampleModal } from "./ExampleModal";
import { InfoModal } from "./InfoModal";

// Export all modals
export { ConfirmationModal, ExampleModal, InfoModal };

// Available modals registry
export const availableModals = {
  "example-modal": ExampleModal,
  "confirmation-modal": ConfirmationModal,
  "info-modal": InfoModal
};
