"use client";

import AccountSettingsIcon from "@/icons/account-settings.svg";
import DangerSettingsIcon from "@/icons/danger-settings.svg";
import LearningSettingsIcon from "@/icons/learning-settings.svg";
import NotificationsSettingsIcon from "@/icons/notifications-settings.svg";
import PrivacySettingsIcon from "@/icons/privacy-settings.svg";
import SettingsIcon from "@/icons/settings.svg";
import { useAuthStore } from "@/lib/auth/authStore";
import type { MembershipTier } from "@/lib/pricing";
import { extractAndClearSessionId, verifyPaymentSession } from "@/lib/subscriptions/verification";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLogoutActions } from "./lib/useLogoutActions";
import styles from "./Settings.module.css";
import SubscriptionErrorBoundary from "./subscription/SubscriptionErrorBoundary";
import SubscriptionSection from "./subscription/SubscriptionSection";

type TabType = "account" | "learning" | "notifications" | "privacy" | "danger";

export default function SettingsPage() {
  const { user, refreshUser } = useAuthStore();
  const { isLoggingOut, handleLogoutFromThisDevice, handleLogoutFromAllDevices } = useLogoutActions();

  // State for checkout flows
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("account");

  // Handle post-payment redirect from Stripe
  useEffect(() => {
    // Only process if user is available
    if (!user) {
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
  }, [user, refreshUser]);

  return (
    <>
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
                    <h3>Session Management</h3>
                    <p style={{ marginBottom: "8px" }}>Manage your active sessions across all devices.</p>
                    <div className="gap-8 flex flex-col w-[250px]">
                      <button
                        className="ui-btn ui-btn-large ui-btn-secondary"
                        onClick={handleLogoutFromThisDevice}
                        disabled={isLoggingOut}
                      >
                        Log out of this device
                      </button>
                      <button
                        className="ui-btn ui-btn-large ui-btn-danger"
                        onClick={handleLogoutFromAllDevices}
                        disabled={isLoggingOut}
                      >
                        Log out of all devices
                      </button>
                    </div>
                  </div>

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
                      <button className="ui-btn ui-btn-large ui-btn-danger">Delete Account</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
