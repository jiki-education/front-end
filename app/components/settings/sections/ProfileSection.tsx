"use client";

import { showModal } from "@/lib/modal/store";
import type { UserSettings } from "@/lib/api/types/settings";
import InlineEdit from "../ui/InlineEdit";
import StatusNotification from "../ui/StatusNotification";
import styles from "../Settings.module.css";

interface ProfileSectionProps {
  settings: UserSettings;
  updateName: (name: string) => Promise<void>;
  updateHandle: (handle: string) => Promise<void>;
  updateEmail: (email: string, sudoPassword: string) => Promise<void>;
}

export default function ProfileSection({ settings, updateName, updateHandle, updateEmail }: ProfileSectionProps) {
  const handleEmailChange = () => {
    showModal("change-email-modal", {
      currentEmail: settings.email,
      onSave: async (newEmail: string, currentPassword: string) => {
        await updateEmail(newEmail, currentPassword);
      }
    });
  };

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

  return (
    <div className={styles.settingItem}>
      <h3>Profile Information</h3>
      <div className="space-y-16">
        <InlineEdit
          label="Name"
          value={settings.name || ""}
          onSave={updateName}
          placeholder="Enter your name"
          validation={validateName}
        />

        <InlineEdit
          label="Handle"
          value={settings.handle || ""}
          onSave={updateHandle}
          placeholder="Enter your handle"
          validation={validateHandle}
        />

        <div className="ui-form-field-large">
          <label className="text-sm font-semibold">Email</label>
          <input type="email" value={settings.email || ""} placeholder="Enter your email" readOnly />
          <button onClick={handleEmailChange} className="ui-btn ui-btn-secondary ui-btn-small mt-8 mb-16">
            Change Email
          </button>
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
      </div>
    </div>
  );
}
