import { UnsubscribeContent } from "@/components/auth/UnsubscribeContent";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.unsubscribe");
  return { title: t("title"), description: t("description") };
}

export default function UnsubscribePage() {
  return <UnsubscribeContent />;
}
