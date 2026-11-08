import { getLocale } from "next-intl/server";
import { getTestimonials } from "./getTestimonials";

export type AuthSearchParams = Promise<Record<string, string | string[] | undefined>>;

export interface AuthPanelProps {
  // Short learner quotes for the scrolling strip, in the request's locale. Empty
  // when the locale has no testimonial catalog (see getTestimonials: never English).
  marquee: string[];
  // Arrived from Exercism (?utm_source=exercism), so the panel also explains
  // how Jiki and Exercism fit together
  fromExercism: boolean;
}

// Everything the auth pages' blue panel needs that only the server knows. Pages
// call this and spread the result onto AuthLayout, so both versions of the
// panel are in the server-rendered HTML.
export async function getAuthPanelProps(searchParams: AuthSearchParams): Promise<AuthPanelProps> {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const testimonials = await getTestimonials(locale);

  return {
    marquee: testimonials?.marquee ?? [],
    fromExercism: params.utm_source === "exercism"
  };
}
