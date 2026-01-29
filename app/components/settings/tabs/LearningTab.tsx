"use client";

import { useEffect, useRef, useState } from "react";
import { useSettingsStore } from "@/lib/settings/settingsStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ActionField from "../ui/ActionField";
import styles from "../Settings.module.css";
import Link from "next/link";

const DEBOUNCE_MS = 500;

export default function LearningTab() {
  const { settings, loading, fetchSettings, updateStreaks } = useSettingsStore();
  const [localEnabled, setLocalEnabled] = useState<boolean | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    if (!settings) {
      void fetchSettings();
    }
  }, [settings, fetchSettings]);

  // Sync local state with settings when settings load
  useEffect(() => {
    if (settings && localEnabled === null) {
      setLocalEnabled(settings.streaks_enabled);
    }
  }, [settings, localEnabled]);

  const handleToggle = () => {
    if (localEnabled === null) {
      return;
    }

    const newValue = !localEnabled;
    setLocalEnabled(newValue);

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the API call
    debounceRef.current = setTimeout(() => {
      void updateStreaks(newValue);
    }, DEBOUNCE_MS);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const enabled = localEnabled ?? settings.streaks_enabled;

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
