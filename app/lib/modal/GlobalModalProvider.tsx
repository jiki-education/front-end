"use client";

import { BaseModal } from "./BaseModal";
import { availableModals } from "./modals";
import { hideModal, useModalStore } from "./store";

export function GlobalModalProvider() {
  const { isOpen, modalName, modalProps } = useModalStore();

  // Get the current modal component
  const ModalComponent = modalName ? availableModals[modalName as keyof typeof availableModals] : null;

  if (!isOpen || !ModalComponent) {
    return null;
  }

  // Pass modal props to the modal component
  return (
    <BaseModal isOpen={isOpen} onRequestClose={hideModal}>
      <ModalComponent {...modalProps} />
    </BaseModal>
  );
}
