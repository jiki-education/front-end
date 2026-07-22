import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PremiumPage } from "@/components/premium/PremiumPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.premium");
  return { title: t("title"), description: t("description") };
}

export default function Page() {
  return <PremiumPage />;
}
