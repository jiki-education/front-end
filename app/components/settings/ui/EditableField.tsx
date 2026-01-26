"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import styles from "./EditableField.module.css";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  type?: "text" | "email";
  placeholder?: string;
  disabled?: boolean;
  validation?: (value: string) => string | null;
  updateButtonText?: string;
}

export default function EditableField({
  label,
  value,
  onSave,
  type = "text",
  placeholder,
  disabled = false,
  validation,
  updateButtonText = "Update"
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  // Update edit value when prop value changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async () => {
    // Validate if validation function provided
    if (validation) {
      const validationError = validation(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Don't save if value hasn't changed
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(editValue);
      setIsEditing(false);
      // Show saved indicator
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      void handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Edit State
  if (isEditing) {
    return (
      <div className={styles.editableField}>
        <div className={styles.inputContainer}>
          <div className="ui-form-field-large">
            <label>{label}</label>
            <input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isSaving}
              autoFocus
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>
          <div className={styles.buttonRow}>
            <button onClick={handleCancel} disabled={isSaving} className="ui-btn ui-btn-secondary ui-btn-small">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || editValue === value}
              className="ui-btn ui-btn-primary ui-btn-small"
            >
              {isSaving ? <LoadingSpinner size="sm" /> : updateButtonText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View State (with optional Saved indicator)
  return (
    <div className={styles.editableField}>
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <span className={styles.label}>
            {label}
            {showSaved && (
              <span className={styles.savedIndicator}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Saved
              </span>
            )}
          </span>
          <div className={styles.value}>{value || <span className="text-gray-400">{placeholder}</span>}</div>
        </div>
        <button onClick={() => setIsEditing(true)} disabled={disabled} className="ui-btn ui-btn-tertiary ui-btn-small">
          Edit
        </button>
      </div>
    </div>
  );
}
