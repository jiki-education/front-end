import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { LandingPage } from "../../../components/landing-page/LandingPage";
import { hasAuthenticationCookie } from "../../../lib/auth/server-storage";
import { getAllBlogPosts } from "../../../lib/content/getAllBlogPosts";
import { getTestimonials } from "../../../lib/content/getTestimonials";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.home");
  return { title: t("title"), description: t("description") };
}

export default async function RootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const hasCookie = await hasAuthenticationCookie();
  if (hasCookie) {
    return redirect("/dashboard");
  }

  // Both read THIS locale, never English. A locale with no translated posts
  // shows no post cards, and one with no testimonial catalog shows no
  // testimonials: three English cards on a translated landing page look like a
  // working page and are not.
  const [posts, testimonials] = await Promise.all([getAllBlogPosts(locale), getTestimonials(locale)]);

  return <LandingPage latestPosts={posts.slice(0, 3)} testimonials={testimonials} />;
}
