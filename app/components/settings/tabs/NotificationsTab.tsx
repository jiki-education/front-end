"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/lib/settings/settingsStore";
import { NOTIFICATION_TYPES, notificationField, type NotificationSlug } from "@/lib/notifications/config";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ActionField from "../ui/ActionField";
import styles from "../Settings.module.css";

interface NotificationSetting {
  id: string;
  titleKey: string;
  descriptionKey: string;
  apiSlug?: NotificationSlug;
  disabled?: boolean;
}

const NOTIFICATION_CONFIGS: NotificationSetting[] = [
  {
    id: "essential",
    titleKey: "essentialTitle",
    descriptionKey: "essentialDescription",
    disabled: true // Cannot be toggled off
  },
  ...NOTIFICATION_TYPES.map((type) => ({
    id: type.settingsI18nId,
    titleKey: `${type.settingsI18nId}Title`,
    descriptionKey: `${type.settingsI18nId}Description`,
    apiSlug: type.slug
  }))
];

export default function NotificationsTab() {
  const { settings, loading, fetchSettings, updateNotification } = useSettingsStore();

  // Fetch settings on mount
  useEffect(() => {
    if (!settings) {
      void fetchSettings();
    }
  }, [settings, fetchSettings]);

  const handleToggle = async (notification: NotificationSetting) => {
    if (!settings || !notification.apiSlug || notification.disabled) {
      return;
    }

    const currentValue = settings[notificationField(notification.apiSlug)];

    // Toggle the value
    await updateNotification({
      slug: notification.apiSlug,
      value: !currentValue
    });
  };

  const isEnabled = (notification: NotificationSetting): boolean => {
    if (!settings) {
      return false;
    }

    // Essential is always enabled
    if (notification.id === "essential") {
      return true;
    }

    if (!notification.apiSlug) {
      return false;
    }

    return settings[notificationField(notification.apiSlug)];
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={styles.settingsContent}>
      {NOTIFICATION_CONFIGS.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          enabled={isEnabled(notification)}
          onToggle={() => handleToggle(notification)}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: NotificationSetting;
  enabled: boolean;
  onToggle: () => void;
}

function NotificationItem({ notification, enabled, onToggle }: NotificationItemProps) {
  const t = useTranslations("settings.notifications");
  const title = t(notification.titleKey as Parameters<typeof t>[0]);
  return (
    <div className={styles.settingsField}>
      <ActionField label={title} description={t(notification.descriptionKey as Parameters<typeof t>[0])}>
        <button
          className={`ui-toggle-switch ${enabled ? "active" : ""} ${
            notification.disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={notification.disabled ? undefined : onToggle}
          disabled={notification.disabled}
          aria-label={t("toggleAriaLabel", { title })}
          aria-checked={enabled}
          role="switch"
        />
      </ActionField>
    </div>
  );
}
