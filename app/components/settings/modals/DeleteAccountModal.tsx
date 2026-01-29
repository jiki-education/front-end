"use client";

import { useState } from "react";
import { hideModal } from "@/lib/modal/store";
import styles from "./DeleteAccountModal.module.css";

export function DeleteAccountModal() {
  const [step, setStep] = useState<"confirm" | "security-check">("confirm");

  if (step === "security-check") {
    return <SecurityCheckStep />;
  }

  return <ConfirmStep onConfirm={() => setStep("security-check")} />;
}

function ConfirmStep({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>Are you sure?</h3>
      <p className={styles.message}>
        Do you really want to delete your account? You will lose all your work. This is irreversible.
      </p>
      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-small ui-btn-primary" onClick={hideModal}>
          Cancel
        </button>
        <button className="ui-btn ui-btn-default ui-btn-danger" onClick={onConfirm}>
          Delete Account
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
