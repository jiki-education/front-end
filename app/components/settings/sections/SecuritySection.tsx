"use client";

import { showModal } from "@/lib/modal/store";
import styles from "../Settings.module.css";

interface SecuritySectionProps {
  updatePassword: (newPassword: string, sudoPassword: string) => Promise<void>;
}

export default function SecuritySection({ updatePassword }: SecuritySectionProps) {
  const handlePasswordChange = () => {
    showModal("change-password-modal", {
      onSave: async (newPassword: string, currentPassword: string) => {
        await updatePassword(newPassword, currentPassword);
      }
    });
  };

  return (
    <div className={styles.settingItem}>
      <h3>Security</h3>
      <div className="ui-form-field-large">
        <label className="text-sm text-text-secondary">Password</label>
        <input type="password" value="••••••••" readOnly />
        <button onClick={handlePasswordChange} className="ui-btn ui-btn-secondary ui-btn-small mt-8">
          Change Password
        </button>
      </div>
    </div>
  );
}
