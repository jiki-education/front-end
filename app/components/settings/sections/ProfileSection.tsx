"use client";

import type { UserSettings } from "@/lib/api/types/settings";
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
  // Validation functions
  const validateName = (value: string): string | null => {
    if (!value.trim()) {
      return "Name cannot be empty";
    }
    if (value.length > 100) {
      return "Name must be less than 100 characters";
    }
    return null;
  };

  const validateHandle = (value: string): string | null => {
    if (!value.trim()) {
      return "Handle cannot be empty";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Handle can only contain letters, numbers, underscores, and hyphens";
    }
    if (value.length < 3) {
      return "Handle must be at least 3 characters";
    }
    if (value.length > 30) {
      return "Handle must be less than 30 characters";
    }
    return null;
  };

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) {
      return "Email cannot be empty";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  return (
    <>
      <div className={styles.settingsField}>
        <EditableField
          label="Name"
          value={settings.name || ""}
          onSave={updateName}
          placeholder="Enter your name"
          validation={validateName}
          updateButtonText="Update Name"
        />
      </div>

      <div className={styles.settingsField}>
        <EditableField
          label="Handle"
          value={settings.handle || ""}
          onSave={updateHandle}
          placeholder="Enter your handle"
          validation={validateHandle}
          updateButtonText="Update Handle"
        />
      </div>

      <div className={styles.settingsField}>
        <EditableField
          label="Email"
          value={settings.email || ""}
          onSave={updateEmail}
          type="email"
          placeholder="Enter your email"
          validation={validateEmail}
          updateButtonText="Update Email"
        />
        {settings.unconfirmed_email && (
          <StatusNotification variant="info">
            <p>
              Confirmation pending for: <strong>{settings.unconfirmed_email}</strong>
            </p>
            <p className="text-xs mt-1">Please check your email to confirm the change.</p>
          </StatusNotification>
        )}
        {!settings.email_confirmed && !settings.unconfirmed_email && (
          <StatusNotification variant="warning">
            <p>Your email address is not confirmed.</p>
          </StatusNotification>
        )}
      </div>
    </>
  );
}
