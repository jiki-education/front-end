import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  modalName: string | null;
  modalProps: Record<string, any>;
}

interface ModalActions {
  showModal: (name: string, props?: Record<string, any>) => void;
  hideModal: () => void;
}

type ModalStore = ModalState & ModalActions;

// Create the global modal store
const useModalStore = create<ModalStore>((set) => ({
  // Initial state
  isOpen: false,
  modalName: null,
  modalProps: {},

  // Actions
  showModal: (name, props = {}) =>
    set({
      isOpen: true,
      modalName: name,
      modalProps: props
    }),

  hideModal: () =>
    set({
      isOpen: false,
      modalName: null,
      modalProps: {}
    })
}));

// Export the hook for React components
export { useModalStore };

// Export convenience functions that can be called from anywhere
export const showModal = (name: string, props?: Record<string, any>) => {
  useModalStore.getState().showModal(name, props);
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
