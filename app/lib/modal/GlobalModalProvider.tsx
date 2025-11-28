"use client";

import { BaseModal } from "./BaseModal";
import { availableModals } from "./modals";
import { hideModal, useModalStore } from "./store";

// TODO: Add support for non-dismissible modals
// The GlobalErrorHandler passes dismissible: false for critical error modals,
// but the modal system doesn't currently respect this prop.
// Changes needed:
// 1. BaseModal should accept dismissible prop (default true)
// 2. Hide close button when dismissible=false
// 3. Disable overlay click close when dismissible=false
// 4. Pass dismissible prop from modalProps through GlobalModalProvider to BaseModal

export function GlobalModalProvider() {
  const { isOpen, modalName, modalProps, overlayClassName } = useModalStore();

  // Get the current modal component
  const ModalComponent = modalName ? availableModals[modalName as keyof typeof availableModals] : null;

  if (!isOpen || !ModalComponent) {
    return null;
  }

  // Pass modal props to the modal component
  return (
    <BaseModal 
      isOpen={isOpen} 
      onRequestClose={hideModal}
      overlayClassName={overlayClassName}
    >
      <ModalComponent {...modalProps} />
    </BaseModal>
  );
}
