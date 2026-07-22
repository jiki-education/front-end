"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { EmailPreferences } from "@/lib/api/emailPreferences";
import { NOTIFICATION_TYPES } from "@/lib/notifications/config";
import NotificationItem, { type NotificationConfig } from "./NotificationItem";
import CheckCircleIcon from "@/icons/check-circle.svg";
import styles from "./UnsubscribePage.module.css";

const NOTIFICATION_CONFIGS: NotificationConfig[] = NOTIFICATION_TYPES.map((type) => ({
  id: type.slug
}));

interface ManageNotificationsSectionProps {
  preferences: EmailPreferences;
  loading: boolean;
  onSave: (preferences: EmailPreferences) => void;
}

export default function ManageNotificationsSection({ preferences, loading, onSave }: ManageNotificationsSectionProps) {
  const t = useTranslations("unsubscribe.manage");
  const tCommon = useTranslations("common");
  const [localPreferences, setLocalPreferences] = useState<EmailPreferences>(preferences);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleToggle = (key: keyof EmailPreferences) => {
    setLocalPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setShowSuccess(false);
  };

  const handleSave = () => {
    onSave(localPreferences);
    setShowSuccess(true);
  };

  const hasChanges = NOTIFICATION_CONFIGS.some((config) => localPreferences[config.id] !== preferences[config.id]);

  return (
    <section className={styles.sectionCard}>
      <h2>{t("title")}</h2>
      <p>{t("description")}</p>

      <div className={styles.notificationList}>
        {NOTIFICATION_CONFIGS.map((config) => (
          <NotificationItem
            key={config.id}
            config={config}
            enabled={localPreferences[config.id]}
            loading={false}
            onToggle={() => handleToggle(config.id)}
          />
        ))}
      </div>

      <div className={styles.buttonRow}>
        {showSuccess && !hasChanges && !loading ? (
          <div className={styles.inlineSuccessMessage}>
            <CheckCircleIcon />
            <span>{t("updated")}</span>
          </div>
        ) : (
          <button
            className={`ui-btn ui-btn-default ui-btn-secondary ${loading ? "ui-btn-loading" : ""}`}
            onClick={handleSave}
            disabled={loading || !hasChanges}
          >
            {loading ? tCommon("saving") : t("save")}
          </button>
        )}
      </div>
    </section>
  );
}
