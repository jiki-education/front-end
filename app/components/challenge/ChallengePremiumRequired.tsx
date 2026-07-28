"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./ChallengePremiumRequired.module.css";

export default function ChallengePremiumRequired() {
  const router = useRouter();
  const t = useTranslations("challenge");

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h2 className={styles.title}>{t("premiumRequired.title")}</h2>
        <p className={styles.description}>{t("premiumRequired.description")}</p>
        <button onClick={() => router.push("/challenges")} className={styles.button}>
          {t("backToChallenges")}
        </button>
      </div>
    </div>
  );
}
