import { UnsubscribeContent } from "@/components/auth/UnsubscribeContent";
import { getAuthPanelProps, type AuthSearchParams } from "@/lib/content/getAuthPanelProps";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.unsubscribe");
  return { title: t("title"), description: t("description") };
}

export default async function UnsubscribePage({ searchParams }: { searchParams: AuthSearchParams }) {
  const panel = await getAuthPanelProps(searchParams);
  return <UnsubscribeContent panel={panel} />;
}
