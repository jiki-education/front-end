import type { Metadata } from "next";
import SettingsContent from "./SettingsContent";

export const metadata: Metadata = {
  title: "Settings - Jiki",
  description: "Manage your account settings, subscription, and preferences."
};

export default function Settings() {
  return <SettingsContent />;
}
