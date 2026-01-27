import Link from "next/link";
import type { ProcessedArticle } from "@/lib/content/generated/types";

interface ArticleCardProps {
  article: ProcessedArticle;
  locale: string;
}

export default function ArticleCard({ article, locale }: ArticleCardProps) {
  const articleUrl = locale === "en" ? `/articles/${article.slug}` : `/${locale}/articles/${article.slug}`;

  return (
    <article className="group rounded-xl border border-border-primary bg-bg-primary p-6 shadow-sm transition-all hover:shadow-lg">
      <Link href={articleUrl}>
        <h2 className="mb-3 text-xl font-bold text-text-primary transition-colors group-hover:text-link-primary">
          {article.title}
        </h2>
      </Link>
      <p className="mb-4 line-clamp-3 text-text-secondary">{article.excerpt}</p>
      <div className="flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-info-bg px-3 py-1 text-xs text-info-text">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
