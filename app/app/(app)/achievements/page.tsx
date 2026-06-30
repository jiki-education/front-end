import BetaTag from "@/components/common/BetaTag";
import SidebarLayout from "../../../components/layout/SidebarLayout";
import { AchievementsContent } from "./AchievementsContent";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.achievements");
  return { title: t("title"), description: t("description") };
}

export default function AchievementsPage() {
  return (
    <SidebarLayout activeItem="achievements">
      <BetaTag />
      <AchievementsContent />
    </SidebarLayout>
  );
}
