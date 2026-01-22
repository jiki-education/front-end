"use client";

import AccountSettingsIcon from "@/icons/account-settings.svg";
import DangerSettingsIcon from "@/icons/danger-settings.svg";
import NotificationsSettingsIcon from "@/icons/notifications-settings.svg";
import SettingsIcon from "@/icons/settings.svg";
import SubscriptionIcon from "@/icons/subscription.svg";
import { useAuthStore } from "@/lib/auth/authStore";
import type { MembershipTier } from "@/lib/pricing";
import { extractAndClearSessionId, verifyPaymentSession } from "@/lib/subscriptions/verification";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./Settings.module.css";
import AccountTab from "./tabs/AccountTab";
import DangerTab from "./tabs/DangerTab";
import NotificationsTab from "./tabs/NotificationsTab";
import SubscriptionTab from "./tabs/SubscriptionTab";

type TabType = "account" | "subscription" | "notifications" | "danger";

export default function SettingsPage() {
  const { user, refreshUser } = useAuthStore();

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
          <div className="ui-page-tabs mb-[26px]">
            <button className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>
              <AccountSettingsIcon />
              Account
            </button>
            <button
              className={activeTab === "subscription" ? "active" : ""}
              onClick={() => setActiveTab("subscription")}
            >
              <SubscriptionIcon />
              Subscription
            </button>
            <button
              className={activeTab === "notifications" ? "active" : ""}
              onClick={() => setActiveTab("notifications")}
            >
              <NotificationsSettingsIcon />
              Notifications
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
            {activeTab === "account" && <AccountTab />}
            {activeTab === "subscription" && (
              <SubscriptionTab
                user={user}
                refreshUser={refreshUser}
                selectedTier={selectedTier}
                setSelectedTier={setSelectedTier}
                clientSecret={clientSecret}
                setClientSecret={setClientSecret}
              />
            )}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "danger" && <DangerTab />}
          </main>
        </div>
      </div>
    </>
  );
}
