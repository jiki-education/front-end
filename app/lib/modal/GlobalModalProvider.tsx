"use client";

import { BaseModal } from "./BaseModal";
import { availableModals } from "./modals";
import { hideModal, useModalStore } from "./store";
import styles from "./GlobalModalProvider.module.css";

// TODO: Add support for non-dismissible modals
// The GlobalErrorHandler passes dismissible: false for critical error modals,
// but the modal system doesn't currently respect this prop.
// Changes needed:
// 1. BaseModal should accept dismissible prop (default true)
// 2. Hide close button when dismissible=false
// 3. Disable overlay click close when dismissible=false
// 4. Pass dismissible prop from modalProps through GlobalModalProvider to BaseModal

export function GlobalModalProvider() {
  const { isOpen, modalName, modalProps, overlayClassName, modalClassName } = useModalStore();

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

  // Badge modals render directly without BaseModal wrapper since they have custom styling
  const isBadgeModal = modalName === "badge-modal" || modalName === "flip-badge-modal";

  if (isBadgeModal) {
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) {
        return;
      }
      // Call onClose if it exists in modalProps
      if (typeof modalProps.onClose === "function") {
        modalProps.onClose();
      }
      hideModal();
    };

    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <ModalComponent {...(modalProps as any)} />
      </div>
    );
  }

  // Check if this modal should be fullscreen
  const isFullscreenModal = modalName === "connection-error-modal";

  // Check if this is a confirmation modal (should not have close button)
  const isConfirmationModal = modalName === "confirmation-modal";

  // Pass modal props to the modal component
  // Cast as any since each modal component validates its own props
  return (
    <BaseModal
      isOpen={isOpen}
      onRequestClose={hideModal}
      overlayClassName={overlayClassName}
      className={modalClassName}
      fullscreen={isFullscreenModal}
      hideCloseButton={isConfirmationModal}
    >
      <ModalComponent {...(modalProps as any)} />
    </BaseModal>
  );
}
