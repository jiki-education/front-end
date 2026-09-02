import BlogPage from "@/components/blog/BlogPage";
import { hasAuthenticationCookie } from "@/lib/auth/server-storage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import { isSupportedLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.blog" });

  return {
    title: t("title"),
    description: t("description")
  };
}

export default async function AuthenticatedLocaleBlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;

  // The default locale is served here under the naked URL (/blog), rewritten to
  // /en/blog by middleware; an explicit /en/blog is redirected back to /blog there.
  // The locale list is the only gate. A locale is either fully translated or it
  // is not served, so being supported already means it has this content; asking
  // again at request time would put a fetch on the path of a cacheable page to
  // answer a question the list has already answered.
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  // Authenticated UI with header/footer
  return (
    <AuthenticatedHeaderLayout>
      <BlogPage authenticated={await hasAuthenticationCookie()} locale={locale} page={page} />
    </AuthenticatedHeaderLayout>
  );
}
