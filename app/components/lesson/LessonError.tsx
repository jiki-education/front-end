"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./LessonError.module.css";

export default function LessonError({ error }: { error: string }) {
  const router = useRouter();
  const routes = useLocaleRoutes();
  const t = useTranslations("lesson");

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.message}>{t("error.message", { error })}</p>
        <button onClick={() => router.push(routes.dashboard())} className={styles.button}>
          {t("backToDashboard")}
        </button>
      </div>
    </div>
  );
}
