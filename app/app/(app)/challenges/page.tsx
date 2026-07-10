import BetaTag from "@/components/common/BetaTag";
import SidebarLayout from "../../../components/layout/SidebarLayout";
import { ChallengesContent } from "./ChallengesContent";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.challenges");
  return { title: t("title"), description: t("description") };
}

export default function ChallengesPage() {
  return (
    <SidebarLayout activeItem="challenges">
      <BetaTag />
      <ChallengesContent />
    </SidebarLayout>
  );
}
