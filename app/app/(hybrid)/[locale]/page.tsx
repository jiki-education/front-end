import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { LandingPage } from "../../../components/landing-page/LandingPage";
import { hasAuthenticationCookie } from "../../../lib/auth/server-storage";
import { getAllBlogPosts } from "../../../lib/content/getAllBlogPosts";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.home");
  return { title: t("title"), description: t("description") };
}

export default async function RootPage() {
  const hasCookie = await hasAuthenticationCookie();
  if (hasCookie) {
    return redirect("/dashboard");
  }

  const latestPosts = getAllBlogPosts("en").slice(0, 3);

  return <LandingPage latestPosts={latestPosts} />;
}
