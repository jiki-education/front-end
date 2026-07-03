import type { Metadata } from "next";
import { alternatesFromRequest } from "@/lib/seo/alternates";

// Emit hreflang alternates + a self-referential canonical for every public page
// in the [locale] tree. Doing it here (rather than in each page's
// generateMetadata) keeps the alternates DRY and automatic: Next merges this
// layout's metadata with each page's own title/description. The path comes from
// the middleware-set x-pathname header, so pages need no per-page wiring.
export async function generateMetadata(): Promise<Metadata> {
  return alternatesFromRequest();
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
