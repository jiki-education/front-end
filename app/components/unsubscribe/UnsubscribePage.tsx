"use client";

import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth/authStore";
import type { EmailPreferences } from "@/lib/api/emailPreferences";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import UnsubscribeFromEmailSection from "./UnsubscribeFromEmailSection";
import UnsubscribeFromAllSection from "./UnsubscribeFromAllSection";
import ManageNotificationsSection from "./ManageNotificationsSection";
import { useEmailPreferences } from "./useEmailPreferences";
import styles from "./UnsubscribePage.module.css";

interface UnsubscribePageProps {
  token: string;
  emailKey?: string;
}

export default function UnsubscribePage({ token, emailKey }: UnsubscribePageProps) {
  const t = useTranslations("unsubscribe");
  const { isAuthenticated } = useAuthStore();
  const {
    preferences,
    loading,
    loadError,
    actionStates,
    handleUpdatePreference,
    handleSavePreferences,
    handleUnsubscribeAll
  } = useEmailPreferences(token);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (loadError && !preferences) {
    notFound();
  }

  const currentKeyValue = emailKey && preferences ? preferences[emailKey as keyof EmailPreferences] : null;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.innerContent}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{t("title")}</h1>
          <p className={styles.pageSubtitle}>{t("subtitle")}</p>
        </header>

        <div className={styles.contentLayout}>
          {emailKey && preferences && (
            <UnsubscribeFromEmailSection
              emailKey={emailKey}
              isSubscribed={currentKeyValue ?? false}
              loading={actionStates.emailKey === "loading"}
              success={actionStates.emailKey === "success"}
              error={actionStates.emailKey === "error"}
              onUnsubscribe={() => handleUpdatePreference(emailKey as keyof EmailPreferences, false)}
            />
          )}

          <UnsubscribeFromAllSection
            loading={actionStates.all === "loading"}
            success={actionStates.all === "success"}
            error={actionStates.all === "error"}
            onUnsubscribe={handleUnsubscribeAll}
          />

          {isAuthenticated && preferences && (
            <ManageNotificationsSection
              preferences={preferences}
              loading={actionStates.preferences === "loading"}
              onSave={handleSavePreferences}
            />
          )}
        </div>
      </div>
    </div>
  );
}
