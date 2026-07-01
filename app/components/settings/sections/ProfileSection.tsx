"use client";

import type { UserSettings } from "@/lib/api/types/settings";
import { useTranslations } from "next-intl";
import EditableField from "../ui/EditableField";
import StatusNotification from "../ui/StatusNotification";
import styles from "../Settings.module.css";

interface ProfileSectionProps {
  settings: UserSettings;
  updateName: (name: string) => Promise<void>;
  updateHandle: (handle: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
}

export default function ProfileSection({ settings, updateName, updateHandle, updateEmail }: ProfileSectionProps) {
  const t = useTranslations("settings.profile");

  // Validation functions
  const validateName = (value: string): string | null => {
    if (!value.trim()) {
      return t("nameEmpty");
    }
    if (value.length > 100) {
      return t("nameTooLong");
    }
    return null;
  };

  const validateHandle = (value: string): string | null => {
    if (!value.trim()) {
      return t("handleEmpty");
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return t("handleInvalid");
    }
    if (value.length < 3) {
      return t("handleTooShort");
    }
    if (value.length > 30) {
      return t("handleTooLong");
    }
    return null;
  };

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) {
      return t("emailEmpty");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return t("emailInvalid");
    }
    return null;
  };

  return (
    <>
      <div className={styles.settingsField}>
        <EditableField
          label={t("nameLabel")}
          value={settings.name || ""}
          onSave={updateName}
          placeholder={t("namePlaceholder")}
          validation={validateName}
          updateButtonText={t("updateName")}
        />
      </div>

      <div className={styles.settingsField}>
        <EditableField
          label={t("handleLabel")}
          value={settings.handle || ""}
          onSave={updateHandle}
          placeholder={t("handlePlaceholder")}
          validation={validateHandle}
          updateButtonText={t("updateHandle")}
        />
      </div>

      <div className={styles.settingsField}>
        <EditableField
          label={t("emailLabel")}
          value={settings.email || ""}
          onSave={updateEmail}
          type="email"
          placeholder={t("emailPlaceholder")}
          validation={validateEmail}
          updateButtonText={t("updateEmail")}
        />
        {settings.unconfirmed_email && (
          <StatusNotification variant="info">
            <p>
              {t("confirmationPendingPrefix")}
              <strong>{settings.unconfirmed_email}</strong>
            </p>
            <p className="text-xs mt-1">{t("confirmationPendingHint")}</p>
          </StatusNotification>
        )}
        {!settings.email_confirmed && !settings.unconfirmed_email && (
          <StatusNotification variant="warning">
            <p>{t("emailNotConfirmed")}</p>
          </StatusNotification>
        )}
      </div>
    </>
  );
}
