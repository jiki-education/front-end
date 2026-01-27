import { getArticle, getListedArticles } from "@/lib/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CTABlock from "../blog/CTABlock";
import ArticleDetailContent from "./ArticleDetailContent";
import RecentArticles from "./RecentArticles";

interface ArticleDetailPageProps {
  slug: string;
  authenticated: boolean;
  locale: string;
}

// Helper for generateStaticParams
export async function getArticleStaticParams(locale: string = "en") {
  const articles = await getListedArticles(locale);
  return articles.map((article) => ({ slug: article.slug }));
}

// Helper for generateMetadata
export async function getArticleMetadata(slug: string, locale: string = "en"): Promise<Metadata> {
  try {
    const article = await getArticle(slug, locale);
    return {
      title: article.title,
      description: article.seo.description,
      keywords: article.seo.keywords.join(", ")
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function ArticleDetailPage({ slug, authenticated, locale }: ArticleDetailPageProps) {
  let article;
  try {
    article = await getArticle(slug, locale);
  } catch {
    notFound();
  }

  // Get recent listed articles, excluding the current one
  const allArticles = await getListedArticles(locale);
  const recentArticles = allArticles
    .filter((a) => a.slug !== slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (authenticated) {
    return <ArticleDetailContent article={article} variant="authenticated" />;
  }

  return (
    <>
      <ArticleDetailContent article={article} variant="unauthenticated" />

      {/* Minimal CTA */}
      <CTABlock
        variant="minimal"
        title="Try Jiki for free"
        subtitle="10,000+ learners use Jiki to master programming through hands-on practice and expert mentorship every month."
        buttonText="Get started now"
        buttonHref="/signup"
      />

      {/* Recent Articles */}
      <RecentArticles articles={recentArticles} />

      {/* Gradient CTA */}
      <CTABlock
        variant="gradient"
        title="Ready to Start Your Coding Journey?"
        subtitle="Join thousands of learners on Jiki. Practice coding exercises, get feedback from mentors, and level up your skills — it's free!"
        buttonText="Sign Up to Jiki"
        buttonHref="/signup"
      />
    </>
  );
}
