"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./ChallengeError.module.css";

export default function ChallengeError({ error }: { error: string }) {
  const router = useRouter();
  const t = useTranslations("challenge");

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.message}>{t("error.message", { error })}</p>
        <button onClick={() => router.push("/challenges")} className={styles.button}>
          {t("backToChallenges")}
        </button>
      </div>
    </div>
  );
}
