"use client";

import { showPremiumUpgradeModal } from "@/lib/modal/app";
import styles from "./page.module.css";

export default function PremiumUpgradeModalTest() {
  const handleShowModal = () => {
    showPremiumUpgradeModal("upgrade_cta_nav", {
      onSuccess: () => {
        console.debug("Upgrade successful");
      },
      onCancel: () => {
        console.debug("Upgrade cancelled");
      }
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Premium Upgrade Modal Test</h1>
        <button onClick={handleShowModal} className={styles.button}>
          Show Premium Upgrade Modal
        </button>
        <p className={styles.note}>Click the button to test the new premium upgrade modal</p>
      </div>
    </div>
  );
}
