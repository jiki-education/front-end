"use client";

import { showModal } from "@/lib/modal/store";
import { useTranslations } from "next-intl";
import { useLogoutActions } from "../lib/useLogoutActions";
import ActionField from "../ui/ActionField";
import styles from "../Settings.module.css";
import modalStyles from "../modals/DeleteAccountModal.module.css";

export default function DangerTab() {
  const t = useTranslations("settings.danger");
  const { isLoggingOut, handleLogoutFromThisDevice } = useLogoutActions();

  const handleDeleteAccount = () => {
    showModal("delete-account-modal", {}, undefined, modalStyles.modal);
  };

  return (
    <div className={styles.settingsContent}>
      <div className={styles.settingsField}>
        <ActionField label={t("sessionLabel")} description={t("sessionDescription")}>
          <button
            className="ui-btn ui-btn-small ui-btn-danger w-[160px]"
            onClick={handleLogoutFromThisDevice}
            disabled={isLoggingOut}
          >
            {t("logout")}
          </button>
        </ActionField>
      </div>
      <div className={styles.settingsField}>
        <ActionField label={t("deleteLabel")} description={t("deleteDescription")}>
          <button
            className="ui-btn ui-btn-small ui-btn-danger min-w-[160px] whitespace-nowrap"
            onClick={handleDeleteAccount}
          >
            {t("deleteButton")}
          </button>
        </ActionField>
      </div>
    </div>
  );
}
