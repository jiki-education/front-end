"use client";

import { BaseModal } from "./BaseModal";
import { availableModals } from "./modals";
import { hideModal, useModalStore } from "./store";

export function GlobalModalProvider() {
  const { isOpen, modalName, modalProps } = useModalStore();

  if (!isOpen || !modalName) {
    return null;
  }

  // Get the current modal component
  const ModalComponent = availableModals[modalName as keyof typeof availableModals];

  // Handle unknown modal names
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!ModalComponent) {
    console.warn(`Unknown modal name: ${modalName}`);
    return null;
  }

  // Pass modal props to the modal component
  // Cast as any since each modal component validates its own props
  return (
    <BaseModal isOpen={isOpen} onRequestClose={hideModal}>
      {/* @ts-ignore - Modal components validate their own props at runtime */}
      <ModalComponent {...modalProps} />
    </BaseModal>
  );
}
