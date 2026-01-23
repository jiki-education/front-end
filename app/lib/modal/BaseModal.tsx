"use client";

import type { ReactNode } from "react";
import Modal from "react-modal";
import { CloseButton } from "@/components/ui-kit";
import styles from "@/app/styles/components/modals.module.css";

interface BaseModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  fullscreen?: boolean;
  hideCloseButton?: boolean;
}

export function BaseModal({
  isOpen,
  onRequestClose,
  title,
  children,
  className = "",
  overlayClassName = "",
  fullscreen = false,
  hideCloseButton = false
}: BaseModalProps) {
  // For fullscreen modals, use special classes
  const modalClass = fullscreen ? styles.modalFullscreen : `${styles.modal} ${className}`;

  const overlayClass = fullscreen ? styles.modalOverlayFullscreen : `${styles.modalOverlay} ${overlayClassName}`;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={modalClass}
      overlayClassName={overlayClass}
      ariaHideApp={false}
    >
      {title && !fullscreen && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      <div className="modal-content">{children}</div>
      {/* TODO: Add support for non-dismissible modals
          Hide this button when dismissible=false prop is passed */}
      {!fullscreen && !hideCloseButton && (
        <div className={styles.modalCloseButton}>
          <CloseButton onClick={onRequestClose} variant="light" />
        </div>
      )}
    </Modal>
  );
}
