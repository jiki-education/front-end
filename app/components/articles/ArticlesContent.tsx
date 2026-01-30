"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProcessedArticle } from "@/lib/content/generated/types";
import type { ArticleTagSlug } from "@/lib/content";
import { useArticlesSearch } from "@/lib/hooks/useArticlesSearch";
import Pagination from "@/components/ui/Pagination";
import FilterSidebar from "./FilterSidebar";
import ArticleCard from "./ArticleCard";
import ArticlesSearch from "./ArticlesSearch";
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
  const { searchQuery, setSearchQuery, searchResults, isLoading } = useArticlesSearch(locale);

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

  // Filter articles based on search results
  const displayedArticles =
    searchResults === null ? articles : articles.filter((article) => searchResults.includes(article.slug));

  // Hide pagination when searching
  const showPagination = searchResults === null && displayedArticles.length > 0;

  return (
    <div className={styles.contentLayout}>
      <div className={styles.contentMain}>
        <div className={styles.searchWrapper}>
          <ArticlesSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery("")}
            searchResults={searchResults}
          />
        </div>

        <div className={styles.articlesGrid}>
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            displayedArticles.map((article) => <ArticleCard key={article.slug} article={article} locale={locale} />)
          )}
        </div>

        {showPagination && (
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

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonBadge} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonText} />
      <div className={styles.skeletonText} />
      <div className={styles.skeletonText} />
    </div>
  );
}
