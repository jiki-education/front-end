"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import styles from "./PasswordField.module.css";

interface PasswordFieldProps {
  onSave: (newPassword: string, currentPassword: string) => Promise<void>;
  disabled?: boolean;
}

export default function PasswordField({ onSave, disabled = false }: PasswordFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const handleSave = async () => {
    // Validation
    if (!currentPassword) {
      setError("Current password is required");
      return;
    }
    if (!newPassword) {
      setError("New password is required");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(newPassword, currentPassword);
      setIsEditing(false);
      resetForm();
      // Show saved indicator
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
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
      <div className={styles.passwordField}>
        <div className={styles.inputContainer}>
          <div className={styles.passwordFields}>
            <div className="ui-form-field-large">
              <label>Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter current password"
                disabled={isSaving}
                autoFocus
              />
            </div>
            <div className="ui-form-field-large">
              <label>New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter new password"
                disabled={isSaving}
              />
            </div>
            <div className="ui-form-field-large">
              <label>Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Confirm new password"
                disabled={isSaving}
              />
            </div>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.buttonRow}>
            <button onClick={handleCancel} disabled={isSaving} className="ui-btn ui-btn-secondary ui-btn-small">
              Cancel
            </button>
            <button onClick={handleSave} disabled={isSaving} className="ui-btn ui-btn-primary ui-btn-small">
              {isSaving ? <LoadingSpinner size="sm" /> : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View State (with optional Saved indicator)
  return (
    <div className={styles.passwordField}>
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <span className={styles.label}>
            Password
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
          <div className={styles.value}>••••••••••••</div>
        </div>
        <button onClick={() => setIsEditing(true)} disabled={disabled} className="ui-btn ui-btn-tertiary ui-btn-small">
          Change
        </button>
      </div>
    </div>
  );
}
