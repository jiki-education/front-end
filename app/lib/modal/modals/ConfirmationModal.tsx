"use client";

import { hideModal } from "../store";

interface ConfirmationModalProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "danger";
}

export function ConfirmationModal({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default"
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
    hideModal();
  };

  const handleCancel = () => {
    onCancel?.();
    hideModal();
  };

  const confirmButtonClasses =
    variant === "danger"
      ? "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      : "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-gray-600">{message}</p>
      <div className="flex gap-2 justify-end mt-6">
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          {cancelText}
        </button>
        <button onClick={handleConfirm} className={confirmButtonClasses}>
          {confirmText}
        </button>
      </div>
    </div>
  );
}
