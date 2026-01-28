"use client";

import { useLogoutActions } from "../lib/useLogoutActions";
import ActionField from "../ui/ActionField";
import styles from "../Settings.module.css";

export default function DangerTab() {
  const { isLoggingOut, handleLogoutFromThisDevice } = useLogoutActions();

  return (
    <div className={styles.settingsContent}>
      <ActionField label="Session Management" description="Manage your active sessions across all devices.">
        <button
          className="ui-btn ui-btn-small ui-btn-danger w-[160px]"
          onClick={handleLogoutFromThisDevice}
          disabled={isLoggingOut}
        >
          Log out
        </button>
      </ActionField>
    </div>
  );
}
