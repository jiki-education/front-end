import { getContentMeta } from "./contentMeta";
import type { TestimonialsData } from "./types";

/**
 * Get a locale's testimonials: the headings, the primary quote, the landing
 * grid, the full /testimonials page, and the hero marquee blurbs.
 *
 * There is NO English fallback here, and there must never be one. A locale that
 * has not translated its testimonials returns null and renders none: the
 * landing section disappears and the /testimonials page shows an empty list.
 * Showing English marketing copy to a reader who asked for another language is
 * the failure the whole structure/copy split exists to make impossible, and
 * "the section cannot render empty" is not an exception to it. It renders empty.
 *
 * Null therefore means one of two things, and the caller cannot tell them apart
 * because it does not need to: this locale has no testimonial catalog, or the
 * deploy is broken. Both render nothing.
 */
export async function getTestimonials(locale: string): Promise<TestimonialsData | null> {
  return (await getContentMeta(locale)).testimonials;
}
