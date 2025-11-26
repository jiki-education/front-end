"use client";

import type { ReactNode } from "react";
import Modal from "react-modal";

interface BaseModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
}

export function BaseModal({
  isOpen,
  onRequestClose,
  title,
  children,
  className = "",
  overlayClassName = ""
}: BaseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={`relative bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 z-modal ${className}`}
      overlayClassName={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal-backdrop ${overlayClassName}`}
      ariaHideApp={false}
    >
      {title && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      <div className="modal-content">{children}</div>
      <button
        onClick={onRequestClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close modal"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </Modal>
  );
}
