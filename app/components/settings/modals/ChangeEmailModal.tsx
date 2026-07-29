"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { hideModal } from "@/lib/modal/store";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import styles from "./ChangeEmailModal.module.css";

interface ChangeEmailModalProps {
  currentEmail: string;
  onSave: (newEmail: string, currentPassword: string) => Promise<void>;
}

export function ChangeEmailModal({ currentEmail, onSave }: ChangeEmailModalProps) {
  const t = useTranslations("settings.changeEmail");
  const tCommon = useTranslations("common");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!newEmail) {
      setError(t("newEmailRequired"));
      return;
    }

    if (!validateEmail(newEmail)) {
      setError(tCommon("validation.emailInvalid"));
      return;
    }

    if (newEmail === currentEmail) {
      setError(t("emailSame"));
      return;
    }

    if (!currentPassword) {
      setError(tCommon("validation.currentPasswordRequired"));
      return;
    }

    setIsSaving(true);

    try {
      await onSave(newEmail, currentPassword);
      hideModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("updateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("title")}</h2>

      <div className={styles.notice}>
        <p className={styles.noticeLabel}>{t("importantLabel")}</p>
        <p>{t("importantText")}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="ui-form-field-large">
          <label className={styles.fieldLabel}>{t("currentEmailLabel")}</label>
          <input type="email" value={currentEmail} disabled />
        </div>

        <div className="ui-form-field-large">
          <label htmlFor="new-email" className={styles.fieldLabel}>
            {t("newEmailLabel")}
          </label>
          <input
            id="new-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder={t("newEmailPlaceholder")}
            disabled={isSaving}
            autoFocus
          />
        </div>

        <div className="ui-form-field-large">
          <label htmlFor="current-password" className={styles.fieldLabel}>
            {t("passwordLabel")}
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            disabled={isSaving}
          />
          <p className={styles.passwordHint}>{t("passwordHint")}</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.buttons}>
          <button type="submit" disabled={isSaving} className="ui-btn ui-btn-small ui-btn-primary">
            {isSaving ? <LoadingSpinner size="sm" /> : t("submit")}
          </button>
          <button
            type="button"
            onClick={hideModal}
            disabled={isSaving}
            className="ui-btn ui-btn-small ui-btn-secondary"
          >
            {tCommon("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
