import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TestimonialsPage } from "@/components/testimonials/TestimonialsPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.testimonials");
  return { title: t("title"), description: t("description") };
}

export default function Page() {
  return <TestimonialsPage />;
}
