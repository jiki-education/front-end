"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { hideModal } from "@/lib/modal/store";
import { requestAccountDeletion } from "@/lib/auth/service";
import styles from "./DeleteAccountModal.module.css";

export function DeleteAccountModal() {
  const t = useTranslations("settings.deleteAccount");
  const [step, setStep] = useState<"confirm" | "security-check">("confirm");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await requestAccountDeletion();
      setStep("security-check");
    } catch {
      setError(t("sendFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "security-check") {
    return <SecurityCheckStep />;
  }

  return <ConfirmStep onConfirm={handleConfirm} isLoading={isLoading} error={error} />;
}

function ConfirmStep({
  onConfirm,
  isLoading,
  error
}: {
  onConfirm: () => void;
  isLoading: boolean;
  error: string | null;
}) {
  const t = useTranslations("settings.deleteAccount");
  const tCommon = useTranslations("common");
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>{t("confirmTitle")}</h3>
      <p className={styles.message}>{t("confirmMessage")}</p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-small ui-btn-primary" onClick={hideModal} disabled={isLoading}>
          {tCommon("cancel")}
        </button>
        <button className="ui-btn ui-btn-default ui-btn-danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? tCommon("sending") : t("submit")}
        </button>
      </div>
    </div>
  );
}

function SecurityCheckStep() {
  const t = useTranslations("settings.deleteAccount");
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>{t("securityTitle")}</h3>
      <p className={styles.message}>{t("securityMessage")}</p>
      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-default ui-btn-primary" onClick={hideModal}>
          {t("understand")}
        </button>
      </div>
    </div>
  );
}
