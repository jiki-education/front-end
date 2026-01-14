"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { useSettingsStore } from "@/lib/settings/settingsStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProfileSection from "../sections/ProfileSection";
import SecuritySection from "../sections/SecuritySection";
import PreferencesSection from "../sections/PreferencesSection";
import styles from "../Settings.module.css";

export default function AccountTab() {
  const { user } = useAuthStore();
  const { settings, loading, fetchSettings, updateName, updateHandle, updateLocale, updateEmail, updatePassword } =
    useSettingsStore();

  // Fetch settings on mount
  useEffect(() => {
    if (user && !settings) {
      void fetchSettings();
    }
  }, [user, settings, fetchSettings]);

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={styles.settingsContent}>
      <ProfileSection
        settings={settings}
        updateName={updateName}
        updateHandle={updateHandle}
        updateEmail={updateEmail}
      />

      <SecuritySection updatePassword={updatePassword} />

      <PreferencesSection settings={settings} updateLocale={updateLocale} />
    </div>
  );
}
