import type { Metadata } from "next";
import { alternatesFromRequest } from "@/lib/seo/alternates";

// Server layout wrapping the external [locale] flows (auth). It exists to emit
// hreflang alternates + a self-referential canonical for every page below it; the
// nested auth/layout.tsx is a client component and so cannot export metadata.
// The path comes from the middleware-set x-pathname header, so pages need no
// per-page wiring.
export async function generateMetadata(): Promise<Metadata> {
  return alternatesFromRequest();
}

export default function ExternalLocaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
