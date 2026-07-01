"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import styles from "./PasswordField.module.css";

interface PasswordFieldProps {
  onSave: (newPassword: string, currentPassword: string) => Promise<void>;
  disabled?: boolean;
}

export default function PasswordField({ onSave, disabled = false }: PasswordFieldProps) {
  const t = useTranslations("settings.passwordField");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const handleSave = async () => {
    // Validation
    if (!currentPassword) {
      setError(t("currentRequired"));
      return;
    }
    if (!newPassword) {
      setError(t("newRequired"));
      return;
    }
    if (newPassword.length < 8) {
      setError(t("minLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("noMatch"));
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(newPassword, currentPassword);
      setIsEditing(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("updateFailed"));
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
              <label>{t("currentLabel")}</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("currentPlaceholder")}
                disabled={isSaving}
                autoFocus
              />
            </div>
            <div className="ui-form-field-large">
              <label>{t("newLabel")}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("newPlaceholder")}
                disabled={isSaving}
              />
            </div>
            <div className="ui-form-field-large">
              <label>{t("confirmLabel")}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("confirmPlaceholder")}
                disabled={isSaving}
              />
            </div>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.buttonRow}>
            <button onClick={handleCancel} disabled={isSaving} className="ui-btn ui-btn-secondary ui-btn-small">
              {t("cancel")}
            </button>
            <button onClick={handleSave} disabled={isSaving} className="ui-btn ui-btn-primary ui-btn-small">
              {isSaving ? <LoadingSpinner size="sm" /> : t("submit")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.passwordField}>
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <span className={styles.label}>{t("label")}</span>
          <div className={styles.value}>••••••••••••</div>
        </div>
        <button onClick={() => setIsEditing(true)} disabled={disabled} className="ui-btn ui-btn-tertiary ui-btn-small">
          {t("change")}
        </button>
      </div>
    </div>
  );
}
