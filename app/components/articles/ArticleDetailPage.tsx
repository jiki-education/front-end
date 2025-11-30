import { getAllArticles, getArticle } from "@jiki/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleDetailContent from "./ArticleDetailContent";
import CTABlock from "../blog/CTABlock";
import RelatedArticles from "../blog/RelatedArticles";

interface ArticleDetailPageProps {
  slug: string;
  authenticated: boolean;
  locale: string;
}

// Helper for generateStaticParams
export function getArticleStaticParams(locale: string = "en") {
  const articles = getAllArticles(locale);
  return articles.map((article) => ({ slug: article.slug }));
}

// Helper for generateMetadata
export function getArticleMetadata(slug: string, locale: string = "en"): Metadata {
  try {
    const article = getArticle(slug, locale);
    return {
      title: article.title,
      description: article.seo.description,
      keywords: article.seo.keywords.join(", ")
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default function ArticleDetailPage({ slug, authenticated, locale }: ArticleDetailPageProps) {
  let article;
  try {
    article = getArticle(slug, locale);
  } catch {
    notFound();
  }

  // Mock related articles (same pattern as blog)
  const relatedArticles = [
    {
      slug: "react-hooks-guide",
      title: "Complete Guide to React Hooks",
      date: "2024-01-15",
      excerpt:
        "Master React Hooks with this comprehensive guide covering useState, useEffect, useContext, and custom hooks with practical examples.",
      author: { name: "Jiki Team", bio: "", avatar: "" },
      tags: ["React", "JavaScript"],
      seo: { description: "", keywords: [] },
      featured: false,
      coverImage: "/api/placeholder/400/240",
      content: "",
      locale: "en"
    },
    {
      slug: "typescript-fundamentals",
      title: "TypeScript Fundamentals",
      date: "2024-02-01",
      excerpt:
        "Learn the fundamentals of TypeScript including types, interfaces, generics, and how to integrate TypeScript into your projects.",
      author: { name: "Jiki Team", bio: "", avatar: "" },
      tags: ["TypeScript", "JavaScript"],
      seo: { description: "", keywords: [] },
      featured: false,
      coverImage: "/api/placeholder/400/240",
      content: "",
      locale: "en"
    },
    {
      slug: "git-workflow-best-practices",
      title: "Git Workflow Best Practices",
      date: "2024-02-15",
      excerpt:
        "Discover best practices for Git workflows including branching strategies, commit conventions, and collaboration techniques for teams.",
      author: { name: "Jiki Team", bio: "", avatar: "" },
      tags: ["Git", "DevOps"],
      seo: { description: "", keywords: [] },
      featured: false,
      coverImage: "/api/placeholder/400/240",
      content: "",
      locale: "en"
    }
  ];

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

      {/* Related Articles */}
      <RelatedArticles articles={relatedArticles} />

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
