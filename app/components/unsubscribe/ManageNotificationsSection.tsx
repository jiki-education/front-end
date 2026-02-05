"use client";

import { useEffect, useState } from "react";
import type { EmailPreferences } from "@/lib/api/emailPreferences";
import NotificationItem, { type NotificationConfig } from "./NotificationItem";
import CheckCircleIcon from "@/icons/check-circle.svg";
import styles from "./UnsubscribePage.module.css";

const NOTIFICATION_CONFIGS: NotificationConfig[] = [
  {
    id: "newsletters",
    title: "Product Updates",
    description: "Stay informed about new features and improvements."
  },
  {
    id: "event_emails",
    title: "Event Notifications",
    description: "Get notified about upcoming livestreams and events."
  },
  {
    id: "milestone_emails",
    title: "Achievement Notifications",
    description: "Receive notifications when you unlock new skills or achievements."
  },
  {
    id: "activity_emails",
    title: "Activity Emails",
    description: "Activity-based notifications like unlocking badges and completing challenges."
  }
];

interface ManageNotificationsSectionProps {
  preferences: EmailPreferences;
  loading: boolean;
  onSave: (preferences: EmailPreferences) => void;
}

export default function ManageNotificationsSection({ preferences, loading, onSave }: ManageNotificationsSectionProps) {
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
      <h2>Manage Your Notifications</h2>
      <p>Fine-tune which emails you receive by toggling individual notification types on or off.</p>

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
            <span>Your email preferences have been updated.</span>
          </div>
        ) : (
          <button
            className={`ui-btn ui-btn-default ui-btn-secondary ${loading ? "ui-btn-loading" : ""}`}
            onClick={handleSave}
            disabled={loading || !hasChanges}
          >
            {loading ? "Saving..." : "Change Preferences"}
          </button>
        )}
      </div>
    </section>
  );
}
