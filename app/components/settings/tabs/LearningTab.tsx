"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useSettingsStore } from "@/lib/settings/settingsStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ActionField from "../ui/ActionField";
import styles from "../Settings.module.css";
import Link from "next/link";

export default function LearningTab() {
  const t = useTranslations("settings.learning");
  const routes = useLocaleRoutes();
  const { settings, loading, fetchSettings, updateStreaks } = useSettingsStore();

  // Fetch settings on mount
  useEffect(() => {
    if (!settings) {
      void fetchSettings();
    }
  }, [settings, fetchSettings]);

  const handleToggle = async () => {
    if (!settings) {
      return;
    }

    await updateStreaks(!settings.streaks_enabled);
  };

  if (loading || !settings) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const enabled = settings.streaks_enabled;

  return (
    <div className={styles.settingsContent}>
      <div className={styles.settingsField}>
        <ActionField label={t("streaksLabel")} description={t("streaksDescription")}>
          <button
            className={`ui-toggle-switch ${enabled ? "active" : ""}`}
            onClick={handleToggle}
            aria-label={t("toggleAriaLabel")}
            aria-checked={enabled}
            role="switch"
          />
        </ActionField>
        <Link href={routes.article("streaks")} className={styles.learnMoreLink}>
          {t("learnMore")}
        </Link>
      </div>
    </div>
  );
}
