import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RoadmapPage } from "@/components/roadmap/RoadmapPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.roadmap");
  return { title: t("title"), description: t("description") };
}

export default function Page() {
  return <RoadmapPage />;
}
