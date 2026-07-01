import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CheckEmailClient from "./CheckEmailClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.checkEmail");
  return { title: t("title"), description: t("description") };
}

export default function CheckEmailPage() {
  return <CheckEmailClient />;
}
