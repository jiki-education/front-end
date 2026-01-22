"use client";

import { useLogoutActions } from "../lib/useLogoutActions";
import styles from "../Settings.module.css";

export default function DangerTab() {
  const { isLoggingOut, handleLogoutFromThisDevice } = useLogoutActions();

  return (
    <div className={styles.settingsContent}>
      <div className={styles.settingItem}>
        <h3>Session Management</h3>
        <p style={{ marginBottom: "8px" }}>Manage your active sessions across all devices.</p>
        <button
          className="ui-btn ui-btn-large ui-btn-secondary"
          onClick={handleLogoutFromThisDevice}
          disabled={isLoggingOut}
        >
          Log out
        </button>
      </div>

      <div className={styles.settingItem}>
        <h3>Delete Account</h3>
        <p style={{ marginBottom: "8px" }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <p className={styles.warningText}>
          ⚠️ <strong>Warning:</strong> This will permanently delete your account, all your progress, completed
          exercises, and personal data. This action is irreversible.
        </p>
        <div className={styles.buttonRow}>
          <button className="ui-btn ui-btn-large ui-btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
