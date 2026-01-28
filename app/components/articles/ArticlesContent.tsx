"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProcessedArticle } from "@/lib/content/generated/types";
import type { ArticleTagSlug } from "@/lib/content";
import Pagination from "@/components/ui/Pagination";
import FilterSidebar from "./FilterSidebar";
import ArticleCard from "./ArticleCard";
import styles from "./ArticlesContent.module.css";

interface ArticlesContentProps {
  articles: ProcessedArticle[];
  locale: string;
  selectedTag: ArticleTagSlug | null;
  currentPage: number;
  totalPages: number;
  tagSlugs: readonly ArticleTagSlug[];
}

export default function ArticlesContent({
  articles,
  locale,
  selectedTag,
  currentPage,
  totalPages,
  tagSlugs
}: ArticlesContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className={styles.contentLayout}>
      <div className={styles.contentMain}>
        <div className={styles.articlesGrid}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>

        {articles.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        )}
      </div>

      <FilterSidebar tagSlugs={tagSlugs} selectedTag={selectedTag} locale={locale} />
    </div>
  );
}
