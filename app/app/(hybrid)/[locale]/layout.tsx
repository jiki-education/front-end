import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/i18n/config";
import { alternatesFromRequest } from "@/lib/seo/alternates";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";

// Emit hreflang alternates + a self-referential canonical for every public page
// in the [locale] tree. Doing it here (rather than in each page's
// generateMetadata) keeps the alternates DRY and automatic: Next merges this
// layout's metadata with each page's own title/description. The path comes from
// the middleware-set x-pathname header, so pages need no per-page wiring.
export async function generateMetadata(): Promise<Metadata> {
  return alternatesFromRequest();
}

// Gate the whole [locale] tree on a served locale. With production serving en
// only, a hand-typed /hu/... (or any unsupported /xx/...) 404s here instead of
// rendering the English page at a foreign-locale URL.
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }
  // Site-wide Organization + WebSite entities, emitted once for the whole public
  // tree. Auth-gated app routes live outside this layout and aren't crawled, so
  // there's no SEO value in emitting them there.
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema(locale)]} />
      {children}
    </>
  );
}
