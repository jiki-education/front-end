"use client";

import { showModal } from "@/lib/modal/store";
import { useLogoutActions } from "../lib/useLogoutActions";
import ActionField from "../ui/ActionField";
import styles from "../Settings.module.css";
import modalStyles from "../modals/DeleteAccountModal.module.css";

export default function DangerTab() {
  const { isLoggingOut, handleLogoutFromThisDevice } = useLogoutActions();

  const handleDeleteAccount = () => {
    showModal("delete-account-modal", {}, undefined, modalStyles.modal);
  };

  return (
    <div className={styles.settingsContent}>
      <div className={styles.settingsField}>
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
      <div className={styles.settingsField}>
        <ActionField
          label="Delete Account"
          description="Permanently delete your account and all associated data. This action cannot be undone."
        >
          <button
            className="ui-btn ui-btn-small ui-btn-danger min-w-[160px] whitespace-nowrap"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </ActionField>
      </div>
    </div>
  );
}
