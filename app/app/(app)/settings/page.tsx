import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SettingsContent from "./SettingsContent";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.settings");
  return { title: t("title"), description: t("description") };
}

export default function Settings() {
  return <SettingsContent />;
}
