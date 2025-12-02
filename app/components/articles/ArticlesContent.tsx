import Link from "next/link";
import type { ProcessedPost } from "@/lib/content/generated/types";

interface ArticlesContentProps {
  articles: ProcessedPost[];
  authenticated: boolean;
  locale: string;
}

export default function ArticlesContent({ articles, authenticated, locale }: ArticlesContentProps) {
  const getArticleUrl = (slug: string) => {
    return locale === "en" ? `/articles/${slug}` : `/${locale}/articles/${slug}`;
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <article
          key={article.slug}
          className={
            authenticated
              ? "group rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm transition-all hover:shadow-lg"
              : "group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
          }
        >
          <Link href={getArticleUrl(article.slug)}>
            <h2
              className={
                authenticated
                  ? "mb-3 text-xl font-bold text-text-primary transition-colors group-hover:text-link-primary"
                  : "mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600"
              }
            >
              {article.title}
            </h2>
          </Link>
          <p className={authenticated ? "mb-4 line-clamp-3 text-text-secondary" : "mb-4 line-clamp-3 text-gray-700"}>
            {article.excerpt}
          </p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className={
                  authenticated
                    ? "rounded-full bg-info-bg px-3 py-1 text-xs text-info-text"
                    : "rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700"
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
