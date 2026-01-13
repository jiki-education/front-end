"use client";

import { useState } from "react";
import styles from "../Settings.module.css";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
}

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "essential",
      title: "Essential Service/Account messages",
      description: "Important updates about your account, security, and service changes.",
      enabled: true,
      disabled: true, // Cannot be toggled off
    },
    {
      id: "features",
      title: "Emails about new features or content",
      description: "Stay updated with the latest features and content added to Jiki.",
      enabled: false,
    },
    {
      id: "livestreams",
      title: "Emails about livestreams",
      description: "Get notified about upcoming livestreams and events.",
      enabled: false,
    },
    {
      id: "milestones",
      title: "Emails when you reach new milestones",
      description: "Celebrate your achievements and progress on Jiki.",
      enabled: false,
    },
    {
      id: "activity",
      title: "Other emails in response to things that you do on Jiki",
      description: "Activity-based notifications like unlocking badges and completing challenges.",
      enabled: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id && !notification.disabled
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  return (
    <div className={styles.settingsContent}>


      <div className={styles.settingsGrid}>
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onToggle={() => handleToggle(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface NotificationItemProps {
  notification: NotificationSetting;
  onToggle: () => void;
}

function NotificationItem({ notification, onToggle }: NotificationItemProps) {
  return (
    <div className={styles.settingItem}>
      <h3>{notification.title}</h3>
      <div className={styles.toggleRow}>
        <p>{notification.description}</p>
        <div
          className={`ui-toggle-switch ${notification.enabled ? "active" : ""} ${notification.disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={notification.disabled ? undefined : onToggle}
        />
      </div>
    </div>
  );
}