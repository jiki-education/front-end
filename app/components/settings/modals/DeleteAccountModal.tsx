"use client";

import { useState } from "react";
import { hideModal } from "@/lib/modal/store";
import { requestAccountDeletion } from "@/lib/auth/service";
import styles from "./DeleteAccountModal.module.css";

export function DeleteAccountModal() {
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
      setError("Failed to send confirmation email. Please try again.");
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
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>Are you sure?</h3>
      <p className={styles.message}>
        Do you really want to delete your account? You will lose all your work. This is irreversible.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-small ui-btn-primary" onClick={hideModal} disabled={isLoading}>
          Cancel
        </button>
        <button className="ui-btn ui-btn-default ui-btn-danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Sending..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}

function SecurityCheckStep() {
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>Security Check</h3>
      <p className={styles.message}>
        We&apos;ve sent you an email to confirm this is really you. Please click the button in that email to delete your
        account.
      </p>
      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-default ui-btn-primary" onClick={hideModal}>
          I understand
        </button>
      </div>
    </div>
  );
}
