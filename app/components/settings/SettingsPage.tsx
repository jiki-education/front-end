"use client";

import { PageHeader } from "@/components/ui-kit/PageHeader";
import AccountSettingsIcon from "@/icons/account-settings.svg";
import DangerSettingsIcon from "@/icons/danger-settings.svg";
import NotificationsSettingsIcon from "@/icons/notifications-settings.svg";
import ProjectsIcon from "@/icons/projects.svg";
import SettingsIcon from "@/icons/settings.svg";
import SubscriptionIcon from "@/icons/subscription.svg";
import { useAuthStore } from "@/lib/auth/authStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import styles from "./Settings.module.css";
import AccountTab from "./tabs/AccountTab";
import DangerTab from "./tabs/DangerTab";
import LearningTab from "./tabs/LearningTab";
import NotificationsTab from "./tabs/NotificationsTab";
import SubscriptionTab from "./tabs/SubscriptionTab";

type TabType = "account" | "subscription" | "learning" | "notifications" | "danger";

export default function SettingsPage() {
  const t = useTranslations("settings.page");
  const { user, refreshUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabType>("account");

  return (
    <div className={styles.mainContent}>
      <PageHeader icon={<SettingsIcon />} title={t("title")} description={t("description")}>
        <div className="ui-page-tabs mb-[26px]">
          <button className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>
            <AccountSettingsIcon />
            {t("tabAccount")}
          </button>
          <button className={activeTab === "subscription" ? "active" : ""} onClick={() => setActiveTab("subscription")}>
            <SubscriptionIcon />
            {t("tabSubscription")}
          </button>
          <button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
          >
            <NotificationsSettingsIcon />
            {t("tabNotifications")}
          </button>
          <button className={activeTab === "learning" ? "active" : ""} onClick={() => setActiveTab("learning")}>
            <ProjectsIcon />
            {t("tabLearning")}
          </button>
          <button
            className={activeTab === "danger" ? "active" : ""}
            data-color="red"
            onClick={() => setActiveTab("danger")}
          >
            <DangerSettingsIcon />
            {t("tabDanger")}
          </button>
        </div>

        <main>
          {activeTab === "account" && <AccountTab />}
          {activeTab === "subscription" && <SubscriptionTab user={user} refreshUser={refreshUser} />}
          {activeTab === "learning" && <LearningTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "danger" && <DangerTab />}
        </main>
      </PageHeader>
    </div>
  );
}
