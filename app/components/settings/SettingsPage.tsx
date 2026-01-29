"use client";

import AccountSettingsIcon from "@/icons/account-settings.svg";
import DangerSettingsIcon from "@/icons/danger-settings.svg";
import NotificationsSettingsIcon from "@/icons/notifications-settings.svg";
import ProjectsIcon from "@/icons/projects.svg";
import SettingsIcon from "@/icons/settings.svg";
import SubscriptionIcon from "@/icons/subscription.svg";
import { useAuthStore } from "@/lib/auth/authStore";
import { useState } from "react";
import styles from "./Settings.module.css";
import AccountTab from "./tabs/AccountTab";
import DangerTab from "./tabs/DangerTab";
import LearningTab from "./tabs/LearningTab";
import NotificationsTab from "./tabs/NotificationsTab";
import SubscriptionTab from "./tabs/SubscriptionTab";

type TabType = "account" | "subscription" | "learning" | "notifications" | "danger";

export default function SettingsPage() {
  const { user, refreshUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabType>("account");

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
            <button className={activeTab === "learning" ? "active" : ""} onClick={() => setActiveTab("learning")}>
              <ProjectsIcon />
              Learning
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
          <main>
            {activeTab === "account" && <AccountTab />}
            {activeTab === "subscription" && <SubscriptionTab user={user} refreshUser={refreshUser} />}
            {activeTab === "learning" && <LearningTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "danger" && <DangerTab />}
          </main>
        </div>
      </div>
    </>
  );
}
