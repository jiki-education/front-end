"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/settings/settingsStore";
import type { NotificationSlug } from "@/lib/api/types/settings";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ActionField from "../ui/ActionField";
import styles from "../Settings.module.css";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  apiSlug?: NotificationSlug;
  disabled?: boolean;
}

const NOTIFICATION_CONFIGS: NotificationSetting[] = [
  {
    id: "essential",
    title: "Essential Service/Account messages",
    description: "Important updates about your account, security, and service changes.",
    disabled: true // Cannot be toggled off
  },
  {
    id: "features",
    title: "Emails about new features or content",
    description: "Stay updated with the latest features and content added to Jiki.",
    apiSlug: "product_updates"
  },
  {
    id: "livestreams",
    title: "Emails about livestreams",
    description: "Get notified about upcoming livestreams and events.",
    apiSlug: "event_emails"
  },
  {
    id: "milestones",
    title: "Emails when you reach new milestones",
    description: "Celebrate your achievements and progress on Jiki.",
    apiSlug: "milestone_emails"
  },
  {
    id: "activity",
    title: "Other emails in response to things that you do on Jiki",
    description: "Activity-based notifications like unlocking badges and completing challenges.",
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
      product_updates: "receive_product_updates",
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
      product_updates: "receive_product_updates",
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
  return (
    <div className={styles.settingsField}>
      <ActionField label={notification.title} description={notification.description}>
        <button
          className={`ui-toggle-switch ${enabled ? "active" : ""} ${
            notification.disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={notification.disabled ? undefined : onToggle}
          disabled={notification.disabled}
          aria-label={`Toggle ${notification.title}`}
          aria-checked={enabled}
          role="switch"
        />
      </ActionField>
    </div>
  );
}
