import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TestimonialsPage } from "@/components/testimonials/TestimonialsPage";
import { getTestimonials } from "@/lib/content/getTestimonials";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.testimonials");
  return { title: t("title"), description: t("description") };
}

/**
 * The quotes are FETCHED here rather than bundled into the component, for the
 * same reason every other translated artifact is: they are a per-locale catalog
 * the i18n repo publishes, so binding them to a front-end build would mean a
 * locale could be translated and still render English until the next deploy.
 *
 * A locale with no testimonial catalog gets an empty list, never English.
 */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const testimonials = await getTestimonials(locale);

  return <TestimonialsPage quotes={testimonials?.page ?? []} />;
}
