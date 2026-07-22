import contentMeta from "@/lib/generated/content-meta-server.json";
import type { TestimonialsData } from "./types";

/**
 * Get the landing-page testimonials for a locale (heading, primary quote, the
 * grid of student quotes, and the hero marquee blurbs).
 *
 * Reads synchronously from the bundled content-meta-server.json (generated at
 * build time from content/src/testimonials/{locale}.json), so it is safe for
 * server-side rendering on cacheable public pages — no fetch, no async.
 *
 * Falls back to English when the requested locale has no testimonials authored.
 */
export function getTestimonials(locale: string): TestimonialsData {
  const meta = contentMeta as {
    testimonials: { en: TestimonialsData; [locale: string]: TestimonialsData | undefined };
  };
  return meta.testimonials[locale] ?? meta.testimonials.en;
}
