"use client";

import SidebarLayout from "@/components/layout/SidebarLayout";
import SettingsPage from "@/components/settings/SettingsPage";

export default function Settings() {
  return (
    <SidebarLayout activeItem="settings">
      <SettingsPage />
    </SidebarLayout>
  );
}
