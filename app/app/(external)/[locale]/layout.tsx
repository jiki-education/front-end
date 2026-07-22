import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/lib/i18n/config";
import { alternatesFromRequest } from "@/lib/seo/alternates";

// Server layout wrapping the external [locale] flows (auth). It exists to emit
// hreflang alternates + a self-referential canonical for every page below it; the
// nested auth/layout.tsx is a client component and so cannot export metadata.
// The path comes from the middleware-set x-pathname header, so pages need no
// per-page wiring.
export async function generateMetadata(): Promise<Metadata> {
  return alternatesFromRequest();
}

// Gate the external [locale] auth flows on a served locale, matching the hybrid
// tree: an unsupported /hu/auth/... (or /xx/auth/...) 404s here.
export default async function ExternalLocaleLayout({
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
  return children;
}
