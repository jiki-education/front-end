import { getContentMeta } from "./contentMeta";
import { DEFAULT_LOCALE } from "@/lib/locales";
import type { TestimonialsData } from "./types";

/**
 * Get the landing-page testimonials for a locale (heading, primary quote, the
 * grid of student quotes, and the hero marquee blurbs).
 *
 * This is the ONE deliberate English fallback in the content layer. Testimonials
 * are marketing copy on the landing page and the section cannot render empty, so
 * an untranslated locale shows the English quotes rather than a hole. Everywhere
 * else a miss stays a miss, so a gap is visible rather than silently English.
 *
 * Returns null only when even English is unavailable, which is a broken deploy
 * rather than a missing translation; the caller renders nothing.
 */
export async function getTestimonials(locale: string): Promise<TestimonialsData | null> {
  const meta = await getContentMeta(locale);
  if (meta.testimonials) {
    return meta.testimonials;
  }
  return (await getContentMeta(DEFAULT_LOCALE)).testimonials;
}
