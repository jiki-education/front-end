import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAuthPanelProps, type AuthSearchParams } from "@/lib/content/getAuthPanelProps";
import CheckEmailClient from "./CheckEmailClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.checkEmail");
  return { title: t("title"), description: t("description") };
}

export default async function CheckEmailPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const panel = await getAuthPanelProps(searchParams);
  return <CheckEmailClient panel={panel} />;
}
