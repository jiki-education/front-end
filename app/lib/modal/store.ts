/**
 * Core modal store and trigger helpers.
 *
 * Pure state plus the small set of show* helpers that are safe to load
 * everywhere (showConfirmation, showInfo, showModal, hideModal,
 * useModalStore). This file is reached by every route that mounts
 * GlobalModalProvider — i.e. the entire app — so it MUST NOT import
 * CSS modules from (app)-only modals. Doing so would bundle those CSS
 * modules into the global CSS chunk on blog/articles/landing/premium
 * marketing routes that never render the corresponding modals.
 *
 * (app)-only show* helpers — anything that imports a modal's
 * .module.css to forward a className through to BaseModal — live in
 * ./app.ts. Callsites in (app) routes import from "@/lib/modal/app".
 */

import { create } from "zustand";
import confirmationStyles from "@/app/styles/components/confirmation-modal.module.css";

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
