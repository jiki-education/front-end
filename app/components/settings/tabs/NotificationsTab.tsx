"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/lib/settings/settingsStore";
import type { NotificationSlug } from "@/lib/api/types/settings";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ActionField from "../ui/ActionField";
import styles from "../Settings.module.css";

interface NotificationSetting {
  id: "essential" | "features" | "livestreams" | "milestones" | "activity";
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
  {
    id: "features",
    titleKey: "featuresTitle",
    descriptionKey: "featuresDescription",
    apiSlug: "newsletters"
  },
  {
    id: "livestreams",
    titleKey: "livestreamsTitle",
    descriptionKey: "livestreamsDescription",
    apiSlug: "event_emails"
  },
  {
    id: "milestones",
    titleKey: "milestonesTitle",
    descriptionKey: "milestonesDescription",
    apiSlug: "milestone_emails"
  },
  {
    id: "activity",
    titleKey: "activityTitle",
    descriptionKey: "activityDescription",
    apiSlug: "activity_emails"
  }
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

    // Get current value from settings
    const fieldMap: Record<NotificationSlug, keyof typeof settings> = {
      newsletters: "receive_newsletters",
      event_emails: "receive_event_emails",
      milestone_emails: "receive_milestone_emails",
      activity_emails: "receive_activity_emails"
    };

    const field = fieldMap[notification.apiSlug];
    const currentValue = settings[field] as boolean;

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

    const fieldMap: Record<NotificationSlug, keyof typeof settings> = {
      newsletters: "receive_newsletters",
      event_emails: "receive_event_emails",
      milestone_emails: "receive_milestone_emails",
      activity_emails: "receive_activity_emails"
    };

    const field = fieldMap[notification.apiSlug];
    return settings[field] as boolean;
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
