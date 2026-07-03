"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { hideModal } from "@/lib/modal/store";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ChangeEmailModalProps {
  currentEmail: string;
  onSave: (newEmail: string, currentPassword: string) => Promise<void>;
}

export function ChangeEmailModal({ currentEmail, onSave }: ChangeEmailModalProps) {
  const t = useTranslations("settings.changeEmail");
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
      setError(t("emailInvalid"));
      return;
    }

    if (newEmail === currentEmail) {
      setError(t("emailSame"));
      return;
    }

    if (!currentPassword) {
      setError(t("passwordRequired"));
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
    <div className="p-24 max-w-md mx-auto text-left">
      <h2 className="text-2xl font-bold mb-16">{t("title")}</h2>

      <div className="bg-blue-50 text-blue-700 p-12 rounded-md text-sm mb-16">
        <p className="font-semibold mb-4">{t("importantLabel")}</p>
        <p>{t("importantText")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-16 ">
        <div className="ui-form-field-large">
          <label className="block text-sm font-semibold mb-4">{t("currentEmailLabel")}</label>
          <input type="email" value={currentEmail} disabled />
        </div>

        <div className="ui-form-field-large">
          <label htmlFor="new-email" className="block text-sm font-semibold mb-4">
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
          <label htmlFor="current-password" className="block text-sm font-semibold mb-4">
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
          <p className="text-xs text-text-secondary mt-4">{t("passwordHint")}</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-12 rounded-md text-sm">{error}</div>}

        <div className="flex gap-12 pt-4">
          <button type="submit" disabled={isSaving} className="ui-btn ui-btn-small ui-btn-primary flex-1">
            {isSaving ? <LoadingSpinner size="sm" /> : t("submit")}
          </button>
          <button
            type="button"
            onClick={hideModal}
            disabled={isSaving}
            className="ui-btn ui-btn-small ui-btn-secondary flex-1"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
