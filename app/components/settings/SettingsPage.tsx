"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRequireAuth } from "@/lib/auth/hooks";
import { extractAndClearSessionId, verifyPaymentSession } from "@/lib/subscriptions/verification";
import toast from "react-hot-toast";
import type { MembershipTier } from "@/lib/pricing";
import SubscriptionSection from "./subscription/SubscriptionSection";
import SubscriptionErrorBoundary from "./subscription/SubscriptionErrorBoundary";
import Sidebar from "@/components/index-page/sidebar/Sidebar";
import styles from "./Settings.module.css";
import SettingsIcon from "@/icons/settings.svg";
import AccountSettingsIcon from "@/icons/account-settings.svg";
import LearningSettingsIcon from "@/icons/learning-settings.svg";
import NotificationsSettingsIcon from "@/icons/notifications-settings.svg";
import PrivacySettingsIcon from "@/icons/privacy-settings.svg";
import DangerSettingsIcon from "@/icons/danger-settings.svg";

type TabType = "account" | "learning" | "notifications" | "privacy" | "danger";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useRequireAuth();
  const { refreshUser } = useAuthStore();

  // State for checkout flows
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("account");

  // Handle post-payment redirect from Stripe
  useEffect(() => {
    // Only process if user is authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    // Extract session_id from URL and remove it (to prevent re-processing on refresh)
    const sessionId = extractAndClearSessionId();

    if (sessionId) {
      // Verify the checkout session with our backend and sync subscription data
      async function verifyAndRefresh(id: string) {
        toast.loading("Verifying payment...");
        const result = await verifyPaymentSession(id);
        toast.dismiss();

        if (result.success) {
          // Payment successful - refresh user data to show new subscription tier
          toast.success("Payment verified! Your subscription has been updated.");
          await refreshUser();
          // Clear checkout state
          setSelectedTier(null);
          setClientSecret(null);
        } else {
          // Payment failed or session invalid
          toast.error(`Failed to verify payment: ${result.error}`);
        }
      }

      void verifyAndRefresh(sessionId);
    }
  }, [isAuthenticated, user, refreshUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary theme-transition">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-link-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-secondary theme-transition">
      <Sidebar activeItem="settings" />

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          {/* Page Header */}
          <header className="ui-page-header">
            <h1>
              <SettingsIcon />
              Settings
            </h1>
            <p>Manage your account and preferences.</p>
          </header>

          {/* Page Tabs */}
          <div className="ui-page-tabs">
            <button className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>
              <AccountSettingsIcon />
              Account
            </button>
            <button className={activeTab === "learning" ? "active" : ""} onClick={() => setActiveTab("learning")}>
              <LearningSettingsIcon />
              Learning
            </button>
            <button
              className={activeTab === "notifications" ? "active" : ""}
              onClick={() => setActiveTab("notifications")}
            >
              <NotificationsSettingsIcon />
              Notifications
            </button>
            <button className={activeTab === "privacy" ? "active" : ""} onClick={() => setActiveTab("privacy")}>
              <PrivacySettingsIcon />
              Privacy
            </button>
            <button
              className={activeTab === "danger" ? "active" : ""}
              data-color="red"
              onClick={() => setActiveTab("danger")}
            >
              <DangerSettingsIcon />
              Danger Zone
            </button>
          </div>

          {/* Tab Content */}
          <main className="p-6">
            <div className="space-y-6">
              {activeTab === "account" && (
                <SubscriptionErrorBoundary>
                  <SubscriptionSection
                    user={user}
                    refreshUser={refreshUser}
                    selectedTier={selectedTier}
                    setSelectedTier={setSelectedTier}
                    clientSecret={clientSecret}
                    setClientSecret={setClientSecret}
                  />
                </SubscriptionErrorBoundary>
              )}
              {activeTab === "learning" && (
                <div className="text-center text-text-secondary py-8">Learning settings coming soon...</div>
              )}
              {activeTab === "notifications" && (
                <div className="text-center text-text-secondary py-8">Notification settings coming soon...</div>
              )}
              {activeTab === "privacy" && (
                <div className="text-center text-text-secondary py-8">Privacy settings coming soon...</div>
              )}
              {activeTab === "danger" && (
                <div className={styles.settingsContent}>
                  <div className={styles.settingItem}>
                    <h3>Delete Account</h3>
                    <p style={{ marginBottom: "8px" }}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <p className={styles.warningText}>
                      ⚠️ <strong>Warning:</strong> This will permanently delete your account, all your progress,
                      completed exercises, and personal data. This action is irreversible.
                    </p>
                    <div className={styles.buttonRow}>
                      <button className="ui-btn ui-btn-danger">Delete Account</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
