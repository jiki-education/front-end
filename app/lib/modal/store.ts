import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  modalName: string | null;
  modalProps: Record<string, any>;
  overlayClassName?: string;
}

interface ModalActions {
  showModal: (name: string, props?: Record<string, any>, overlayClassName?: string) => void;
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

  // Actions
  showModal: (name, props = {}, overlayClassName) =>
    set({
      isOpen: true,
      modalName: name,
      modalProps: props,
      overlayClassName
    }),

  hideModal: () =>
    set({
      isOpen: false,
      modalName: null,
      modalProps: {},
      overlayClassName: undefined
    })
}));

// Export the hook for React components
export { useModalStore };

// Export convenience functions that can be called from anywhere
export const showModal = (name: string, props?: Record<string, any>, overlayClassName?: string) => {
  useModalStore.getState().showModal(name, props, overlayClassName);
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
