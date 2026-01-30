"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/settings/settingsStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ActionField from "../ui/ActionField";
import styles from "../Settings.module.css";
import Link from "next/link";

export default function LearningTab() {
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
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const enabled = settings.streaks_enabled;

  return (
    <div className={styles.settingsContent}>
      <div className={styles.settingsField}>
        <ActionField label="Study Streaks" description="Enable streaks on my account.">
          <button
            className={`ui-toggle-switch ${enabled ? "active" : ""}`}
            onClick={handleToggle}
            aria-label="Toggle study streaks"
            aria-checked={enabled}
            role="switch"
          />
        </ActionField>
        <Link
          href="/articles/streaks"
          className="text-sm text-gray-500 underline hover:text-gray-700 mt-1 inline-block"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
