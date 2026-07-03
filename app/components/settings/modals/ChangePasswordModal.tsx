"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { hideModal } from "@/lib/modal/store";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ChangePasswordModalProps {
  onSave: (newPassword: string, currentPassword: string) => Promise<void>;
}

export function ChangePasswordModal({ onSave }: ChangePasswordModalProps) {
  const t = useTranslations("settings.changePassword");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

    if (currentPassword === newPassword) {
      setError(t("mustDiffer"));
      return;
    }

    setIsSaving(true);

    try {
      await onSave(newPassword, currentPassword);
      hideModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("updateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-24 max-w-md mx-auto ui-form-field-large text-left">
      <h2 className="text-2xl font-bold mb-16">{t("title")}</h2>

      <form onSubmit={handleSubmit} className="space-y-16">
        <div className="ui-form-field-large">
          <label htmlFor="current-password" className="block text-sm font-medium mb-4">
            {t("currentLabel")}
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t("currentPlaceholder")}
            disabled={isSaving}
            autoFocus
          />
        </div>

        <div className="ui-form-field-large">
          <label htmlFor="new-password" className="block text-sm font-medium mb-4">
            {t("newLabel")}
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("newPlaceholder")}
            disabled={isSaving}
          />
          <p className="text-xs text-text-secondary mt-4">{t("newHint")}</p>
        </div>

        <div className="ui-form-field-large">
          <label htmlFor="confirm-password" className="block text-sm font-medium mb-4">
            {t("confirmLabel")}
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("confirmPlaceholder")}
            disabled={isSaving}
          />
        </div>

        {error && <div className="bg-red-50 text-red-600 p-12 rounded-md text-sm">{error}</div>}

        <div className="flex gap-12 pt-4">
          <button type="submit" disabled={isSaving} className="ui-btn ui-btn-primary ui-btn-small flex-1">
            {isSaving ? <LoadingSpinner size="sm" /> : t("submit")}
          </button>
          <button
            type="button"
            onClick={hideModal}
            disabled={isSaving}
            className="ui-btn ui-btn-secondary ui-btn-small flex-1"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
